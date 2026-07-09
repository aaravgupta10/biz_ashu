# Utility Engine

Version: 1.0

Status: Draft

Owner: Runtime Intelligence Team

Dependencies:
- execution-engine.md
- state-manager.md
- perception-engine.md
- semantic-analysis-service.md

Used By:
- Execution Engine
- Action Engine
- Behavioral Inference Engine

---

# Purpose

The Utility Engine evaluates candidate actions and estimates their expected subjective utility for the current synthetic human.

It is responsible for action evaluation rather than action execution.

Given a set of possible actions and the current runtime state, the Utility Engine produces an ordered ranking of actions together with supporting evidence and confidence.

---

# Philosophy

The Utility Engine does not ask

"What can the user do?"

It asks

"Given who this user is, what is the most valuable thing to do next?"

Utility is subjective.

Different synthetic humans assign different utilities to identical actions.

---

# Design Principles

The Utility Engine must be

Deterministic

Model Agnostic

Explainable

Replayable

Evidence Based

Versioned

Composable

Extensible

---

# Responsibilities

The Utility Engine is responsible for

Action evaluation

Utility estimation

Action ranking

Constraint filtering

Decision evidence generation

Confidence estimation

Expected outcome estimation

The Utility Engine is not responsible for

Action generation

Action execution

State management

Perception

Memory

Semantic reasoning

Recommendations

---

# High-Level Pipeline

Runtime State

+

Candidate Actions

+

Semantic Graph

↓

Context Assembly

↓

Utility Evaluation

↓

Constraint Filtering

↓

Action Ranking

↓

Utility Package

---

# Utility Model

Every candidate action receives a utility estimate.

The estimate reflects the expected subjective value of performing that action under the current conditions.

Utility is always contextual.

---

# Inputs

The Utility Engine receives

Current Runtime State

Candidate Actions

Current Goals

Memory State

Attention State

Emotional State

Semantic Graph

Environment State

Behavior Model

Execution Context

---

# Evaluation Pipeline

Candidate Actions

↓

Context Enrichment

↓

Feature Extraction

↓

Utility Estimation

↓

Constraint Validation

↓

Ranking

↓

Confidence Evaluation

↓

Utility Package

---

# Utility Factors

Utility estimation may consider

Goal alignment

Expected reward

Expected effort

Trust

Risk

Curiosity

Attention cost

Memory

Novelty

Familiarity

Information value

Uncertainty reduction

Time cost

Interaction cost

User preferences

Behavior model parameters

The weighting of these factors is defined by the behavioral model, not by the Utility Engine itself.

---

# Candidate Actions

Typical actions include

Click

Scroll

Read

Hover

Navigate

Expand

Collapse

Compare

Search

Wait

Exit

The Utility Engine evaluates actions without modifying them.

---

# Constraints

Actions may be rejected due to

Inaccessibility

Invalid state

Missing target

Interaction rules

Execution limits

Goal conflicts

Filtered actions remain visible in diagnostics.

---

# Utility Score

Every evaluated action records

Action ID

Utility Score

Confidence

Supporting Factors

Constraint Status

Evaluation Timestamp

Behavior Model Version

Scores are relative within the current decision context.

---

# Ranking

Candidate actions are ranked by estimated utility.

Ranking preserves

Utility score

Confidence

Evaluation metadata

Supporting evidence

Alternative actions

The ranking itself is deterministic.

---

# Confidence

Every utility estimate records

Confidence

Evidence

Behavior Model

Supporting observations

State dependencies

Confidence reflects certainty in the estimate rather than action quality.

---

# Decision Evidence

Every utility estimate records why it received its score.

Examples

Pricing aligns with current goal.

↓

High utility

CTA requires higher trust than currently available.

↓

Reduced utility

FAQ reduces uncertainty.

↓

Moderate utility

Evidence enables explainable simulation.

---

# Utility Package

The Utility Engine emits

Ranked Actions

Utility Scores

Confidence

Decision Evidence

Evaluation Metadata

Constraint Report

Execution Metadata

The Utility Package becomes the input to the Action Engine.

---

# Validation

Validation verifies

Candidate validity

Behavior model compatibility

Schema integrity

Constraint consistency

Version compatibility

Invalid evaluations are rejected.

---

# Replay Support

Replay reconstructs

Candidate actions

Utility scores

Ranking

Decision evidence

Confidence

Replay produces identical rankings for identical inputs.

---

# Metrics

The Utility Engine records

Evaluations

Average evaluation latency

Average candidate count

Ranking stability

Confidence distribution

Constraint violations

Evaluation cost

Behavior model usage

---

# Runtime Invariants

The following rules must never be violated.

The Utility Engine never generates actions.

The Utility Engine never executes actions.

Every score references supporting evidence.

Every evaluation is deterministic for identical inputs.

Utility scores are model dependent.

Rankings are reproducible.

---

# Platform Guarantees

The Utility Engine guarantees

Deterministic evaluation

Replayability

Model independence

Structured outputs

Evidence-backed scores

Version compatibility

Explainable rankings

---

# Future Extensions

Potential future capabilities include

Multi-objective optimization

Bounded rationality models

Prospect theory utilities

Dynamic risk sensitivity

Temporal discounting

Social utility models

Cognitive bias modules

Reinforcement learning integration

---

# Summary

The Utility Engine is the decision evaluation subsystem of the Behavioral Intelligence Platform.

By transforming candidate actions into explainable utility rankings, it provides the bridge between perception and action while remaining independent of action generation, execution, and behavioral reasoning.

This separation enables flexible behavioral models, reproducible simulations, and transparent decision-making across diverse synthetic user populations.