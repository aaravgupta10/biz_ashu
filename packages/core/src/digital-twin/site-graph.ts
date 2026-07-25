import { z } from 'zod';
import { type Page } from './page.js';

export const siteGraphSchema = z.object({
  id: z.string().min(1, 'Site ID cannot be empty').trim(),
  name: z.string().min(1, 'Site name cannot be empty').trim(),
  entryRoute: z.string().min(1, 'Entry route cannot be empty').startsWith('/').trim(),
  pages: z.record(z.string(), z.unknown()),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export type SiteGraphInput = z.input<typeof siteGraphSchema>;
export type SiteGraphOutput = z.output<typeof siteGraphSchema>;

/**
 * Immutable domain entity representing a multi-page web application Digital Twin graph.
 */
export class ImmutableSiteGraph {
  public readonly id: string;
  public readonly name: string;
  public readonly entryRoute: string;
  public readonly pages: Readonly<Record<string, Page>>;
  public readonly metadata: Readonly<Record<string, unknown>>;

  private constructor(data: SiteGraphOutput) {
    this.id = data.id;
    this.name = data.name;
    this.entryRoute = data.entryRoute;

    const frozenPages: Record<string, Page> = {};
    for (const [route, page] of Object.entries(data.pages as Record<string, Page>)) {
      frozenPages[route] = Object.freeze({
        ...page,
        components: Object.freeze([...(page.components || []).map((c) => Object.freeze({ ...c }))]),
      });
    }
    this.pages = Object.freeze(frozenPages);
    this.metadata = Object.freeze({ ...data.metadata });
    Object.freeze(this);
  }

  /**
   * Validates input parameters against siteGraphSchema and instantiates a frozen ImmutableSiteGraph.
   */
  public static create(input?: Partial<SiteGraphInput>): ImmutableSiteGraph {
    const raw = {
      id: input?.id ?? `site-${Math.random().toString(36).substring(2, 9)}`,
      name: input?.name ?? 'Untitled Site Graph',
      entryRoute: input?.entryRoute ?? '/',
      pages: input?.pages ?? {},
      metadata: input?.metadata ?? {},
    };

    const validated = siteGraphSchema.parse(raw);
    return new ImmutableSiteGraph(validated);
  }

  /**
   * Retrieves a Page Digital Twin by its URL route path.
   */
  public getPageByRoute(route: string): Page | undefined {
    return this.pages[route];
  }

  /**
   * Returns a plain JSON representation of the SiteGraph.
   */
  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      entryRoute: this.entryRoute,
      pages: JSON.parse(JSON.stringify(this.pages)),
      metadata: JSON.parse(JSON.stringify(this.metadata)),
    };
  }
}
