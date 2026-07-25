import { describe, it, expect } from 'vitest';
import { ImmutablePage, ImmutablePersona, ImmutableCognitiveState } from '@platform/core';
import type { InteractionAffordance } from '@platform/compiler';
import { evaluateNextAction } from './decision-engine.js';

function createMockPage() {
  return ImmutablePage.create({
    id: 'page-1',
    name: 'Form Page',
    route: '/form',
    purpose: 'Submit feedback',
    components: [
      { id: 'comp-btn', name: 'Submit Button', type: 'CTA', purpose: 'Submit form', metadata: {} },
      {
        id: 'comp-footer',
        name: 'Footer',
        type: 'Footer',
        purpose: 'Footer section',
        metadata: {},
      },
    ],
    metadata: {},
  });
}

function createMockPersona() {
  return ImmutablePersona.create({
    id: 'persona-1',
    name: 'Standard User',
    role: 'User',
    personality: {
      openness: 0.6,
      conscientiousness: 0.6,
      extraversion: 0.5,
      agreeableness: 0.5,
      neuroticism: 0.3,
    },
    cognitiveTraits: {
      technicalFluency: 0.7,
      domainFamiliarity: 0.6,
      patienceThreshold: 0.5,
      attentionSpan: 0.6,
      visualAcuity: 0.8,
      riskTolerance: 0.6,
    },
    demographics: {},
    metadata: {},
  });
}

function createMockCognitiveState() {
  return ImmutableCognitiveState.create({
    id: 'cog-1',
    personaId: 'persona-1',
    activeGoal: 'Submit feedback',
    frustrationLevel: 0.1,
    trustLevel: 0.8,
    stepCount: 0,
  });
}

describe('decision-engine', () => {
  it('selects highest utility affordance deterministically', () => {
    const page = createMockPage();
    const persona = createMockPersona();
    const state = createMockCognitiveState();

    const affordances: InteractionAffordance[] = [
      {
        id: 'aff-scroll',
        type: 'scroll',
        targetNodeId: 'comp-footer',
        description: 'Scroll footer',
        enabled: true,
        metadata: {},
      },
      {
        id: 'aff-click',
        type: 'click',
        targetNodeId: 'comp-btn',
        description: 'Click submit',
        enabled: true,
        metadata: {},
      },
    ];

    const decision = evaluateNextAction(page, affordances, persona, state);

    expect(decision.selectedAffordance).not.toBeNull();
    expect(decision.selectedComponentId).toBe('comp-btn');
    expect(decision.actionType).toBe('click');
    expect(decision.evaluations).toHaveLength(2);
    expect(decision.evaluations[0]?.utilityScore).toBeGreaterThan(
      decision.evaluations[1]?.utilityScore ?? 0,
    );
  });

  it('handles empty affordances list gracefully with wait action', () => {
    const page = createMockPage();
    const persona = createMockPersona();
    const state = createMockCognitiveState();

    const decision = evaluateNextAction(page, [], persona, state);

    expect(decision.selectedAffordance).toBeNull();
    expect(decision.actionType).toBe('wait');
  });
});
