'use client';

import React, { useState, useEffect } from 'react';

export interface PlayerStep {
  stepIndex: number;
  actionType: string;
  targetComponentId: string;
  durationMs: number;
  reasoning: string;
  frustration: number;
}

export interface SimulationPlayerControlsProps {
  steps: PlayerStep[];
  onStepChange?: (currentStepIndex: number) => void;
}

export function SimulationPlayerControls({ steps, onStepChange }: SimulationPlayerControlsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<0.5 | 1 | 2>(1);

  const totalSteps = steps.length;

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying && totalSteps > 0) {
      const intervalMs = 1000 / playbackSpeed;
      timer = setTimeout(() => {
        setCurrentStep((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          const next = prev + 1;
          if (onStepChange) onStepChange(next);
          return next;
        });
      }, intervalMs);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, currentStep, totalSteps, playbackSpeed, onStepChange]);

  const handleStepSelect = (index: number) => {
    setCurrentStep(index);
    if (onStepChange) onStepChange(index);
  };

  const activeStep = steps[currentStep];

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
        Interactive Journey Scrubber & Gaze Player
      </h2>

      {/* Control Buttons & Speed */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => handleStepSelect(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            style={{
              backgroundColor: '#0f172a',
              color: '#ffffff',
              border: '1px solid #334155',
              borderRadius: '0.375rem',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
            }}
          >
            ⏮ Step Back
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              backgroundColor: isPlaying ? '#ef4444' : '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.375rem',
              padding: '0.5rem 1.25rem',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            {isPlaying ? '⏸ Pause' : '▶ Play Gaze'}
          </button>
          <button
            onClick={() => handleStepSelect(Math.min(totalSteps - 1, currentStep + 1))}
            disabled={currentStep >= totalSteps - 1}
            style={{
              backgroundColor: '#0f172a',
              color: '#ffffff',
              border: '1px solid #334155',
              borderRadius: '0.375rem',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
            }}
          >
            ⏭ Step Next
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginRight: '0.5rem' }}>
            Speed:
          </span>
          {([0.5, 1, 2] as const).map((spd) => (
            <button
              key={spd}
              onClick={() => setPlaybackSpeed(spd)}
              style={{
                backgroundColor: playbackSpeed === spd ? '#0284c7' : '#0f172a',
                color: '#ffffff',
                border: '1px solid #334155',
                borderRadius: '0.25rem',
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Scrubber */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="range"
          min={0}
          max={Math.max(0, totalSteps - 1)}
          value={currentStep}
          onChange={(e) => handleStepSelect(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: '#94a3b8',
            marginTop: '0.25rem',
          }}
        >
          <span>Step 1</span>
          <span>
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span>Step {totalSteps}</span>
        </div>
      </div>

      {/* Active Step Reasoning Overlay */}
      {activeStep && (
        <div
          style={{
            backgroundColor: '#0f172a',
            padding: '1rem',
            borderRadius: '0.5rem',
            border: '1px solid #334155',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              color: '#38bdf8',
              fontSize: '0.875rem',
              fontWeight: '700',
            }}
          >
            <span>
              Action: {activeStep.actionType.toUpperCase()} ({activeStep.targetComponentId})
            </span>
            <span style={{ color: '#cbd5e1' }}>Duration: {activeStep.durationMs} ms</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.8125rem', marginTop: '0.5rem', margin: 0 }}>
            Cognitive Reasoning: {activeStep.reasoning}
          </p>
        </div>
      )}
    </div>
  );
}
