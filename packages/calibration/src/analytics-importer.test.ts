import { describe, it, expect } from 'vitest';
import { importEmpiricalClickstream, type RawAnalyticsEvent } from './analytics-importer.js';

describe('importEmpiricalClickstream', () => {
  it('parses empirical clickstream logs and derives calibration benchmarks', () => {
    const events: RawAnalyticsEvent[] = [
      { sessionId: 's1', eventType: 'pageview', timestampMs: 1000 },
      { sessionId: 's1', eventType: 'click', timestampMs: 1500 },
      { sessionId: 's1', eventType: 'submit', timestampMs: 2500 },
      { sessionId: 's2', eventType: 'pageview', timestampMs: 1000 },
      { sessionId: 's2', eventType: 'abandon', timestampMs: 1800 },
    ];

    const benchmark = importEmpiricalClickstream(events, 'page-checkout');

    expect(benchmark.pageId).toBe('page-checkout');
    expect(benchmark.completionRate).toBe(0.5);
    expect(benchmark.targetDropOffRate).toBe(0.5);
    expect(benchmark.averageStepsToConversion).toBe(3);
    expect(benchmark.averageTimeOnPageMs).toBe(1500);
  });
});
