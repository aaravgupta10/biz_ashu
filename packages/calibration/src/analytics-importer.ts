import type { EmpiricalBenchmarkData } from './discrepancy-calculator.js';

export interface RawAnalyticsEvent {
  sessionId: string;
  eventType: 'pageview' | 'click' | 'input' | 'submit' | 'abandon';
  timestampMs: number;
  pageId?: string;
}

/**
 * Parses raw empirical user clickstream event logs and computes aggregate calibration benchmark targets.
 *
 * @param rawEvents Array of RawAnalyticsEvent objects
 * @param targetPageId Target Page ID to benchmark
 * @returns EmpiricalBenchmarkData object for loss metric calculation
 */
export function importEmpiricalClickstream(
  rawEvents: RawAnalyticsEvent[],
  targetPageId: string,
): EmpiricalBenchmarkData {
  if (rawEvents.length === 0) {
    return {
      pageId: targetPageId,
      targetDropOffRate: 0.2,
      averageTimeOnPageMs: 2000,
      averageStepsToConversion: 4,
      completionRate: 0.8,
    };
  }

  // Group events by session
  const sessions = new Map<string, RawAnalyticsEvent[]>();
  for (const ev of rawEvents) {
    const list = sessions.get(ev.sessionId) || [];
    list.push(ev);
    sessions.set(ev.sessionId, list);
  }

  const totalSessions = sessions.size;
  let completedCount = 0;
  let abandonedCount = 0;
  let totalStepsCompleted = 0;
  let totalDurationCompletedMs = 0;

  for (const [, events] of sessions.entries()) {
    // Sort events by timestamp
    events.sort((a, b) => a.timestampMs - b.timestampMs);
    const hasSubmit = events.some((e) => e.eventType === 'submit');
    const hasAbandon = events.some((e) => e.eventType === 'abandon');

    if (hasSubmit) {
      completedCount++;
      totalStepsCompleted += events.length;
      const lastTs = events[events.length - 1]?.timestampMs ?? 0;
      const firstTs = events[0]?.timestampMs ?? 0;
      const duration = lastTs - firstTs;
      totalDurationCompletedMs += Math.max(100, duration);
    } else if (hasAbandon) {
      abandonedCount++;
    }
  }

  const completionRate = Math.round((completedCount / Math.max(1, totalSessions)) * 100) / 100;
  const targetDropOffRate = Math.round((abandonedCount / Math.max(1, totalSessions)) * 100) / 100;
  const averageStepsToConversion = Math.max(
    1,
    Math.round(totalStepsCompleted / Math.max(1, completedCount)),
  );
  const averageTimeOnPageMs = Math.max(
    500,
    Math.round(totalDurationCompletedMs / Math.max(1, completedCount)),
  );

  return {
    pageId: targetPageId,
    targetDropOffRate,
    averageTimeOnPageMs,
    averageStepsToConversion,
    completionRate,
  };
}
