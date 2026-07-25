import { generateId } from '@platform/shared';
import type { SimulationTrace } from '@platform/runtime';
import {
  calculateDiscrepancy,
  EmpiricalBenchmarkData,
  DiscrepancyMetrics,
} from './discrepancy-calculator.js';

/**
 * Parameter adjustment coefficient multipliers produced by calibration.
 */
export interface CalibratedParameters {
  patienceCoeff: number;
  attentionSpanCoeff: number;
  visualAcuityCoeff: number;
  riskToleranceCoeff: number;
}

/**
 * Full output result of persona parameter calibration.
 */
export interface CalibrationOptimizationResult {
  id: string;
  simulationId?: string;
  discrepancyMetrics: DiscrepancyMetrics;
  parametersAdjusted: CalibratedParameters;
  confidenceScore: number;
  calibratedAt: string;
}

/**
 * Optimizes persona cognitive parameters based on simulation traces and empirical benchmarks.
 *
 * @param traces Array of executed SimulationTrace objects
 * @param empirical Ground-truth human user testing benchmark
 * @returns CalibrationOptimizationResult detailing parameter adjustments and confidence score
 */
export function calibratePersonaParameters(
  traces: SimulationTrace[],
  empirical: EmpiricalBenchmarkData,
): CalibrationOptimizationResult {
  const metrics = calculateDiscrepancy(traces, empirical);

  // Compute directional adjustment multipliers based on discrepancy sources
  let patienceCoeff = 1.0;
  let attentionSpanCoeff = 1.0;
  let visualAcuityCoeff = 1.0;
  let riskToleranceCoeff = 1.0;
  if (metrics.dropOffDiscrepancy > 0.1) {
    patienceCoeff = Math.round((1.0 + metrics.dropOffDiscrepancy * 0.2) * 100) / 100;
    riskToleranceCoeff = Math.round((1.0 + metrics.dropOffDiscrepancy * 0.1) * 100) / 100;
  }

  if (metrics.timeDiscrepancy > 0.1) {
    attentionSpanCoeff = Math.round((1.0 + metrics.timeDiscrepancy * 0.15) * 100) / 100;
  }

  if (metrics.stepDiscrepancy > 0.1) {
    visualAcuityCoeff = Math.round((1.0 + metrics.stepDiscrepancy * 0.1) * 100) / 100;
  }

  const confidenceScore =
    Math.round(Math.max(0.5, 1.0 - metrics.totalDiscrepancyScore) * 100) / 100;

  return {
    id: generateId(),
    simulationId: traces[0]?.simulationId,
    discrepancyMetrics: metrics,
    parametersAdjusted: {
      patienceCoeff,
      attentionSpanCoeff,
      visualAcuityCoeff,
      riskToleranceCoeff,
    },
    confidenceScore,
    calibratedAt: new Date().toISOString(),
  };
}
