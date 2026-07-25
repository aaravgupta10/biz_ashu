import { describe, it, expect } from 'vitest';
import type { SemanticNode } from './semantic-node.js';
import {
  extractAffordances,
  extractAllAffordances,
  extractNodeAffordances,
  isNodeDisabled,
} from './interaction-compiler.js';

function createMockSemanticNode(overrides?: Partial<SemanticNode>): SemanticNode {
  return {
    id: 'node-1',
    type: 'CTA',
    purpose: 'Call to action: Submit',
    sourceElementId: 'elem-1',
    metadata: { tagName: 'button', attributes: {}, textContent: 'Submit' },
    children: [],
    ...overrides,
  };
}

describe('interaction-compiler', () => {
  describe('isNodeDisabled', () => {
    it('returns true if disabled attribute is present', () => {
      const node = createMockSemanticNode({
        metadata: { tagName: 'button', attributes: { disabled: '' } },
      });
      expect(isNodeDisabled(node)).toBe(true);
    });

    it('returns true if aria-disabled is true', () => {
      const node = createMockSemanticNode({
        metadata: { tagName: 'button', attributes: { 'aria-disabled': 'true' } },
      });
      expect(isNodeDisabled(node)).toBe(true);
    });

    it('returns false when node is enabled', () => {
      const node = createMockSemanticNode();
      expect(isNodeDisabled(node)).toBe(false);
    });
  });

  describe('extractNodeAffordances', () => {
    it('extracts click affordance for CTA button', () => {
      const node = createMockSemanticNode({
        type: 'CTA',
        metadata: { tagName: 'button', attributes: {}, textContent: 'Buy Now' },
      });

      const affordances = extractNodeAffordances(node);
      expect(affordances).toHaveLength(1);
      expect(affordances[0]?.type).toBe('click');
      expect(affordances[0]?.enabled).toBe(true);
      expect(affordances[0]?.targetNodeId).toBe('node-1');
    });

    it('extracts click and submit affordances for CTA submit button', () => {
      const node = createMockSemanticNode({
        type: 'CTA',
        metadata: { tagName: 'input', attributes: { type: 'submit' } },
      });

      const affordances = extractNodeAffordances(node);
      expect(affordances).toHaveLength(2);
      expect(affordances[0]?.type).toBe('click');
      expect(affordances[1]?.type).toBe('submit');
    });

    it('extracts click and navigate affordances for Link', () => {
      const node = createMockSemanticNode({
        type: 'Link',
        metadata: {
          tagName: 'a',
          attributes: { href: '/about' },
          textContent: 'About Us',
        },
      });

      const affordances = extractNodeAffordances(node);
      expect(affordances).toHaveLength(2);
      expect(affordances[0]?.type).toBe('click');
      expect(affordances[1]?.type).toBe('navigate');
      expect(affordances[1]?.metadata['targetUrl']).toBe('/about');
    });

    it('extracts type affordance for text Input', () => {
      const node = createMockSemanticNode({
        type: 'Input',
        metadata: {
          tagName: 'input',
          attributes: { name: 'email', placeholder: 'Enter email' },
        },
      });

      const affordances = extractNodeAffordances(node);
      expect(affordances).toHaveLength(1);
      expect(affordances[0]?.type).toBe('type');
      expect(affordances[0]?.metadata['fieldName']).toBe('email');
    });

    it('extracts select affordance for select Input', () => {
      const node = createMockSemanticNode({
        type: 'Input',
        metadata: {
          tagName: 'select',
          attributes: { name: 'country' },
        },
      });

      const affordances = extractNodeAffordances(node);
      expect(affordances).toHaveLength(1);
      expect(affordances[0]?.type).toBe('select');
    });

    it('marks affordances as enabled: false when node is disabled', () => {
      const node = createMockSemanticNode({
        type: 'CTA',
        metadata: { tagName: 'button', attributes: { disabled: 'disabled' } },
      });

      const affordances = extractNodeAffordances(node);
      expect(affordances[0]?.enabled).toBe(false);
    });
  });

  describe('extractAffordances (recursive)', () => {
    it('extracts affordances recursively from parent and child nodes', () => {
      const childInput = createMockSemanticNode({
        id: 'child-input',
        type: 'Input',
        metadata: { tagName: 'input', attributes: { name: 'username' } },
      });

      const parentForm = createMockSemanticNode({
        id: 'parent-form',
        type: 'Form',
        metadata: { tagName: 'form', attributes: { action: '/login' } },
        children: [childInput],
      });

      const affordances = extractAffordances(parentForm);
      expect(affordances).toHaveLength(2);
      expect(affordances[0]?.targetNodeId).toBe('parent-form');
      expect(affordances[0]?.type).toBe('submit');
      expect(affordances[1]?.targetNodeId).toBe('child-input');
      expect(affordances[1]?.type).toBe('type');
    });
  });

  describe('extractAllAffordances', () => {
    it('extracts affordances across multiple root nodes', () => {
      const nodes = [
        createMockSemanticNode({ id: 'node-1', type: 'Headline' }),
        createMockSemanticNode({ id: 'node-2', type: 'CTA' }),
      ];

      const affordances = extractAllAffordances(nodes);
      expect(affordances.length).toBeGreaterThanOrEqual(2);
      expect(affordances[0]?.targetNodeId).toBe('node-1');
      expect(affordances[1]?.targetNodeId).toBe('node-2');
    });
  });
});
