import { describe, it, expect } from 'vitest';
import { ImmutablePage } from '@platform/core';
import type { SimulationTrace } from '@platform/runtime';
import { detectFrictionPatterns } from './friction-detector.js';
import { generateProductRecommendations } from './recommendation-generator.js';

function createMockPage() {
  return ImmutablePage.create({
    id: 'page-1',
    name: 'Signup Page',
    route: '/signup',
    purpose: 'User Registration',
    components: [
      {
        id: 'comp-cta',
        name: 'Submit Registration',
        type: 'CTA',
        purpose: 'Complete registration',
        metadata: {},
      },
      {
        id: 'comp-input',
        name: 'Email Input',
        type: 'Input',
        purpose: 'Enter email',
        metadata: {},
      },
    ],
    metadata: {},
  });
}

function createMockTrace(overrides?: Partial<SimulationTrace>): SimulationTrace {
  return {
    traceId: 'trace-1',
    simulationId: 'sim-100',
    pageId: 'page-1',
    personaId: 'persona-1',
    status: 'abandoned',
    totalSteps: 3,
    totalDurationMs: 1500,
    finalFrustration: 0.92,
    finalTrust: 0.2,
    stepLogs: [
      {
        stepIndex: 0,
        actionEvent: {
          id: 'act-1',
          simulationId: 'sim-100',
          stepIndex: 0,
          actionType: 'type',
          targetComponentId: 'comp-input',
          affordanceId: 'aff-1',
          durationMs: 500,
          payload: {},
          timestamp: new Date().toISOString(),
        },
        cognitiveStateSnapshot: {},
        worldStateSnapshot: {},
        decisionReasoning: 'Type email',
        utilityScore: 0.8,
      },
      {
        stepIndex: 1,
        actionEvent: {
          id: 'act-2',
          simulationId: 'sim-100',
          stepIndex: 1,
          actionType: 'type',
          targetComponentId: 'comp-input',
          affordanceId: 'aff-1',
          durationMs: 500,
          payload: {},
          timestamp: new Date().toISOString(),
        },
        cognitiveStateSnapshot: {},
        worldStateSnapshot: {},
        decisionReasoning: 'Type email again',
        utilityScore: 0.7,
      },
      {
        stepIndex: 2,
        actionEvent: {
          id: 'act-3',
          simulationId: 'sim-100',
          stepIndex: 2,
          actionType: 'type',
          targetComponentId: 'comp-input',
          affordanceId: 'aff-1',
          durationMs: 500,
          payload: {},
          timestamp: new Date().toISOString(),
        },
        cognitiveStateSnapshot: {},
        worldStateSnapshot: {},
        decisionReasoning: 'Type email 3rd time',
        utilityScore: 0.6,
      },
    ],
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('recommendation engine', () => {
  describe('detectFrictionPatterns', () => {
    it('detects abandonment, high frustration, hesitation loop, and unclear CTA patterns', () => {
      const page = createMockPage();
      const trace = createMockTrace();

      const patterns = detectFrictionPatterns(trace, page);

      expect(patterns.length).toBeGreaterThanOrEqual(3);
      const types = patterns.map((p) => p.type);
      expect(types).toContain('abandonment');
      expect(types).toContain('high_frustration');
      expect(types).toContain('hesitation_loop');
      expect(types).toContain('unclear_cta');
    });
  });

  describe('generateProductRecommendations', () => {
    it('generates structured recommendations with expected lift factors', () => {
      const page = createMockPage();
      const trace = createMockTrace();

      const patterns = detectFrictionPatterns(trace, page);
      const recommendations = generateProductRecommendations(patterns);

      expect(recommendations.length).toBe(patterns.length);
      expect(recommendations[0]?.expectedLift).toBeGreaterThan(0.0);
      expect(recommendations[0]?.evidenceSummary).toBeDefined();
    });
  });
});
