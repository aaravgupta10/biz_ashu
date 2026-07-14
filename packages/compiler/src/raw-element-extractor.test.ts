import { describe, it, expect } from 'vitest';
import { parseHtml } from './dom-parser.js';
import { extractRawElements } from './raw-element-extractor.js';

describe('extractRawElements', () => {
  it('should extract correct hierarchy, attributes, and text from HTML', () => {
    const html = `
      <div id="container" class="main-div">
        <h1>Welcome</h1>
        <p>This is <a href="/details">a link</a> to details.</p>
      </div>
    `;
    const doc = parseHtml(html);
    const elements = extractRawElements(doc);

    // Verify all element tags are extracted
    const tagNames = elements.map((el) => el.tagName);
    expect(tagNames).toContain('html');
    expect(tagNames).toContain('body');
    expect(tagNames).toContain('div');
    expect(tagNames).toContain('h1');
    expect(tagNames).toContain('p');
    expect(tagNames).toContain('a');

    // Find the container div
    const container = elements.find(
      (el) => el.tagName === 'div' && el.attributes.id === 'container',
    );
    expect(container).toBeDefined();
    if (!container) {
      throw new Error('container element not found');
    }
    expect(container.attributes.class).toBe('main-div');
    expect(container.depth).toBe(2); // html (0) -> body (1) -> div (2)

    // Check h1 text
    const h1 = elements.find((el) => el.tagName === 'h1');
    expect(h1).toBeDefined();
    if (!h1) {
      throw new Error('h1 element not found');
    }
    expect(h1.textContent).toBe('Welcome');
    expect(h1.parentId).toBe(container.id);

    // Check link in p element
    const p = elements.find((el) => el.tagName === 'p');
    const a = elements.find((el) => el.tagName === 'a');
    expect(p).toBeDefined();
    expect(a).toBeDefined();
    if (!p || !a) {
      throw new Error('p or a element not found');
    }
    expect(a.parentId).toBe(p.id);
    expect(a.attributes.href).toBe('/details');
    expect(p.textContent).toContain('This is');
    expect(p.textContent).toContain('a link');
  });

  it('should ensure all assigned IDs are unique and non-empty', () => {
    const html = '<ul><li>1</li><li>2</li><li>3</li></ul>';
    const doc = parseHtml(html);
    const elements = extractRawElements(doc);

    expect(elements.length).toBeGreaterThan(0);
    const ids = elements.map((el) => el.id);
    const uniqueIds = new Set(ids);

    expect(ids.length).toBe(uniqueIds.size);
    for (const id of ids) {
      expect(id.length).toBeGreaterThan(0);
    }
  });
});
