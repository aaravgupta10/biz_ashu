import { generateId } from '@platform/shared';
import type { SemanticNode } from './semantic-node.js';
import type { InteractionAffordance, InteractionType } from './interaction-affordance.js';

/**
 * Checks if a SemanticNode is disabled via HTML attributes or ARIA attributes.
 *
 * @param node The SemanticNode to inspect
 * @returns True if disabled, false otherwise
 */
export function isNodeDisabled(node: SemanticNode): boolean {
  const attrs = (node.metadata.attributes as Record<string, string> | undefined) || {};
  if ('disabled' in attrs && attrs['disabled'] !== 'false') {
    return true;
  }
  if (attrs['aria-disabled'] === 'true') {
    return true;
  }
  return false;
}

/**
 * Helper to construct an InteractionAffordance object.
 */
function createAffordance(
  node: SemanticNode,
  type: InteractionType,
  description: string,
  extraMetadata: Record<string, unknown> = {},
): InteractionAffordance {
  const disabled = isNodeDisabled(node);
  const attrs = (node.metadata.attributes as Record<string, string> | undefined) || {};

  return {
    id: generateId(),
    type,
    targetNodeId: node.id,
    description,
    enabled: !disabled,
    metadata: {
      tagName: node.metadata.tagName,
      purpose: node.purpose,
      attributes: attrs,
      ...extraMetadata,
    },
  };
}

/**
 * Extracts all valid interaction affordances from a single SemanticNode (excluding children).
 *
 * @param node The SemanticNode to extract affordances from
 * @returns Array of InteractionAffordance objects for this node
 */
export function extractNodeAffordances(node: SemanticNode): InteractionAffordance[] {
  const affordances: InteractionAffordance[] = [];
  const attrs = (node.metadata.attributes as Record<string, string> | undefined) || {};
  const text = (node.metadata.textContent as string | undefined)?.trim() || '';

  switch (node.type) {
    case 'CTA': {
      const isSubmit = attrs['type'] === 'submit';
      affordances.push(
        createAffordance(node, 'click', text ? `Click button "${text}"` : 'Click button component'),
      );
      if (isSubmit) {
        affordances.push(
          createAffordance(node, 'submit', 'Submit form via action button', {
            isSubmitButton: true,
          }),
        );
      }
      break;
    }

    case 'Link': {
      const href = attrs['href'] || '#';
      affordances.push(
        createAffordance(node, 'click', text ? `Click link "${text}"` : `Click hyperlink`),
      );
      affordances.push(
        createAffordance(node, 'navigate', `Navigate to ${href}`, { targetUrl: href }),
      );
      break;
    }

    case 'Input': {
      const fieldName = attrs['name'] || attrs['placeholder'] || attrs['id'] || 'input';
      const inputType = attrs['type'] || 'text';
      if (inputType === 'select' || node.metadata.tagName === 'select') {
        affordances.push(
          createAffordance(node, 'select', `Select option for ${fieldName}`, {
            fieldName,
            inputType,
          }),
        );
      } else {
        affordances.push(
          createAffordance(node, 'type', `Enter value into ${fieldName}`, {
            fieldName,
            inputType,
            placeholder: attrs['placeholder'],
          }),
        );
      }
      break;
    }

    case 'Form': {
      const formAction = attrs['action'] || 'current page';
      affordances.push(
        createAffordance(node, 'submit', `Submit form to ${formAction}`, {
          action: formAction,
          method: attrs['method'] || 'GET',
        }),
      );
      break;
    }

    case 'Navigation':
    case 'Header':
    case 'Footer':
    case 'Section':
    case 'Article':
    case 'Main Content': {
      affordances.push(createAffordance(node, 'scroll', `Scroll to ${node.type} section`));
      break;
    }

    case 'Image': {
      affordances.push(
        createAffordance(
          node,
          'hover',
          attrs['alt'] ? `View image "${attrs['alt']}"` : 'View image component',
        ),
      );
      break;
    }

    case 'Headline':
    case 'GenericComponent':
    default: {
      affordances.push(createAffordance(node, 'hover', `Inspect ${node.type} component`));
      break;
    }
  }

  return affordances;
}

/**
 * Recursively extracts interaction affordances from a SemanticNode and all its descendants.
 *
 * @param node The root SemanticNode to traverse
 * @returns Array of all InteractionAffordance objects across the tree
 */
export function extractAffordances(node: SemanticNode): InteractionAffordance[] {
  const affordances = extractNodeAffordances(node);

  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      affordances.push(...extractAffordances(child));
    }
  }

  return affordances;
}

/**
 * Extracts all interaction affordances across an array of SemanticNode trees.
 *
 * @param nodes Array of top-level SemanticNode objects
 * @returns Array of all extracted InteractionAffordance objects
 */
export function extractAllAffordances(nodes: SemanticNode[]): InteractionAffordance[] {
  const affordances: InteractionAffordance[] = [];
  for (const node of nodes) {
    affordances.push(...extractAffordances(node));
  }
  return affordances;
}
