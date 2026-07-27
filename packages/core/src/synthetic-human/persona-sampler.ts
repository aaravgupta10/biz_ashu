import { ImmutablePersona, type Persona, type PersonaInput } from './persona.js';

export type ArchetypeType =
  | 'accessibility_screen_reader'
  | 'fintech_compliance'
  | 'saas_trial_evaluator'
  | 'ecommerce_discount_hunter'
  | 'non_native_speaker';

/**
 * Generates a statistically sampled synthetic persona profile using Box-Muller Gaussian trait distribution.
 *
 * @param archetype Specialized industry archetype
 * @param overrides Optional partial trait overrides
 * @returns Instantiated Persona domain entity
 */
export function sampleCustomPersona(
  archetype: ArchetypeType,
  overrides?: Partial<PersonaInput>,
): Persona {
  const boxMuller = (mean: number, stdev = 0.05) => {
    const u1 = Math.max(0.0001, Math.random());
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return Math.round(Math.max(0.05, Math.min(0.99, mean + z0 * stdev)) * 100) / 100;
  };

  let traits = {
    openness: 0.6,
    conscientiousness: 0.7,
    extraversion: 0.5,
    agreeableness: 0.6,
    neuroticism: 0.3,
    technicalFluency: 0.75,
    domainFamiliarity: 0.7,
    patienceThreshold: 0.6,
    attentionSpan: 0.65,
    visualAcuity: 0.8,
    riskTolerance: 0.6,
  };

  switch (archetype) {
    case 'accessibility_screen_reader':
      traits = {
        openness: boxMuller(0.6),
        conscientiousness: boxMuller(0.9),
        extraversion: boxMuller(0.5),
        agreeableness: boxMuller(0.7),
        neuroticism: boxMuller(0.3),
        technicalFluency: boxMuller(0.85),
        domainFamiliarity: boxMuller(0.7),
        patienceThreshold: boxMuller(0.85),
        attentionSpan: boxMuller(0.9),
        visualAcuity: boxMuller(0.2), // Low visual acuity (screen reader dependent)
        riskTolerance: boxMuller(0.4),
      };
      break;
    case 'fintech_compliance':
      traits = {
        openness: boxMuller(0.4),
        conscientiousness: boxMuller(0.95),
        extraversion: boxMuller(0.4),
        agreeableness: boxMuller(0.5),
        neuroticism: boxMuller(0.8),
        technicalFluency: boxMuller(0.85),
        domainFamiliarity: boxMuller(0.9),
        patienceThreshold: boxMuller(0.85),
        attentionSpan: boxMuller(0.9),
        visualAcuity: boxMuller(0.9),
        riskTolerance: boxMuller(0.05), // Zero risk tolerance
      };
      break;
    case 'saas_trial_evaluator':
      traits = {
        openness: boxMuller(0.8),
        conscientiousness: boxMuller(0.8),
        extraversion: boxMuller(0.6),
        agreeableness: boxMuller(0.6),
        neuroticism: boxMuller(0.3),
        technicalFluency: boxMuller(0.9),
        domainFamiliarity: boxMuller(0.8),
        patienceThreshold: boxMuller(0.5),
        attentionSpan: boxMuller(0.6),
        visualAcuity: boxMuller(0.85),
        riskTolerance: boxMuller(0.65),
      };
      break;
    case 'ecommerce_discount_hunter':
      traits = {
        openness: boxMuller(0.7),
        conscientiousness: boxMuller(0.5),
        extraversion: boxMuller(0.7),
        agreeableness: boxMuller(0.6),
        neuroticism: boxMuller(0.4),
        technicalFluency: boxMuller(0.8),
        domainFamiliarity: boxMuller(0.85),
        patienceThreshold: boxMuller(0.4),
        attentionSpan: boxMuller(0.5),
        visualAcuity: boxMuller(0.9),
        riskTolerance: boxMuller(0.7),
      };
      break;
    case 'non_native_speaker':
      traits = {
        openness: boxMuller(0.65),
        conscientiousness: boxMuller(0.75),
        extraversion: boxMuller(0.5),
        agreeableness: boxMuller(0.7),
        neuroticism: boxMuller(0.4),
        technicalFluency: boxMuller(0.7),
        domainFamiliarity: boxMuller(0.4),
        patienceThreshold: boxMuller(0.6),
        attentionSpan: boxMuller(0.55),
        visualAcuity: boxMuller(0.8),
        riskTolerance: boxMuller(0.45),
      };
      break;
  }

  const id = `persona-${archetype}-${Math.random().toString(36).substring(2, 7)}`;
  const name = overrides?.name || formatArchetypeName(archetype);

  return ImmutablePersona.create({
    id,
    name,
    role: archetype,
    personality: {
      openness: traits.openness,
      conscientiousness: traits.conscientiousness,
      extraversion: traits.extraversion,
      agreeableness: traits.agreeableness,
      neuroticism: traits.neuroticism,
      ...overrides?.personality,
    },
    cognitiveTraits: {
      technicalFluency: traits.technicalFluency,
      domainFamiliarity: traits.domainFamiliarity,
      patienceThreshold: traits.patienceThreshold,
      attentionSpan: traits.attentionSpan,
      visualAcuity: traits.visualAcuity,
      riskTolerance: traits.riskTolerance,
      ...overrides?.cognitiveTraits,
    },
    demographics: { archetype, sampledAt: new Date().toISOString() },
    metadata: { ...overrides?.metadata },
  });
}

function formatArchetypeName(archetype: ArchetypeType): string {
  switch (archetype) {
    case 'accessibility_screen_reader':
      return 'Accessibility Screen-Reader User';
    case 'fintech_compliance':
      return 'Fintech Compliance Officer';
    case 'saas_trial_evaluator':
      return 'SaaS Free-Trial Evaluator';
    case 'ecommerce_discount_hunter':
      return 'E-Commerce Discount Hunter';
    case 'non_native_speaker':
      return 'Non-Native Language Speaker';
  }
}
