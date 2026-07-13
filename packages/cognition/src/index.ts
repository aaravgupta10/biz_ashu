import { TraceRecord } from '@platform/runtime';
import { generateId } from '@platform/shared';

export interface CognitiveState {
  id: string;
  traceId: string;
  inferences: string[];
  confidence: number;
}

export function analyzeTraceRecord(record: TraceRecord): CognitiveState {
  return {
    id: generateId(),
    traceId: record.traceId,
    inferences: ['user hesitated before click', 'user scanned header menu first'],
    confidence: 0.92,
  };
}
