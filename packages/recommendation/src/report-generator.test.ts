import { describe, it, expect } from 'vitest';
import { ImmutablePersona, type Page } from '@platform/core';
import type { SimulationTrace } from '@platform/runtime';
import { generateCroAuditReport } from './report-generator.js';

const mockPage: Page = {
  id: 'page-audit-1',
  name: 'Checkout Page',
  route: '/checkout',
  purpose: 'Checkout',
  metadata: {},
  components: [],
};

const mockPersona = ImmutablePersona.create({
  id: 'persona-1',
  name: 'Standard Shopper',
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

const mockTrace: SimulationTrace = {
  traceId: 't-1',
  simulationId: 'sim-1',
  pageId: 'page-audit-1',
  personaId: 'persona-1',
  status: 'completed',
  totalSteps: 3,
  totalDurationMs: 1200,
  finalFrustration: 0.2,
  finalTrust: 0.8,
  stepLogs: [],
  createdAt: new Date().toISOString(),
};

describe('generateCroAuditReport', () => {
  it('generates a formatted executive CRO audit report document', () => {
    const report = generateCroAuditReport({
      page: mockPage,
      persona: mockPersona,
      trace: mockTrace,
      frictionPatterns: [
        {
          id: 'fric-1',
          type: 'unclear_cta',
          targetComponentId: 'btn',
          severity: 'high',
          confidence: 0.9,
          description: 'Unclear call-to-action button contrast',
          evidence: ['Low saliency'],
        },
      ],
      recommendations: [
        {
          id: 'rec-1',
          frictionPatternId: 'fric-1',
          componentId: 'btn',
          category: 'layout',
          suggestion: 'Elevate button contrast',
          evidenceSummary: 'Low saliency',
          expectedLift: 0.15,
          confidence: 0.9,
        },
      ],
    });

    expect(report.reportId).toBeDefined();
    expect(report.pageName).toBe('Checkout Page');
    expect(report.healthScore).toBeGreaterThan(0);
    expect(report.markdownContent).toContain('Executive CRO Audit Report');
    expect(report.markdownContent).toContain('Elevate button contrast');
  });
});
