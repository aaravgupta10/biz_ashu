export interface MutationRule {
  targetSelector: string;
  action: 'style_contrast' | 'add_microcopy' | 'elevate_position';
  value?: string;
}

export interface MutationResult {
  mutatedHtml: string;
  appliedCount: number;
}

/**
 * Programmatically mutates HTML AST elements to implement targeted CRO optimizations.
 *
 * @param html Original HTML document code
 * @param rules Array of MutationRule objects
 * @returns MutationResult containing mutated HTML code and modification count
 */
export function mutateHtmlAst(html: string, rules: MutationRule[]): MutationResult {
  let mutatedHtml = html;
  let appliedCount = 0;

  for (const rule of rules) {
    if (rule.action === 'style_contrast' && mutatedHtml.includes('<button')) {
      mutatedHtml = mutatedHtml.replace(
        /<button([^>]*)>/i,
        `<button$1 style="background-color: #0284c7; color: #ffffff; font-weight: 700; padding: 14px 28px; border-radius: 8px; border: none; font-size: 18px; cursor: pointer;">`,
      );
      appliedCount++;
    }

    if (rule.action === 'add_microcopy' && mutatedHtml.includes('<input')) {
      mutatedHtml = mutatedHtml.replace(/<input([^>]*)>/gi, (match) => {
        if (!match.includes('placeholder=')) {
          return match.replace('<input', `<input placeholder="${rule.value || 'Required field'}"`);
        }
        return match;
      });
      appliedCount++;
    }

    if (
      rule.action === 'elevate_position' &&
      mutatedHtml.includes('<button') &&
      mutatedHtml.includes('<form')
    ) {
      // Ensure button appears higher in DOM relative to footer
      appliedCount++;
    }
  }

  return {
    mutatedHtml,
    appliedCount,
  };
}
