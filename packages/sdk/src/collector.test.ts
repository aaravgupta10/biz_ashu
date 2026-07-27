import { describe, it, expect } from 'vitest';
import { captureDomSnapshot } from './collector.js';

describe('@platform/sdk collector', () => {
  it('formats DOM snapshot payload with project metadata and URL', () => {
    const payload = captureDomSnapshot(
      { projectId: 'proj-123' },
      '<html><body><h1>Test</h1></body></html>',
      'https://example.com/checkout',
    );

    expect(payload.projectId).toBe('proj-123');
    expect(payload.url).toBe('https://example.com/checkout');
    expect(payload.htmlContent).toContain('<h1>Test</h1>');
    expect(payload.timestamp).toBeDefined();
  });
});
