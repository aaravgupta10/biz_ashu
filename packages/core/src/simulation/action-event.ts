import { z } from 'zod';

export const actionEventTypeSchema = z.enum([
  'click',
  'type',
  'submit',
  'navigate',
  'scroll',
  'hover',
  'select',
  'wait',
]);

export type ActionEventType = z.infer<typeof actionEventTypeSchema>;

/**
 * Zod schema to validate an ActionEvent at runtime.
 */
export const actionEventSchema = z.object({
  id: z.string().trim().min(1, 'Action event ID must be a non-empty string'),
  simulationId: z.string().trim().min(1, 'Simulation ID must be a non-empty string'),
  stepIndex: z.number().int().min(0, 'Step index must be >= 0'),
  actionType: actionEventTypeSchema,
  targetComponentId: z.string().trim().nullable().default(null),
  affordanceId: z.string().trim().nullable().default(null),
  durationMs: z.number().min(0, 'Duration must be >= 0'),
  payload: z.record(z.unknown()).default({}),
  timestamp: z.string().datetime({ message: 'Timestamp must be a valid ISO date-time string' }),
});

export interface ActionEvent {
  readonly id: string;
  readonly simulationId: string;
  readonly stepIndex: number;
  readonly actionType: ActionEventType;
  readonly targetComponentId: string | null;
  readonly affordanceId: string | null;
  readonly durationMs: number;
  readonly payload: Readonly<Record<string, unknown>>;
  readonly timestamp: string;
}

/**
 * Immutable implementation of the ActionEvent interface.
 */
export class ImmutableActionEvent implements ActionEvent {
  readonly id: string;
  readonly simulationId: string;
  readonly stepIndex: number;
  readonly actionType: ActionEventType;
  readonly targetComponentId: string | null;
  readonly affordanceId: string | null;
  readonly durationMs: number;
  readonly payload: Readonly<Record<string, unknown>>;
  readonly timestamp: string;

  private constructor(data: z.infer<typeof actionEventSchema>) {
    this.id = data.id;
    this.simulationId = data.simulationId;
    this.stepIndex = data.stepIndex;
    this.actionType = data.actionType;
    this.targetComponentId = data.targetComponentId;
    this.affordanceId = data.affordanceId;
    this.durationMs = data.durationMs;
    this.payload = Object.freeze(JSON.parse(JSON.stringify(data.payload)));
    this.timestamp = data.timestamp;
    Object.freeze(this);
  }

  public static create(input: unknown): ImmutableActionEvent {
    const validated = actionEventSchema.parse(input);
    return new ImmutableActionEvent(validated);
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      simulationId: this.simulationId,
      stepIndex: this.stepIndex,
      actionType: this.actionType,
      targetComponentId: this.targetComponentId,
      affordanceId: this.affordanceId,
      durationMs: this.durationMs,
      payload: JSON.parse(JSON.stringify(this.payload)),
      timestamp: this.timestamp,
    };
  }
}
