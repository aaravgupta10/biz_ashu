import { generateId } from '@platform/shared';
import { ImmutableSiteGraph, Page } from '@platform/core';
import { parseHtml } from './dom-parser.js';
import { extractRawElements } from './raw-element-extractor.js';
import { classifyRawElements } from './semantic-classifier.js';
import { buildPageGraph } from './graph-builder.js';
import { extractAllAffordances } from './interaction-compiler.js';
import { validateDigitalTwinPage } from './twin-validator.js';
import type { InteractionAffordance } from './interaction-affordance.js';

export interface SitePageInput {
  /** URL route path (e.g., '/', '/product', '/checkout') */
  route: string;
  /** Raw HTML document string for this page */
  html: string;
  /** Human-readable page name */
  name?: string;
  /** Primary purpose of the page */
  purpose?: string;
}

export interface CompiledSiteOutput {
  /** Compiled ImmutableSiteGraph Digital Twin */
  site: ImmutableSiteGraph;
  /** Interaction affordances indexed by route path */
  affordancesByRoute: Record<string, InteractionAffordance[]>;
}

/**
 * Compiles a multi-page site graph from an array of HTML document inputs and route mappings.
 *
 * @param siteName Human-readable name of the website/application
 * @param entryRoute Initial entry route URL path (defaults to '/')
 * @param pageInputs Array of SitePageInput objects
 * @returns CompiledSiteOutput containing the ImmutableSiteGraph and affordance maps
 */
export function compileSiteGraph(
  siteName: string,
  entryRoute: string,
  pageInputs: SitePageInput[],
): CompiledSiteOutput {
  const pagesMap: Record<string, Page> = {};
  const affordancesByRoute: Record<string, InteractionAffordance[]> = {};

  for (const input of pageInputs) {
    const domTree = parseHtml(input.html);
    const rawElements = extractRawElements(domTree);
    const semanticNodes = classifyRawElements(rawElements);

    const page = buildPageGraph(semanticNodes, {
      id: generateId(),
      name: input.name || `Page ${input.route}`,
      route: input.route,
      purpose: input.purpose || `Navigate and interact on ${input.route}`,
    });

    const affordances = extractAllAffordances(semanticNodes);
    validateDigitalTwinPage(page, affordances);

    pagesMap[input.route] = page;
    affordancesByRoute[input.route] = affordances;
  }

  const site = ImmutableSiteGraph.create({
    id: generateId(),
    name: siteName,
    entryRoute,
    pages: pagesMap,
  });

  return { site, affordancesByRoute };
}
