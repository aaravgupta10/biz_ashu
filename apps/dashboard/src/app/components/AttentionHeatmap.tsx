'use client';

import React from 'react';

export interface ComponentAttentionScoreUI {
  componentId: string;
  componentName: string;
  componentType: string;
  attentionScore: number;
  fixationZone: 'high' | 'medium' | 'low';
  saliencyContribution: number;
  positionContribution: number;
}

export interface AttentionHeatmapProps {
  scores: ComponentAttentionScoreUI[];
  highCount: number;
  mediumCount: number;
  lowCount: number;
}

export function AttentionHeatmap({
  scores,
  highCount,
  mediumCount,
  lowCount,
}: AttentionHeatmapProps) {
  const getZoneBadgeColor = (zone: 'high' | 'medium' | 'low') => {
    switch (zone) {
      case 'high':
        return { bg: '#7f1d1d', text: '#fca5a5', border: '#ef4444' };
      case 'medium':
        return { bg: '#78350f', text: '#fde047', border: '#eab308' };
      case 'low':
      default:
        return { bg: '#14532d', text: '#86efac', border: '#22c55e' };
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#1e293b',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        border: '1px solid #334155',
      }}
    >
      <h2
        style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#e2e8f0' }}
      >
        Eye-Tracking Visual Attention Distribution
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            backgroundColor: '#0f172a',
            padding: '1rem',
            borderRadius: '0.5rem',
            border: '1px solid #ef4444',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: '#fca5a5' }}>High Fixation Zone</div>
          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f87171' }}>
            {highCount} Elements
          </div>
        </div>
        <div
          style={{
            backgroundColor: '#0f172a',
            padding: '1rem',
            borderRadius: '0.5rem',
            border: '1px solid #eab308',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: '#fde047' }}>Medium Fixation Zone</div>
          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#facc15' }}>
            {mediumCount} Elements
          </div>
        </div>
        <div
          style={{
            backgroundColor: '#0f172a',
            padding: '1rem',
            borderRadius: '0.5rem',
            border: '1px solid #22c55e',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: '#86efac' }}>Low Fixation Zone</div>
          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#4ade80' }}>
            {lowCount} Elements
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {scores.map((s) => {
          const colors = getZoneBadgeColor(s.fixationZone);
          return (
            <div
              key={s.componentId}
              style={{
                backgroundColor: '#0f172a',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: `1px solid ${colors.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span style={{ fontWeight: '600', fontSize: '0.875rem', color: '#f8fafc' }}>
                  {s.componentName}
                </span>
                <span
                  style={{
                    marginLeft: '0.5rem',
                    fontSize: '0.75rem',
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                  }}
                >
                  ({s.componentType})
                </span>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Saliency: {s.saliencyContribution} | Spatial Weight: {s.positionContribution}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    backgroundColor: colors.bg,
                    color: colors.text,
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    display: 'inline-block',
                  }}
                >
                  {(s.attentionScore * 100).toFixed(0)}% Attention
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
