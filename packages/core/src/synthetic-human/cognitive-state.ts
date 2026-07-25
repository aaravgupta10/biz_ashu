import { z } from 'zod';

/**
 * Schema for short-term memory records logged during simulation steps.
 */
export const memoryEntrySchema = z.object({
  componentId: z.string().trim().min(1, 'Component ID must be a non-empty string'),
  affordanceId: z.string().trim().min(1).optional(),
  actionType: z.string().trim().min(1, 'Action type must be a non-empty string'),
  timestampMs: z.number().min(0, 'Timestamp must be >= 0'),
  result: z.enum(['success', 'failure', 'hesitation', 'no_change']),
  notes: z.string().optional(),
});

export type ShortTermMemoryEntry = z.infer<typeof memoryEntrySchema>;

/**
 * Zod schema to validate a CognitiveState's shape at runtime.
 */
export const cognitiveStateSchema = z.object({
  id: z.string().trim().min(1, 'CognitiveState ID must be a non-empty string'),
  personaId: z.string().trim().min(1, 'Persona ID must be a non-empty string'),
  activeGoal: z.string().trim().min(1, 'Active goal must be a non-empty string'),
  activeFocusComponentId: z.string().trim().nullable().default(null),
  frustrationLevel: z
    .number()
    .min(0, 'Frustration level must be >= 0')
    .max(1, 'Frustration level must be <= 1'),
  trustLevel: z.number().min(0, 'Trust level must be >= 0').max(1, 'Trust level must be <= 1'),
  stepCount: z.number().int().min(0, 'Step count must be >= 0').default(0),
  shortTermMemory: z.array(memoryEntrySchema).default([]),
  metadata: z.record(z.unknown()).default({}),
});

/**
 * Interface representing the real-time cognitive state of a synthetic human during simulation execution.
 */
export interface CognitiveState {
  /** Unique identifier of the cognitive state */
  readonly id: string;
  /** Identifier of the associated Persona */
  readonly personaId: string;
  /** Active goal being pursued (e.g. 'Complete Checkout') */
  readonly activeGoal: string;
  /** ID of the component currently receiving primary focus, or null */
  readonly activeFocusComponentId: string | null;
  /** Accumulated frustration level continuous value [0.0 - 1.0] */
  readonly frustrationLevel: number;
  /** Accumulated trust level continuous value [0.0 - 1.0] */
  readonly trustLevel: number;
  /** Total steps executed in the current session */
  readonly stepCount: number;
  /** Log of recent component interactions in short-term memory */
  readonly shortTermMemory: readonly Readonly<ShortTermMemoryEntry>[];
  /** Associated metadata */
  readonly metadata: Readonly<Record<string, unknown>>;
}

/**
 * Immutable implementation of the CognitiveState interface.
 * Instances of this class are deeply frozen to prevent state mutations outside controlled transitions.
 */
export class ImmutableCognitiveState implements CognitiveState {
  readonly id: string;
  readonly personaId: string;
  readonly activeGoal: string;
  readonly activeFocusComponentId: string | null;
  readonly frustrationLevel: number;
  readonly trustLevel: number;
  readonly stepCount: number;
  readonly shortTermMemory: readonly Readonly<ShortTermMemoryEntry>[];
  readonly metadata: Readonly<Record<string, unknown>>;

  private constructor(data: z.infer<typeof cognitiveStateSchema>) {
    this.id = data.id;
    this.personaId = data.personaId;
    this.activeGoal = data.activeGoal;
    this.activeFocusComponentId = data.activeFocusComponentId;
    this.frustrationLevel = data.frustrationLevel;
    this.trustLevel = data.trustLevel;
    this.stepCount = data.stepCount;
    this.shortTermMemory = Object.freeze(
      data.shortTermMemory.map((entry) => Object.freeze({ ...entry })),
    );
    this.metadata = Object.freeze(JSON.parse(JSON.stringify(data.metadata)));
    Object.freeze(this);
  }

  /**
   * Factory method to create, validate, and freeze a CognitiveState instance.
   * @param input Raw input data
   * @returns A frozen ImmutableCognitiveState instance
   * @throws ZodError if validation fails
   */
  public static create(input: unknown): ImmutableCognitiveState {
    const validated = cognitiveStateSchema.parse(input);
    return new ImmutableCognitiveState(validated);
  }

  /**
   * Returns a new ImmutableCognitiveState instance with updated fields, preserving immutability.
   * @param changes Partial updates to apply to state
   * @returns A new frozen ImmutableCognitiveState instance
   */
  public update(changes: Partial<z.infer<typeof cognitiveStateSchema>>): ImmutableCognitiveState {
    const currentJSON = this.toJSON();
    const merged = { ...currentJSON, ...changes };
    return ImmutableCognitiveState.create(merged);
  }

  /**
   * Serializes the cognitive state into a plain JSON-compatible object.
   */
  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      personaId: this.personaId,
      activeGoal: this.activeGoal,
      activeFocusComponentId: this.activeFocusComponentId,
      frustrationLevel: this.frustrationLevel,
      trustLevel: this.trustLevel,
      stepCount: this.stepCount,
      shortTermMemory: this.shortTermMemory.map((m) => ({ ...m })),
      metadata: JSON.parse(JSON.stringify(this.metadata)),
    };
  }
}
