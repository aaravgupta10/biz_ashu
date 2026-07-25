import { generateId } from '@platform/shared';
import type { ActionEvent } from '@platform/core';

/**
 * Log entry for a single simulation step.
 */
export interface StepLogEntry {
  /** 0-indexed step number */
  stepIndex: number;
  /** Action event executed during this step */
  actionEvent: ActionEvent;
  /** Snapshot of the cognitive state at this step */
  cognitiveStateSnapshot: Record<string, unknown>;
  /** Snapshot of the world state at this step */
  worldStateSnapshot: Record<string, unknown>;
  /** Natural language explanation of the decision */
  decisionReasoning: string;
  /** Utility score of the selected action */
  utilityScore: number;
}

/**
 * Full execution trace of a simulation session.
 */
export interface SimulationTrace {
  /** Unique trace identifier */
  readonly traceId: string;
  /** ID of the executed simulation session */
  readonly simulationId: string;
  /** Target page ID */
  readonly pageId: string;
  /** Persona ID of the synthetic human */
  readonly personaId: string;
  /** Final status of the simulation */
  readonly status: 'completed' | 'abandoned' | 'max_steps_reached' | 'failed';
  /** Total steps executed */
  readonly totalSteps: number;
  /** Total simulated duration in milliseconds */
  readonly totalDurationMs: number;
  /** Final frustration level [0.0 - 1.0] */
  readonly finalFrustration: number;
  /** Final trust level [0.0 - 1.0] */
  readonly finalTrust: number;
  /** Log entries for all steps */
  readonly stepLogs: readonly Readonly<StepLogEntry>[];
  /** ISO timestamp of trace creation */
  readonly createdAt: string;
}

/**
 * Immutable/Stateful TraceLogger recording simulation step telemetry.
 */
export class TraceLogger {
  readonly traceId: string;
  readonly simulationId: string;
  readonly pageId: string;
  readonly personaId: string;
  private readonly stepLogs: StepLogEntry[] = [];
  private readonly startTime: Date = new Date();

  constructor(simulationId: string, pageId: string, personaId: string) {
    this.traceId = generateId();
    this.simulationId = simulationId;
    this.pageId = pageId;
    this.personaId = personaId;
  }

  /**
   * Appends a step log entry to the trace.
   */
  public logStep(entry: StepLogEntry): void {
    this.stepLogs.push({ ...entry });
  }

  /**
   * Returns the count of steps logged so far.
   */
  public getStepCount(): number {
    return this.stepLogs.length;
  }

  /**
   * Finalizes and returns an immutable SimulationTrace object.
   */
  public finalizeTrace(
    status: SimulationTrace['status'],
    finalFrustration: number,
    finalTrust: number,
  ): SimulationTrace {
    const totalDurationMs = this.stepLogs.reduce((acc, log) => acc + log.actionEvent.durationMs, 0);

    return Object.freeze({
      traceId: this.traceId,
      simulationId: this.simulationId,
      pageId: this.pageId,
      personaId: this.personaId,
      status,
      totalSteps: this.stepLogs.length,
      totalDurationMs,
      finalFrustration,
      finalTrust,
      stepLogs: Object.freeze([...this.stepLogs.map((s) => Object.freeze({ ...s }))]),
      createdAt: this.startTime.toISOString(),
    });
  }
}
