import { describe, it, expect } from 'vitest';
import { ImmutablePage, ImmutablePersona, ImmutableCognitiveState } from '@platform/core';
import {
  calculateAttentionScores,
  calculateComponentAttention,
  calculateRelevanceMultiplier,
} from './perception-engine.js';

function createMockPage() {
  return ImmutablePage.create({
    id: 'page-1',
    name: 'Checkout Page',
    route: '/checkout',
    purpose: 'Complete purchase',
    components: [
      {
        id: 'comp-cta',
        name: 'Submit Button',
        type: 'CTA',
        purpose: 'Complete Sign-up',
        metadata: {},
      },
      { id: 'comp-head', name: 'Main Title', type: 'Headline', purpose: 'Title', metadata: {} },
      { id: 'comp-footer', name: 'Footer Links', type: 'Footer', purpose: 'Footer', metadata: {} },
    ],
    metadata: {},
  });
}

function createMockPersona() {
  return ImmutablePersona.create({
    id: 'persona-1',
    name: 'Power User',
    role: 'User',
    personality: {
      openness: 0.8,
      conscientiousness: 0.7,
      extraversion: 0.5,
      agreeableness: 0.6,
      neuroticism: 0.2,
    },
    cognitiveTraits: {
      technicalFluency: 0.9,
      domainFamiliarity: 0.8,
      patienceThreshold: 0.5,
      attentionSpan: 0.7,
      visualAcuity: 0.9,
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
    activeGoal: 'Complete Sign-up',
    activeFocusComponentId: 'comp-cta',
    frustrationLevel: 0.1,
    trustLevel: 0.8,
    stepCount: 1,
    shortTermMemory: [],
    metadata: {},
  });
}

describe('perception-engine', () => {
  it('calculates relevance multiplier with focus and goal keyword boosts', () => {
    const page = createMockPage();
    const ctaComp = page.components[0];
    expect(ctaComp).toBeDefined();
    const state = createMockCognitiveState();

    if (ctaComp) {
      const mult = calculateRelevanceMultiplier(ctaComp, state);
      expect(mult).toBeGreaterThan(1.0);
    }
  });

  it('calculates higher attention score for CTA than Footer', () => {
    const page = createMockPage();
    const persona = createMockPersona();
    const state = createMockCognitiveState();

    const ctaComp = page.components[0];
    const footerComp = page.components[2];
    expect(ctaComp).toBeDefined();
    expect(footerComp).toBeDefined();

    if (ctaComp && footerComp) {
      const ctaScore = calculateComponentAttention(ctaComp, persona, state);
      const footerScore = calculateComponentAttention(footerComp, persona, state);

      expect(ctaScore).toBeGreaterThan(footerScore);
      expect(ctaScore).toBeLessThanOrEqual(1.0);
      expect(footerScore).toBeGreaterThanOrEqual(0.0);
    }
  });

  it('calculates attention scores map across all page components', () => {
    const page = createMockPage();
    const persona = createMockPersona();
    const state = createMockCognitiveState();

    const scoreMap = calculateAttentionScores(page, persona, state);

    expect(scoreMap.size).toBe(3);
    expect(scoreMap.has('comp-cta')).toBe(true);
    expect(scoreMap.has('comp-head')).toBe(true);
    expect(scoreMap.has('comp-footer')).toBe(true);
  });
});
