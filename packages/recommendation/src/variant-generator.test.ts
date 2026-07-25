import { describe, it, expect } from 'vitest';
import type { SimulationTrace } from '@platform/runtime';
import { generatePageVariant } from './variant-generator.js';
import { compareSimulationVariants } from './variant-comparator.js';
import type { ProductRecommendation } from './recommendation-generator.js';

const sampleHTML = `
<!DOCTYPE html>
<html>
<body>
  <form>
    <input type="email" id="email" />
    <button type="submit" id="btn">Submit</button>
  </form>
</body>
</html>`;

function createMockTrace(overrides?: Partial<SimulationTrace>): SimulationTrace {
  return {
    traceId: 'trace-1',
    simulationId: 'sim-1',
    pageId: 'page-1',
    personaId: 'persona-1',
    status: 'completed',
    totalSteps: 4,
    totalDurationMs: 1200,
    finalFrustration: 0.4,
    finalTrust: 0.7,
    stepLogs: [],
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('variant generator & comparator', () => {
  describe('generatePageVariant', () => {
    it('applies CTA contrast styles and input placeholders based on recommendations', () => {
      const recommendations: ProductRecommendation[] = [
        {
          id: 'rec-1',
          frictionPatternId: 'fric-1',
          componentId: 'btn',
          category: 'layout',
          suggestion: 'Move primary call-to-action button above the fold',
          evidenceSummary: 'Unclear CTA',
          expectedLift: 0.14,
          confidence: 0.9,
        },
        {
          id: 'rec-2',
          frictionPatternId: 'fric-2',
          componentId: 'email',
          category: 'content',
          suggestion: 'Add inline placeholder guidance',
          evidenceSummary: 'Hesitation loop',
          expectedLift: 0.11,
          confidence: 0.85,
        },
      ];

      const result = generatePageVariant(sampleHTML, recommendations);

      expect(result.variantHtml).toContain('style="background-color: #0284c7');
      expect(result.variantHtml).toContain('placeholder="Required field"');
      expect(result.appliedTransformations.length).toBe(2);
    });
  });

  describe('compareSimulationVariants', () => {
    it('calculates conversion lift and frustration reduction between traces', () => {
      const originalTrace = createMockTrace({
        status: 'abandoned',
        totalSteps: 5,
        finalFrustration: 0.9,
      });
      const variantTrace = createMockTrace({
        status: 'completed',
        totalSteps: 3,
        finalFrustration: 0.2,
      });

      const report = compareSimulationVariants(originalTrace, variantTrace);

      expect(report.originalStatus).toBe('abandoned');
      expect(report.variantStatus).toBe('completed');
      expect(report.stepDelta).toBe(2);
      expect(report.frustrationReductionPercent).toBeGreaterThan(0);
      expect(report.verifiedConversionLift).toBeGreaterThan(0.0);
      expect(report.verdict).toBe('significant_improvement');
    });
  });
});
