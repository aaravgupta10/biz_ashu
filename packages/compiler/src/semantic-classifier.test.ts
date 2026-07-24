import { describe, it, expect } from 'vitest';
import type { RawElement } from './raw-element.js';
import {
  classifyRawElement,
  classifyRawElements,
  determineSemanticType,
  determinePurpose,
} from './semantic-classifier.js';

function createMockRawElement(overrides?: Partial<RawElement>): RawElement {
  return {
    id: 'elem-1',
    tagName: 'div',
    attributes: {},
    textContent: '',
    children: [],
    parentId: null,
    depth: 0,
    ...overrides,
  };
}

describe('semantic-classifier', () => {
  describe('determineSemanticType', () => {
    it('classifies headlines (h1, h2, etc.) as Headline', () => {
      expect(determineSemanticType(createMockRawElement({ tagName: 'h1' }))).toBe('Headline');
      expect(determineSemanticType(createMockRawElement({ tagName: 'h2' }))).toBe('Headline');
      expect(determineSemanticType(createMockRawElement({ tagName: 'h3' }))).toBe('Headline');
    });

    it('classifies button and input buttons as CTA', () => {
      expect(determineSemanticType(createMockRawElement({ tagName: 'button' }))).toBe('CTA');
      expect(
        determineSemanticType(
          createMockRawElement({ tagName: 'input', attributes: { type: 'submit' } }),
        ),
      ).toBe('CTA');
      expect(
        determineSemanticType(
          createMockRawElement({ tagName: 'input', attributes: { type: 'button' } }),
        ),
      ).toBe('CTA');
    });

    it('classifies anchor tags as Link', () => {
      expect(determineSemanticType(createMockRawElement({ tagName: 'a' }))).toBe('Link');
    });

    it('classifies img tags as Image', () => {
      expect(determineSemanticType(createMockRawElement({ tagName: 'img' }))).toBe('Image');
    });

    it('classifies form tags as Form', () => {
      expect(determineSemanticType(createMockRawElement({ tagName: 'form' }))).toBe('Form');
    });

    it('classifies input and textarea tags as Input', () => {
      expect(
        determineSemanticType(
          createMockRawElement({ tagName: 'input', attributes: { type: 'text' } }),
        ),
      ).toBe('Input');
      expect(determineSemanticType(createMockRawElement({ tagName: 'textarea' }))).toBe('Input');
    });

    it('classifies navigation structural elements as Navigation', () => {
      expect(determineSemanticType(createMockRawElement({ tagName: 'nav' }))).toBe('Navigation');
    });

    it('classifies header, footer, section, article, main', () => {
      expect(determineSemanticType(createMockRawElement({ tagName: 'footer' }))).toBe('Footer');
      expect(determineSemanticType(createMockRawElement({ tagName: 'header' }))).toBe('Header');
      expect(determineSemanticType(createMockRawElement({ tagName: 'section' }))).toBe('Section');
      expect(determineSemanticType(createMockRawElement({ tagName: 'article' }))).toBe('Article');
      expect(determineSemanticType(createMockRawElement({ tagName: 'main' }))).toBe('Main Content');
    });

    it('classifies unknown elements as GenericComponent', () => {
      expect(determineSemanticType(createMockRawElement({ tagName: 'div' }))).toBe(
        'GenericComponent',
      );
      expect(determineSemanticType(createMockRawElement({ tagName: 'span' }))).toBe(
        'GenericComponent',
      );
      expect(determineSemanticType(createMockRawElement({ tagName: 'unknown-tag' }))).toBe(
        'GenericComponent',
      );
    });

    it('uses role attribute for classification when available on unknown tags', () => {
      expect(
        determineSemanticType(
          createMockRawElement({ tagName: 'div', attributes: { role: 'button' } }),
        ),
      ).toBe('CTA');
      expect(
        determineSemanticType(
          createMockRawElement({ tagName: 'div', attributes: { role: 'link' } }),
        ),
      ).toBe('Link');
    });
  });

  describe('determinePurpose', () => {
    it('generates purpose strings based on type and element details', () => {
      const headlineElem = createMockRawElement({ tagName: 'h1', textContent: 'Welcome Home' });
      expect(determinePurpose('Headline', headlineElem)).toBe('Heading: Welcome Home');

      const ctaElem = createMockRawElement({ tagName: 'button', textContent: 'Submit Form' });
      expect(determinePurpose('CTA', ctaElem)).toBe('Call to action: Submit Form');

      const linkElem = createMockRawElement({
        tagName: 'a',
        attributes: { href: 'https://example.com' },
      });
      expect(determinePurpose('Link', linkElem)).toBe('Navigate to https://example.com');
    });
  });

  describe('classifyRawElement', () => {
    it('converts a RawElement into a valid SemanticNode with required properties', () => {
      const rawElem: RawElement = createMockRawElement({
        id: 'raw-123',
        tagName: 'h1',
        textContent: 'Main Title',
      });

      const node = classifyRawElement(rawElem);

      expect(node.id).toBeDefined();
      expect(typeof node.id).toBe('string');
      expect(node.type).toBe('Headline');
      expect(node.purpose).toBe('Heading: Main Title');
      expect(node.sourceElementId).toBe('raw-123');
      expect(node.metadata).toEqual({
        tagName: 'h1',
        attributes: {},
        textContent: 'Main Title',
        depth: 0,
        parentId: null,
      });
      expect(node.children).toEqual([]);
    });

    it('recursively converts children elements', () => {
      const childElem = createMockRawElement({
        id: 'raw-child',
        tagName: 'button',
        textContent: 'Click Me',
        parentId: 'raw-parent',
        depth: 1,
      });
      const parentElem = createMockRawElement({
        id: 'raw-parent',
        tagName: 'form',
        children: [childElem],
      });

      const parentNode = classifyRawElement(parentElem);

      expect(parentNode.type).toBe('Form');
      expect(parentNode.children).toHaveLength(1);
      expect(parentNode.children[0]?.type).toBe('CTA');
      expect(parentNode.children[0]?.sourceElementId).toBe('raw-child');
    });
  });

  describe('classifyRawElements', () => {
    it('converts RawElement[] into SemanticNode[]', () => {
      const elements: RawElement[] = [
        createMockRawElement({ id: 'elem-1', tagName: 'h1', textContent: 'Title' }),
        createMockRawElement({ id: 'elem-2', tagName: 'button', textContent: 'Buy Now' }),
        createMockRawElement({ id: 'elem-3', tagName: 'div' }),
      ];

      const nodes = classifyRawElements(elements);

      expect(nodes).toHaveLength(3);
      expect(nodes[0]?.type).toBe('Headline');
      expect(nodes[1]?.type).toBe('CTA');
      expect(nodes[2]?.type).toBe('GenericComponent');
    });
  });
});
