export * from './html-loader.js';
export * from './dom-parser.js';
export * from './raw-element.js';
export * from './raw-element-extractor.js';
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
