import { parse, type DefaultTreeAdapterTypes } from 'parse5';

/**
 * Custom error thrown if the DOM parser encounters an unrecoverable failure.
 */
export class DomParseError extends Error {
  public readonly code = 'DOM_PARSE_ERROR';

  constructor(message: string, cause: unknown) {
    super(`DOM parsing failed: ${message}`);
    this.name = 'DomParseError';
    this.cause = cause;
  }
}

/**
 * Parses an HTML string into a parse5 Document AST.
 * Since parse5 implements the HTML5 parsing specification, it gracefully repairs
 * malformed or incomplete HTML inputs by constructing valid body/head containers.
 *
 * @param html Raw HTML string to parse
 * @returns The parsed parse5 Document AST representation
 * @throws DomParseError if a fatal parsing error occurs
 */
export function parseHtml(html: string): DefaultTreeAdapterTypes.Document {
  try {
    return parse(html);
  } catch (error: unknown) {
    throw new DomParseError(error instanceof Error ? error.message : String(error), error);
  }
}
