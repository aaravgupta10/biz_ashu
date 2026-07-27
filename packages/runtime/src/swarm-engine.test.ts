import { describe, it, expect } from 'vitest';
import { generateSyntheticPopulation, type Page } from '@platform/core';
import type { InteractionAffordance } from '@platform/compiler';
import { runSwarmSimulationSession } from './swarm-engine.js';
import { calculateSwarmAnalytics } from './swarm-analytics.js';

const mockPage: Page = {
  id: 'page-swarm-1',
  name: 'Checkout Page',
  route: '/checkout',
  purpose: 'Checkout',
  metadata: {},
  components: [
    { id: 'email', name: 'Email Input', type: 'input', purpose: 'Enter email', metadata: {} },
    { id: 'card', name: 'Card Input', type: 'input', purpose: 'Enter card', metadata: {} },
    { id: 'pay', name: 'Pay Button', type: 'button', purpose: 'Pay order', metadata: {} },
  ],
};

const mockAffordances: InteractionAffordance[] = [
  {
    id: 'aff-email',
    targetNodeId: 'email',
    type: 'type',
    description: 'Enter email',
    enabled: true,
    metadata: {},
  },
  {
    id: 'aff-card',
    targetNodeId: 'card',
    type: 'type',
    description: 'Enter card',
    enabled: true,
    metadata: {},
  },
  {
    id: 'aff-pay',
    targetNodeId: 'pay',
    type: 'submit',
    description: 'Pay order',
    enabled: true,
    metadata: {},
  },
];

describe('Monte Carlo Swarm Engine', () => {
  it('executes parallel swarm simulations across synthetic cohorts and calculates analytics', () => {
    const population = generateSyntheticPopulation([
      { cohortType: 'gen_z_mobile', count: 3 },
      { cohortType: 'senior_low_fluency', count: 3 },
    ]);

    expect(population.length).toBe(6);

    const swarmTrace = runSwarmSimulationSession({
      page: mockPage,
      population,
      affordances: mockAffordances,
      maxStepsPerSession: 10,
    });

    expect(swarmTrace.swarmId).toBeDefined();
    expect(swarmTrace.totalPopulation).toBe(6);
    expect(swarmTrace.traces.length).toBe(6);

    const analytics = calculateSwarmAnalytics(swarmTrace);
    expect(analytics.swarmId).toBe(swarmTrace.swarmId);
    expect(analytics.overallConversionRate).toBeGreaterThanOrEqual(0.0);
  });
});
