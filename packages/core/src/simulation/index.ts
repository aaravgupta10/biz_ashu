export * from './action-event.js';
export * from './world-state.js';
import { BaseEntity } from '../common/index.js';

export interface Simulation extends BaseEntity {
  status: 'idle' | 'running' | 'completed' | 'failed';
  runtimeId: string;
}
