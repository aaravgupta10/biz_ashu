import { describe, it, expect } from 'vitest';
import { generateId, PLATFORM_VERSION } from './index.js';

describe('Shared Utilities', () => {
  it('should have a valid platform version', () => {
    expect(PLATFORM_VERSION).toBe('0.1.0');
  });

  it('should generate unique non-empty IDs', () => {
    const id1 = generateId();
    const id2 = generateId();

    expect(id1).toBeTypeOf('string');
    expect(id1.length).toBeGreaterThan(0);
    expect(id1).not.toBe(id2);
  });
});
