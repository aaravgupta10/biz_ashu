import { generateId } from '@platform/shared';
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
import {
  detectFrictionPatterns,
  generateProductRecommendations,
  generateCroAuditReport,
} from '@platform/recommendation';

export interface CliAuditConfig {
  htmlContent: string;
  minHealthScore?: number;
  personaName?: string;
}

export interface CliAuditOutput {
  exitCode: number;
  healthScore: number;
  totalFrictionCount: number;
  recommendationsCount: number;
  reportMarkdown: string;
}

/**
 * Runs the Behavioral Intelligence Platform CLI CRO Audit engine.
 *
 * @param config CliAuditConfig
 * @returns CliAuditOutput with exitCode (0 = pass, 1 = failure)
 */
export function runCliAudit(config: CliAuditConfig): CliAuditOutput {
  const minThreshold = config.minHealthScore ?? 75;

  const domTree = parseHtml(config.htmlContent);
  const rawElements = extractRawElements(domTree);
  const semanticNodes = classifyRawElements(rawElements);
  const page = buildPageGraph(semanticNodes, { name: 'CLI Audit Target Page' });
  const affordances = extractAllAffordances(semanticNodes);
  validateDigitalTwinPage(page, affordances);

  const persona = ImmutablePersona.create({
    id: generateId(),
    name: config.personaName || 'CI Auditor',
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

  const trace = runSimulationSession({ page, persona, affordances, maxSteps: 10 });
  const frictionPatterns = detectFrictionPatterns(trace, page);
  const recommendations = generateProductRecommendations(frictionPatterns);

  const report = generateCroAuditReport({
    page,
    persona,
    trace,
    frictionPatterns,
    recommendations,
  });

  const exitCode = report.healthScore >= minThreshold ? 0 : 1;

  return {
    exitCode,
    healthScore: report.healthScore,
    totalFrictionCount: frictionPatterns.length,
    recommendationsCount: recommendations.length,
    reportMarkdown: report.markdownContent,
  };
}
