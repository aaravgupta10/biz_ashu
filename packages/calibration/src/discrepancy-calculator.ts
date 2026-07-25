import type { SimulationTrace } from '@platform/runtime';

/**
 * Observed empirical benchmark data collected from real human user testing.
 */
export interface EmpiricalBenchmarkData {
  /** ID of the page evaluated */
  pageId: string;
  /** Observed real human drop-off rate [0.0 - 1.0] */
  targetDropOffRate: number;
  /** Observed average time on page in milliseconds */
  averageTimeOnPageMs: number;
  /** Observed average steps taken to conversion/completion */
  averageStepsToConversion: number;
  /** Observed real human completion rate [0.0 - 1.0] */
  completionRate: number;
}

/**
 * Breakdown of discrepancy scores between simulation traces and empirical benchmarks.
 */
export interface DiscrepancyMetrics {
  /** Difference between simulated drop-off and real human drop-off */
  dropOffDiscrepancy: number;
  /** Normalized difference between simulated duration and real duration */
  timeDiscrepancy: number;
  /** Normalized difference between simulated step count and real step count */
  stepDiscrepancy: number;
  /** Composite Loss Function score [0.0 - 1.0] where 0.0 is perfect alignment */
  totalDiscrepancyScore: number;
}

/**
 * Computes deterministic discrepancy metrics (loss function) comparing simulation traces against empirical benchmarks.
 *
 * @param traces Array of executed SimulationTrace objects
 * @param empirical EmpiricalBenchmarkData containing ground-truth human analytics
 * @returns DiscrepancyMetrics object detailing individual component losses and total loss score
 */
export function calculateDiscrepancy(
  traces: SimulationTrace[],
  empirical: EmpiricalBenchmarkData,
): DiscrepancyMetrics {
  if (!traces || traces.length === 0) {
    return {
      dropOffDiscrepancy: 1.0,
      timeDiscrepancy: 1.0,
      stepDiscrepancy: 1.0,
      totalDiscrepancyScore: 1.0,
    };
  }

  const totalTraces = traces.length;

  // 1. Simulated Drop-off Rate (abandoned status)
  const abandonedCount = traces.filter((t) => t.status === 'abandoned').length;
  const simDropOffRate = abandonedCount / totalTraces;
  const dropOffDiscrepancy = Math.abs(simDropOffRate - empirical.targetDropOffRate);

  // 2. Average Duration Discrepancy
  const totalDuration = traces.reduce((acc, t) => acc + t.totalDurationMs, 0);
  const avgDurationMs = totalDuration / totalTraces;
  const timeDiscrepancy = Math.min(
    1.0,
    Math.abs(avgDurationMs - empirical.averageTimeOnPageMs) /
      Math.max(1, empirical.averageTimeOnPageMs),
  );

  // 3. Average Step Count Discrepancy
  const totalSteps = traces.reduce((acc, t) => acc + t.totalSteps, 0);
  const avgSteps = totalSteps / totalTraces;
  const stepDiscrepancy = Math.min(
    1.0,
    Math.abs(avgSteps - empirical.averageStepsToConversion) /
      Math.max(1, empirical.averageStepsToConversion),
  );

  // Weighted Loss Function: L = 0.5 * dropOff + 0.3 * time + 0.2 * steps
  const totalDiscrepancyScore =
    Math.round((0.5 * dropOffDiscrepancy + 0.3 * timeDiscrepancy + 0.2 * stepDiscrepancy) * 1000) /
    1000;

  return {
    dropOffDiscrepancy: Math.round(dropOffDiscrepancy * 1000) / 1000,
    timeDiscrepancy: Math.round(timeDiscrepancy * 1000) / 1000,
    stepDiscrepancy: Math.round(stepDiscrepancy * 1000) / 1000,
    totalDiscrepancyScore,
  };
}
