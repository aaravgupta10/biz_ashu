# Attention Model

Version: 1.0

Status: Draft

Owner: Behavioral Science Team

Dependencies:
- attention-profile.md
- utility-function.md
- perception-engine.md

Used By:
- Attention Engine
- Perception Engine
- Utility Engine
- Simulation Runtime

---

# Purpose

The Attention Model defines how a Synthetic Human allocates its limited attentional resources across the observable elements of a Digital Twin.

Rather than assuming every visible component is perceived, the model determines which components receive attention based on relevance, saliency, goals, personality, and cognitive constraints.

The resulting attention allocation determines what information becomes available for perception.

---

# Philosophy

Attention is limited.

Attention is competitive.

Not everything visible is noticed.

Attention represents the allocation of finite cognitive resources rather than visual visibility alone.

---

# Design Principles

The Attention Model must be

Deterministic

Explainable

Composable

Calibratable

Replayable

Versioned

Behaviorally Grounded

---

# Responsibilities

The Attention Model is responsible for

Attention allocation

Attention normalization

Attention decay

Attention competition

Attention explanation

Validation

The Attention Model is not responsible for

Perception

Decision making

Action generation

Simulation orchestration

Behavior generation

---

# High-Level Pipeline

Observable Components

↓

Feature Extraction

↓

Attention Allocation

↓

Observed Components

↓

Perception Engine

---

# Mathematical Definition

For each observable component i,

Aᵢ =
w₁Sᵢ
+
w₂Gᵢ
+
w₃Pᵢ
+
w₄Nᵢ
-
w₅Cᵢ

where

Sᵢ = Visual Saliency

Gᵢ = Goal Relevance

Pᵢ = Attention Profile Preference

Nᵢ = Information Novelty

Cᵢ = Cognitive Cost

The resulting scores are normalized to form an attention distribution.

---

# Attention Budget

Each decision cycle possesses a finite attention budget.

Budget allocation determines

Components observed

Reading depth

Scanning behavior

Exploration limits

Budget constraints prevent unrealistic perception.

---

# Visual Saliency

Examples

Large headings

Primary CTAs

Animations

Contrasting colors

Above-the-fold content

Saliency attracts attention but does not guarantee observation.

---

# Goal Relevance

Goal relevance measures

Expected usefulness for current goals.

Examples

Pricing while comparing plans

Documentation while integrating APIs

Security page during evaluation

Higher relevance increases attention.

---

# Attention Profile

Stable user preferences influence allocation.

Examples

Technical users prioritize documentation.

Executives prioritize ROI.

Marketers prioritize messaging.

Profile weights bias attention allocation.

---

# Information Novelty

Repeated exposure reduces attention.

Previously unseen information receives higher priority.

Novelty decays gradually over time.

---

# Cognitive Cost

Dense or complex information requires greater effort.

Examples

Large documentation pages

Complex pricing matrices

Legal agreements

Higher cognitive cost reduces attention.

---

# Normalization

Attention scores are normalized into a probability distribution.

The total allocation equals

1.0

This represents the complete attention budget.

---

# Attention Decay

Previously attended components become less attractive unless

Content changes

Goals change

Environment changes

Decay encourages exploration.

---

# Calibration

Parameters may be calibrated using

Eye-tracking studies

Heatmaps

Scroll-depth analytics

Session recordings

User research

Calibration preserves deterministic execution.

---

# Validation

Validation verifies

Normalization

Parameter ranges

Numerical stability

Determinism

Version compatibility

---

# Metrics

The Attention Model records

Average Attention

Attention Distribution

Component Coverage

Attention Entropy

Budget Utilization

Validation Failures

---

# Runtime Invariants

The following rules must never be violated.

Attention remains normalized.

Budget is finite.

Attention allocation is deterministic.

Only attended components reach perception.

Every allocation is explainable.

---

# Versioning

Every attention computation records

Attention Model Version

Parameter Version

Calibration Version

Schema Version

Timestamp

---

# Platform Guarantees

The Attention Model guarantees

Deterministic allocation

Normalized attention

Explainable scores

Calibration support

Replayability

Behaviorally realistic perception

---

# Future Extensions

Potential future capabilities include

Eye movement simulation

Foveated attention

Adaptive attention budgets

Multi-modal attention

Accessibility-aware attention

Real-time saliency estimation

---

# Summary

The Attention Model mathematically allocates a Synthetic Human's finite attentional resources across the observable components of a Digital Twin.

By combining visual saliency, goal relevance, attention preferences, information novelty, and cognitive cost into a normalized attention budget, the platform models realistic perception while ensuring deterministic, explainable, and calibratable simulation.