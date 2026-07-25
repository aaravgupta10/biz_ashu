import type { Page, Component } from '@platform/core';
import type { Persona, CognitiveState } from '@platform/core';

/**
 * Result map of component IDs to calculated attention scores [0.0 - 1.0].
 */
export type AttentionScoreMap = Map<string, number>;

/**
 * Base visual saliency weight for different semantic component types.
 */
const BASE_SALIENCY_MAP: Readonly<Record<string, number>> = {
  CTA: 0.95,
  Form: 0.9,
  Headline: 0.85,
  Link: 0.75,
  Input: 0.7,
  Image: 0.8,
  Header: 0.65,
  Navigation: 0.6,
  Section: 0.5,
  Article: 0.5,
  Main: 0.6,
  Footer: 0.4,
  GenericComponent: 0.35,
};

/**
 * Calculates component relevance multiplier based on active user goal and focus state.
 *
 * @param component Component being evaluated
 * @param cognitiveState Current active cognitive state
 * @returns Relevance factor multiplier [0.5 - 1.5]
 */
export function calculateRelevanceMultiplier(
  component: Component,
  cognitiveState: CognitiveState,
): number {
  let multiplier = 1.0;

  // Active focus bonus
  if (cognitiveState.activeFocusComponentId === component.id) {
    multiplier += 0.3;
  }

  // Goal keyword matching boost
  const goalLower = cognitiveState.activeGoal.toLowerCase();
  const purposeLower = component.purpose.toLowerCase();
  const nameLower = component.name.toLowerCase();

  if (purposeLower.includes(goalLower) || nameLower.includes(goalLower)) {
    multiplier += 0.2;
  }

  return Math.min(1.5, Math.max(0.5, multiplier));
}

/**
 * Calculates the visual attention score for a single Component.
 *
 * @param component Component to evaluate
 * @param persona Persona defining visual acuity and domain familiarity
 * @param cognitiveState Active cognitive state
 * @returns Attention score clamped to [0.0 - 1.0]
 */
export function calculateComponentAttention(
  component: Component,
  persona: Persona,
  cognitiveState: CognitiveState,
): number {
  const baseSaliency = BASE_SALIENCY_MAP[component.type] ?? 0.35;
  const acuityFactor = 0.5 + 0.5 * persona.cognitiveTraits.visualAcuity;
  const relevance = calculateRelevanceMultiplier(component, cognitiveState);

  const rawScore = baseSaliency * acuityFactor * relevance;
  return Math.min(1.0, Math.max(0.0, Math.round(rawScore * 1000) / 1000));
}

/**
 * Computes deterministic visual attention scores across all components in a Page graph.
 *
 * @param page Compiled Page digital twin
 * @param persona Synthetic human Persona profile
 * @param cognitiveState Current CognitiveState
 * @returns Map of component IDs to visual attention scores [0.0 - 1.0]
 */
export function calculateAttentionScores(
  page: Page,
  persona: Persona,
  cognitiveState: CognitiveState,
): AttentionScoreMap {
  const scores: AttentionScoreMap = new Map();

  for (const component of page.components) {
    const score = calculateComponentAttention(component, persona, cognitiveState);
    scores.set(component.id, score);
  }

  return scores;
}
