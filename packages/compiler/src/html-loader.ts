import { readFile } from 'node:fs/promises';

/**
 * Custom error thrown when the specified HTML file is not found on disk.
 */
export class HtmlFileNotFoundError extends Error {
  public readonly code = 'HTML_FILE_NOT_FOUND';

  constructor(
    public readonly filePath: string,
    cause?: unknown,
  ) {
    super(`HTML file not found at path: ${filePath}`);
    this.name = 'HtmlFileNotFoundError';
    if (cause) {
      this.cause = cause;
    }
  }
}

/**
 * Custom error thrown when the specified path is unreadable (e.g., is a directory, lacks permissions).
 */
export class HtmlFileReadError extends Error {
  public readonly code = 'HTML_FILE_READ_ERROR';

  constructor(
    public readonly filePath: string,
    cause: unknown,
  ) {
    super(
      `Failed to read HTML file at path: ${filePath}. Reason: ${
        cause instanceof Error ? cause.message : String(cause)
      }`,
    );
    this.name = 'HtmlFileReadError';
    this.cause = cause;
  }
}

/**
 * Loads an HTML file asynchronously from disk and returns its contents as a string.
 *
 * @param filePath Path to the HTML file on disk
 * @returns Promise resolving to the HTML file contents as a string
 * @throws HtmlFileNotFoundError if the file does not exist
 * @throws HtmlFileReadError if reading fails due to lack of permissions, path being a directory, etc.
 */
export async function loadHtmlFile(filePath: string): Promise<string> {
  try {
    const content = await readFile(filePath, 'utf8');
    return content;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error) {
      const errCode = (error as { code: string }).code;
      if (errCode === 'ENOENT') {
        throw new HtmlFileNotFoundError(filePath, error);
      }
    }
    throw new HtmlFileReadError(filePath, error);
  }
}
