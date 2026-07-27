import type { SwarmSimulationTrace } from './swarm-engine.js';

export interface CohortAnalytics {
  cohortType: string;
  populationSize: number;
  conversionRate: number;
  abandonmentRate: number;
  averageFrustration: number;
}

export interface SwarmAnalyticsReport {
  swarmId: string;
  overallConversionRate: number;
  cohortBreakdown: CohortAnalytics[];
  componentDropOffHeatmap: Record<string, number>;
}

/**
 * Computes statistical cohort analytics and component drop-off metrics across a Monte Carlo swarm simulation trace.
 *
 * @param swarmTrace SwarmSimulationTrace
 * @returns SwarmAnalyticsReport object containing cohort breakdown and component drop-off frequency
 */
export function calculateSwarmAnalytics(swarmTrace: SwarmSimulationTrace): SwarmAnalyticsReport {
  const cohortGroups = new Map<
    string,
    { total: number; completed: number; abandoned: number; frustrationSum: number }
  >();
  const componentDropOffHeatmap: Record<string, number> = {};

  for (const trace of swarmTrace.traces) {
    const cohortType = (trace as unknown as { personaRole?: string }).personaRole || 'general';
    const group = cohortGroups.get(cohortType) || {
      total: 0,
      completed: 0,
      abandoned: 0,
      frustrationSum: 0,
    };

    group.total++;
    group.frustrationSum += trace.finalFrustration;

    if (trace.status === 'completed') {
      group.completed++;
    } else if (trace.status === 'abandoned') {
      group.abandoned++;
      // Track last interacted component on drop-off
      const lastStep = trace.stepLogs[trace.stepLogs.length - 1];
      if (lastStep?.actionEvent.targetComponentId) {
        const compId = lastStep.actionEvent.targetComponentId;
        componentDropOffHeatmap[compId] = (componentDropOffHeatmap[compId] || 0) + 1;
      }
    }

    cohortGroups.set(cohortType, group);
  }

  const cohortBreakdown: CohortAnalytics[] = [];
  for (const [cohortType, stats] of cohortGroups.entries()) {
    cohortBreakdown.push({
      cohortType,
      populationSize: stats.total,
      conversionRate: Math.round((stats.completed / Math.max(1, stats.total)) * 1000) / 1000,
      abandonmentRate: Math.round((stats.abandoned / Math.max(1, stats.total)) * 1000) / 1000,
      averageFrustration:
        Math.round((stats.frustrationSum / Math.max(1, stats.total)) * 1000) / 1000,
    });
  }

  return {
    swarmId: swarmTrace.swarmId,
    overallConversionRate: swarmTrace.aggregateConversionRate,
    cohortBreakdown,
    componentDropOffHeatmap,
  };
}
