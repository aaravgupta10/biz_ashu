import { ImmutablePersona, type Persona } from './persona.js';

export type CohortType =
  'gen_z_mobile' | 'senior_low_fluency' | 'impulsive_buyer' | 'enterprise_security' | 'power_user';

export interface CohortConfig {
  cohortType: CohortType;
  count: number;
  namePrefix?: string;
}

/**
 * Generates a statistically grounded population cohort of Synthetic Human Personas.
 *
 * @param cohortConfigs Array of CohortConfig objects
 * @returns Array of instantiated Persona domain entities
 */
export function generateSyntheticPopulation(cohortConfigs: CohortConfig[]): Persona[] {
  const population: Persona[] = [];

  for (const config of cohortConfigs) {
    const { cohortType, count, namePrefix } = config;

    for (let i = 0; i < count; i++) {
      const id = `persona-${cohortType}-${i + 1}-${Math.random().toString(36).substring(2, 7)}`;
      const name = `${namePrefix || formatCohortName(cohortType)} #${i + 1}`;

      let personality = {
        openness: 0.6,
        conscientiousness: 0.6,
        extraversion: 0.5,
        agreeableness: 0.6,
        neuroticism: 0.3,
      };

      let cognitiveTraits = {
        technicalFluency: 0.75,
        domainFamiliarity: 0.7,
        patienceThreshold: 0.6,
        attentionSpan: 0.65,
        visualAcuity: 0.8,
        riskTolerance: 0.6,
      };

      // Apply cohort trait archetypes with realistic variance
      const jitter = () => (Math.random() - 0.5) * 0.1;

      switch (cohortType) {
        case 'gen_z_mobile':
          personality = {
            openness: 0.85 + jitter(),
            conscientiousness: 0.5 + jitter(),
            extraversion: 0.7 + jitter(),
            agreeableness: 0.6,
            neuroticism: 0.4,
          };
          cognitiveTraits = {
            technicalFluency: 0.95 + jitter(),
            domainFamiliarity: 0.75 + jitter(),
            patienceThreshold: 0.35 + jitter(),
            attentionSpan: 0.45 + jitter(),
            visualAcuity: 0.9 + jitter(),
            riskTolerance: 0.7 + jitter(),
          };
          break;
        case 'senior_low_fluency':
          personality = {
            openness: 0.4 + jitter(),
            conscientiousness: 0.85 + jitter(),
            extraversion: 0.4,
            agreeableness: 0.8,
            neuroticism: 0.3,
          };
          cognitiveTraits = {
            technicalFluency: 0.35 + jitter(),
            domainFamiliarity: 0.4 + jitter(),
            patienceThreshold: 0.75 + jitter(),
            attentionSpan: 0.8 + jitter(),
            visualAcuity: 0.55 + jitter(),
            riskTolerance: 0.3 + jitter(),
          };
          break;
        case 'impulsive_buyer':
          personality = {
            openness: 0.9 + jitter(),
            conscientiousness: 0.3 + jitter(),
            extraversion: 0.8,
            agreeableness: 0.6,
            neuroticism: 0.2,
          };
          cognitiveTraits = {
            technicalFluency: 0.8 + jitter(),
            domainFamiliarity: 0.6 + jitter(),
            patienceThreshold: 0.5 + jitter(),
            attentionSpan: 0.4 + jitter(),
            visualAcuity: 0.85 + jitter(),
            riskTolerance: 0.85 + jitter(),
          };
          break;
        case 'enterprise_security':
          personality = {
            openness: 0.4 + jitter(),
            conscientiousness: 0.95 + jitter(),
            extraversion: 0.3,
            agreeableness: 0.5,
            neuroticism: 0.8 + jitter(),
          };
          cognitiveTraits = {
            technicalFluency: 0.85 + jitter(),
            domainFamiliarity: 0.85 + jitter(),
            patienceThreshold: 0.8 + jitter(),
            attentionSpan: 0.85 + jitter(),
            visualAcuity: 0.85 + jitter(),
            riskTolerance: 0.15 + jitter(),
          };
          break;
        case 'power_user':
          personality = {
            openness: 0.8 + jitter(),
            conscientiousness: 0.85 + jitter(),
            extraversion: 0.6,
            agreeableness: 0.6,
            neuroticism: 0.2,
          };
          cognitiveTraits = {
            technicalFluency: 0.98 + jitter(),
            domainFamiliarity: 0.9 + jitter(),
            patienceThreshold: 0.7 + jitter(),
            attentionSpan: 0.8 + jitter(),
            visualAcuity: 0.95 + jitter(),
            riskTolerance: 0.65 + jitter(),
          };
          break;
      }

      // Clamp values [0.0, 1.0]
      const clamp = (val: number) => Math.round(Math.max(0.05, Math.min(0.99, val)) * 100) / 100;

      const persona = ImmutablePersona.create({
        id,
        name,
        role: cohortType,
        personality: {
          openness: clamp(personality.openness),
          conscientiousness: clamp(personality.conscientiousness),
          extraversion: clamp(personality.extraversion),
          agreeableness: clamp(personality.agreeableness),
          neuroticism: clamp(personality.neuroticism),
        },
        cognitiveTraits: {
          technicalFluency: clamp(cognitiveTraits.technicalFluency),
          domainFamiliarity: clamp(cognitiveTraits.domainFamiliarity),
          patienceThreshold: clamp(cognitiveTraits.patienceThreshold),
          attentionSpan: clamp(cognitiveTraits.attentionSpan),
          visualAcuity: clamp(cognitiveTraits.visualAcuity),
          riskTolerance: clamp(cognitiveTraits.riskTolerance),
        },
        demographics: { cohortType },
        metadata: { generatedAt: new Date().toISOString() },
      });

      population.push(persona);
    }
  }

  return population;
}

function formatCohortName(cohort: CohortType): string {
  switch (cohort) {
    case 'gen_z_mobile':
      return 'Gen Z Mobile Native';
    case 'senior_low_fluency':
      return 'Senior Low-Fluency';
    case 'impulsive_buyer':
      return 'Impulsive Buyer';
    case 'enterprise_security':
      return 'Enterprise Security Buyer';
    case 'power_user':
      return 'Power User';
  }
}
