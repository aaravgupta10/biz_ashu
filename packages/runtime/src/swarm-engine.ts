import { generateId } from '@platform/shared';
import type { Page, Persona } from '@platform/core';
import type { InteractionAffordance } from '@platform/compiler';
import { runSimulationSession } from './simulation-engine.js';
import type { SimulationTrace } from './trace-logger.js';

export interface SwarmConfig {
  /** Unique Swarm Session ID */
  swarmId?: string;
  /** Digital Twin target Page */
  page: Page;
  /** Array of synthetic human Persona profiles */
  population: Persona[];
  /** Interaction affordances for the page */
  affordances: InteractionAffordance[];
  /** Maximum steps per individual session (default 10) */
  maxStepsPerSession?: number;
}

export interface SwarmSimulationTrace {
  readonly swarmId: string;
  readonly pageId: string;
  readonly totalPopulation: number;
  readonly completedSessionsCount: number;
  readonly abandonedSessionsCount: number;
  readonly maxStepsReachedCount: number;
  readonly aggregateConversionRate: number;
  readonly averageFrustration: number;
  readonly traces: readonly Readonly<SimulationTrace>[];
  readonly createdAt: string;
}

/**
 * Executes a Monte Carlo Swarm simulation session across a population cohort of synthetic personas.
 *
 * @param config SwarmConfig
 * @returns SwarmSimulationTrace containing aggregate statistics and individual session traces
 */
export function runSwarmSimulationSession(config: SwarmConfig): SwarmSimulationTrace {
  const swarmId = config.swarmId || generateId();
  const maxSteps = config.maxStepsPerSession || 10;
  const traces: SimulationTrace[] = [];

  let completedCount = 0;
  let abandonedCount = 0;
  let maxStepsCount = 0;
  let totalFrustrationSum = 0;

  for (const persona of config.population) {
    const trace = runSimulationSession({
      page: config.page,
      persona,
      affordances: config.affordances,
      maxSteps,
    });

    traces.push(trace);
    totalFrustrationSum += trace.finalFrustration;

    if (trace.status === 'completed') {
      completedCount++;
    } else if (trace.status === 'abandoned') {
      abandonedCount++;
    } else {
      maxStepsCount++;
    }
  }

  const total = config.population.length;
  const aggregateConversionRate = Math.round((completedCount / Math.max(1, total)) * 1000) / 1000;
  const averageFrustration = Math.round((totalFrustrationSum / Math.max(1, total)) * 1000) / 1000;

  return Object.freeze({
    swarmId,
    pageId: config.page.id,
    totalPopulation: total,
    completedSessionsCount: completedCount,
    abandonedSessionsCount: abandonedCount,
    maxStepsReachedCount: maxStepsCount,
    aggregateConversionRate,
    averageFrustration,
    traces: Object.freeze([...traces.map((t) => Object.freeze({ ...t }))]),
    createdAt: new Date().toISOString(),
  });
}
