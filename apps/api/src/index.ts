import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PLATFORM_VERSION, generateId } from '@platform/shared';
import {
  ImmutablePersona,
  ImmutableCognitiveState,
  generateSyntheticPopulation,
  type CohortType,
} from '@platform/core';
import {
  parseHtml,
  extractRawElements,
  classifyRawElements,
  buildPageGraph,
  extractAllAffordances,
  validateDigitalTwinPage,
  compileSiteGraph,
  type SitePageInput,
} from '@platform/compiler';
import {
  runSimulationSession,
  runMultiPageSimulationSession,
  runSwarmSimulationSession,
  calculateSwarmAnalytics,
} from '@platform/runtime';
import { calculateVisualAttentionHeatmap } from '@platform/cognition';
import {
  calculateDiscrepancy,
  parsePostHogEvents,
  runContinuousAutoTuner,
  importEmpiricalClickstream,
  type PostHogExportEvent,
} from '@platform/calibration';
import {
  detectFrictionPatterns,
  generateProductRecommendations,
  generateRecommendations,
  generatePageVariant,
  compareSimulationVariants,
  runAutonomousOptimizer,
  generateGitPullRequestPatch,
} from '@platform/recommendation';

const fastify = Fastify({
  logger: true,
});

await fastify.register(cors, { origin: true });

const DEFAULT_SAMPLE_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Express Checkout</title>
</head>
<body>
  <header>
    <h1>Complete Your Purchase</h1>
  </header>
  <main>
    <form id="checkout-form" action="/submit-order" method="POST">
      <label for="email">Email Address</label>
      <input type="email" id="email" name="email" required />

      <label for="card">Credit Card Number</label>
      <input type="text" id="card" name="card" required />

      <button type="submit" id="pay-button">Pay Now ($49.00)</button>
    </form>
  </main>
  <footer>
    <a href="/terms">Terms of Service</a>
  </footer>
</body>
</html>
`;

fastify.get('/health', async () => {
  return {
    status: 'ok',
    version: PLATFORM_VERSION,
  };
});

fastify.get('/demo-recommendation', async () => {
  const dummyState = ImmutableCognitiveState.create({
    id: 'state-uuid-example',
    personaId: 'persona-uuid-example',
    activeGoal: 'Complete Sign-up',
    frustrationLevel: 0.2,
    trustLevel: 0.8,
  });

  const recommendations = generateRecommendations(dummyState);
  return { recommendations };
});

interface SimulateRequestBody {
  html?: string;
  personaName?: string;
  maxSteps?: number;
}

fastify.post('/api/simulate', async (request) => {
  const body = (request.body as SimulateRequestBody) || {};
  const htmlInput = body.html && body.html.trim() !== '' ? body.html : DEFAULT_SAMPLE_HTML;
  const maxSteps = body.maxSteps || 10;

  // 1. Compile HTML to Digital Twin
  const domTree = parseHtml(htmlInput);
  const rawElements = extractRawElements(domTree);
  const semanticNodes = classifyRawElements(rawElements);
  const page = buildPageGraph(semanticNodes, {
    id: generateId(),
    name: 'Target Page',
    route: '/checkout',
    purpose: 'Complete purchase conversion',
  });
  const affordances = extractAllAffordances(semanticNodes);
  const validation = validateDigitalTwinPage(page, affordances);

  // 2. Instantiate Synthetic Human Persona
  const persona = ImmutablePersona.create({
    id: generateId(),
    name: body.personaName || 'Standard Shopper',
    role: 'Customer',
    personality: {
      openness: 0.6,
      conscientiousness: 0.7,
      extraversion: 0.5,
      agreeableness: 0.6,
      neuroticism: 0.3,
    },
    cognitiveTraits: {
      technicalFluency: 0.75,
      domainFamiliarity: 0.7,
      patienceThreshold: 0.55,
      attentionSpan: 0.65,
      visualAcuity: 0.8,
      riskTolerance: 0.6,
    },
    demographics: {},
    metadata: {},
  });

  // 3. Execute Simulation Session
  const trace = runSimulationSession({
    page,
    persona,
    affordances,
    maxSteps,
  });

  // 4. Calculate Empirical Calibration Metrics
  const empirical = {
    pageId: page.id,
    targetDropOffRate: 0.1,
    averageTimeOnPageMs: 1500,
    averageStepsToConversion: 3,
    completionRate: 0.9,
  };
  const discrepancy = calculateDiscrepancy([trace], empirical);

  // 5. Detect Friction & Generate Product Recommendations
  const frictionPatterns = detectFrictionPatterns(trace, page);
  const recommendations = generateProductRecommendations(frictionPatterns);

  return {
    page,
    validation,
    persona: persona.toJSON(),
    trace,
    discrepancy,
    frictionPatterns,
    recommendations,
  };
});

interface SimulateSiteRequestBody {
  siteName?: string;
  entryRoute?: string;
  pages?: SitePageInput[];
  personaName?: string;
  maxTotalSteps?: number;
}

fastify.post('/api/simulate-site', async (request) => {
  const body = (request.body as SimulateSiteRequestBody) || {};
  const siteName = body.siteName || 'Multi-Page Application';
  const entryRoute = body.entryRoute || '/';
  const pagesInput = body.pages || [
    { route: '/', html: DEFAULT_SAMPLE_HTML, name: 'Checkout Page' },
  ];

  const { site, affordancesByRoute } = compileSiteGraph(siteName, entryRoute, pagesInput);

  const persona = ImmutablePersona.create({
    id: generateId(),
    name: body.personaName || 'Multi-Page Navigator',
    role: 'User',
    personality: {
      openness: 0.7,
      conscientiousness: 0.75,
      extraversion: 0.5,
      agreeableness: 0.6,
      neuroticism: 0.25,
    },
    cognitiveTraits: {
      technicalFluency: 0.8,
      domainFamiliarity: 0.75,
      patienceThreshold: 0.6,
      attentionSpan: 0.7,
      visualAcuity: 0.85,
      riskTolerance: 0.65,
    },
    demographics: {},
    metadata: {},
  });

  const trace = runMultiPageSimulationSession({
    site,
    persona,
    affordancesByRoute,
    maxTotalSteps: body.maxTotalSteps || 25,
  });

  return {
    site: site.toJSON(),
    persona: persona.toJSON(),
    trace,
  };
});

fastify.post('/api/generate-variant', async (request) => {
  const body = (request.body as SimulateRequestBody) || {};
  const htmlInput = body.html && body.html.trim() !== '' ? body.html : DEFAULT_SAMPLE_HTML;

  // 1. Run Original Journey (Variant A)
  const domTreeA = parseHtml(htmlInput);
  const rawElementsA = extractRawElements(domTreeA);
  const semanticNodesA = classifyRawElements(rawElementsA);
  const pageA = buildPageGraph(semanticNodesA, { name: 'Original Page' });
  const affordancesA = extractAllAffordances(semanticNodesA);

  const persona = ImmutablePersona.create({
    id: generateId(),
    name: body.personaName || 'A/B Tester Persona',
    role: 'User',
    personality: {
      openness: 0.6,
      conscientiousness: 0.8,
      extraversion: 0.5,
      agreeableness: 0.6,
      neuroticism: 0.3,
    },
    cognitiveTraits: {
      technicalFluency: 0.8,
      domainFamiliarity: 0.75,
      patienceThreshold: 0.5,
      attentionSpan: 0.6,
      visualAcuity: 0.85,
      riskTolerance: 0.6,
    },
    demographics: {},
    metadata: {},
  });

  const traceA = runSimulationSession({
    page: pageA,
    persona,
    affordances: affordancesA,
    maxSteps: 10,
  });
  const frictionPatterns = detectFrictionPatterns(traceA, pageA);
  const recommendations = generateProductRecommendations(frictionPatterns);

  // 2. Generate Optimized Variant B
  const variantResult = generatePageVariant(htmlInput, recommendations);

  // 3. Run Optimized Journey (Variant B)
  const domTreeB = parseHtml(variantResult.variantHtml);
  const rawElementsB = extractRawElements(domTreeB);
  const semanticNodesB = classifyRawElements(rawElementsB);
  const pageB = buildPageGraph(semanticNodesB, { name: 'Optimized Variant B Page' });
  const affordancesB = extractAllAffordances(semanticNodesB);

  const traceB = runSimulationSession({
    page: pageB,
    persona,
    affordances: affordancesB,
    maxSteps: 10,
  });

  // 4. Compare Telemetry & Calculate Verified Lift
  const comparisonReport = compareSimulationVariants(traceA, traceB);

  return {
    originalHtml: htmlInput,
    variantHtml: variantResult.variantHtml,
    appliedTransformations: variantResult.appliedTransformations,
    originalTrace: traceA,
    variantTrace: traceB,
    recommendations,
    comparisonReport,
  };
});

fastify.post('/api/attention-heatmap', async (request) => {
  const body = (request.body as SimulateRequestBody) || {};
  const htmlInput = body.html && body.html.trim() !== '' ? body.html : DEFAULT_SAMPLE_HTML;

  const domTree = parseHtml(htmlInput);
  const rawElements = extractRawElements(domTree);
  const semanticNodes = classifyRawElements(rawElements);
  const page = buildPageGraph(semanticNodes, { name: 'Heatmap Page Target' });

  const persona = ImmutablePersona.create({
    id: generateId(),
    name: body.personaName || 'Visual Scanner',
    role: 'User',
    personality: {
      openness: 0.6,
      conscientiousness: 0.7,
      extraversion: 0.5,
      agreeableness: 0.6,
      neuroticism: 0.3,
    },
    cognitiveTraits: {
      technicalFluency: 0.8,
      domainFamiliarity: 0.75,
      patienceThreshold: 0.6,
      attentionSpan: 0.7,
      visualAcuity: 0.85,
      riskTolerance: 0.6,
    },
    demographics: {},
    metadata: {},
  });

  const heatmapData = calculateVisualAttentionHeatmap(page, persona);

  return {
    page,
    persona: persona.toJSON(),
    heatmap: heatmapData,
  };
});

interface SimulateSwarmRequestBody {
  html?: string;
  cohorts?: { cohortType: CohortType; count: number }[];
  maxStepsPerSession?: number;
}

fastify.post('/api/simulate-swarm', async (request) => {
  const body = (request.body as SimulateSwarmRequestBody) || {};
  const htmlInput = body.html && body.html.trim() !== '' ? body.html : DEFAULT_SAMPLE_HTML;

  const domTree = parseHtml(htmlInput);
  const rawElements = extractRawElements(domTree);
  const semanticNodes = classifyRawElements(rawElements);
  const page = buildPageGraph(semanticNodes, { name: 'Swarm Target Page' });
  const affordances = extractAllAffordances(semanticNodes);

  const cohortConfigs = body.cohorts || [
    { cohortType: 'gen_z_mobile' as CohortType, count: 5 },
    { cohortType: 'senior_low_fluency' as CohortType, count: 5 },
    { cohortType: 'impulsive_buyer' as CohortType, count: 5 },
    { cohortType: 'enterprise_security' as CohortType, count: 5 },
  ];

  const population = generateSyntheticPopulation(cohortConfigs);

  const swarmTrace = runSwarmSimulationSession({
    page,
    population,
    affordances,
    maxStepsPerSession: body.maxStepsPerSession || 10,
  });

  const swarmAnalytics = calculateSwarmAnalytics(swarmTrace);

  return {
    page,
    totalPopulation: population.length,
    swarmTrace,
    swarmAnalytics,
  };
});

fastify.post('/api/auto-optimize', async (request) => {
  const body = (request.body as SimulateRequestBody) || {};
  const htmlInput = body.html && body.html.trim() !== '' ? body.html : DEFAULT_SAMPLE_HTML;

  const persona = ImmutablePersona.create({
    id: generateId(),
    name: body.personaName || 'Autonomous Optimizer',
    role: 'User',
    personality: {
      openness: 0.6,
      conscientiousness: 0.8,
      extraversion: 0.5,
      agreeableness: 0.6,
      neuroticism: 0.3,
    },
    cognitiveTraits: {
      technicalFluency: 0.8,
      domainFamiliarity: 0.75,
      patienceThreshold: 0.5,
      attentionSpan: 0.6,
      visualAcuity: 0.85,
      riskTolerance: 0.6,
    },
    demographics: {},
    metadata: {},
  });

  const optimizationResult = runAutonomousOptimizer({ html: htmlInput, persona });
  const gitPatch = generateGitPullRequestPatch(
    optimizationResult.originalHtml,
    optimizationResult.optimizedHtml,
    optimizationResult.verifiedLiftGain,
  );

  return {
    optimizationResult,
    gitPatch,
  };
});

interface CalibrateLiveRequestBody {
  posthogEvents?: PostHogExportEvent[];
  personaName?: string;
}

fastify.post('/api/calibrate-live', async (request) => {
  const body = (request.body as CalibrateLiveRequestBody) || {};
  const samplePostHogEvents: PostHogExportEvent[] = body.posthogEvents || [
    {
      event: '$pageview',
      distinct_id: 'user-1',
      timestamp: new Date(Date.now() - 10000).toISOString(),
    },
    { event: 'submit_order', distinct_id: 'user-1', timestamp: new Date().toISOString() },
    {
      event: '$pageview',
      distinct_id: 'user-2',
      timestamp: new Date(Date.now() - 10000).toISOString(),
    },
    { event: 'abandon_cart', distinct_id: 'user-2', timestamp: new Date().toISOString() },
  ];

  const rawEvents = parsePostHogEvents(samplePostHogEvents);
  const benchmark = importEmpiricalClickstream(rawEvents, 'live-target-page');

  const persona = ImmutablePersona.create({
    id: generateId(),
    name: body.personaName || 'Live Calibrated Persona',
    role: 'User',
    personality: {
      openness: 0.6,
      conscientiousness: 0.7,
      extraversion: 0.5,
      agreeableness: 0.6,
      neuroticism: 0.3,
    },
    cognitiveTraits: {
      technicalFluency: 0.75,
      domainFamiliarity: 0.7,
      patienceThreshold: 0.55,
      attentionSpan: 0.65,
      visualAcuity: 0.8,
      riskTolerance: 0.6,
    },
    demographics: {},
    metadata: {},
  });

  const autoTuningResult = runContinuousAutoTuner(persona, benchmark, 10);

  return {
    benchmark,
    autoTuningResult,
  };
});

const start = async () => {
  try {
    // Port 3001 is standard for Fastify API in a Next.js monorepo
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
