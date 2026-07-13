# Utility Function

Version: 1.0

Status: Draft

Owner: Behavioral Science Team

Dependencies:
- decision-model.md
- trust-model.md
- risk-model.md
- attention-model.md
- belief-update.md

Used By:
- Utility Engine
- Decision Model
- Simulation Runtime
- Recommendation Engine

---

# Purpose

The Utility Function computes the expected subjective value of every candidate action available to a Synthetic Human.

Rather than maximizing objective reward, the Utility Function estimates how desirable an action appears given the user's current cognitive state, goals, knowledge, trust, risk perception, and environment.

The resulting utility scores are consumed by the Decision Model.

---

# Philosophy

Humans do not optimize objective reward.

They optimize perceived value.

Utility represents the desirability of an action from the perspective of the Synthetic Human at a specific point in time.

Utility is dynamic.

It changes continuously as beliefs, trust, goals, and knowledge evolve.

---

# Design Principles

The Utility Function must be

Deterministic

Explainable

Composable

Differentiable where practical

Calibratable

Versioned

Behaviorally Grounded

---

# Responsibilities

The Utility Function is responsible for

Action valuation

Utility decomposition

Utility normalization

Utility explanation

Parameter evaluation

Validation

The Utility Function is not responsible for

Decision making

Action execution

Simulation orchestration

Recommendation generation

Behavior generation

---

# High-Level Pipeline

Candidate Actions

↓

Feature Extraction

↓

Utility Computation

↓

Utility Scores

↓

Decision Model

---

# Mathematical Definition

For a candidate action a,

U(a) =
w₁G(a)
+
w₂I(a)
+
w₃T(a)
-
w₄R(a)
-
w₅C(a)
-
w₆τ(a)

where

G(a) = Expected Goal Progress

I(a) = Expected Information Gain

T(a) = Trust Contribution

R(a) = Perceived Risk

C(a) = Cognitive Cost

τ(a) = Time Cost

w₁...w₆ are configurable weights.

---

# Goal Progress

Measures

Expected progress toward active goals.

Examples

Complete signup

Compare plans

Reduce uncertainty

Finish onboarding

Goal Progress is normalized.

---

# Information Gain

Measures

Expected reduction in uncertainty.

Examples

Reading documentation

Viewing pricing

Opening FAQ

Comparing plans

Information Gain decreases as uncertainty decreases.

---

# Trust Contribution

Measures

Expected change in confidence resulting from an action.

Examples

Viewing testimonials

Reading security documentation

Inspecting customer logos

Trust contribution may be positive, neutral, or negative.

---

# Perceived Risk

Measures

Expected negative outcomes.

Examples

Financial risk

Privacy risk

Implementation risk

Vendor lock-in

Higher perceived risk lowers utility.

---

# Cognitive Cost

Measures

Mental effort required.

Examples

Reading long documentation

Complex forms

Dense pricing tables

High cognitive cost lowers utility.

---

# Time Cost

Measures

Expected effort in terms of time.

Examples

Estimated reading time

Workflow length

Additional navigation

Long interactions reduce utility unless compensated by greater value.

---

# Normalization

Utility scores are normalized.

Recommended range

0.0 to 1.0

Normalization supports comparison across actions.

---

# Utility Package

The Utility Function emits

Candidate Utility Scores

Utility Breakdown

Feature Contributions

Normalization Metadata

Validation Report

Version Information

The package becomes input to the Decision Model.

---

# Calibration

Weights may be calibrated using

Conversion analytics

Session recordings

A/B experiments

Observed user behavior

Customer interviews

Calibration preserves deterministic execution.

---

# Validation

Validation verifies

Parameter ranges

Normalization

Equation stability

Numerical consistency

Schema compatibility

Version compatibility

---

# Metrics

The Utility Function records

Average Utility

Utility Distribution

Utility Variance

Decision Margin

Evaluation Time

Validation Failures

---

# Runtime Invariants

The following rules must never be violated.

Utility is deterministic.

Identical inputs produce identical outputs.

Every utility score includes a breakdown.

Scores remain normalized.

Weights remain versioned.

---

# Versioning

Every utility evaluation records

Utility Function Version

Parameter Version

Calibration Version

Schema Version

Timestamp

---

# Platform Guarantees

The Utility Function guarantees

Deterministic computation

Explainable scores

Composable evaluation

Calibration support

Version compatibility

Behaviorally meaningful action valuation

---

# Future Extensions

Potential future capabilities include

Prospect Theory utilities

Context-aware weighting

Adaptive utility learning

Multi-objective optimization

Personalized utility calibration

Bayesian utility estimation

---

# Summary

The Utility Function computes the perceived value of every candidate action by combining goal progress, information gain, trust, perceived risk, cognitive cost, and time cost into a single explainable score.

By separating action valuation from decision making, the platform produces realistic, transparent, and calibratable behavior while allowing future improvements to the decision process without changing the underlying utility computation.