export * from './persona.js';
export * from './cognitive-state.js';
export * from './population-generator.js';
import { BaseEntity } from '../common/index.js';
import { Persona } from './persona.js';

export interface SyntheticHuman extends BaseEntity {
  persona: Persona;
  capabilities: string[];
}
