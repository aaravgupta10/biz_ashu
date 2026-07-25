import type { Page, Persona } from '@platform/core';

export interface ComponentAttentionScore {
  componentId: string;
  componentName: string;
  componentType: string;
  attentionScore: number;
  fixationZone: 'high' | 'medium' | 'low';
  saliencyContribution: number;
  positionContribution: number;
}

export interface AttentionHeatmapData {
  pageId: string;
  personaId: string;
  totalComponentsScored: number;
  highFixationCount: number;
  mediumFixationCount: number;
  lowFixationCount: number;
  scores: ComponentAttentionScore[];
}

/**
 * Computes component-level visual attention distribution scores modeling synthetic eye-tracking fixations.
 *
 * @param page Page Digital Twin
 * @param persona Synthetic Human Persona profile
 * @returns AttentionHeatmapData containing component attention scores and fixation zone counts
 */
export function calculateVisualAttentionHeatmap(
  page: Page,
  persona: Persona,
): AttentionHeatmapData {
  const scores: ComponentAttentionScore[] = [];
  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;

  const components = page.components || [];
  const totalComponents = components.length;

  components.forEach((comp, index) => {
    // 1. Base Saliency by Type
    let typeSaliency = 0.5;
    const typeLower = comp.type.toLowerCase();
    if (typeLower.includes('button') || typeLower.includes('submit')) {
      typeSaliency = 0.9;
    } else if (
      typeLower.includes('heading') ||
      typeLower.includes('h1') ||
      typeLower.includes('h2')
    ) {
      typeSaliency = 0.85;
    } else if (typeLower.includes('input') || typeLower.includes('select')) {
      typeSaliency = 0.7;
    } else if (typeLower.includes('link') || typeLower.includes('anchor')) {
      typeSaliency = 0.6;
    }

    // 2. Spatial Viewport Position Weight (f-shape reading pattern)
    const relativePos = totalComponents > 1 ? index / (totalComponents - 1) : 0;
    const positionWeight = Math.max(0.3, 1.0 - relativePos * 0.6);

    // 3. Persona Trait Multipliers
    const acuityMult = persona.cognitiveTraits.visualAcuity || 0.8;
    const spanMult = persona.cognitiveTraits.attentionSpan || 0.7;

    const rawScore =
      (typeSaliency * 0.6 + positionWeight * 0.4) *
      (0.7 + acuityMult * 0.3) *
      (0.8 + spanMult * 0.2);
    const attentionScore = Math.round(Math.min(1.0, Math.max(0.1, rawScore)) * 100) / 100;

    let fixationZone: ComponentAttentionScore['fixationZone'] = 'low';
    if (attentionScore >= 0.7) {
      fixationZone = 'high';
      highCount++;
    } else if (attentionScore >= 0.45) {
      fixationZone = 'medium';
      mediumCount++;
    } else {
      lowCount++;
    }

    scores.push({
      componentId: comp.id,
      componentName: comp.name,
      componentType: comp.type,
      attentionScore,
      fixationZone,
      saliencyContribution: Math.round(typeSaliency * 100) / 100,
      positionContribution: Math.round(positionWeight * 100) / 100,
    });
  });

  return {
    pageId: page.id,
    personaId: persona.id,
    totalComponentsScored: totalComponents,
    highFixationCount: highCount,
    mediumFixationCount: mediumCount,
    lowFixationCount: lowCount,
    scores,
  };
}
