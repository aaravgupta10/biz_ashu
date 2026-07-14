import { z } from 'zod';

/**
 * Zod schema to validate a Component's structural shape at runtime.
 */
export const componentSchema = z.object({
  id: z.string().min(1, 'Component ID must be a non-empty string'),
  name: z.string().min(1, 'Component name must be a non-empty string'),
  type: z.string().min(1, 'Component type must be a non-empty string'),
  purpose: z.string().min(1, 'Component purpose must be a non-empty string'),
  metadata: z.record(z.unknown()).default({}),
});

/**
 * TypeScript interface representing a Component.
 * Denotes a structural digital element within a Page of a Digital Twin.
 */
export interface Component {
  /** Unique identifier of the component */
  readonly id: string;
  /** Human-readable name of the component */
  readonly name: string;
  /** Structural/functional type (e.g. 'button', 'input', 'anchor') */
  readonly type: string;
  /** Intended purpose or role of this component (e.g. 'Submit Form', 'Navigate Home') */
  readonly purpose: string;
  /** Dynamic metadata associated with the component */
  readonly metadata: Readonly<Record<string, unknown>>;
}

/**
 * Immutable implementation of the Component interface.
 * Instances of this class are deeply frozen to prevent state mutations.
 */
export class ImmutableComponent implements Component {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly purpose: string;
  readonly metadata: Readonly<Record<string, unknown>>;

  private constructor(data: z.infer<typeof componentSchema>) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.purpose = data.purpose;
    // Deep clone metadata to disconnect references, then freeze it
    this.metadata = Object.freeze(JSON.parse(JSON.stringify(data.metadata)));
    Object.freeze(this);
  }

  /**
   * Factory method to create, validate, and freeze a Component instance.
   * @param input Raw input data
   * @returns A frozen ImmutableComponent instance
   * @throws ZodError if validation fails
   */
  public static create(input: unknown): ImmutableComponent {
    const validated = componentSchema.parse(input);
    return new ImmutableComponent(validated);
  }

  /**
   * Serializes the component into a plain JSON-compatible object.
   */
  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      purpose: this.purpose,
      metadata: JSON.parse(JSON.stringify(this.metadata)),
    };
  }
}
