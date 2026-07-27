import { generateId } from '@platform/shared';
import { ImmutablePage, ImmutableComponent, type Component } from '@platform/core';
import type { SemanticNode } from './semantic-node.js';

/**
 * Options to customize the construction of an ImmutablePage graph.
 */
export interface PageGraphOptions {
  /** Unique identifier for the page (defaults to a generated ID) */
  id?: string;
  /** Human-readable page name (defaults to 'Compiled Page') */
  name?: string;
  /** URL route or path of the page (defaults to '/') */
  route?: string;
  /** Primary purpose description of the page (defaults to 'Compiled Digital Twin Page') */
  purpose?: string;
  /** Custom metadata associated with the page */
  metadata?: Record<string, unknown>;
}

/**
 * Recursively converts a SemanticNode and its child nodes into flat Component objects.
 *
 * @param node The SemanticNode to convert
 * @param parentComponentId ID of the parent component, or null if root
 * @returns Array of Component raw input objects
 */
export function convertSemanticNodeToComponents(
  node: SemanticNode,
  parentComponentId: string | null = null,
): Component[] {
  const childComponentIds = node.children ? node.children.map((child) => child.id) : [];

  let name = `${node.type} Component`;
  if (node.purpose) {
    if (node.purpose.includes(': ')) {
      name = `${node.purpose.split(': ')[1]} (${node.type})`;
    } else if (!node.purpose.includes('Generic')) {
      name = `${node.purpose} (${node.type})`;
    }
  }

  const currentComponent: Component = {
    id: node.id,
    name,
    type: node.type,
    purpose: node.purpose,
    metadata: {
      sourceElementId: node.sourceElementId,
      parentComponentId,
      childComponentIds,
      ...node.metadata,
    },
  };

  const childComponents: Component[] = [];
  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      childComponents.push(...convertSemanticNodeToComponents(child, node.id));
    }
  }

  return [currentComponent, ...childComponents];
}

/**
 * Builds an ImmutablePage digital twin graph from an array of SemanticNode objects.
 *
 * @param semanticNodes Array of top-level SemanticNode objects
 * @param options Configuration options for the compiled Page
 * @returns A validated, frozen ImmutablePage instance
 */
export function buildPageGraph(
  semanticNodes: SemanticNode[],
  options?: PageGraphOptions,
): ImmutablePage {
  const pageId = options?.id || generateId();
  const pageName = options?.name || 'Compiled Page';
  const pageRoute = options?.route || '/';
  const pagePurpose = options?.purpose || 'Compiled Digital Twin Page';
  const pageMetadata = options?.metadata || {};

  const allComponents: Component[] = [];
  for (const node of semanticNodes) {
    allComponents.push(...convertSemanticNodeToComponents(node, null));
  }

  const immutableComponents = allComponents.map((comp) => ImmutableComponent.create(comp));

  return ImmutablePage.create({
    id: pageId,
    name: pageName,
    route: pageRoute,
    purpose: pagePurpose,
    components: immutableComponents.map((c) => c.toJSON()),
    metadata: {
      ...pageMetadata,
      totalComponents: immutableComponents.length,
      compiledAt: new Date().toISOString(),
    },
  });
}
