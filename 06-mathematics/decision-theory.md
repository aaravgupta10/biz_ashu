# Decision Theory

Version: 1.0

Status: Draft

Owner: Behavioral Science Team

Dependencies:
- utility-function.md
- decision-model.md
- trust-equations.md
- belief-update.md

Used By:
- Decision Model
- Simulation Runtime
- Action Engine
- Replay Engine

---

# Purpose

The Decision Theory model defines how a Synthetic Human selects one action from a set of candidate actions based on their computed utility and current cognitive state.

Rather than assuming perfectly rational optimization, the model represents boundedly rational decision making that remains deterministic, explainable, and calibratable.

---

# Philosophy

Utility estimates value.

Decision Theory selects actions.

Decision making is influenced by

- utility
- trust
- risk
- uncertainty
- emotion
- behavior policy

No single factor determines behavior.

---

# Design Principles

The Decision Theory model must be

Deterministic

Explainable

Composable

Replayable

Calibratable

Versioned

Behaviorally Grounded

---

# Responsibilities

The Decision Theory model is responsible for

Action selection

Decision confidence estimation

Tie resolution

Decision stability

Decision explanation

Validation

The Decision Theory model is not responsible for

Utility computation

Attention allocation

Belief updates

Action execution

Simulation orchestration

---

# High-Level Pipeline

Candidate Actions

↓

Utility Scores

↓

Decision Policy

↓

Chosen Action

↓

Action Engine

---

# Mathematical Definition

For a candidate action a,

Score(a) =
U(a)
+
B(a)
-
P(a)

where

U(a) = Utility

B(a) = Behavioral adjustments

P(a) = Decision penalties

The chosen action is

argmax Score(a)

subject to all behavioral constraints.

---

# Behavioral Adjustments

Behavioral adjustments include

Personality

Emotion

Behavior Policy

Goal Priority

Recent Experiences

Current Context

Adjustments remain deterministic.

---

# Decision Penalties

Decision penalties may include

High uncertainty

High perceived risk

Cognitive overload

Decision fatigue

Time pressure

Penalties reduce effective decision score.

---

# Decision Confidence

Decision confidence measures how strongly the chosen action dominates alternatives.

Higher separation between candidate scores produces higher confidence.

Confidence remains normalized.

---

# Decision Stability

Stable decisions occur when

Repeated evaluation produces the same outcome.

Small input perturbations should not cause large behavioral changes.

Decision stability supports replayability.

---

# Tie Resolution

When competing actions possess similar scores,

Tie resolution considers

Goal priority

Behavior policy

Trust

Risk

Previous actions

Tie resolution is deterministic.

---

# Calibration

Parameters may be calibrated using

Behavioral analytics

Session recordings

Conversion funnels

A/B experiments

Observed user behavior

Calibration preserves deterministic execution.

---

# Validation

Validation verifies

Score consistency

Numerical stability

Parameter ranges

Determinism

Version compatibility

---

# Metrics

The Decision Theory model records

Decision confidence

Decision stability

Utility margins

Average decision latency

Tie frequency

Validation failures

---

# Runtime Invariants

The following rules must never be violated.

Exactly one action is selected.

Selection is deterministic.

Scores remain explainable.

Decision confidence is recorded.

Tie resolution remains deterministic.

---

# Versioning

Every decision records

Decision Theory Version

Parameter Version

Calibration Version

Schema Version

Timestamp

---

# Platform Guarantees

The Decision Theory model guarantees

Deterministic action selection

Replayability

Explainable decisions

Calibration support

Version compatibility

Behaviorally realistic choices

---

# Future Extensions

Potential future capabilities include

Prospect Theory

Expected Utility Theory

Bounded Rationality

Multi-objective optimization

Sequential planning

Game-theoretic reasoning

Adaptive decision policies

---

# Summary

The Decision Theory model defines how Synthetic Humans convert utility estimates into concrete actions.

By separating action valuation from action selection and incorporating behavioral adjustments, penalties, and confidence estimation, the platform produces deterministic, explainable, and behaviorally realistic decisions suitable for replay, calibration, and continuous improvement.