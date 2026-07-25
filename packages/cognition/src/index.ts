export * from './perception-engine.js';
export * from './goal-generator.js';
export * from './decision-engine.js';
export * from './attention-heatmap.js';
import { generateId } from '@platform/shared';

export interface CognitionTraceInput {
  traceId: string;
  simulationId?: string;
  stepsCount?: number;
  timestamp?: Date | string;
}

export interface CognitionAnalysisResult {
  id: string;
  traceId: string;
  inferences: string[];
  confidence: number;
}

export function analyzeTraceRecord(record: CognitionTraceInput): CognitionAnalysisResult {
  return {
    id: generateId(),
    traceId: record.traceId,
    inferences: ['user hesitated before click', 'user scanned header menu first'],
    confidence: 0.92,
  };
}
