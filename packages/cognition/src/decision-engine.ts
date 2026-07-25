import type { Page, Persona, CognitiveState } from '@platform/core';
import type { InteractionAffordance } from '@platform/compiler';
import { calculateAttentionScores } from './perception-engine.js';
import { generateUserGoals, UserGoal } from './goal-generator.js';

/**
 * Details an evaluation score for a candidate interaction affordance.
 */
export interface DecisionEvaluation {
  /** The candidate InteractionAffordance being evaluated */
  affordance: InteractionAffordance;
  /** ID of the target component */
  componentId: string;
  /** Computed utility score continuous value [0.0 - 1.0+] */
  utilityScore: number;
  /** Human-readable explanation of why this utility score was assigned */
  explanation: string;
}

/**
 * Result returned by the decision engine selecting the next action step.
 */
export interface DecisionResult {
  /** Selected InteractionAffordance to execute, or null if waiting/abandoning */
  selectedAffordance: InteractionAffordance | null;
  /** ID of the target component receiving the action */
  selectedComponentId: string | null;
  /** Ranked array of all candidate affordance evaluations */
  evaluations: DecisionEvaluation[];
  /** The selected action type string (e.g. 'click', 'type', 'wait') */
  actionType: string;
  /** Explainable natural language reasoning for the decision */
  reasoning: string;
}

/**
 * Deterministically evaluates candidate interaction affordances to select the synthetic user's next action.
 *
 * @param page Compiled Page digital twin
 * @param affordances List of available InteractionAffordance objects
 * @param persona Synthetic human Persona profile
 * @param cognitiveState Current active CognitiveState
 * @returns A DecisionResult detailing selected action and ranked utility evaluations
 */
export function evaluateNextAction(
  page: Page,
  affordances: InteractionAffordance[],
  persona: Persona,
  cognitiveState: CognitiveState,
): DecisionResult {
  if (!affordances || affordances.length === 0) {
    return {
      selectedAffordance: null,
      selectedComponentId: null,
      evaluations: [],
      actionType: 'wait',
      reasoning: 'No executable affordances available on current page',
    };
  }

  const attentionScores = calculateAttentionScores(page, persona, cognitiveState);
  const userGoals = generateUserGoals(page, persona, cognitiveState);
  const primaryGoal = userGoals[0] as UserGoal | undefined;

  const evaluations: DecisionEvaluation[] = [];

  for (const aff of affordances) {
    if (!aff.enabled) {
      continue;
    }

    const compAttention = attentionScores.get(aff.targetNodeId) ?? 0.35;

    // Base utility formula combining visual attention and goal relevance
    let utility = compAttention * 0.5;

    if (primaryGoal && primaryGoal.targetComponentId === aff.targetNodeId) {
      utility += primaryGoal.priority * 0.4;
    }

    // Risk tolerance & patience weighting
    if (aff.type === 'click' || aff.type === 'submit') {
      utility += persona.cognitiveTraits.riskTolerance * 0.1;
    }

    const roundedUtility = Math.round(utility * 1000) / 1000;

    evaluations.push({
      affordance: aff,
      componentId: aff.targetNodeId,
      utilityScore: roundedUtility,
      explanation: `Utility ${roundedUtility}: attention (${compAttention}), goal priority (${primaryGoal?.priority ?? 0}).`,
    });
  }

  evaluations.sort((a, b) => b.utilityScore - a.utilityScore);

  const topChoice = evaluations[0];
  if (!topChoice) {
    return {
      selectedAffordance: null,
      selectedComponentId: null,
      evaluations: [],
      actionType: 'wait',
      reasoning: 'All available affordances are disabled or zero utility',
    };
  }

  return {
    selectedAffordance: topChoice.affordance,
    selectedComponentId: topChoice.componentId,
    evaluations,
    actionType: topChoice.affordance.type,
    reasoning: `Selected action "${topChoice.affordance.type}" on component "${topChoice.componentId}" with highest utility score ${topChoice.utilityScore}.`,
  };
}
