import { z } from 'zod';
import { Component, componentSchema, ImmutableComponent } from './component.js';

/**
 * Zod schema to validate a Page's structural shape at runtime.
 */
export const pageSchema = z.object({
  id: z.string().min(1, 'Page ID must be a non-empty string'),
  name: z.string().min(1, 'Page name must be a non-empty string'),
  route: z.string().min(1, 'Page route must be a non-empty string'),
  purpose: z.string().min(1, 'Page purpose must be a non-empty string'),
  components: z.array(componentSchema).default([]),
  metadata: z.record(z.unknown()).default({}),
});

/**
 * TypeScript interface representing a Page.
 * Denotes a distinct digital location within a Digital Twin.
 */
export interface Page {
  /** Unique identifier of the page */
  readonly id: string;
  /** Human-readable name of the page */
  readonly name: string;
  /** The URL path or route of this page (e.g. '/dashboard/login') */
  readonly route: string;
  /** The primary purpose or goal of this page (e.g. 'Authentication Gateway') */
  readonly purpose: string;
  /** List of components embedded in this page */
  readonly components: readonly Component[];
  /** Dynamic metadata associated with the page */
  readonly metadata: Readonly<Record<string, unknown>>;
}

/**
 * Immutable implementation of the Page interface.
 * Instances of this class are deeply frozen to prevent state mutations.
 */
export class ImmutablePage implements Page {
  readonly id: string;
  readonly name: string;
  readonly route: string;
  readonly purpose: string;
  readonly components: readonly ImmutableComponent[];
  readonly metadata: Readonly<Record<string, unknown>>;

  private constructor(data: z.infer<typeof pageSchema>) {
    this.id = data.id;
    this.name = data.name;
    this.route = data.route;
    this.purpose = data.purpose;
    // Map components to ImmutableComponent instances and freeze the array
    this.components = Object.freeze(data.components.map((comp) => ImmutableComponent.create(comp)));
    // Deep clone metadata to disconnect references, then freeze it
    this.metadata = Object.freeze(JSON.parse(JSON.stringify(data.metadata)));
    Object.freeze(this);
  }

  /**
   * Factory method to create, validate, and freeze a Page instance.
   * @param input Raw input data
   * @returns A frozen ImmutablePage instance
   * @throws ZodError if validation fails
   */
  public static create(input: unknown): ImmutablePage {
    const validated = pageSchema.parse(input);
    return new ImmutablePage(validated);
  }

  /**
   * Serializes the page into a plain JSON-compatible object.
   */
  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      route: this.route,
      purpose: this.purpose,
      components: this.components.map((comp) => comp.toJSON()),
      metadata: JSON.parse(JSON.stringify(this.metadata)),
    };
  }
}
