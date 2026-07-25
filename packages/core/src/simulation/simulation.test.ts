import { describe, it, expect } from 'vitest';
import { ImmutableActionEvent } from './action-event.js';
import { ImmutableWorldState } from './world-state.js';

describe('simulation models', () => {
  describe('ImmutableActionEvent', () => {
    it('creates a valid ActionEvent instance', () => {
      const now = new Date().toISOString();
      const action = ImmutableActionEvent.create({
        id: 'act-1',
        simulationId: 'sim-100',
        stepIndex: 0,
        actionType: 'click',
        targetComponentId: 'comp-btn-1',
        affordanceId: 'aff-click-1',
        durationMs: 250,
        payload: { clickCoordinates: { x: 100, y: 200 } },
        timestamp: now,
      });

      expect(action.id).toBe('act-1');
      expect(action.actionType).toBe('click');
      expect(action.durationMs).toBe(250);
      expect(Object.isFrozen(action)).toBe(true);
      expect(Object.isFrozen(action.payload)).toBe(true);
    });

    it('validates ISO timestamp format', () => {
      expect(() =>
        ImmutableActionEvent.create({
          id: 'act-1',
          simulationId: 'sim-100',
          stepIndex: 0,
          actionType: 'click',
          durationMs: 100,
          timestamp: 'invalid-date',
        }),
      ).toThrow();
    });
  });

  describe('ImmutableWorldState', () => {
    it('creates a valid WorldState snapshot', () => {
      const world = ImmutableWorldState.create({
        id: 'ws-1',
        simulationId: 'sim-100',
        activePageId: 'page-home',
        stepIndex: 0,
        elapsedTimeMs: 0,
        componentStates: {
          'comp-btn-1': {
            componentId: 'comp-btn-1',
            visible: true,
            enabled: true,
            focused: false,
          },
        },
      });

      expect(world.id).toBe('ws-1');
      expect(world.activePageId).toBe('page-home');
      expect(world.componentStates['comp-btn-1']?.visible).toBe(true);
      expect(Object.isFrozen(world)).toBe(true);
    });

    it('immutably updates world state via update helper', () => {
      const initialWorld = ImmutableWorldState.create({
        id: 'ws-1',
        simulationId: 'sim-100',
        activePageId: 'page-home',
        stepIndex: 0,
        elapsedTimeMs: 0,
      });

      const nextWorld = initialWorld.update({
        stepIndex: 1,
        elapsedTimeMs: 500,
      });

      expect(initialWorld.stepIndex).toBe(0);
      expect(nextWorld.stepIndex).toBe(1);
      expect(nextWorld.elapsedTimeMs).toBe(500);
      expect(Object.isFrozen(nextWorld)).toBe(true);
    });
  });
});
