import type { RawAnalyticsEvent } from './analytics-importer.js';

export interface PostHogExportEvent {
  event: string;
  distinct_id: string;
  timestamp: string;
  properties?: Record<string, unknown>;
}

/**
 * Parses raw PostHog event export stream into platform RawAnalyticsEvent objects.
 *
 * @param posthogEvents Array of PostHogExportEvent objects
 * @returns Array of normalized RawAnalyticsEvent objects
 */
export function parsePostHogEvents(posthogEvents: PostHogExportEvent[]): RawAnalyticsEvent[] {
  const normalized: RawAnalyticsEvent[] = [];

  for (const ev of posthogEvents) {
    let eventType: RawAnalyticsEvent['eventType'] = 'click';

    if (ev.event === '$pageview') {
      eventType = 'pageview';
    } else if (
      ev.event.toLowerCase().includes('submit') ||
      ev.event.toLowerCase().includes('order')
    ) {
      eventType = 'submit';
    } else if (
      ev.event.toLowerCase().includes('drop') ||
      ev.event.toLowerCase().includes('abandon')
    ) {
      eventType = 'abandon';
    } else if (ev.event.toLowerCase().includes('input')) {
      eventType = 'input';
    }

    const timestampMs = new Date(ev.timestamp).getTime();

    normalized.push({
      sessionId: ev.distinct_id || `session-${Math.random().toString(36).substring(2, 7)}`,
      eventType,
      timestampMs: isNaN(timestampMs) ? Date.now() : timestampMs,
    });
  }

  return normalized;
}
