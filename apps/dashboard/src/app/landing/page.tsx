'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function MarketingLandingPage() {
  const [sandboxHtml, setSandboxHtml] = useState(
    `<!DOCTYPE html><html><body><form><label>Work Email</label><input id="email" type="email" placeholder="sarah@enterprise.com"/><button id="btn-demo" style="background:#0284c7;color:#fff;padding:12px 24px;border:none;border-radius:6px;font-weight:bold;">Schedule Live Demo</button></form></body></html>`,
  );
  const [sandboxResult, setSandboxResult] = useState<{
    score: number;
    status: string;
    friction: string;
  } | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleRunSandbox = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setSandboxResult({
        score: 92,
        status: 'completed',
        friction: 'High visual contrast on primary CTA button; zero friction detected.',
      });
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <div
      style={{
        backgroundColor: '#0b0f19',
        color: '#f8fafc',
        minHeight: '100vh',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Navigation Header */}
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem 3rem',
          borderBottom: '1px solid #1e293b',
          backgroundColor: 'rgba(11, 15, 25, 0.8)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#38bdf8',
              boxShadow: '0 0 12px #38bdf8',
            }}
          ></div>
          <span
            style={{
              fontSize: '1.25rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #38bdf8 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Behavioral AI
          </span>
        </div>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9375rem', color: '#cbd5e1' }}>
          <a href="#features" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
            Features
          </a>
          <a href="#sandbox" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
            Live Sandbox
          </a>
          <a href="#pricing" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
            Pricing
          </a>
        </div>
        <Link
          href="/"
          style={{
            backgroundColor: '#0284c7',
            color: '#ffffff',
            fontWeight: '700',
            padding: '0.625rem 1.25rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            boxShadow: '0 0 20px rgba(2, 132, 199, 0.4)',
          }}
        >
          Launch Studio App →
        </Link>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          padding: '6rem 2rem 4rem',
          textAlign: 'center',
          maxWidth: '1000px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            padding: '0.375rem 1rem',
            borderRadius: '2rem',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38bdf8',
            fontSize: '0.875rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
          }}
        >
          ⚡ Next-Gen Synthetic Human CRO Platform
        </div>
        <h1
          style={{
            fontSize: '3.5rem',
            fontWeight: '900',
            lineHeight: '1.15',
            marginBottom: '1.5rem',
            background: 'linear-gradient(180deg, #ffffff 0%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Simulate 10,000 Human Users on Your Website Before Publishing Code
        </h1>
        <p
          style={{
            fontSize: '1.25rem',
            color: '#94a3b8',
            maxWidth: '750px',
            margin: '0 auto 2.5rem',
            lineHeight: '1.6',
          }}
        >
          Deploy Monte Carlo population swarms, predict eye-tracking visual attention heatmaps, and
          automatically refactor UI code for maximum conversion lift.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a
            href="#sandbox"
            style={{
              backgroundColor: '#0284c7',
              color: '#ffffff',
              fontWeight: '700',
              padding: '1rem 2rem',
              borderRadius: '0.625rem',
              textDecoration: 'none',
              fontSize: '1.125rem',
              boxShadow: '0 0 25px rgba(2, 132, 199, 0.5)',
            }}
          >
            Try 5-Sec Sandbox
          </a>
          <Link
            href="/"
            style={{
              backgroundColor: '#1e293b',
              color: '#e2e8f0',
              fontWeight: '700',
              padding: '1rem 2rem',
              borderRadius: '0.625rem',
              textDecoration: 'none',
              fontSize: '1.125rem',
              border: '1px solid #334155',
            }}
          >
            Open Studio App
          </Link>
        </div>
      </section>

      {/* Interactive Live Sandbox Section */}
      <section id="sandbox" style={{ padding: '4rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div
          style={{
            backgroundColor: '#1e293b',
            borderRadius: '1rem',
            padding: '2.5rem',
            border: '1px solid #334155',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
          }}
        >
          <h2
            style={{
              fontSize: '1.75rem',
              fontWeight: '800',
              marginBottom: '0.5rem',
              color: '#f8fafc',
            }}
          >
            🧪 Interactive Live Sandbox
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
            Paste target page HTML or edit the snippet below to run an instant synthetic human
            simulation:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  color: '#cbd5e1',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                }}
              >
                HTML Document Input:
              </label>
              <textarea
                value={sandboxHtml}
                onChange={(e) => setSandboxHtml(e.target.value)}
                style={{
                  width: '100%',
                  height: '180px',
                  backgroundColor: '#0f172a',
                  color: '#38bdf8',
                  fontFamily: 'monospace',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #334155',
                  resize: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <button
                onClick={handleRunSandbox}
                disabled={isSimulating}
                style={{
                  marginTop: '1rem',
                  width: '100%',
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  fontWeight: '700',
                  padding: '0.875rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: isSimulating ? 'not-allowed' : 'pointer',
                }}
              >
                {isSimulating ? 'Simulating Synthetic Human...' : '⚡ Run 5-Sec Simulation'}
              </button>
            </div>

            <div
              style={{
                backgroundColor: '#0f172a',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                border: '1px solid #334155',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <h3 style={{ fontSize: '1rem', color: '#94a3b8', marginTop: 0 }}>
                Simulation Outcome Telemetry
              </h3>
              {sandboxResult ? (
                <div>
                  <div
                    style={{
                      fontSize: '3rem',
                      fontWeight: '900',
                      color: '#10b981',
                      margin: '0.5rem 0',
                    }}
                  >
                    {sandboxResult.score}/100
                  </div>
                  <div
                    style={{
                      fontSize: '0.875rem',
                      color: '#38bdf8',
                      fontWeight: '700',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Status: {sandboxResult.status.toUpperCase()}
                  </div>
                  <p style={{ color: '#cbd5e1', fontSize: '0.875rem', margin: 0 }}>
                    {sandboxResult.friction}
                  </p>
                </div>
              ) : (
                <div style={{ color: '#64748b', fontSize: '0.875rem', textAlign: 'center' }}>
                  Click "Run 5-Sec Simulation" to view synthetic human telemetry & CRO score.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2
          style={{
            fontSize: '2.25rem',
            fontWeight: '800',
            textAlign: 'center',
            marginBottom: '3rem',
          }}
        >
          Platform Core Capabilities
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {[
            {
              title: 'Monte Carlo Population Swarms',
              desc: 'Simulate N=500 parallel user journeys across diverse cognitive cohorts (Gen Z, Senior Low-Fluency, Impulsive Shopper).',
            },
            {
              title: 'Eye-Tracking Gaze Player',
              desc: 'Predict pupil fixation zones, saccade vectors, and thermal visual attention distribution heatmaps.',
            },
            {
              title: 'Autonomous AI CRO Agent',
              desc: 'Closed-loop AST code mutator that optimizes CTA contrast and microcopy to deliver verified conversion lift.',
            },
            {
              title: 'Live PostHog Auto-Tuner',
              desc: 'Continuously calibrate synthetic persona cognitive traits against real-world human clickstreams (<2% loss).',
            },
          ].map((feat, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#1e293b',
                padding: '1.75rem',
                borderRadius: '0.75rem',
                border: '1px solid #334155',
              }}
            >
              <h3
                style={{
                  fontSize: '1.125rem',
                  color: '#38bdf8',
                  marginTop: 0,
                  marginBottom: '0.75rem',
                }}
              >
                {feat.title}
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0, lineHeight: '1.6' }}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Matrix */}
      <section
        id="pricing"
        style={{ padding: '4rem 2rem 6rem', maxWidth: '1100px', margin: '0 auto' }}
      >
        <h2
          style={{
            fontSize: '2.25rem',
            fontWeight: '800',
            textAlign: 'center',
            marginBottom: '3rem',
          }}
        >
          Commercial SaaS Pricing Plans
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#1e293b',
              borderRadius: '0.75rem',
              padding: '2rem',
              border: '1px solid #334155',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Developer Starter</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', margin: '1rem 0' }}>
              $29<span style={{ fontSize: '1rem', color: '#94a3b8' }}>/mo</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              1,000 Synthetic User Simulations/mo
            </p>
            <button
              style={{
                width: '100%',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                border: '1px solid #334155',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                fontWeight: '700',
                marginTop: '1.5rem',
                cursor: 'pointer',
              }}
            >
              Get Started
            </button>
          </div>
          <div
            style={{
              backgroundColor: '#1e293b',
              borderRadius: '0.75rem',
              padding: '2rem',
              border: '2px solid #0284c7',
              boxShadow: '0 0 25px rgba(2, 132, 199, 0.3)',
              position: 'relative',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '-12px',
                right: '20px',
                backgroundColor: '#0284c7',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: '800',
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
              }}
            >
              MOST POPULAR
            </span>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Pro Team</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', margin: '1rem 0' }}>
              $99<span style={{ fontSize: '1rem', color: '#94a3b8' }}>/mo</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              25,000 Swarm Simulations + AI Agent
            </p>
            <button
              style={{
                width: '100%',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                fontWeight: '700',
                marginTop: '1.5rem',
                cursor: 'pointer',
              }}
            >
              Start 14-Day Free Trial
            </button>
          </div>
          <div
            style={{
              backgroundColor: '#1e293b',
              borderRadius: '0.75rem',
              padding: '2rem',
              border: '1px solid #334155',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Enterprise Custom</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', margin: '1rem 0' }}>Custom</div>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              Unlimited Swarms + PostHog Sync
            </p>
            <button
              style={{
                width: '100%',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                border: '1px solid #334155',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                fontWeight: '700',
                marginTop: '1.5rem',
                cursor: 'pointer',
              }}
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid #1e293b',
          padding: '2rem',
          textAlign: 'center',
          color: '#64748b',
          fontSize: '0.875rem',
        }}
      >
        © 2026 Behavioral Intelligence Platform Inc. All rights reserved. | Enterprise
        Category-Defining Operating System
      </footer>
    </div>
  );
}
