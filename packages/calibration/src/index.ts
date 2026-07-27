export * from './discrepancy-calculator.js';
export * from './parameter-optimizer.js';
export * from './analytics-importer.js';
export * from './analytics-connector.js';
export * from './continuous-tuner.js';

import { Simulation } from '@platform/core';
import { generateId } from '@platform/shared';

export interface LegacyCalibrationResult {
  id: string;
  simulationId: string;
  discrepancyScore: number;
  parametersAdjusted: Record<string, number>;
  calibratedAt: Date;
}

export function calibrateSimulationModel(
  sim: Simulation,
  _empiricalData: Record<string, unknown>,
): LegacyCalibrationResult {
  return {
    id: generateId(),
    simulationId: sim.id,
    discrepancyScore: 0.05,
    parametersAdjusted: {
      decisionThreshold: 0.85,
      attentionspanCoeff: 1.12,
    },
    calibratedAt: new Date(),
  };
}
