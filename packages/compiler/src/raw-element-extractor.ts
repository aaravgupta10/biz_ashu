import { generateId } from '@platform/shared';
import type { DefaultTreeAdapterTypes } from 'parse5';
import type { RawElement } from './raw-element.js';

/**
 * Helper type guard to verify if a parse5 node is an Element node.
 */
function isElementNode(
  node: DefaultTreeAdapterTypes.Node,
): node is DefaultTreeAdapterTypes.Element {
  return !node.nodeName.startsWith('#') && 'tagName' in node;
}

/**
 * Recursively extracts and concatenates the text content of a parse5 node and its descendants.
 */
function getTextContent(node: DefaultTreeAdapterTypes.Node): string {
  if (node.nodeName === '#text') {
    return (node as DefaultTreeAdapterTypes.TextNode).value;
  }
  if ('childNodes' in node && node.childNodes) {
    return node.childNodes.map(getTextContent).join('');
  }
  return '';
}

/**
 * Traverses a parse5 Document AST and extracts a flat array of normalized RawElement objects.
 * The elements in the returned array are in pre-order traversal (document order),
 * and each holds references to its children, parentId, attributes, and text contents.
 *
 * @param document The parsed parse5 Document AST
 * @returns An array of normalized RawElement objects
 */
export function extractRawElements(document: DefaultTreeAdapterTypes.Document): RawElement[] {
  const flatList: RawElement[] = [];

  function traverse(
    node: DefaultTreeAdapterTypes.Node,
    parentId: string | null,
    depth: number,
  ): RawElement[] {
    const elements: RawElement[] = [];

    if ('childNodes' in node && node.childNodes) {
      for (const child of node.childNodes) {
        if (isElementNode(child)) {
          const elementId = generateId();

          // Convert parse5 attributes array to a simple key-value Record
          const attributes: Record<string, string> = {};
          if (child.attrs) {
            for (const attr of child.attrs) {
              attributes[attr.name] = attr.value;
            }
          }

          // Gather text content recursively
          const textContent = getTextContent(child).trim();

          const rawElement: RawElement = {
            id: elementId,
            tagName: child.tagName.toLowerCase(),
            attributes,
            textContent,
            children: [],
            parentId,
            depth,
          };

          // Append to our flat collection list
          flatList.push(rawElement);
          elements.push(rawElement);

          // Recursively process children and assign references
          rawElement.children = traverse(child, elementId, depth + 1);
        } else {
          // Non-element nodes (comments, text) do not increase depth or change parentId
          const subElements = traverse(child, parentId, depth);
          elements.push(...subElements);
        }
      }
    }

    return elements;
  }

  traverse(document, null, 0);
  return flatList;
}
