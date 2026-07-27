'use client';

import React from 'react';

export interface FixationPoint {
  id: string;
  x: number;
  y: number;
  durationMs: number;
  label: string;
}

export interface GazePlotOverlayProps {
  fixations: FixationPoint[];
  activeStepIndex: number;
}

export function GazePlotOverlay({ fixations, activeStepIndex }: GazePlotOverlayProps) {
  const visibleFixations = fixations.slice(0, activeStepIndex + 1);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '300px',
        backgroundColor: '#0f172a',
        borderRadius: '0.5rem',
        border: '1px solid #334155',
        overflow: 'hidden',
      }}
    >
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        {/* Draw Saccade Vector Lines connecting consecutive gaze fixations */}
        {visibleFixations.map((pt, idx) => {
          if (idx === 0) return null;
          const prev = visibleFixations[idx - 1];
          if (!prev) return null;
          return (
            <line
              key={`line-${idx}`}
              x1={`${prev.x}%`}
              y1={`${prev.y}%`}
              x2={`${pt.x}%`}
              y2={`${pt.y}%`}
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Draw Pupil Fixation Heatmap Circles */}
        {visibleFixations.map((pt, idx) => {
          const isCurrent = idx === activeStepIndex;
          const radius = Math.min(30, Math.max(12, pt.durationMs / 20));
          return (
            <g key={pt.id}>
              <circle
                cx={`${pt.x}%`}
                cy={`${pt.y}%`}
                r={radius}
                fill={isCurrent ? 'rgba(239, 68, 68, 0.6)' : 'rgba(56, 189, 248, 0.4)'}
                stroke={isCurrent ? '#ef4444' : '#38bdf8'}
                strokeWidth="2"
              />
              <text
                x={`${pt.x}%`}
                y={`${pt.y}%`}
                fill="#ffffff"
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
                dy=".3em"
              >
                {idx + 1}
              </text>
            </g>
          );
        })}
      </svg>
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          right: '12px',
          fontSize: '0.75rem',
          color: '#94a3b8',
        }}
      >
        Eye-Tracking Gaze Vector Overlay
      </div>
    </div>
  );
}
