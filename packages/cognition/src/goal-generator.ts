import type { Page, Persona, CognitiveState } from '@platform/core';

/**
 * Represents a goal or intent pursued by a synthetic human during simulation.
 */
export interface UserGoal {
  /** Unique identifier for the goal */
  id: string;
  /** Human-readable description of the goal */
  description: string;
  /** Goal priority score continuous value [0.0 - 1.0] */
  priority: number;
  /** Optional target Component ID associated with this goal */
  targetComponentId?: string;
  /** Status indicating whether this goal has been accomplished */
  completed: boolean;
}

/**
 * Formulates structured user goals based on Page digital twin purpose, component layout, and Persona traits.
 *
 * @param page Compiled Page instance
 * @param persona Persona profile of the synthetic human
 * @param currentState Optional current CognitiveState
 * @returns Array of UserGoal objects prioritized deterministically
 */
export function generateUserGoals(
  page: Page,
  persona: Persona,
  currentState?: CognitiveState,
): UserGoal[] {
  const goals: UserGoal[] = [];

  // 1. Primary Page Goal
  goals.push({
    id: `goal-primary-${page.id}`,
    description: page.purpose,
    priority: 0.9,
    completed: false,
  });

  // 2. Component-specific Action Goals (CTAs or Forms)
  const actionComponents = page.components.filter(
    (c) => c.type === 'CTA' || c.type === 'Form' || c.type === 'Input',
  );

  for (const comp of actionComponents) {
    goals.push({
      id: `goal-action-${comp.id}`,
      description: `Execute action: ${comp.purpose}`,
      priority: comp.type === 'CTA' || comp.type === 'Form' ? 0.85 : 0.7,
      targetComponentId: comp.id,
      completed: false,
    });
  }

  // 3. Exploration Goal based on Persona Openness trait
  if (persona.personality.openness >= 0.5) {
    const explorePriority = Math.round(persona.personality.openness * 0.6 * 100) / 100;
    goals.push({
      id: `goal-explore-${page.id}`,
      description: 'Explore page structure and navigation links',
      priority: explorePriority,
      completed: false,
    });
  }

  // If cognitive state shows high frustration (> 0.7), prioritize abandonment / quick exit goal
  if (currentState && currentState.frustrationLevel > 0.7) {
    goals.unshift({
      id: `goal-exit-${page.id}`,
      description: 'Abandon flow due to high friction and frustration',
      priority: 0.99,
      completed: false,
    });
  }

  // Sort goals descending by priority
  return goals.sort((a, b) => b.priority - a.priority);
}
