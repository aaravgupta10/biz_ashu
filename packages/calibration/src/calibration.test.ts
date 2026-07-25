import { describe, it, expect } from 'vitest';
import type { SimulationTrace } from '@platform/runtime';
import { calculateDiscrepancy, EmpiricalBenchmarkData } from './discrepancy-calculator.js';
import { calibratePersonaParameters } from './parameter-optimizer.js';

function createMockTrace(overrides?: Partial<SimulationTrace>): SimulationTrace {
  return {
    traceId: 'trace-1',
    simulationId: 'sim-100',
    pageId: 'page-1',
    personaId: 'persona-1',
    status: 'completed',
    totalSteps: 4,
    totalDurationMs: 1200,
    finalFrustration: 0.1,
    finalTrust: 0.8,
    stepLogs: [],
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

function createMockEmpirical(): EmpiricalBenchmarkData {
  return {
    pageId: 'page-1',
    targetDropOffRate: 0.0,
    averageTimeOnPageMs: 1200,
    averageStepsToConversion: 4,
    completionRate: 1.0,
  };
}

describe('calibration engine', () => {
  describe('calculateDiscrepancy', () => {
    it('returns zero totalDiscrepancyScore when simulation perfectly matches empirical data', () => {
      const traces = [createMockTrace()];
      const empirical = createMockEmpirical();

      const metrics = calculateDiscrepancy(traces, empirical);

      expect(metrics.dropOffDiscrepancy).toBe(0.0);
      expect(metrics.timeDiscrepancy).toBe(0.0);
      expect(metrics.stepDiscrepancy).toBe(0.0);
      expect(metrics.totalDiscrepancyScore).toBe(0.0);
    });

    it('calculates discrepancy score when simulation diverges from empirical data', () => {
      const traces = [
        createMockTrace({ status: 'abandoned', totalSteps: 1, totalDurationMs: 200 }),
      ];
      const empirical = createMockEmpirical(); // expected completed, 4 steps, 1200ms

      const metrics = calculateDiscrepancy(traces, empirical);

      expect(metrics.dropOffDiscrepancy).toBeGreaterThan(0.0);
      expect(metrics.totalDiscrepancyScore).toBeGreaterThan(0.0);
    });
  });

  describe('calibratePersonaParameters', () => {
    it('produces calibrated parameters and confidence score', () => {
      const traces = [createMockTrace({ status: 'abandoned' })];
      const empirical = createMockEmpirical();

      const result = calibratePersonaParameters(traces, empirical);

      expect(result.id).toBeDefined();
      expect(result.confidenceScore).toBeGreaterThanOrEqual(0.5);
      expect(result.parametersAdjusted.patienceCoeff).toBeGreaterThanOrEqual(1.0);
    });
  });
});
