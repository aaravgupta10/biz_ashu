import { describe, it, expect } from 'vitest';
import { ImmutablePersona, type Page } from '@platform/core';
import { calculateVisualAttentionHeatmap } from './attention-heatmap.js';

const mockPage: Page = {
  id: 'page-heatmap-1',
  name: 'Sample Checkout Page',
  route: '/checkout',
  purpose: 'Order purchase',
  metadata: {},
  components: [
    { id: 'h1', name: 'Header Title', type: 'heading', purpose: 'Title', metadata: {} },
    { id: 'email', name: 'Email Input', type: 'input', purpose: 'Enter email', metadata: {} },
    { id: 'btn', name: 'Submit Button', type: 'button', purpose: 'Pay now', metadata: {} },
    { id: 'footer', name: 'Footer Link', type: 'anchor', purpose: 'Terms', metadata: {} },
  ],
};

const mockPersona = ImmutablePersona.create({
  id: 'persona-heat-1',
  name: 'Visual Observer',
  role: 'User',
  personality: {
    openness: 0.6,
    conscientiousness: 0.8,
    extraversion: 0.5,
    agreeableness: 0.6,
    neuroticism: 0.2,
  },
  cognitiveTraits: {
    technicalFluency: 0.8,
    domainFamiliarity: 0.8,
    patienceThreshold: 0.6,
    attentionSpan: 0.8,
    visualAcuity: 0.9,
    riskTolerance: 0.6,
  },
  demographics: {},
  metadata: {},
});

describe('calculateVisualAttentionHeatmap', () => {
  it('computes visual fixation attention scores and zone counts', () => {
    const heatmap = calculateVisualAttentionHeatmap(mockPage, mockPersona);

    expect(heatmap.pageId).toBe('page-heatmap-1');
    expect(heatmap.totalComponentsScored).toBe(4);
    expect(heatmap.scores.length).toBe(4);

    const btnScore = heatmap.scores.find((s) => s.componentId === 'btn');
    expect(btnScore).toBeDefined();
    expect(btnScore?.attentionScore).toBeGreaterThan(0.5);

    expect(heatmap.highFixationCount + heatmap.mediumFixationCount + heatmap.lowFixationCount).toBe(
      4,
    );
  });
});
