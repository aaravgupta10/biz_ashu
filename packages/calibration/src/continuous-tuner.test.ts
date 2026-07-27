import { describe, it, expect } from 'vitest';
import { ImmutablePersona } from '@platform/core';
import { parsePostHogEvents, type PostHogExportEvent } from './analytics-connector.js';
import { runContinuousAutoTuner } from './continuous-tuner.js';

const mockPersona = ImmutablePersona.create({
  id: 'persona-tune-1',
  name: 'Tuning Candidate',
  role: 'User',
  personality: {
    openness: 0.6,
    conscientiousness: 0.7,
    extraversion: 0.5,
    agreeableness: 0.6,
    neuroticism: 0.3,
  },
  cognitiveTraits: {
    technicalFluency: 0.8,
    domainFamiliarity: 0.75,
    patienceThreshold: 0.6,
    attentionSpan: 0.7,
    visualAcuity: 0.85,
    riskTolerance: 0.6,
  },
  demographics: {},
  metadata: {},
});

describe('Live Analytics Auto-Tuner', () => {
  it('parses PostHog events and runs continuous parameter auto-tuning', () => {
    const posthogEvents: PostHogExportEvent[] = [
      { event: '$pageview', distinct_id: 'u1', timestamp: '2026-07-25T10:00:00Z' },
      { event: 'submit_order', distinct_id: 'u1', timestamp: '2026-07-25T10:00:15Z' },
    ];

    const normalized = parsePostHogEvents(posthogEvents);
    expect(normalized.length).toBe(2);
    expect(normalized[0]?.eventType).toBe('pageview');
    expect(normalized[1]?.eventType).toBe('submit');

    const result = runContinuousAutoTuner(mockPersona, {
      pageId: 'page-checkout',
      targetDropOffRate: 0.1,
      averageTimeOnPageMs: 1500,
      averageStepsToConversion: 3,
      completionRate: 0.9,
    });

    expect(result.personaId).toBe(mockPersona.id);
    expect(result.iterationsRun).toBeGreaterThan(0);
    expect(result.calibratedTraits).toBeDefined();
  });
});
