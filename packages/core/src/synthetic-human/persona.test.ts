import { describe, it, expect } from 'vitest';
import { ImmutablePersona } from './persona.js';

function createValidPersonaInput() {
  return {
    id: 'persona-1',
    name: 'Tech-Savvy Power User',
    role: 'Early Adopter',
    personality: {
      openness: 0.85,
      conscientiousness: 0.7,
      extraversion: 0.6,
      agreeableness: 0.5,
      neuroticism: 0.2,
    },
    cognitiveTraits: {
      technicalFluency: 0.9,
      domainFamiliarity: 0.8,
      patienceThreshold: 0.4,
      attentionSpan: 0.6,
      visualAcuity: 0.95,
      riskTolerance: 0.75,
    },
    demographics: { ageGroup: '25-34', region: 'NA' },
    metadata: { source: 'default-archetypes' },
  };
}

describe('persona', () => {
  it('creates a valid ImmutablePersona instance', () => {
    const input = createValidPersonaInput();
    const persona = ImmutablePersona.create(input);

    expect(persona.id).toBe('persona-1');
    expect(persona.name).toBe('Tech-Savvy Power User');
    expect(persona.role).toBe('Early Adopter');
    expect(persona.personality.openness).toBe(0.85);
    expect(persona.cognitiveTraits.technicalFluency).toBe(0.9);
    expect(persona.demographics['ageGroup']).toBe('25-34');
  });

  it('rejects traits out of range [0.0 - 1.0]', () => {
    const input = createValidPersonaInput();
    input.personality.openness = 1.5; // Invalid > 1.0

    expect(() => ImmutablePersona.create(input)).toThrow();

    const input2 = createValidPersonaInput();
    input2.cognitiveTraits.patienceThreshold = -0.1; // Invalid < 0.0

    expect(() => ImmutablePersona.create(input2)).toThrow();
  });

  it('rejects empty string identifiers or names', () => {
    const input = createValidPersonaInput();
    input.id = '   ';

    expect(() => ImmutablePersona.create(input)).toThrow();
  });

  it('returns deeply frozen immutable objects', () => {
    const input = createValidPersonaInput();
    const persona = ImmutablePersona.create(input);

    expect(Object.isFrozen(persona)).toBe(true);
    expect(Object.isFrozen(persona.personality)).toBe(true);
    expect(Object.isFrozen(persona.cognitiveTraits)).toBe(true);
    expect(Object.isFrozen(persona.demographics)).toBe(true);
    expect(Object.isFrozen(persona.metadata)).toBe(true);
  });

  it('serializes into clean JSON output via toJSON', () => {
    const input = createValidPersonaInput();
    const persona = ImmutablePersona.create(input);
    const json = persona.toJSON();

    expect(json['id']).toBe('persona-1');
    expect(json['name']).toBe('Tech-Savvy Power User');
    expect(json['personality']).toEqual(input.personality);
    expect(json['cognitiveTraits']).toEqual(input.cognitiveTraits);
  });
});
