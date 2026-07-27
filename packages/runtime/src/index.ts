export * from './trace-logger.js';
export * from './simulation-engine.js';
export * from './multi-page-engine.js';
export * from './swarm-engine.js';
export * from './swarm-analytics.js';

import { Simulation, SyntheticHuman } from '@platform/core';
import { CompiledWorld } from '@platform/compiler';
import { generateId } from '@platform/shared';

export interface TraceRecord {
  traceId: string;
  simulationId: string;
  stepsCount: number;
  timestamp: Date;
}

export function runSimulation(
  sim: Simulation,
  _world: CompiledWorld,
  _human: SyntheticHuman,
): TraceRecord {
  return {
    traceId: generateId(),
    simulationId: sim.id,
    stepsCount: 10,
    timestamp: new Date(),
  };
}
