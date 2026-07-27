export * from './html-loader.js';
export * from './dom-parser.js';
export * from './raw-element.js';
export * from './raw-element-extractor.js';
export * from './semantic-node.js';
export * from './semantic-classifier.js';
export * from './graph-builder.js';
export * from './interaction-affordance.js';
export * from './interaction-compiler.js';
export * from './twin-validator.js';
export * from './site-compiler.js';
export * from './ast-mutator.js';
export * from './sample-templates.js';
export * from './visual-renderer.js';
import { DigitalTwin } from '@platform/core';
import { generateId } from '@platform/shared';

export interface CompiledWorld {
  id: string;
  digitalTwinId: string;
  compiledAt: Date;
}

export function compileDigitalTwin(twin: DigitalTwin): CompiledWorld {
  return {
    id: generateId(),
    digitalTwinId: twin.id,
    compiledAt: new Date(),
  };
}
