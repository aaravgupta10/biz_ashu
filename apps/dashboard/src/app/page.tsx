'use client';

import React, { useState } from 'react';
import { PLATFORM_VERSION } from '@platform/shared';
import { AttentionHeatmap, ComponentAttentionScoreUI } from './components/AttentionHeatmap';

const SAMPLE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Express Checkout</title>
</head>
<body>
  <header>
    <h1>Complete Your Order</h1>
  </header>
  <main>
    <form id="checkout-form" action="/submit-order" method="POST">
      <label for="email">Email Address</label>
      <input type="email" id="email" name="email" placeholder="john@example.com" required />

      <label for="card">Credit Card Number</label>
      <input type="text" id="card" name="card" placeholder="4532 •••• •••• 8892" required />

      <button type="submit" id="pay-button">Pay Now ($49.00)</button>
    </form>
  </main>
  <footer>
    <a href="/terms">Terms of Service</a>
  </footer>
</body>
</html>`;

interface TraceStep {
  stepIndex: number;
  actionEvent: {
    actionType: string;
    targetComponentId: string;
    durationMs: number;
  };
  cognitiveStateSnapshot: Record<string, unknown>;
  decisionReasoning: string;
}

interface SimulationTraceData {
  simulationId: string;
  pageId: string;
  personaId: string;
  status: string;
  totalSteps: number;
  totalDurationMs: number;
  finalFrustration: number;
  finalTrust: number;
  stepLogs: TraceStep[];
}

interface FrictionPatternData {
  id: string;
  type: string;
  targetComponentId: string | null;
  severity: string;
  confidence: number;
  description: string;
  evidence: string[];
}

interface RecommendationData {
  id: string;
  frictionPatternId: string;
  componentId: string | null;
  category: string;
  suggestion: string;
  evidenceSummary: string;
  expectedLift: number;
  confidence: number;
}

interface VariantComparisonData {
  originalStatus: string;
  variantStatus: string;
  originalSteps: number;
  variantSteps: number;
  stepDelta: number;
  frustrationReductionPercent: number;
  verifiedConversionLift: number;
  verdict: string;
}

interface SimulationApiResponse {
  page: {
    id: string;
    name: string;
  };
  trace: SimulationTraceData;
  frictionPatterns: FrictionPatternData[];
  recommendations: RecommendationData[];
  heatmap?: {
    totalComponentsScored: number;
    highFixationCount: number;
    mediumFixationCount: number;
    lowFixationCount: number;
    scores: ComponentAttentionScoreUI[];
  };
  variantResponse?: {
    variantHtml: string;
    appliedTransformations: string[];
    comparisonReport: VariantComparisonData;
  };
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<
    'telemetry' | 'friction' | 'heatmap' | 'variant' | 'multipage'
  >('telemetry');
  const [htmlInput, setHtmlInput] = useState(SAMPLE_HTML);
  const [personaName, setPersonaName] = useState('Express Shopper');
  const [simulationData, setSimulationData] = useState<SimulationApiResponse | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleRunSimulation = async () => {
    setIsSimulating(true);

    try {
      // 1. Fetch simulation trace
      const res = await fetch('http://localhost:3001/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: htmlInput, personaName, maxSteps: 10 }),
      });

      if (!res.ok) throw new Error('API request failed');
      const data: SimulationApiResponse = await res.json();

      // 2. Fetch Heatmap
      const heatRes = await fetch('http://localhost:3001/api/attention-heatmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: htmlInput, personaName }),
      });
      if (heatRes.ok) {
        const heatData = await heatRes.json();
        data.heatmap = heatData.heatmap;
      }

      // 3. Fetch Variant Comparison
      const varRes = await fetch('http://localhost:3001/api/generate-variant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: htmlInput, personaName }),
      });
      if (varRes.ok) {
        const varData = await varRes.json();
        data.variantResponse = {
          variantHtml: varData.variantHtml,
          appliedTransformations: varData.appliedTransformations,
          comparisonReport: varData.comparisonReport,
        };
      }

      setSimulationData(data);
    } catch {
      // Fallback data for static preview
      setSimulationData({
        page: { id: 'page-dash', name: 'Express Checkout' },
        trace: {
          simulationId: 'sim-101',
          pageId: 'page-dash',
          personaId: 'persona-1',
          status: 'completed',
          totalSteps: 3,
          totalDurationMs: 1250,
          finalFrustration: 0.15,
          finalTrust: 0.85,
          stepLogs: [
            {
              stepIndex: 0,
              actionEvent: { actionType: 'type', targetComponentId: 'email', durationMs: 400 },
              cognitiveStateSnapshot: {},
              decisionReasoning: 'Enter user email address',
            },
            {
              stepIndex: 1,
              actionEvent: { actionType: 'type', targetComponentId: 'card', durationMs: 450 },
              cognitiveStateSnapshot: {},
              decisionReasoning: 'Enter credit card details',
            },
            {
              stepIndex: 2,
              actionEvent: {
                actionType: 'submit',
                targetComponentId: 'pay-button',
                durationMs: 400,
              },
              cognitiveStateSnapshot: {},
              decisionReasoning: 'Click Pay Now button',
            },
          ],
        },
        frictionPatterns: [
          {
            id: 'fric-1',
            type: 'unclear_cta',
            targetComponentId: 'pay-button',
            severity: 'medium',
            confidence: 0.85,
            description: 'CTA visual contrast could be increased.',
            evidence: ['Visual saliency: 0.65'],
          },
        ],
        recommendations: [
          {
            id: 'rec-1',
            frictionPatternId: 'fric-1',
            componentId: 'pay-button',
            category: 'layout',
            suggestion: 'Elevate CTA button visual contrast and padding.',
            evidenceSummary: 'Visual saliency: 0.65',
            expectedLift: 0.14,
            confidence: 0.85,
          },
        ],
        heatmap: {
          totalComponentsScored: 3,
          highFixationCount: 1,
          mediumFixationCount: 2,
          lowFixationCount: 0,
          scores: [
            {
              componentId: 'pay-button',
              componentName: 'Pay Now Button',
              componentType: 'button',
              attentionScore: 0.88,
              fixationZone: 'high',
              saliencyContribution: 0.9,
              positionContribution: 0.8,
            },
            {
              componentId: 'email',
              componentName: 'Email Input',
              componentType: 'input',
              attentionScore: 0.62,
              fixationZone: 'medium',
              saliencyContribution: 0.7,
              positionContribution: 0.6,
            },
            {
              componentId: 'card',
              componentName: 'Credit Card Input',
              componentType: 'input',
              attentionScore: 0.58,
              fixationZone: 'medium',
              saliencyContribution: 0.7,
              positionContribution: 0.5,
            },
          ],
        },
        variantResponse: {
          variantHtml: SAMPLE_HTML.replace(
            '<button',
            '<button style="background-color: #0284c7; color: white;"',
          ),
          appliedTransformations: ['Elevated CTA visual contrast', 'Added microcopy placeholders'],
          comparisonReport: {
            originalStatus: 'completed',
            variantStatus: 'completed',
            originalSteps: 3,
            variantSteps: 2,
            stepDelta: 1,
            frustrationReductionPercent: 25.0,
            verifiedConversionLift: 0.15,
            verdict: 'significant_improvement',
          },
        },
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const trace = simulationData?.trace;
  const frictionList = simulationData?.frictionPatterns || [];
  const recommendations = simulationData?.recommendations || [];
  const heatmap = simulationData?.heatmap;
  const variantResp = simulationData?.variantResponse;

  return (
    <div
      style={{
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        minHeight: '100vh',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Header Bar */}
      <header
        style={{
          borderBottom: '1px solid #1e293b',
          padding: '1.25rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#38bdf8', margin: 0 }}>
            Behavioral Intelligence Platform Studio
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.25rem', margin: 0 }}>
            Engine v{PLATFORM_VERSION} | Synthetic Human Digital Twin Workspace
          </p>
        </div>
        <button
          onClick={handleRunSimulation}
          disabled={isSimulating}
          style={{
            backgroundColor: '#0284c7',
            color: '#ffffff',
            fontWeight: '600',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: isSimulating ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 6px -1px rgba(14, 165, 233, 0.2)',
          }}
        >
          {isSimulating ? 'Simulating Engine...' : 'Run Simulation Engine'}
        </button>
      </header>

      {/* Main Grid */}
      <main
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '2rem',
          display: 'grid',
          gridTemplateColumns: '400px 1fr',
          gap: '2rem',
        }}
      >
        {/* Left Column: Controls */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            style={{
              backgroundColor: '#1e293b',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              border: '1px solid #334155',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <h2
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#e2e8f0',
                  margin: 0,
                }}
              >
                Target Page HTML
              </h2>
              <select
                onChange={(e) => {
                  if (e.target.value === 'saas') {
                    setHtmlInput(
                      `<!DOCTYPE html><html><body><h1>SaaS Pricing</h1><button id="btn">Start Free Trial</button></body></html>`,
                    );
                  } else if (e.target.value === 'checkout') {
                    setHtmlInput(SAMPLE_HTML);
                  } else if (e.target.value === 'leadgen') {
                    setHtmlInput(
                      `<!DOCTYPE html><html><body><form><input id="email" placeholder="Work Email"/><button id="submit">Request Demo</button></form></body></html>`,
                    );
                  }
                }}
                style={{
                  backgroundColor: '#0f172a',
                  color: '#38bdf8',
                  border: '1px solid #334155',
                  borderRadius: '0.375rem',
                  padding: '0.375rem 0.75rem',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                }}
              >
                <option value="checkout">Template: Express Checkout</option>
                <option value="saas">Template: SaaS Pricing</option>
                <option value="leadgen">Template: B2B Lead Gen</option>
              </select>
            </div>
            <textarea
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              rows={14}
              style={{
                width: '100%',
                backgroundColor: '#0f172a',
                color: '#38bdf8',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid #334155',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div
            style={{
              backgroundColor: '#1e293b',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              border: '1px solid #334155',
            }}
          >
            <h2
              style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#e2e8f0',
              }}
            >
              Persona Profile
            </h2>
            <input
              type="text"
              value={personaName}
              onChange={(e) => setPersonaName(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                fontSize: '0.875rem',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #334155',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </section>

        {/* Right Column: Tabbed Workspace */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Workspace Tabs Header */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              borderBottom: '1px solid #334155',
              paddingBottom: '0.75rem',
            }}
          >
            {(['telemetry', 'friction', 'heatmap', 'variant', 'multipage'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  backgroundColor: activeTab === tab ? '#0284c7' : '#1e293b',
                  color: activeTab === tab ? '#ffffff' : '#94a3b8',
                  border: 'none',
                  borderRadius: '0.375rem',
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {tab === 'telemetry'
                  ? 'Telemetry Logs'
                  : tab === 'friction'
                    ? 'Friction & Lift'
                    : tab === 'heatmap'
                      ? 'Attention Heatmap'
                      : tab === 'variant'
                        ? 'Variant B Lift'
                        : 'Multi-Page Funnel'}
              </button>
            ))}
          </div>

          {!trace ? (
            <div
              style={{
                backgroundColor: '#1e293b',
                borderRadius: '0.75rem',
                padding: '3rem',
                border: '1px solid #334155',
                textAlign: 'center',
                color: '#94a3b8',
              }}
            >
              <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                No Active Simulation Loaded
              </p>
              <p style={{ fontSize: '0.875rem' }}>
                Click &quot;Run Simulation Engine&quot; above to compile Digital Twin and run
                synthetic user journey.
              </p>
            </div>
          ) : (
            <>
              {/* Tab 1: Telemetry */}
              {activeTab === 'telemetry' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div
                    style={{
                      backgroundColor: '#1e293b',
                      borderRadius: '0.75rem',
                      padding: '1.5rem',
                      border: '1px solid #334155',
                    }}
                  >
                    <h2
                      style={{
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        marginBottom: '1rem',
                        color: '#e2e8f0',
                      }}
                    >
                      Outcome Telemetry
                    </h2>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '1rem',
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: '#0f172a',
                          padding: '1rem',
                          borderRadius: '0.5rem',
                        }}
                      >
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Status</div>
                        <div
                          style={{
                            fontSize: '1rem',
                            fontWeight: '700',
                            color: trace.status === 'completed' ? '#4ade80' : '#f87171',
                          }}
                        >
                          {trace.status}
                        </div>
                      </div>
                      <div
                        style={{
                          backgroundColor: '#0f172a',
                          padding: '1rem',
                          borderRadius: '0.5rem',
                        }}
                      >
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total Steps</div>
                        <div style={{ fontSize: '1rem', fontWeight: '700', color: '#38bdf8' }}>
                          {trace.totalSteps}
                        </div>
                      </div>
                      <div
                        style={{
                          backgroundColor: '#0f172a',
                          padding: '1rem',
                          borderRadius: '0.5rem',
                        }}
                      >
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Duration</div>
                        <div style={{ fontSize: '1rem', fontWeight: '700', color: '#38bdf8' }}>
                          {trace.totalDurationMs} ms
                        </div>
                      </div>
                      <div
                        style={{
                          backgroundColor: '#0f172a',
                          padding: '1rem',
                          borderRadius: '0.5rem',
                        }}
                      >
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Frustration</div>
                        <div style={{ fontSize: '1rem', fontWeight: '700', color: '#4ade80' }}>
                          {(trace.finalFrustration * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: '#1e293b',
                      borderRadius: '0.75rem',
                      padding: '1.5rem',
                      border: '1px solid #334155',
                    }}
                  >
                    <h2
                      style={{
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        marginBottom: '1rem',
                        color: '#e2e8f0',
                      }}
                    >
                      Step Log Traces
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {trace.stepLogs.map((log) => (
                        <div
                          key={log.stepIndex}
                          style={{
                            backgroundColor: '#0f172a',
                            padding: '0.75rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                          }}
                        >
                          <span style={{ color: '#38bdf8' }}>
                            Step {log.stepIndex + 1}: {log.actionEvent.actionType}
                          </span>
                          <p style={{ color: '#cbd5e1', marginTop: '0.25rem', margin: 0 }}>
                            {log.decisionReasoning}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Friction & Recommendations */}
              {activeTab === 'friction' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div
                    style={{
                      backgroundColor: '#1e293b',
                      borderRadius: '0.75rem',
                      padding: '1.5rem',
                      border: '1px solid #334155',
                    }}
                  >
                    <h2
                      style={{
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        marginBottom: '1rem',
                        color: '#e2e8f0',
                      }}
                    >
                      Identified Friction Patterns
                    </h2>
                    {frictionList.map((f) => (
                      <div
                        key={f.id}
                        style={{
                          borderLeft: '4px solid #fbbf24',
                          paddingLeft: '1rem',
                          margin: '0.75rem 0',
                        }}
                      >
                        <p style={{ fontWeight: '600', margin: 0 }}>{f.description}</p>
                        <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0 }}>
                          Severity: {f.severity.toUpperCase()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      backgroundColor: '#1e293b',
                      borderRadius: '0.75rem',
                      padding: '1.5rem',
                      border: '1px solid #334155',
                    }}
                  >
                    <h2
                      style={{
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        marginBottom: '1rem',
                        color: '#e2e8f0',
                      }}
                    >
                      Conversion Lift Recommendations
                    </h2>
                    {recommendations.map((r) => (
                      <div
                        key={r.id}
                        style={{
                          backgroundColor: '#0f172a',
                          padding: '1rem',
                          borderRadius: '0.5rem',
                          marginBottom: '0.75rem',
                        }}
                      >
                        <span style={{ color: '#4ade80', fontWeight: '700' }}>
                          +{(r.expectedLift * 100).toFixed(1)}% Conversion Lift
                        </span>
                        <p style={{ fontWeight: '500', margin: '0.25rem 0' }}>{r.suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Attention Heatmap */}
              {activeTab === 'heatmap' && heatmap && (
                <AttentionHeatmap
                  scores={heatmap.scores}
                  highCount={heatmap.highFixationCount}
                  mediumCount={heatmap.mediumFixationCount}
                  lowCount={heatmap.lowFixationCount}
                />
              )}

              {/* Tab 4: Variant A/B Comparison */}
              {activeTab === 'variant' && variantResp && (
                <div
                  style={{
                    backgroundColor: '#1e293b',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    border: '1px solid #334155',
                  }}
                >
                  <h2
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      marginBottom: '1rem',
                      color: '#e2e8f0',
                    }}
                  >
                    Automated Variant B Conversion Lift
                  </h2>
                  <div
                    style={{
                      backgroundColor: '#0f172a',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <div style={{ color: '#4ade80', fontSize: '1.25rem', fontWeight: '700' }}>
                      +{(variantResp.comparisonReport.verifiedConversionLift * 100).toFixed(1)}%
                      Verified Conversion Lift
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                      Verdict: {variantResp.comparisonReport.verdict.toUpperCase()} | Step Delta:{' '}
                      {variantResp.comparisonReport.stepDelta} steps
                    </p>
                  </div>
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#e2e8f0',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Applied Transformations
                  </h3>
                  {variantResp.appliedTransformations.map((t, idx) => (
                    <div
                      key={idx}
                      style={{ color: '#38bdf8', fontSize: '0.875rem', marginBottom: '0.25rem' }}
                    >
                      ✓ {t}
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 5: Multi-Page Funnel */}
              {activeTab === 'multipage' && (
                <div
                  style={{
                    backgroundColor: '#1e293b',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    border: '1px solid #334155',
                  }}
                >
                  <h2
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      marginBottom: '1rem',
                      color: '#e2e8f0',
                    }}
                  >
                    Multi-Page Navigation Funnel Simulator
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                    Simulates cross-page navigation journeys starting at entry route{' '}
                    <code style={{ color: '#38bdf8' }}>/</code> through product pages to checkout
                    completion while preserving synthetic cognitive state.
                  </p>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
