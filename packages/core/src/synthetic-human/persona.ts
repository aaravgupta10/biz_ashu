import { z } from 'zod';

/**
 * Big Five (OCEAN) personality traits represented as continuous values [0.0 - 1.0].
 */
export const oceanPersonalitySchema = z.object({
  openness: z.number().min(0, 'Openness must be >= 0').max(1, 'Openness must be <= 1'),
  conscientiousness: z
    .number()
    .min(0, 'Conscientiousness must be >= 0')
    .max(1, 'Conscientiousness must be <= 1'),
  extraversion: z.number().min(0, 'Extraversion must be >= 0').max(1, 'Extraversion must be <= 1'),
  agreeableness: z
    .number()
    .min(0, 'Agreeableness must be >= 0')
    .max(1, 'Agreeableness must be <= 1'),
  neuroticism: z.number().min(0, 'Neuroticism must be >= 0').max(1, 'Neuroticism must be <= 1'),
});

export type OceanPersonality = z.infer<typeof oceanPersonalitySchema>;

/**
 * Cognitive & perceptual traits represented as continuous values [0.0 - 1.0].
 */
export const cognitiveTraitsSchema = z.object({
  technicalFluency: z
    .number()
    .min(0, 'Technical fluency must be >= 0')
    .max(1, 'Technical fluency must be <= 1'),
  domainFamiliarity: z
    .number()
    .min(0, 'Domain familiarity must be >= 0')
    .max(1, 'Domain familiarity must be <= 1'),
  patienceThreshold: z
    .number()
    .min(0, 'Patience threshold must be >= 0')
    .max(1, 'Patience threshold must be <= 1'),
  attentionSpan: z
    .number()
    .min(0, 'Attention span must be >= 0')
    .max(1, 'Attention span must be <= 1'),
  visualAcuity: z
    .number()
    .min(0, 'Visual acuity must be >= 0')
    .max(1, 'Visual acuity must be <= 1'),
  riskTolerance: z
    .number()
    .min(0, 'Risk tolerance must be >= 0')
    .max(1, 'Risk tolerance must be <= 1'),
});

export type CognitiveTraits = z.infer<typeof cognitiveTraitsSchema>;

/**
 * Zod schema to validate a Persona's structural shape at runtime.
 */
export const personaSchema = z.object({
  id: z.string().trim().min(1, 'Persona ID must be a non-empty string'),
  name: z.string().trim().min(1, 'Persona name must be a non-empty string'),
  role: z.string().trim().min(1, 'Persona role must be a non-empty string'),
  personality: oceanPersonalitySchema,
  cognitiveTraits: cognitiveTraitsSchema,
  demographics: z.record(z.unknown()).default({}),
  metadata: z.record(z.unknown()).default({}),
});

/**
 * Interface representing a Persona profile for synthetic human agents.
 */
export interface Persona {
  /** Unique identifier of the persona */
  readonly id: string;
  /** Human-readable name of the persona (e.g. 'Tech-Savvy Power User') */
  readonly name: string;
  /** Primary domain role or profile type */
  readonly role: string;
  /** Big Five (OCEAN) personality traits */
  readonly personality: Readonly<OceanPersonality>;
  /** Cognitive and perceptual traits */
  readonly cognitiveTraits: Readonly<CognitiveTraits>;
  /** Demographic attributes */
  readonly demographics: Readonly<Record<string, unknown>>;
  /** Dynamic metadata */
  readonly metadata: Readonly<Record<string, unknown>>;
}

/**
 * Immutable implementation of the Persona interface.
 * Instances of this class are deeply frozen to prevent state mutations.
 */
export class ImmutablePersona implements Persona {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly personality: Readonly<OceanPersonality>;
  readonly cognitiveTraits: Readonly<CognitiveTraits>;
  readonly demographics: Readonly<Record<string, unknown>>;
  readonly metadata: Readonly<Record<string, unknown>>;

  private constructor(data: z.infer<typeof personaSchema>) {
    this.id = data.id;
    this.name = data.name;
    this.role = data.role;
    this.personality = Object.freeze({ ...data.personality });
    this.cognitiveTraits = Object.freeze({ ...data.cognitiveTraits });
    this.demographics = Object.freeze(JSON.parse(JSON.stringify(data.demographics)));
    this.metadata = Object.freeze(JSON.parse(JSON.stringify(data.metadata)));
    Object.freeze(this);
  }

  /**
   * Factory method to create, validate, and freeze a Persona instance.
   * @param input Raw input data
   * @returns A frozen ImmutablePersona instance
   * @throws ZodError if validation fails
   */
  public static create(input: unknown): ImmutablePersona {
    const validated = personaSchema.parse(input);
    return new ImmutablePersona(validated);
  }

  /**
   * Serializes the persona into a plain JSON-compatible object.
   */
  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      role: this.role,
      personality: { ...this.personality },
      cognitiveTraits: { ...this.cognitiveTraits },
      demographics: JSON.parse(JSON.stringify(this.demographics)),
      metadata: JSON.parse(JSON.stringify(this.metadata)),
    };
  }
}
