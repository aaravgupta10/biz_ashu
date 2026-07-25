import { z } from 'zod';

export const componentRuntimeStateSchema = z.object({
  componentId: z.string().trim().min(1),
  visible: z.boolean().default(true),
  enabled: z.boolean().default(true),
  focused: z.boolean().default(false),
  value: z.string().optional(),
  metadata: z.record(z.unknown()).default({}),
});

export type ComponentRuntimeState = z.infer<typeof componentRuntimeStateSchema>;

export const worldStateSchema = z.object({
  id: z.string().trim().min(1, 'World state ID must be a non-empty string'),
  simulationId: z.string().trim().min(1, 'Simulation ID must be a non-empty string'),
  activePageId: z.string().trim().min(1, 'Active page ID must be a non-empty string'),
  stepIndex: z.number().int().min(0, 'Step index must be >= 0').default(0),
  elapsedTimeMs: z.number().min(0, 'Elapsed time must be >= 0').default(0),
  componentStates: z.record(componentRuntimeStateSchema).default({}),
  metadata: z.record(z.unknown()).default({}),
});

export interface WorldState {
  readonly id: string;
  readonly simulationId: string;
  readonly activePageId: string;
  readonly stepIndex: number;
  readonly elapsedTimeMs: number;
  readonly componentStates: Readonly<Record<string, ComponentRuntimeState>>;
  readonly metadata: Readonly<Record<string, unknown>>;
}

/**
 * Immutable implementation of the WorldState snapshot.
 */
export class ImmutableWorldState implements WorldState {
  readonly id: string;
  readonly simulationId: string;
  readonly activePageId: string;
  readonly stepIndex: number;
  readonly elapsedTimeMs: number;
  readonly componentStates: Readonly<Record<string, ComponentRuntimeState>>;
  readonly metadata: Readonly<Record<string, unknown>>;

  private constructor(data: z.infer<typeof worldStateSchema>) {
    this.id = data.id;
    this.simulationId = data.simulationId;
    this.activePageId = data.activePageId;
    this.stepIndex = data.stepIndex;
    this.elapsedTimeMs = data.elapsedTimeMs;
    this.componentStates = Object.freeze(JSON.parse(JSON.stringify(data.componentStates)));
    this.metadata = Object.freeze(JSON.parse(JSON.stringify(data.metadata)));
    Object.freeze(this);
  }

  public static create(input: unknown): ImmutableWorldState {
    const validated = worldStateSchema.parse(input);
    return new ImmutableWorldState(validated);
  }

  public update(changes: Partial<z.infer<typeof worldStateSchema>>): ImmutableWorldState {
    const currentJSON = this.toJSON();
    const merged = { ...currentJSON, ...changes };
    return ImmutableWorldState.create(merged);
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      simulationId: this.simulationId,
      activePageId: this.activePageId,
      stepIndex: this.stepIndex,
      elapsedTimeMs: this.elapsedTimeMs,
      componentStates: JSON.parse(JSON.stringify(this.componentStates)),
      metadata: JSON.parse(JSON.stringify(this.metadata)),
    };
  }
}
