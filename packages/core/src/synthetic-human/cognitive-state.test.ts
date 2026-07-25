import { describe, it, expect } from 'vitest';
import { ImmutableCognitiveState } from './cognitive-state.js';

function createValidCognitiveStateInput() {
  return {
    id: 'cog-state-1',
    personaId: 'persona-1',
    activeGoal: 'Complete Sign-up',
    activeFocusComponentId: 'comp-10',
    frustrationLevel: 0.1,
    trustLevel: 0.8,
    stepCount: 2,
    shortTermMemory: [
      {
        componentId: 'comp-1',
        actionType: 'click',
        timestampMs: 1200,
        result: 'success' as const,
      },
    ],
    metadata: { sessionTraceId: 'trace-99' },
  };
}

describe('cognitive-state', () => {
  it('creates a valid ImmutableCognitiveState instance', () => {
    const input = createValidCognitiveStateInput();
    const state = ImmutableCognitiveState.create(input);

    expect(state.id).toBe('cog-state-1');
    expect(state.personaId).toBe('persona-1');
    expect(state.activeGoal).toBe('Complete Sign-up');
    expect(state.activeFocusComponentId).toBe('comp-10');
    expect(state.frustrationLevel).toBe(0.1);
    expect(state.trustLevel).toBe(0.8);
    expect(state.stepCount).toBe(2);
    expect(state.shortTermMemory).toHaveLength(1);
    expect(state.shortTermMemory[0]?.componentId).toBe('comp-1');
  });

  it('rejects frustration or trust levels out of bounds [0.0 - 1.0]', () => {
    const input = createValidCognitiveStateInput();
    input.frustrationLevel = 1.2;

    expect(() => ImmutableCognitiveState.create(input)).toThrow();

    const input2 = createValidCognitiveStateInput();
    input2.trustLevel = -0.5;

    expect(() => ImmutableCognitiveState.create(input2)).toThrow();
  });

  it('returns deeply frozen immutable objects', () => {
    const input = createValidCognitiveStateInput();
    const state = ImmutableCognitiveState.create(input);

    expect(Object.isFrozen(state)).toBe(true);
    expect(Object.isFrozen(state.shortTermMemory)).toBe(true);
    expect(Object.isFrozen(state.shortTermMemory[0])).toBe(true);
    expect(Object.isFrozen(state.metadata)).toBe(true);
  });

  it('updates state immutably via update helper method', () => {
    const input = createValidCognitiveStateInput();
    const initialState = ImmutableCognitiveState.create(input);

    const nextState = initialState.update({
      stepCount: 3,
      frustrationLevel: 0.3,
      activeFocusComponentId: 'comp-11',
    });

    // Original state remains unchanged
    expect(initialState.stepCount).toBe(2);
    expect(initialState.frustrationLevel).toBe(0.1);
    expect(initialState.activeFocusComponentId).toBe('comp-10');

    // New state has updated values and is frozen
    expect(nextState.stepCount).toBe(3);
    expect(nextState.frustrationLevel).toBe(0.3);
    expect(nextState.activeFocusComponentId).toBe('comp-11');
    expect(Object.isFrozen(nextState)).toBe(true);
  });

  it('serializes to clean JSON object', () => {
    const input = createValidCognitiveStateInput();
    const state = ImmutableCognitiveState.create(input);
    const json = state.toJSON();

    expect(json['id']).toBe('cog-state-1');
    expect(json['activeGoal']).toBe('Complete Sign-up');
    expect(json['frustrationLevel']).toBe(0.1);
  });
});
