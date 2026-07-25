import { generateId } from '@platform/shared';
import {
  Page,
  Persona,
  ImmutableCognitiveState,
  ImmutableWorldState,
  ImmutableActionEvent,
  type ActionEventType,
} from '@platform/core';
import type { InteractionAffordance } from '@platform/compiler';
import { evaluateNextAction } from '@platform/cognition';
import { TraceLogger, SimulationTrace } from './trace-logger.js';

/**
 * Configuration options to initialize and run a simulation session.
 */
export interface SimulationConfig {
  /** Unique identifier for the simulation session */
  simulationId?: string;
  /** Compiled Page digital twin instance */
  page: Page;
  /** Synthetic human Persona profile */
  persona: Persona;
  /** List of interactable affordances exposed by the page */
  affordances: InteractionAffordance[];
  /** Maximum steps allowed before forced session termination (defaults to 20) */
  maxSteps?: number;
  /** Initial active goal description (defaults to page purpose) */
  initialGoal?: string;
}

/**
 * Deterministically executes a multi-step simulation session of a synthetic human navigating a Digital Twin page.
 *
 * @param config SimulationConfig detailing inputs
 * @returns Serialized SimulationTrace containing step telemetry and outcome
 */
export function runSimulationSession(config: SimulationConfig): SimulationTrace {
  const simId = config.simulationId || generateId();
  const maxSteps = config.maxSteps || 20;
  const initialGoal = config.initialGoal || config.page.purpose;

  const logger = new TraceLogger(simId, config.page.id, config.persona.id);

  let currentCognitiveState = ImmutableCognitiveState.create({
    id: generateId(),
    personaId: config.persona.id,
    activeGoal: initialGoal,
    activeFocusComponentId: null,
    frustrationLevel: 0.05,
    trustLevel: 0.8,
    stepCount: 0,
    shortTermMemory: [],
    metadata: { simulationId: simId },
  });

  let currentWorldState = ImmutableWorldState.create({
    id: generateId(),
    simulationId: simId,
    activePageId: config.page.id,
    stepIndex: 0,
    elapsedTimeMs: 0,
    componentStates: {},
    metadata: {},
  });

  let finalStatus: SimulationTrace['status'] = 'max_steps_reached';

  for (let stepIndex = 0; stepIndex < maxSteps; stepIndex++) {
    // 1. Decision Evaluation
    const decision = evaluateNextAction(
      config.page,
      config.affordances,
      config.persona,
      currentCognitiveState,
    );

    // If no action is possible or decision chooses to wait
    if (!decision.selectedAffordance || decision.actionType === 'wait') {
      finalStatus = currentCognitiveState.frustrationLevel >= 0.7 ? 'abandoned' : 'completed';
      break;
    }

    const selectedAff = decision.selectedAffordance;
    const stepDurationMs = 300 + Math.round(Math.random() * 200);

    // 2. Construct Action Event
    const actionEvent = ImmutableActionEvent.create({
      id: generateId(),
      simulationId: simId,
      stepIndex,
      actionType: selectedAff.type as ActionEventType,
      targetComponentId: selectedAff.targetNodeId,
      affordanceId: selectedAff.id,
      durationMs: stepDurationMs,
      payload: { ...selectedAff.metadata },
      timestamp: new Date().toISOString(),
    });

    // 3. Update Cognitive State
    const nextFrustration = Math.min(
      1.0,
      currentCognitiveState.frustrationLevel + (selectedAff.type === 'click' ? 0.02 : 0.05),
    );
    const nextTrust = Math.max(
      0.0,
      currentCognitiveState.trustLevel - (nextFrustration > 0.5 ? 0.03 : 0.0),
    );

    currentCognitiveState = currentCognitiveState.update({
      stepCount: stepIndex + 1,
      activeFocusComponentId: selectedAff.targetNodeId,
      frustrationLevel: Math.round(nextFrustration * 1000) / 1000,
      trustLevel: Math.round(nextTrust * 1000) / 1000,
      shortTermMemory: [
        ...currentCognitiveState.shortTermMemory,
        {
          componentId: selectedAff.targetNodeId,
          affordanceId: selectedAff.id,
          actionType: selectedAff.type,
          timestampMs: currentWorldState.elapsedTimeMs + stepDurationMs,
          result: 'success',
        },
      ],
    });

    // 4. Update World State
    currentWorldState = currentWorldState.update({
      stepIndex: stepIndex + 1,
      elapsedTimeMs: currentWorldState.elapsedTimeMs + stepDurationMs,
    });

    // 5. Log Step
    const topEval = decision.evaluations[0];
    logger.logStep({
      stepIndex,
      actionEvent,
      cognitiveStateSnapshot: currentCognitiveState.toJSON(),
      worldStateSnapshot: currentWorldState.toJSON(),
      decisionReasoning: decision.reasoning,
      utilityScore: topEval ? topEval.utilityScore : 0,
    });

    // 6. Termination Check
    if (currentCognitiveState.frustrationLevel >= 0.9) {
      finalStatus = 'abandoned';
      break;
    }

    if (selectedAff.type === 'submit') {
      finalStatus = 'completed';
      break;
    }
  }

  return logger.finalizeTrace(
    finalStatus,
    currentCognitiveState.frustrationLevel,
    currentCognitiveState.trustLevel,
  );
}
