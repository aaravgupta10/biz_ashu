import { CognitiveState } from '@platform/cognition';
import { generateId } from '@platform/shared';

export interface Recommendation {
  id: string;
  cognitiveStateId: string;
  type: 'layout' | 'content' | 'performance';
  suggestion: string;
  expectedLift: number;
}

export function generateRecommendations(state: CognitiveState): Recommendation[] {
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
