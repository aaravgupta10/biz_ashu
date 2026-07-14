import { describe, it, expect } from 'vitest';
import { parseHtml } from './dom-parser.js';
import type { DefaultTreeAdapterTypes } from 'parse5';

describe('parseHtml', () => {
  it('should successfully parse a valid HTML string', () => {
    const html =
      '<!DOCTYPE html><html><head><title>Test</title></head><body><h1>Hello</h1></body></html>';
    const doc = parseHtml(html);

    expect(doc.nodeName).toBe('#document');
    expect(doc.childNodes.length).toBeGreaterThan(0);

    const htmlNode = doc.childNodes.find(
      (node: DefaultTreeAdapterTypes.ChildNode) => node.nodeName === 'html',
    );
    expect(htmlNode).toBeDefined();
  });

  it('should gracefully handle and auto-repair malformed HTML', () => {
    const malformedHtml = '<div><p>Unclosed paragraph';
    const doc = parseHtml(malformedHtml);

    expect(doc.nodeName).toBe('#document');
    expect(doc.childNodes.length).toBeGreaterThan(0);

    const htmlNode = doc.childNodes.find(
      (node: DefaultTreeAdapterTypes.ChildNode) => node.nodeName === 'html',
    );
    expect(htmlNode).toBeDefined();
  });
});
