import type { Page, Persona } from '@platform/core';
import type { SimulationTrace } from '@platform/runtime';
import type { FrictionPattern } from './friction-detector.js';
import type { ProductRecommendation } from './recommendation-generator.js';
import type { VariantComparisonReport } from './variant-comparator.js';

export interface CroAuditReportInput {
  page: Page;
  persona: Persona;
  trace: SimulationTrace;
  frictionPatterns: FrictionPattern[];
  recommendations: ProductRecommendation[];
  comparisonReport?: VariantComparisonReport;
}

export interface CroAuditReport {
  reportId: string;
  generatedAt: string;
  pageName: string;
  route: string;
  healthScore: number;
  markdownContent: string;
}

/**
 * Generates an executive CRO Audit Report artifact detailing page digital twin health,
 * friction pattern hotspots, and evidence-backed conversion lift recommendations.
 *
 * @param input CroAuditReportInput
 * @returns CroAuditReport object with formatted markdown report
 */
export function generateCroAuditReport(input: CroAuditReportInput): CroAuditReport {
  const { page, persona, trace, frictionPatterns, recommendations, comparisonReport } = input;

  const totalFriction = frictionPatterns.length;
  const criticalCount = frictionPatterns.filter(
    (f) => f.severity === 'critical' || f.severity === 'high',
  ).length;
  const healthScore = Math.max(
    0,
    Math.round(100 - criticalCount * 25 - (totalFriction - criticalCount) * 10),
  );

  const generatedAt = new Date().toISOString();
  const reportId = `report-${Math.random().toString(36).substring(2, 9)}`;

  let md = `# Executive CRO Audit Report — ${page.name}\n\n`;
  md += `**Target Route**: \`${page.route}\`  \n`;
  md += `**Audit Timestamp**: ${generatedAt}  \n`;
  md += `**Synthetic Persona Profile**: ${persona.name} (${persona.role})  \n`;
  md += `**Overall Page Health Score**: **${healthScore}/100**  \n\n`;

  md += `---  \n\n`;
  md += `## 1. Simulation Journey Telemetry  \n\n`;
  md += `- **Outcome Status**: \`${trace.status.toUpperCase()}\`  \n`;
  md += `- **Total Journey Steps**: ${trace.totalSteps}  \n`;
  md += `- **Total Duration**: ${trace.totalDurationMs} ms  \n`;
  md += `- **Final Frustration Level**: ${(trace.finalFrustration * 100).toFixed(0)}%  \n\n`;

  md += `## 2. Identified Friction Hotspots (${totalFriction})  \n\n`;
  if (totalFriction === 0) {
    md += `✓ Zero critical friction obstacles detected on target page.  \n\n`;
  } else {
    for (const f of frictionPatterns) {
      md += `### [${f.severity.toUpperCase()}] ${f.description}\n`;
      md += `- **Confidence**: ${(f.confidence * 100).toFixed(0)}%\n`;
      md += `- **Evidence**: ${f.evidence.join('; ')}\n\n`;
    }
  }

  md += `## 3. Evidence-Backed Recommendations (${recommendations.length})  \n\n`;
  for (const r of recommendations) {
    md += `### +${(r.expectedLift * 100).toFixed(1)}% Lift — ${r.category.toUpperCase()} Optimization\n`;
    md += `**Suggestion**: ${r.suggestion}  \n`;
    md += `**Evidence**: ${r.evidenceSummary}  \n\n`;
  }

  if (comparisonReport) {
    md += `## 4. Variant A vs Variant B Simulation Delta  \n\n`;
    md += `- **Original Journey Status**: \`${comparisonReport.originalStatus}\`  \n`;
    md += `- **Optimized Variant B Status**: \`${comparisonReport.variantStatus}\`  \n`;
    md += `- **Step Count Reduction**: ${comparisonReport.stepDelta} steps  \n`;
    md += `- **Frustration Reduction**: ${comparisonReport.frustrationReductionPercent}%  \n`;
    md += `- **Verified Conversion Lift**: **+${(comparisonReport.verifiedConversionLift * 100).toFixed(1)}%**  \n`;
    md += `- **Verdict**: \`${comparisonReport.verdict.toUpperCase()}\`  \n\n`;
  }

  return {
    reportId,
    generatedAt,
    pageName: page.name,
    route: page.route,
    healthScore,
    markdownContent: md,
  };
}
