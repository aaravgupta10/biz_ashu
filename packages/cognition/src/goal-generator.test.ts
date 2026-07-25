import { describe, it, expect } from 'vitest';
import { ImmutablePage, ImmutablePersona, ImmutableCognitiveState } from '@platform/core';
import { generateUserGoals } from './goal-generator.js';

function createMockPage() {
  return ImmutablePage.create({
    id: 'page-1',
    name: 'Login Page',
    route: '/login',
    purpose: 'Authenticate user',
    components: [
      {
        id: 'comp-submit',
        name: 'Submit Button',
        type: 'CTA',
        purpose: 'Submit Credentials',
        metadata: {},
      },
    ],
    metadata: {},
  });
}

function createMockPersona(openness = 0.8) {
  return ImmutablePersona.create({
    id: 'persona-1',
    name: 'User 1',
    role: 'Member',
    personality: {
      openness,
      conscientiousness: 0.6,
      extraversion: 0.5,
      agreeableness: 0.6,
      neuroticism: 0.3,
    },
    cognitiveTraits: {
      technicalFluency: 0.7,
      domainFamiliarity: 0.6,
      patienceThreshold: 0.5,
      attentionSpan: 0.6,
      visualAcuity: 0.8,
      riskTolerance: 0.5,
    },
    demographics: {},
    metadata: {},
  });
}

describe('goal-generator', () => {
  it('generates prioritized user goals derived from page purpose and components', () => {
    const page = createMockPage();
    const persona = createMockPersona();

    const goals = generateUserGoals(page, persona);
    expect(goals.length).toBeGreaterThanOrEqual(2);
    expect(goals[0]?.description).toContain('Authenticate user');
  });

  it('adds exit goal when frustration level is high (> 0.7)', () => {
    const page = createMockPage();
    const persona = createMockPersona();
    const frustratedState = ImmutableCognitiveState.create({
      id: 'cog-1',
      personaId: 'persona-1',
      activeGoal: 'Login',
      frustrationLevel: 0.85,
      trustLevel: 0.2,
      stepCount: 5,
    });

    const goals = generateUserGoals(page, persona, frustratedState);
    expect(goals[0]?.id).toContain('goal-exit');
    expect(goals[0]?.priority).toBe(0.99);
  });
});
