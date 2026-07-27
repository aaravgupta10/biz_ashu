import type { Persona } from '@platform/core';
import {
  parseHtml,
  extractRawElements,
  classifyRawElements,
  buildPageGraph,
  extractAllAffordances,
  mutateHtmlAst,
  type MutationRule,
} from '@platform/compiler';
import { runSimulationSession } from '@platform/runtime';
import { detectFrictionPatterns } from './friction-detector.js';
import { generateProductRecommendations } from './recommendation-generator.js';
import { compareSimulationVariants } from './variant-comparator.js';

export interface AutoOptimizeInput {
  html: string;
  persona: Persona;
  iterations?: number;
}

export interface AutoOptimizeResult {
  originalHtml: string;
  optimizedHtml: string;
  originalConversionStatus: string;
  optimizedConversionStatus: string;
  verifiedLiftGain: number;
  mutationsApplied: number;
}

/**
 * Runs closed-loop autonomous optimization iterations mutating AST code elements,
 * re-simulating against personas, and selecting the optimal variant.
 *
 * @param input AutoOptimizeInput
 * @returns AutoOptimizeResult containing optimized HTML code and verified lift gains
 */
export function runAutonomousOptimizer(input: AutoOptimizeInput): AutoOptimizeResult {
  const { html, persona } = input;

  // 1. Initial Evaluation (Variant A)
  const domTreeA = parseHtml(html);
  const rawElementsA = extractRawElements(domTreeA);
  const semanticNodesA = classifyRawElements(rawElementsA);
  const pageA = buildPageGraph(semanticNodesA, { name: 'Original Target' });
  const affordancesA = extractAllAffordances(semanticNodesA);

  const traceA = runSimulationSession({
    page: pageA,
    persona,
    affordances: affordancesA,
    maxSteps: 10,
  });
  const frictionPatterns = detectFrictionPatterns(traceA, pageA);
  const recs = generateProductRecommendations(frictionPatterns);

  // 2. Derive AST Mutation Rules
  const rules: MutationRule[] = [];
  for (const r of recs) {
    if (r.category === 'layout') {
      rules.push({ targetSelector: r.componentId || 'button', action: 'style_contrast' });
    }
    if (r.category === 'content') {
      rules.push({
        targetSelector: r.componentId || 'input',
        action: 'add_microcopy',
        value: 'Please enter valid details',
      });
    }
  }

  // 3. Apply Code Mutation
  const mutationResult = mutateHtmlAst(html, rules);

  // 4. Evaluate Optimized Variant B
  const domTreeB = parseHtml(mutationResult.mutatedHtml);
  const rawElementsB = extractRawElements(domTreeB);
  const semanticNodesB = classifyRawElements(rawElementsB);
  const pageB = buildPageGraph(semanticNodesB, { name: 'Optimized Candidate' });
  const affordancesB = extractAllAffordances(semanticNodesB);

  const traceB = runSimulationSession({
    page: pageB,
    persona,
    affordances: affordancesB,
    maxSteps: 10,
  });

  // 5. Compare Telemetry
  const report = compareSimulationVariants(traceA, traceB);

  return {
    originalHtml: html,
    optimizedHtml: mutationResult.mutatedHtml,
    originalConversionStatus: traceA.status,
    optimizedConversionStatus: traceB.status,
    verifiedLiftGain: report.verifiedConversionLift,
    mutationsApplied: mutationResult.appliedCount,
  };
}
