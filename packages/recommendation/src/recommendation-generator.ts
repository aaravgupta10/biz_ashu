import { generateId } from '@platform/shared';
import type { FrictionPattern } from './friction-detector.js';

/**
 * Structured product recommendation containing evidence summary and expected conversion lift.
 */
export interface ProductRecommendation {
  /** Unique recommendation identifier */
  id: string;
  /** Associated friction pattern ID */
  frictionPatternId: string;
  /** Target component ID receiving recommendation */
  componentId: string | null;
  /** Category of recommendation */
  category: 'layout' | 'content' | 'performance' | 'accessibility';
  /** Actionable recommendation suggestion text */
  suggestion: string;
  /** Concise summary of behavioral evidence supporting the recommendation */
  evidenceSummary: string;
  /** Estimated conversion/completion lift factor (e.g. 0.12 = +12%) */
  expectedLift: number;
  /** Recommendation confidence score [0.0 - 1.0] */
  confidence: number;
}

/**
 * Generates structured, evidence-backed UI/UX product recommendations based on detected friction patterns.
 *
 * @param patterns List of detected FrictionPattern objects
 * @returns Array of ProductRecommendation objects with estimated lift
 */
export function generateProductRecommendations(
  patterns: FrictionPattern[],
): ProductRecommendation[] {
  const recommendations: ProductRecommendation[] = [];

  for (const pattern of patterns) {
    switch (pattern.type) {
      case 'unclear_cta':
        recommendations.push({
          id: generateId(),
          frictionPatternId: pattern.id,
          componentId: pattern.targetComponentId,
          category: 'layout',
          suggestion:
            'Move primary call-to-action button above the fold and increase visual saliency/contrast.',
          evidenceSummary: pattern.evidence.join('; '),
          expectedLift: 0.14,
          confidence: pattern.confidence,
        });
        break;

      case 'hesitation_loop':
        recommendations.push({
          id: generateId(),
          frictionPatternId: pattern.id,
          componentId: pattern.targetComponentId,
          category: 'content',
          suggestion: 'Simplify input labels, add inline validation help, and clarify microcopy.',
          evidenceSummary: pattern.evidence.join('; '),
          expectedLift: 0.11,
          confidence: pattern.confidence,
        });
        break;

      case 'abandonment':
        recommendations.push({
          id: generateId(),
          frictionPatternId: pattern.id,
          componentId: pattern.targetComponentId,
          category: 'layout',
          suggestion:
            'Reduce required form fields and remove visual distraction blocks along conversion path.',
          evidenceSummary: pattern.evidence.join('; '),
          expectedLift: 0.18,
          confidence: pattern.confidence,
        });
        break;

      case 'high_frustration':
        recommendations.push({
          id: generateId(),
          frictionPatternId: pattern.id,
          componentId: pattern.targetComponentId,
          category: 'performance',
          suggestion: 'Optimize step transition timing and simplify page navigation hierarchy.',
          evidenceSummary: pattern.evidence.join('; '),
          expectedLift: 0.08,
          confidence: pattern.confidence,
        });
        break;

      default:
        recommendations.push({
          id: generateId(),
          frictionPatternId: pattern.id,
          componentId: pattern.targetComponentId,
          category: 'accessibility',
          suggestion: 'Improve element contrast, touch target dimensions, and visual feedback.',
          evidenceSummary: pattern.evidence.join('; '),
          expectedLift: 0.05,
          confidence: pattern.confidence,
        });
        break;
    }
  }

  return recommendations;
}
