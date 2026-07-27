import { describe, it, expect } from 'vitest';
import { renderVisualLayout } from './visual-renderer.js';

const html = `<html><body><button id="b1">Btn 1</button><input id="i1" /></body></html>`;

describe('Visual Layout Renderer', () => {
  it('extracts bounding boxes for elements with IDs', () => {
    const layout = renderVisualLayout(html);

    expect(layout.viewportWidth).toBe(1024);
    expect(layout.boundingBoxes.length).toBe(2);
    expect(layout.boundingBoxes[0]?.componentId).toBe('b1');
    expect(layout.boundingBoxes[1]?.componentId).toBe('i1');
  });
});
