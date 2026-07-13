# Attention Engine

Version: 1.0

Status: Draft

Owner: Runtime Intelligence Team

Dependencies:
- execution-engine.md
- state-manager.md
- memory-system.md
- semantic-analysis-service.md

Used By:
- Perception Engine
- Utility Engine
- Behavior Trace
- State Manager

---

# Purpose

The Attention Engine is responsible for allocating limited cognitive resources across the Digital Twin during simulation.

Rather than allowing every visible object to receive equal processing, the Attention Engine determines which objects receive attention, how much attention they receive, and how attention evolves over time.

Attention acts as the gateway between observation and perception.

---

# Philosophy

Synthetic humans cannot process everything simultaneously.

Attention is a limited resource.

Objects compete for attention.

Goals, memory, emotion, novelty, and visual salience influence this competition.

The Attention Engine models this competition in a deterministic manner.

---

# Design Principles

The Attention Engine must be

Deterministic

Budget Limited

Replayable

State Aware

Explainable

Model Agnostic

Versioned

Incremental

---

# Responsibilities

The Attention Engine is responsible for

Attention allocation

Attention budgeting

Focus selection

Attention transitions

Attention persistence

Attention decay

Attention metrics

The Attention Engine is not responsible for

Visual observation

Semantic reasoning

Action selection

State management

Recommendations

Behavioral inference

---

# High-Level Pipeline

Visible Objects

↓

Attention Candidates

↓

Salience Evaluation

↓

Goal Bias

↓

Memory Bias

↓

Emotion Bias

↓

Attention Allocation

↓

Focus Selection

↓

Attention State

---

# Attention Budget

Every synthetic human possesses a finite attention budget.

The budget represents available cognitive resources for the current execution tick.

Attention cannot exceed the available budget.

Allocation is normalized across all candidates.

---

# Attention Candidates

Candidates include every currently perceivable object.

Examples

Buttons

Headlines

Pricing

Images

Navigation

Forms

Testimonials

Popups

Notifications

Hidden objects are not candidates.

---

# Attention Factors

Attention allocation may consider

Visual salience

Goal relevance

Current task

Novelty

Motion

Contrast

Size

Position

Memory associations

Emotional significance

Trust signals

Current cognitive load

The weighting of these factors is defined by the behavior model.

---

# Bottom-Up Attention

Bottom-up attention is stimulus-driven.

Examples

Animation

Bright colors

Large elements

Movement

High contrast

Unexpected changes

Bottom-up attention is independent of goals.

---

# Top-Down Attention

Top-down attention is goal-driven.

Examples

Finding pricing

Searching documentation

Looking for signup

Comparing plans

Reading reviews

Goals bias attention allocation.

---

# Memory Bias

Previously encoded memories influence future attention.

Examples

Recently viewed pricing

Previously ignored CTA

Remembered trust signal

Memory strengthens or weakens attention allocation.

---

# Emotional Bias

Current emotional state influences attention.

Examples

Low trust

↓

Security badges become more salient.

High curiosity

↓

Feature descriptions receive more attention.

Frustration

↓

Exit options receive more attention.

---

# Attention Allocation

Each candidate receives

Attention Weight

Confidence

Supporting Factors

Allocation Timestamp

Attention weights are normalized.

---

# Focus

Focus represents the highest-priority object receiving attention.

Only one object may occupy primary focus during a tick.

Focus may persist across multiple ticks.

---

# Attention Persistence

Attention may continue across ticks.

Persistence depends upon

Task relevance

Information density

Reading progress

Goal alignment

Cognitive load

Persistent attention reduces unnecessary context switching.

---

# Attention Shift

Attention shifts occur when

Goals change

New stimuli appear

Current object is exhausted

Interruptions occur

Environment changes

Every shift becomes an event.

---

# Attention Decay

Attention naturally decreases over time.

Decay depends upon

Time

Novelty

Completion

Repetition

Competing stimuli

Objects eventually lose attention if not reinforced.

---

# Attention State

The Attention Engine updates

Focused Object

Attention Distribution

Ignored Objects

Attention History

Remaining Budget

Current Salience Map

Attention State is owned by the State Manager.

---

# Attention Package

The engine emits

Attention Distribution

Focused Object

Attention Scores

Attention Evidence

Attention Events

Execution Metadata

The package becomes input to the Perception Engine.

---

# Validation

Validation verifies

Budget consistency

Object visibility

Allocation normalization

Schema compliance

Version compatibility

Invalid allocations are rejected.

---

# Replay Support

Replay reconstructs

Attention allocations

Focus transitions

Attention shifts

Budget usage

Attention history

Replay produces identical attention evolution.

---

# Metrics

The Attention Engine records

Attention shifts

Average focus duration

Attention entropy

Budget utilization

Ignored objects

Focus transitions

Allocation latency

Salience distribution

---

# Runtime Invariants

The following rules must never be violated.

Attention budget is finite.

Only visible objects receive attention.

Only one object may hold primary focus per tick.

Attention allocation is normalized.

Attention changes only through the Attention Engine.

Every attention shift is recorded.

Replay reconstructs identical attention evolution.

---

# Platform Guarantees

The Attention Engine guarantees

Deterministic allocation

Replayability

Explainable attention

Budget awareness

Version compatibility

Model independence

Structured outputs

---

# Future Extensions

Potential future capabilities include

Eye movement simulation

Peripheral vision

Multi-focus attention

Task switching costs

Visual search models

Attentional blindness

Change blindness

Biologically inspired attention models

---

# Summary

The Attention Engine models how synthetic humans allocate limited cognitive resources while interacting with Digital Twins.

By controlling what receives processing resources—and what is ignored—it provides the cognitive bottleneck that makes simulations more realistic, explainable, and representative of human behavior rather than idealized optimization.