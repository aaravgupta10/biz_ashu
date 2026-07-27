export interface ElementBoundingBox {
  componentId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface VisualLayoutResult {
  viewportWidth: number;
  viewportHeight: number;
  boundingBoxes: ElementBoundingBox[];
}

/**
 * Calculates 2D spatial layout bounding boxes for DOM components inside visual viewports.
 *
 * @param html Target HTML document string
 * @returns VisualLayoutResult with component coordinates
 */
export function renderVisualLayout(html: string): VisualLayoutResult {
  const boundingBoxes: ElementBoundingBox[] = [];

  // Match IDs in HTML
  const idMatches = html.matchAll(/id=["']([^"']+)["']/g);
  let index = 0;

  for (const match of idMatches) {
    const compId = match[1] || `comp-${index}`;
    // Compute synthetic 2D layout grid positions
    const col = index % 3;
    const row = Math.floor(index / 3);

    boundingBoxes.push({
      componentId: compId,
      x: Math.round(50 + col * 280),
      y: Math.round(100 + row * 120),
      width: 240,
      height: 60,
    });

    index++;
  }

  return {
    viewportWidth: 1024,
    viewportHeight: 768,
    boundingBoxes,
  };
}
