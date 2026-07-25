import type { Page, Component } from '@platform/core';
import type { InteractionAffordance } from './interaction-affordance.js';

/**
 * Details a structural or referential validation failure.
 */
export interface ValidationError {
  /** Error code identifier (e.g. 'EMPTY_PAGE_ID', 'DUPLICATE_COMPONENT_ID') */
  code: string;
  /** Detailed human-readable description of the error */
  message: string;
  /** Component ID associated with the error (if applicable) */
  componentId?: string;
  /** Property or field path where the error occurred */
  path?: string;
}

/**
 * Result returned by the twin validator detailing validity status and issues.
 */
export interface ValidationResult {
  /** True if validation passed with 0 errors; false otherwise */
  valid: boolean;
  /** Array of critical validation errors preventing simulation execution */
  errors: ValidationError[];
  /** Array of non-blocking warnings */
  warnings: ValidationError[];
}

/**
 * Validates a Page digital twin object and optional associated affordances against structural integrity rules.
 *
 * @param page The Page instance to validate
 * @param affordances Optional list of InteractionAffordance objects to validate against the page graph
 * @returns A ValidationResult object detailing any errors or warnings
 */
export function validateDigitalTwinPage(
  page: Page,
  affordances?: InteractionAffordance[],
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // 1. Validate Page-level attributes
  if (!page.id || page.id.trim() === '') {
    errors.push({
      code: 'EMPTY_PAGE_ID',
      message: 'Page ID must be a non-empty string.',
      path: 'id',
    });
  }

  if (!page.name || page.name.trim() === '') {
    errors.push({
      code: 'EMPTY_PAGE_NAME',
      message: 'Page name must be a non-empty string.',
      path: 'name',
    });
  }

  if (!page.route || !page.route.startsWith('/')) {
    errors.push({
      code: 'INVALID_PAGE_ROUTE',
      message: 'Page route must be a non-empty string starting with "/".',
      path: 'route',
    });
  }

  if (!page.purpose || page.purpose.trim() === '') {
    errors.push({
      code: 'EMPTY_PAGE_PURPOSE',
      message: 'Page purpose must be a non-empty string.',
      path: 'purpose',
    });
  }

  if (!page.components || page.components.length === 0) {
    errors.push({
      code: 'EMPTY_COMPONENTS_LIST',
      message: 'Page must contain at least one compiled component.',
      path: 'components',
    });
  }

  // 2. Validate Components & Unique IDs
  const componentIds = new Set<string>();
  const componentsMap = new Map<string, Component>();

  for (const component of page.components) {
    if (!component.id || component.id.trim() === '') {
      errors.push({
        code: 'EMPTY_COMPONENT_ID',
        message: 'Component ID must be a non-empty string.',
        path: 'components.id',
      });
      continue;
    }

    if (componentIds.has(component.id)) {
      errors.push({
        code: 'DUPLICATE_COMPONENT_ID',
        message: `Duplicate component ID found: "${component.id}".`,
        componentId: component.id,
        path: 'components.id',
      });
    } else {
      componentIds.add(component.id);
      componentsMap.set(component.id, component);
    }

    if (!component.name || component.name.trim() === '') {
      errors.push({
        code: 'EMPTY_COMPONENT_NAME',
        message: `Component "${component.id}" must have a non-empty name.`,
        componentId: component.id,
        path: 'components.name',
      });
    }

    if (!component.type || component.type.trim() === '') {
      errors.push({
        code: 'EMPTY_COMPONENT_TYPE',
        message: `Component "${component.id}" must have a non-empty type.`,
        componentId: component.id,
        path: 'components.type',
      });
    }

    if (!component.purpose || component.purpose.trim() === '') {
      errors.push({
        code: 'EMPTY_COMPONENT_PURPOSE',
        message: `Component "${component.id}" must have a non-empty purpose.`,
        componentId: component.id,
        path: 'components.purpose',
      });
    }
  }

  // 3. Validate Parent & Child References
  for (const component of page.components) {
    const meta = component.metadata || {};

    const parentId = meta['parentComponentId'] as string | null | undefined;
    if (parentId && !componentIds.has(parentId)) {
      errors.push({
        code: 'DANGLING_PARENT_REFERENCE',
        message: `Component "${component.id}" references parentComponentId "${parentId}" which does not exist in the page graph.`,
        componentId: component.id,
        path: 'components.metadata.parentComponentId',
      });
    }

    const childIds = meta['childComponentIds'] as string[] | undefined;
    if (childIds && Array.isArray(childIds)) {
      for (const childId of childIds) {
        if (!componentIds.has(childId)) {
          errors.push({
            code: 'DANGLING_CHILD_REFERENCE',
            message: `Component "${component.id}" references childComponentId "${childId}" which does not exist in the page graph.`,
            componentId: component.id,
            path: 'components.metadata.childComponentIds',
          });
        }
      }
    }
  }

  // 4. Validate Affordances (if provided)
  if (affordances && affordances.length > 0) {
    for (const affordance of affordances) {
      if (!componentIds.has(affordance.targetNodeId)) {
        errors.push({
          code: 'INVALID_AFFORDANCE_TARGET',
          message: `Affordance "${affordance.id}" targets component "${affordance.targetNodeId}" which does not exist in the page graph.`,
          componentId: affordance.targetNodeId,
          path: 'affordances.targetNodeId',
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
