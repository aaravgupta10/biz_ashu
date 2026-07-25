import type { ProductRecommendation } from './recommendation-generator.js';

export interface PageVariantResult {
  /** Original source HTML code */
  originalHtml: string;
  /** Transformed Variant B HTML code */
  variantHtml: string;
  /** List of applied automated transformation descriptions */
  appliedTransformations: string[];
}

/**
 * Programmatically transforms HTML document code based on evidence-backed UX recommendations
 * to generate an optimized Page Variant B.
 *
 * @param html Original HTML document string
 * @param recommendations Array of ProductRecommendation objects
 * @returns PageVariantResult containing transformed Variant B HTML and change log
 */
export function generatePageVariant(
  html: string,
  recommendations: ProductRecommendation[],
): PageVariantResult {
  let transformedHtml = html;
  const appliedTransformations: string[] = [];

  for (const rec of recommendations) {
    if (rec.category === 'layout' || rec.suggestion.toLowerCase().includes('cta')) {
      // Apply high-contrast saliency styling to primary buttons/CTAs
      if (transformedHtml.includes('<button')) {
        transformedHtml = transformedHtml.replace(
          /<button([^>]*)>/i,
          `<button$1 style="background-color: #0284c7; color: #ffffff; font-weight: 700; padding: 12px 24px; border-radius: 6px; border: none; font-size: 16px; cursor: pointer;">`,
        );
        appliedTransformations.push(
          'Elevated CTA button visual contrast and touch target padding.',
        );
      }
    }

    if (rec.category === 'content' || rec.suggestion.toLowerCase().includes('input')) {
      // Add clear helper microcopy placeholders to input fields
      if (transformedHtml.includes('<input')) {
        transformedHtml = transformedHtml.replace(/<input([^>]*)>/gi, (match) => {
          if (!match.includes('placeholder=')) {
            return match.replace('<input', '<input placeholder="Required field"');
          }
          return match;
        });
        appliedTransformations.push(
          'Simplified input field microcopy and added inline placeholder guidance.',
        );
      }
    }

    if (rec.category === 'accessibility' || rec.category === 'performance') {
      // Add ARIA landmark attributes for faster visual attention scanning
      if (transformedHtml.includes('<main') && !transformedHtml.includes('role="main"')) {
        transformedHtml = transformedHtml.replace(
          '<main',
          '<main role="main" aria-label="Primary Content"',
        );
        appliedTransformations.push(
          'Added ARIA accessibility landmarks to accelerate visual attention parsing.',
        );
      }
    }
  }

  return {
    originalHtml: html,
    variantHtml: transformedHtml,
    appliedTransformations,
  };
}
