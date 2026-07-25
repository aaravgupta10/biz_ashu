export * from './friction-detector.js';
export * from './recommendation-generator.js';

import { CognitiveState } from '@platform/core';
import { generateId } from '@platform/shared';

export interface LegacyRecommendation {
  id: string;
  cognitiveStateId: string;
  type: 'layout' | 'content' | 'performance';
  suggestion: string;
  expectedLift: number;
}

export function generateRecommendations(state: CognitiveState): LegacyRecommendation[] {
  return [
    {
      id: generateId(),
      cognitiveStateId: state.id,
      type: 'layout',
      suggestion: 'Move primary call-to-action button above the fold to match user scan path.',
      expectedLift: 0.14,
    },
  ];
}
