/**
 * Supported interaction action types that a synthetic human can perform on a component.
 */
export type InteractionType =
  'click' | 'type' | 'submit' | 'navigate' | 'scroll' | 'hover' | 'select';

/**
 * Interface representing an interactable affordance exposed by a semantic node.
 */
export interface InteractionAffordance {
  /** Unique identifier for the affordance */
  id: string;
  /** Action type of the interaction (e.g. 'click', 'type', 'submit', 'navigate') */
  type: InteractionType;
  /** ID of the target SemanticNode associated with this affordance */
  targetNodeId: string;
  /** Human-readable description of what this affordance accomplishes */
  description: string;
  /** Indicates whether the interaction is currently active and executable */
  enabled: boolean;
  /** Additional metadata (e.g., href URL, input name, form action, placeholder) */
  metadata: Record<string, unknown>;
}
