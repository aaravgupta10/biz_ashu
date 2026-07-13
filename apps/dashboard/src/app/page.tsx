import React from 'react';
import { PLATFORM_VERSION } from '@platform/shared';
import { generateRecommendations } from '@platform/recommendation';

export default function HomePage() {
  const dummyState = {
    id: 'dashboard-state-uuid',
    traceId: 'dashboard-trace-uuid',
    inferences: ['user read CTA text', 'user paused over pricing plan'],
    confidence: 0.94,
  };

  const recommendations = generateRecommendations(dummyState);

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header
        style={{ marginBottom: '2rem', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}
      >
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Behavioral Intelligence Platform</h1>
        <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Version: {PLATFORM_VERSION}</p>
      </header>

      <section style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#38bdf8' }}>
          Demo Recommendations
        </h2>
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            style={{ borderLeft: '4px solid #38bdf8', paddingLeft: '1rem', margin: '1rem 0' }}
          >
            <p style={{ fontWeight: '500' }}>{rec.suggestion}</p>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Type: {rec.type} | Expected Lift: {(rec.expectedLift * 100).toFixed(1)}%
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
