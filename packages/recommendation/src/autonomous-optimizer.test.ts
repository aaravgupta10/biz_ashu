import { describe, it, expect } from 'vitest';
import { ImmutablePersona } from '@platform/core';
import { runAutonomousOptimizer } from './autonomous-optimizer.js';
import { generateGitPullRequestPatch } from './git-pr-generator.js';

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

const persona = ImmutablePersona.create({
  id: 'p-opt-1',
  name: 'Opt Tester',
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
    patienceThreshold: 0.5,
    attentionSpan: 0.6,
    visualAcuity: 0.85,
    riskTolerance: 0.6,
  },
  demographics: {},
  metadata: {},
});

describe('Autonomous AI CRO Optimizer', () => {
  it('runs closed-loop AST code mutation and produces a Git PR patch', () => {
    const result = runAutonomousOptimizer({ html: sampleHTML, persona });

    expect(result.originalHtml).toBe(sampleHTML);
    expect(result.mutationsApplied).toBeGreaterThanOrEqual(0);
    expect(result.optimizedHtml).toBeDefined();

    const patch = generateGitPullRequestPatch(
      result.originalHtml,
      result.optimizedHtml,
      result.verifiedLiftGain,
    );
    expect(patch.prTitle).toContain('Autonomous UX Optimization');
    expect(patch.diffContent).toContain('index.html');
  });
});
