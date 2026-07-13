# Attention Profile

Version: 1.0

Status: Draft

Owner: Behavioral Modeling Team

Dependencies:
- personality-model.md
- knowledge-model.md
- behavior-policy.md
- digital-user-genome.md

Used By:
- Attention Engine
- Perception Engine
- Utility Engine
- Simulation Runtime

---

# Purpose

The Attention Profile defines the stable attentional tendencies of every Synthetic Human.

Rather than determining where attention is allocated at every moment, the Attention Profile defines which categories of information naturally attract or repel a user's attention throughout a simulation.

The profile biases perception without determining it.

---

# Philosophy

Humans do not perceive everything.

Attention is selective.

Different Synthetic Humans naturally prioritize different information.

The Attention Profile determines what a user is likely to notice before the Attention Engine allocates attention during runtime.

---

# Design Principles

The Attention Profile must be

Deterministic

Stable

Replayable

Explainable

Composable

Versioned

Model Independent

Scientifically Grounded

---

# Responsibilities

The Attention Profile is responsible for

Attention preferences

Attention priorities

Attention biases

Attention sensitivity

Category weighting

Validation

Metadata generation

The Attention Profile is not responsible for

Moment-to-moment attention allocation

Eye movement

Visual saliency

Perception

Simulation execution

Recommendations

---

# High-Level Pipeline

Digital User Genome

↓

Attention Profile

↓

Attention Engine

↓

Perceived Environment

↓

Decision Making

---

# Inputs

The Attention Profile receives

Digital User Genome

Personality Profile

Knowledge Profile

Behavior Policy

Simulation Context

Version Metadata

Inputs remain immutable.

---

# Attention Categories

The profile defines preferences across multiple categories.

Visual Design

Headlines

Body Text

Pricing

Navigation

Calls-to-Action

Testimonials

Social Proof

Security Signals

Documentation

Technical Information

Images

Forms

Integrations

Performance Claims

Each category possesses an independent attention weight.

---

# Attention Attributes

Every attention category records

Category ID

Weight

Priority

Sensitivity

Confidence

Metadata

Version

Weights are normalized.

---

# Attention Biases

The profile defines natural attentional biases.

Examples

Technical Bias

Business Bias

Marketing Bias

Visual Bias

Pricing Bias

Trust Bias

Navigation Bias

Biases influence downstream perception.

---

# Attention Priorities

Categories are ranked according to

Personal relevance

Knowledge

Current goals

Professional background

Behavior policy

Priorities remain stable throughout a simulation.

---

# Attention Blindness

The profile may define areas of consistently low attention.

Examples

Ignores testimonials

Rarely notices security badges

Skips long paragraphs

Avoids documentation

Blindness influences perception rather than behavior directly.

---

# Interaction with the Attention Engine

The Attention Profile provides stable weighting.

The Attention Engine combines

Visual Saliency

Current Goals

Environment

Emotional State

Attention Profile

to determine runtime attention allocation.

---

# Attention Profile Package

The Attention Profile emits

Category Weights

Attention Priorities

Attention Biases

Blindness Profile

Validation Report

Metadata

Version Information

The package becomes part of the Synthetic Human Specification.

---

# Validation

Validation verifies

Weight normalization

Category integrity

Priority consistency

Schema compatibility

Version compatibility

---

# Metrics

The Attention Profile records

Category Distribution

Average Weights

Attention Diversity

Validation Failures

Generation Time

---

# Runtime Invariants

The following rules must never be violated.

Attention Profiles are deterministic.

Profiles remain stable during simulation.

Weights are normalized.

Every Synthetic Human possesses a complete Attention Profile.

Profiles bias attention but never directly allocate it.

---

# Versioning

Every attention profile records

Attention Profile Version

Genome Version

Configuration Version

Schema Version

Timestamp

---

# Platform Guarantees

The Attention Profile guarantees

Deterministic attention preferences

Replayability

Structured attention representation

Version compatibility

Explainable attentional biases

Behaviorally consistent perception

---

# Future Extensions

Potential future capabilities include

Eye-tracking calibration

Accessibility-aware attention

Culture-specific attention profiles

Adaptive attention evolution

Cross-session attentional learning

Attention calibration from real analytics

---

# Summary

The Attention Profile defines the enduring attentional preferences of every Synthetic Human.

By separating stable attention tendencies from the runtime mechanics of attention allocation, the platform produces more realistic perception, allowing different users to naturally notice different aspects of the same digital product while maintaining deterministic, explainable, and reproducible simulations.