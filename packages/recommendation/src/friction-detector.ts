import { generateId } from '@platform/shared';
import type { Page } from '@platform/core';
import type { SimulationTrace } from '@platform/runtime';

/**
 * Categorization of identified user friction patterns.
 */
export type FrictionType =
  'high_frustration' | 'abandonment' | 'hesitation_loop' | 'low_visual_attention' | 'unclear_cta';

/**
 * Structured friction pattern detailing identified UI/UX obstacles and supporting evidence.
 */
export interface FrictionPattern {
  /** Unique identifier for the friction pattern */
  id: string;
  /** Categorized friction pattern type */
  type: FrictionType;
  /** ID of the target component associated with the friction, if applicable */
  targetComponentId: string | null;
  /** Severity level of the friction */
  severity: 'low' | 'medium' | 'high' | 'critical';
  /** Confidence score of pattern detection [0.0 - 1.0] */
  confidence: number;
  /** Human-readable description of the friction pattern */
  description: string;
  /** List of supporting evidence logs */
  evidence: string[];
}

/**
 * Analyzes simulation traces and page digital twins to detect friction patterns.
 *
 * @param trace Executed SimulationTrace object
 * @param page Compiled Page digital twin
 * @returns Array of detected FrictionPattern objects
 */
export function detectFrictionPatterns(trace: SimulationTrace, page: Page): FrictionPattern[] {
  const patterns: FrictionPattern[] = [];

  // 1. Session Abandonment Pattern
  if (trace.status === 'abandoned') {
    const lastStep = trace.stepLogs[trace.stepLogs.length - 1];
    patterns.push({
      id: generateId(),
      type: 'abandonment',
      targetComponentId: lastStep?.actionEvent.targetComponentId ?? null,
      severity: 'critical',
      confidence: 0.95,
      description: 'Synthetic user abandoned journey due to excessive friction.',
      evidence: [
        `Final frustration level reached ${trace.finalFrustration}`,
        `Abandoned at step ${trace.totalSteps}`,
      ],
    });
  }

  // 2. High Frustration Increase Pattern
  if (trace.finalFrustration >= 0.5) {
    patterns.push({
      id: generateId(),
      type: 'high_frustration',
      targetComponentId: null,
      severity: trace.finalFrustration >= 0.8 ? 'high' : 'medium',
      confidence: 0.88,
      description: 'Significant accumulated user frustration detected across journey steps.',
      evidence: [`End-of-session frustration level: ${trace.finalFrustration}`],
    });
  }

  // 3. Hesitation Loop Pattern (repeated actions on same component >= 3 times)
  const componentCounts = new Map<string, number>();
  for (const step of trace.stepLogs) {
    const targetId = step.actionEvent.targetComponentId;
    if (targetId) {
      const count = (componentCounts.get(targetId) ?? 0) + 1;
      componentCounts.set(targetId, count);
    }
  }

  for (const [compId, count] of componentCounts.entries()) {
    if (count >= 3) {
      const comp = page.components.find((c) => c.id === compId);
      patterns.push({
        id: generateId(),
        type: 'hesitation_loop',
        targetComponentId: compId,
        severity: 'high',
        confidence: 0.92,
        description: `Synthetic user repeatedly interacted with component "${comp?.name ?? compId}" (${count} times).`,
        evidence: [`Component ${compId} interacted with ${count} times without proceeding`],
      });
    }
  }

  // 4. Unclear CTA / Low Visual Attention Pattern
  const primaryCTA = page.components.find((c) => c.type === 'CTA' || c.type === 'Form');
  if (primaryCTA) {
    const ctaInteracted = trace.stepLogs.some(
      (s) => s.actionEvent.targetComponentId === primaryCTA.id,
    );
    if (!ctaInteracted && trace.status !== 'completed') {
      patterns.push({
        id: generateId(),
        type: 'unclear_cta',
        targetComponentId: primaryCTA.id,
        severity: 'high',
        confidence: 0.85,
        description: `Primary action component "${primaryCTA.name}" was never interacted with before session end.`,
        evidence: [
          `Component ${primaryCTA.id} (${primaryCTA.name}) received 0 execution interactions`,
        ],
      });
    }
  }

  return patterns;
}
