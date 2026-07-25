import { describe, it, expect } from 'vitest';
import {
  parseHtml,
  extractRawElements,
  classifyRawElements,
  buildPageGraph,
  extractAllAffordances,
  validateDigitalTwinPage,
} from '@platform/compiler';
import { ImmutablePersona } from '@platform/core';
import { runSimulationSession } from '@platform/runtime';
import { calculateDiscrepancy, calibratePersonaParameters } from '@platform/calibration';
import { detectFrictionPatterns, generateProductRecommendations } from '@platform/recommendation';

const sampleCheckoutHTML = `
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

describe('End-to-End System Pipeline Integration Test', () => {
  it('executes raw HTML through full 7-stage engine pipeline', () => {
    // Stage 1 & 2: Compiler Pipeline
    const domTree = parseHtml(sampleCheckoutHTML);
    expect(domTree).toBeDefined();

    const rawElements = extractRawElements(domTree);
    expect(rawElements.length).toBeGreaterThan(0);

    const semanticNodes = classifyRawElements(rawElements);
    expect(semanticNodes.length).toBeGreaterThan(0);

    const page = buildPageGraph(semanticNodes, {
      id: 'page-e2e',
      name: 'Express Checkout',
      route: '/checkout',
      purpose: 'Complete order',
    });
    expect(page.components.length).toBeGreaterThan(0);

    const affordances = extractAllAffordances(semanticNodes);
    expect(affordances.length).toBeGreaterThan(0);

    const validationResult = validateDigitalTwinPage(page, affordances);
    expect(validationResult.valid).toBe(true);

    // Stage 3: Core Synthetic Human Persona
    const persona = ImmutablePersona.create({
      id: 'persona-e2e',
      name: 'Busy Buyer',
      role: 'Customer',
      personality: {
        openness: 0.6,
        conscientiousness: 0.8,
        extraversion: 0.5,
        agreeableness: 0.7,
        neuroticism: 0.3,
      },
      cognitiveTraits: {
        technicalFluency: 0.8,
        domainFamiliarity: 0.7,
        patienceThreshold: 0.5,
        attentionSpan: 0.6,
        visualAcuity: 0.8,
        riskTolerance: 0.6,
      },
      demographics: {},
      metadata: {},
    });

    // Stage 5: Runtime Multi-Step Simulation Session
    const trace = runSimulationSession({
      simulationId: 'sim-e2e-1',
      page,
      persona,
      affordances,
      maxSteps: 10,
      initialGoal: 'Complete order',
    });

    expect(trace.simulationId).toBe('sim-e2e-1');
    expect(trace.totalSteps).toBeGreaterThan(0);
    expect(trace.stepLogs.length).toBe(trace.totalSteps);

    // Stage 6: Calibration & Loss Discrepancy Analysis
    const empirical = {
      pageId: 'page-e2e',
      targetDropOffRate: 0.1,
      averageTimeOnPageMs: 1500,
      averageStepsToConversion: 3,
      completionRate: 0.9,
    };

    const discrepancyMetrics = calculateDiscrepancy([trace], empirical);
    expect(discrepancyMetrics.totalDiscrepancyScore).toBeGreaterThanOrEqual(0.0);

    const calibrationResult = calibratePersonaParameters([trace], empirical);
    expect(calibrationResult.confidenceScore).toBeGreaterThanOrEqual(0.5);

    // Stage 7: Evidence-Backed Friction Pattern & Recommendation Engine
    const frictionPatterns = detectFrictionPatterns(trace, page);
    expect(Array.isArray(frictionPatterns)).toBe(true);

    const recommendations = generateProductRecommendations(frictionPatterns);
    expect(recommendations.length).toBe(frictionPatterns.length);
    if (recommendations.length > 0) {
      expect(recommendations[0]?.expectedLift).toBeGreaterThan(0.0);
    }
  });
});
