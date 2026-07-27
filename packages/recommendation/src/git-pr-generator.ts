export interface GitPullRequestPatch {
  prTitle: string;
  prBody: string;
  diffContent: string;
  verifiedLift: number;
}

/**
 * Formats an automated Git patch diff and GitHub Pull Request description summarizing autonomous CRO code refactoring.
 *
 * @param originalHtml Original HTML document code
 * @param optimizedHtml Optimized HTML document code
 * @param verifiedLift Measured conversion lift factor
 * @returns GitPullRequestPatch object
 */
export function generateGitPullRequestPatch(
  originalHtml: string,
  optimizedHtml: string,
  verifiedLift: number,
): GitPullRequestPatch {
  const prTitle = `fix(cro): Autonomous UX Optimization (+${(verifiedLift * 100).toFixed(1)}% Conversion Lift)`;

  let prBody = `## Autonomous CRO Agent Optimization Report\n\n`;
  prBody += `The Behavioral Intelligence Platform autonomous agent mutated target DOM components to resolve detected user friction obstacles.\n\n`;
  prBody += `### Performance Lift Metrics\n`;
  prBody += `- **Verified Conversion Lift**: **+${(verifiedLift * 100).toFixed(1)}%**\n`;
  prBody += `- **Status**: Verified by Synthetic Swarm Simulation\n\n`;
  prBody += `### Summary of Changes\n`;
  prBody += `- Elevated visual contrast & saliency on primary CTA buttons\n`;
  prBody += `- Injected inline microcopy guidance into form input fields\n`;

  let diffContent = `--- a/src/index.html\n+++ b/src/index.html\n@@ -1,10 +1,10 @@\n`;
  const origLines = originalHtml.split('\n');
  const optLines = optimizedHtml.split('\n');

  for (let i = 0; i < Math.max(origLines.length, optLines.length); i++) {
    const o = origLines[i] || '';
    const n = optLines[i] || '';
    if (o !== n) {
      diffContent += `-${o}\n+${n}\n`;
    } else {
      diffContent += ` ${o}\n`;
    }
  }

  return {
    prTitle,
    prBody,
    diffContent,
    verifiedLift,
  };
}
