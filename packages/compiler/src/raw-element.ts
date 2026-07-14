/**
 * Represents a normalized HTML element extracted from a DOM tree.
 */
export interface RawElement {
  /** Unique identifier assigned to the raw element */
  id: string;
  /** The HTML tag name (e.g. 'div', 'button', 'a') in lowercase */
  tagName: string;
  /** Key-value pairs of attributes defined on the element */
  attributes: Record<string, string>;
  /** The concatenated text content inside this element */
  textContent: string;
  /** Hierarchical references to child RawElements */
  children: RawElement[];
  /** Reference identifier of the parent element, or null if it is a root element */
  parentId: string | null;
  /** Nesting depth of this element in the DOM tree (0-indexed starting from the root parsed element) */
  depth: number;
}
