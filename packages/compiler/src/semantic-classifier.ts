import { generateId } from '@platform/shared';
import type { RawElement } from './raw-element.js';
import type { SemanticNode, SemanticNodeType } from './semantic-node.js';

/**
 * Mapping of standard HTML tag names to their semantic roles.
 */
const TAG_TYPE_MAP: Readonly<Record<string, SemanticNodeType>> = {
  h1: 'Headline',
  h2: 'Headline',
  h3: 'Headline',
  h4: 'Headline',
  h5: 'Headline',
  h6: 'Headline',
  button: 'CTA',
  a: 'Link',
  img: 'Image',
  form: 'Form',
  input: 'Input',
  textarea: 'Input',
  select: 'Input',
  nav: 'Navigation',
  footer: 'Footer',
  header: 'Header',
  section: 'Section',
  article: 'Article',
  main: 'Main Content',
};

/**
 * Determines the semantic type/role of a RawElement using deterministic HTML semantics rules.
 *
 * @param element The RawElement to evaluate
 * @returns The classified SemanticNodeType string
 */
export function determineSemanticType(element: RawElement): SemanticNodeType {
  const tagName = element.tagName.toLowerCase().trim();

  // Special case: input element types that function as CTAs
  if (tagName === 'input') {
    const typeAttr = element.attributes['type']?.toLowerCase().trim();
    if (typeAttr === 'submit' || typeAttr === 'button' || typeAttr === 'reset') {
      return 'CTA';
    }
    return 'Input';
  }

  // Check direct tag mapping
  const mappedType = TAG_TYPE_MAP[tagName];
  if (mappedType) {
    return mappedType;
  }

  // Check role attribute if present for semantic fallback
  const roleAttr = element.attributes['role']?.toLowerCase().trim();
  if (roleAttr) {
    switch (roleAttr) {
      case 'button':
        return 'CTA';
      case 'link':
        return 'Link';
      case 'heading':
        return 'Headline';
      case 'img':
      case 'graphics-document':
        return 'Image';
      case 'form':
        return 'Form';
      case 'navigation':
        return 'Navigation';
      case 'banner':
        return 'Header';
      case 'contentinfo':
        return 'Footer';
      case 'main':
        return 'Main Content';
      case 'search':
      case 'textbox':
      case 'spinbutton':
      case 'combobox':
        return 'Input';
    }
  }

  return 'GenericComponent';
}

/**
 * Derives a human-readable purpose description for a classified element based on its type and attributes.
 *
 * @param type The classified SemanticNodeType
 * @param element The source RawElement
 * @returns A descriptive purpose string
 */
export function determinePurpose(type: SemanticNodeType, element: RawElement): string {
  const text = element.textContent.trim();
  const attrs = element.attributes;

  switch (type) {
    case 'Headline':
      return text ? `Heading: ${text}` : `Heading element (${element.tagName})`;
    case 'CTA':
      if (text) return `Call to action: ${text}`;
      if (attrs['value']) return `Call to action: ${attrs['value']}`;
      if (attrs['aria-label']) return `Call to action: ${attrs['aria-label']}`;
      return 'Call to action button';
    case 'Link':
      if (attrs['href']) return `Navigate to ${attrs['href']}`;
      if (text) return `Link: ${text}`;
      return 'Hyperlink element';
    case 'Image':
      if (attrs['alt']) return `Image: ${attrs['alt']}`;
      if (attrs['src']) return `Image source: ${attrs['src']}`;
      return 'Visual image element';
    case 'Form':
      if (attrs['name']) return `Form: ${attrs['name']}`;
      if (attrs['id']) return `Form: ${attrs['id']}`;
      if (attrs['action']) return `Form submitting to ${attrs['action']}`;
      return 'Form submission container';
    case 'Input': {
      const fieldName = attrs['placeholder'] || attrs['name'] || attrs['type'] || attrs['id'];
      return fieldName ? `Input field for ${fieldName}` : 'User input control';
    }
    case 'Navigation':
      return text ? `Navigation: ${text}` : 'Navigation section';
    case 'Header':
      return 'Page or section header';
    case 'Footer':
      return 'Page or section footer';
    case 'Section':
      return text ? `Section: ${text}` : 'Content section';
    case 'Article':
      return text ? `Article: ${text}` : 'Standalone article content';
    case 'Main Content':
      return 'Primary page content';
    case 'GenericComponent':
    default:
      return text ? `Content component: ${text}` : `Generic ${element.tagName} element`;
  }
}

/**
 * Classifies a single RawElement into a SemanticNode.
 * Recursively classifies any child RawElements.
 *
 * @param element The RawElement object to classify
 * @returns A SemanticNode instance
 */
export function classifyRawElement(element: RawElement): SemanticNode {
  const type = determineSemanticType(element);
  const purpose = determinePurpose(type, element);

  const children = element.children
    ? element.children.map((child) => classifyRawElement(child))
    : [];

  return {
    id: generateId(),
    type,
    purpose,
    sourceElementId: element.id,
    metadata: {
      tagName: element.tagName,
      attributes: { ...element.attributes },
      textContent: element.textContent,
      depth: element.depth,
      parentId: element.parentId,
    },
    children,
  };
}

/**
 * Converts an array of RawElement objects into an array of SemanticNode objects.
 *
 * @param elements Array of RawElement objects
 * @returns Array of classified SemanticNode objects
 */
export function classifyRawElements(elements: RawElement[]): SemanticNode[] {
  return elements.map((element) => classifyRawElement(element));
}
