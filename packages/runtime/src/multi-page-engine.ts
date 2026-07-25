import { generateId } from '@platform/shared';
import {
  ImmutableSiteGraph,
  Persona,
  ImmutableCognitiveState,
  ImmutableActionEvent,
  type ActionEventType,
} from '@platform/core';
import type { InteractionAffordance } from '@platform/compiler';
import { evaluateNextAction } from '@platform/cognition';

export interface MultiPageSimulationConfig {
  /** Unique simulation session ID */
  simulationId?: string;
  /** Compiled ImmutableSiteGraph Digital Twin */
  site: ImmutableSiteGraph;
  /** Synthetic Human Persona profile */
  persona: Persona;
  /** Interaction affordances indexed by route path */
  affordancesByRoute: Record<string, InteractionAffordance[]>;
  /** Maximum total steps across all pages (defaults to 30) */
  maxTotalSteps?: number;
  /** Target goal route (e.g. '/thank-you') */
  goalRoute?: string;
}

import type { ActionEvent } from '@platform/core';

export interface MultiPageStepLogEntry {
  stepIndex: number;
  route: string;
  actionEvent: ActionEvent;
  cognitiveStateSnapshot: Record<string, unknown>;
  decisionReasoning: string;
}

export interface MultiPageSimulationTrace {
  readonly traceId: string;
  readonly simulationId: string;
  readonly siteId: string;
  readonly personaId: string;
  readonly status: 'completed' | 'abandoned' | 'max_steps_reached';
  readonly totalSteps: number;
  readonly visitedRoutes: readonly string[];
  readonly stepLogs: readonly Readonly<MultiPageStepLogEntry>[];
  readonly finalFrustration: number;
  readonly finalTrust: number;
  readonly createdAt: string;
}

/**
 * Deterministically executes a multi-page simulation session across interconnected page Digital Twins.
 *
 * @param config MultiPageSimulationConfig
 * @returns Serialized MultiPageSimulationTrace
 */
export function runMultiPageSimulationSession(
  config: MultiPageSimulationConfig,
): MultiPageSimulationTrace {
  const simId = config.simulationId || generateId();
  const maxSteps = config.maxTotalSteps || 30;
  let currentRoute = config.site.entryRoute;

  const visitedRoutes: string[] = [currentRoute];
  const stepLogs: MultiPageStepLogEntry[] = [];

  let cognitiveState = ImmutableCognitiveState.create({
    id: generateId(),
    personaId: config.persona.id,
    activeGoal: `Navigate site starting at ${currentRoute}`,
    frustrationLevel: 0.05,
    trustLevel: 0.8,
    stepCount: 0,
    shortTermMemory: [],
    metadata: { simulationId: simId, siteId: config.site.id },
  });

  let status: MultiPageSimulationTrace['status'] = 'max_steps_reached';

  for (let stepIndex = 0; stepIndex < maxSteps; stepIndex++) {
    const currentPage = config.site.getPageByRoute(currentRoute);
    if (!currentPage) {
      status = 'abandoned';
      break;
    }

    const affordances = config.affordancesByRoute[currentRoute] || [];

    const decision = evaluateNextAction(currentPage, affordances, config.persona, cognitiveState);

    if (!decision.selectedAffordance || decision.actionType === 'wait') {
      status = cognitiveState.frustrationLevel >= 0.7 ? 'abandoned' : 'completed';
      break;
    }

    const selectedAff = decision.selectedAffordance;
    const stepDurationMs = 300 + Math.round(Math.random() * 200);

    const actionEvent = ImmutableActionEvent.create({
      id: generateId(),
      simulationId: simId,
      stepIndex,
      actionType: selectedAff.type as ActionEventType,
      targetComponentId: selectedAff.targetNodeId,
      affordanceId: selectedAff.id,
      durationMs: stepDurationMs,
      payload: { route: currentRoute, ...selectedAff.metadata },
      timestamp: new Date().toISOString(),
    });

    // Check if interaction triggers route navigation transition
    const targetUrlRaw = selectedAff.metadata['targetUrl'] ?? selectedAff.metadata['href'];
    const targetUrl = typeof targetUrlRaw === 'string' ? targetUrlRaw : undefined;
    if (targetUrl && config.site.getPageByRoute(targetUrl)) {
      currentRoute = targetUrl;
      if (!visitedRoutes.includes(currentRoute)) {
        visitedRoutes.push(currentRoute);
      }
    }

    // Update Cognitive State (persists across page transitions)
    const nextFrustration = Math.min(
      1.0,
      cognitiveState.frustrationLevel + (selectedAff.type === 'click' ? 0.02 : 0.04),
    );
    const nextTrust = Math.max(
      0.0,
      cognitiveState.trustLevel - (nextFrustration > 0.5 ? 0.02 : 0.0),
    );

    cognitiveState = cognitiveState.update({
      stepCount: stepIndex + 1,
      activeFocusComponentId: selectedAff.targetNodeId,
      frustrationLevel: Math.round(nextFrustration * 1000) / 1000,
      trustLevel: Math.round(nextTrust * 1000) / 1000,
      shortTermMemory: [
        ...cognitiveState.shortTermMemory,
        {
          componentId: selectedAff.targetNodeId,
          affordanceId: selectedAff.id,
          actionType: selectedAff.type,
          timestampMs: stepIndex * 400 + stepDurationMs,
          result: 'success',
        },
      ],
    });

    stepLogs.push({
      stepIndex,
      route: currentRoute,
      actionEvent,
      cognitiveStateSnapshot: cognitiveState.toJSON(),
      decisionReasoning: decision.reasoning,
    });

    // Termination Check
    if (cognitiveState.frustrationLevel >= 0.9) {
      status = 'abandoned';
      break;
    }

    if (config.goalRoute && currentRoute === config.goalRoute) {
      status = 'completed';
      break;
    }

    if (selectedAff.type === 'submit' && currentRoute.includes('checkout')) {
      status = 'completed';
      break;
    }
  }

  return Object.freeze({
    traceId: generateId(),
    simulationId: simId,
    siteId: config.site.id,
    personaId: config.persona.id,
    status,
    totalSteps: stepLogs.length,
    visitedRoutes: Object.freeze([...visitedRoutes]),
    stepLogs: Object.freeze([...stepLogs.map((s) => Object.freeze({ ...s }))]),
    finalFrustration: cognitiveState.frustrationLevel,
    finalTrust: cognitiveState.trustLevel,
    createdAt: new Date().toISOString(),
  });
}
