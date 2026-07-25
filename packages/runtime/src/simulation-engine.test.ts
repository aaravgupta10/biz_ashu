import { describe, it, expect } from 'vitest';
import { ImmutablePage, ImmutablePersona } from '@platform/core';
import type { InteractionAffordance } from '@platform/compiler';
import { runSimulationSession } from './simulation-engine.js';
import { TraceLogger } from './trace-logger.js';

function createMockPage() {
  return ImmutablePage.create({
    id: 'page-checkout',
    name: 'Checkout Page',
    route: '/checkout',
    purpose: 'Complete order',
    components: [
      {
        id: 'comp-submit',
        name: 'Place Order Button',
        type: 'CTA',
        purpose: 'Submit order',
        metadata: {},
      },
      {
        id: 'comp-input',
        name: 'Card Number',
        type: 'Input',
        purpose: 'Enter payment card',
        metadata: {},
      },
    ],
    metadata: {},
  });
}

function createMockPersona() {
  return ImmutablePersona.create({
    id: 'persona-1',
    name: 'Express Buyer',
    role: 'Shopper',
    personality: {
      openness: 0.7,
      conscientiousness: 0.8,
      extraversion: 0.5,
      agreeableness: 0.6,
      neuroticism: 0.2,
    },
    cognitiveTraits: {
      technicalFluency: 0.8,
      domainFamiliarity: 0.9,
      patienceThreshold: 0.6,
      attentionSpan: 0.7,
      visualAcuity: 0.9,
      riskTolerance: 0.7,
    },
    demographics: {},
    metadata: {},
  });
}

function createMockAffordances(): InteractionAffordance[] {
  return [
    {
      id: 'aff-input',
      type: 'type',
      targetNodeId: 'comp-input',
      description: 'Enter card',
      enabled: true,
      metadata: { fieldName: 'card' },
    },
    {
      id: 'aff-submit',
      type: 'submit',
      targetNodeId: 'comp-submit',
      description: 'Submit order',
      enabled: true,
      metadata: { isSubmitButton: true },
    },
  ];
}

describe('simulation-engine', () => {
  describe('TraceLogger', () => {
    it('logs step entries and finalizes frozen trace telemetry', () => {
      const logger = new TraceLogger('sim-1', 'page-1', 'persona-1');

      logger.logStep({
        stepIndex: 0,
        actionEvent: {
          id: 'act-1',
          simulationId: 'sim-1',
          stepIndex: 0,
          actionType: 'click',
          targetComponentId: 'comp-1',
          affordanceId: 'aff-1',
          durationMs: 200,
          payload: {},
          timestamp: new Date().toISOString(),
        },
        cognitiveStateSnapshot: {},
        worldStateSnapshot: {},
        decisionReasoning: 'Selected CTA',
        utilityScore: 0.85,
      });

      expect(logger.getStepCount()).toBe(1);

      const trace = logger.finalizeTrace('completed', 0.1, 0.9);
      expect(trace.traceId).toBeDefined();
      expect(trace.status).toBe('completed');
      expect(trace.totalSteps).toBe(1);
      expect(trace.totalDurationMs).toBe(200);
      expect(Object.isFrozen(trace)).toBe(true);
      expect(Object.isFrozen(trace.stepLogs)).toBe(true);
    });
  });

  describe('runSimulationSession', () => {
    it('executes a simulation session to completion', () => {
      const page = createMockPage();
      const persona = createMockPersona();
      const affordances = createMockAffordances();

      const trace = runSimulationSession({
        simulationId: 'sim-test-1',
        page,
        persona,
        affordances,
        maxSteps: 5,
      });

      expect(trace.simulationId).toBe('sim-test-1');
      expect(trace.pageId).toBe('page-checkout');
      expect(trace.personaId).toBe('persona-1');
      expect(trace.totalSteps).toBeGreaterThan(0);
      expect(trace.status).toBe('completed');
      expect(trace.stepLogs[0]?.actionEvent.simulationId).toBe('sim-test-1');
    });

    it('respects maxSteps limit', () => {
      const page = createMockPage();
      const persona = createMockPersona();
      const scrollAffordance: InteractionAffordance[] = [
        {
          id: 'aff-scroll',
          type: 'scroll',
          targetNodeId: 'comp-input',
          description: 'Scroll',
          enabled: true,
          metadata: {},
        },
      ];

      const trace = runSimulationSession({
        simulationId: 'sim-test-2',
        page,
        persona,
        affordances: scrollAffordance,
        maxSteps: 2,
      });

      expect(trace.totalSteps).toBe(2);
      expect(trace.status).toBe('max_steps_reached');
    });
  });
});
