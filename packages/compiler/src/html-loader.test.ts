import { describe, it, expect } from 'vitest';
import { writeFile, unlink, mkdir, rmdir } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { loadHtmlFile, HtmlFileNotFoundError, HtmlFileReadError } from './html-loader.js';

describe('loadHtmlFile', () => {
  it('should successfully read a valid HTML file', async () => {
    const testPath = join(tmpdir(), `test-${Date.now()}-${Math.random()}.html`);
    const mockHtml = '<html><body><h1>Hello World</h1></body></html>';

    await writeFile(testPath, mockHtml, 'utf8');

    try {
      const content = await loadHtmlFile(testPath);
      expect(content).toBe(mockHtml);
    } finally {
      await unlink(testPath);
    }
  });

  it('should throw HtmlFileNotFoundError when the file does not exist', async () => {
    const nonexistentPath = join(tmpdir(), `nonexistent-${Date.now()}-${Math.random()}.html`);

    await expect(loadHtmlFile(nonexistentPath)).rejects.toThrow(HtmlFileNotFoundError);
    await expect(loadHtmlFile(nonexistentPath)).rejects.toThrow(
      `HTML file not found at path: ${nonexistentPath}`,
    );
  });

  it('should throw HtmlFileReadError when the path is a directory', async () => {
    const dirPath = join(tmpdir(), `dir-${Date.now()}-${Math.random()}`);
    await mkdir(dirPath);

    try {
      await expect(loadHtmlFile(dirPath)).rejects.toThrow(HtmlFileReadError);
    } finally {
      await rmdir(dirPath);
    }
  });
});
