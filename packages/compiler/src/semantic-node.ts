/**
 * Represents the standard semantic type or role assigned to a classified HTML node.
 */
export type SemanticNodeType =
  | 'Headline'
  | 'CTA'
  | 'Link'
  | 'Image'
  | 'Form'
  | 'Input'
  | 'Navigation'
  | 'Footer'
  | 'Header'
  | 'Section'
  | 'Article'
  | 'Main Content'
  | 'GenericComponent'
  | string;

/**
 * Interface representing a classified semantic node.
 */
export interface SemanticNode {
  /** Unique identifier for the semantic node */
  id: string;
  /** Semantic classification type or role of the element (e.g. 'Headline', 'CTA', 'GenericComponent') */
  type: SemanticNodeType;
  /** The intended purpose or role description of this semantic node */
  purpose: string;
  /** The ID of the raw element from which this node was classified */
  sourceElementId: string;
  /** Additional metadata extracted from the raw element */
  metadata: Record<string, unknown>;
  /** Hierarchical references to child SemanticNodes */
  children: SemanticNode[];
}
