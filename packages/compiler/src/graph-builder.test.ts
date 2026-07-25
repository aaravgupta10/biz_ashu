import { describe, it, expect } from 'vitest';
import type { SemanticNode } from './semantic-node.js';
import { buildPageGraph, convertSemanticNodeToComponents } from './graph-builder.js';

function createMockSemanticNode(overrides?: Partial<SemanticNode>): SemanticNode {
  return {
    id: 'node-1',
    type: 'Headline',
    purpose: 'Heading: Main Title',
    sourceElementId: 'elem-1',
    metadata: { tagName: 'h1', textContent: 'Main Title' },
    children: [],
    ...overrides,
  };
}

describe('graph-builder', () => {
  describe('convertSemanticNodeToComponents', () => {
    it('converts a single SemanticNode into a Component array', () => {
      const node = createMockSemanticNode();
      const components = convertSemanticNodeToComponents(node);

      expect(components).toHaveLength(1);
      expect(components[0]?.id).toBe('node-1');
      expect(components[0]?.type).toBe('Headline');
      expect(components[0]?.purpose).toBe('Heading: Main Title');
      expect(components[0]?.metadata).toMatchObject({
        sourceElementId: 'elem-1',
        parentComponentId: null,
        childComponentIds: [],
        tagName: 'h1',
      });
    });

    it('recursively converts child SemanticNodes and tracks parent/child IDs', () => {
      const childNode = createMockSemanticNode({
        id: 'node-child',
        type: 'CTA',
        purpose: 'Call to action: Submit',
        sourceElementId: 'elem-2',
        children: [],
      });

      const parentNode = createMockSemanticNode({
        id: 'node-parent',
        type: 'Form',
        purpose: 'Form submission',
        sourceElementId: 'elem-1',
        children: [childNode],
      });

      const components = convertSemanticNodeToComponents(parentNode);

      expect(components).toHaveLength(2);
      expect(components[0]?.id).toBe('node-parent');
      expect(components[0]?.metadata['childComponentIds']).toEqual(['node-child']);
      expect(components[1]?.id).toBe('node-child');
      expect(components[1]?.metadata['parentComponentId']).toBe('node-parent');
    });
  });

  describe('buildPageGraph', () => {
    it('builds a valid ImmutablePage graph with default options', () => {
      const nodes = [
        createMockSemanticNode({ id: 'node-1', type: 'Headline' }),
        createMockSemanticNode({ id: 'node-2', type: 'CTA' }),
      ];

      const page = buildPageGraph(nodes);

      expect(page.id).toBeDefined();
      expect(page.name).toBe('Compiled Page');
      expect(page.route).toBe('/');
      expect(page.purpose).toBe('Compiled Digital Twin Page');
      expect(page.components).toHaveLength(2);
      expect(page.components[0]?.type).toBe('Headline');
      expect(page.components[1]?.type).toBe('CTA');
      expect(page.metadata['totalComponents']).toBe(2);
    });

    it('applies custom page graph options', () => {
      const nodes = [createMockSemanticNode({ id: 'node-1' })];
      const page = buildPageGraph(nodes, {
        id: 'custom-page-id',
        name: 'Landing Page',
        route: '/home',
        purpose: 'User acquisition page',
        metadata: { campaign: 'summer-sale' },
      });

      expect(page.id).toBe('custom-page-id');
      expect(page.name).toBe('Landing Page');
      expect(page.route).toBe('/home');
      expect(page.purpose).toBe('User acquisition page');
      expect(page.metadata['campaign']).toBe('summer-sale');
    });

    it('returns frozen ImmutablePage and ImmutableComponent objects', () => {
      const nodes = [createMockSemanticNode({ id: 'node-1' })];
      const page = buildPageGraph(nodes);

      expect(Object.isFrozen(page)).toBe(true);
      expect(Object.isFrozen(page.components)).toBe(true);
      expect(Object.isFrozen(page.components[0])).toBe(true);
    });
  });
});
