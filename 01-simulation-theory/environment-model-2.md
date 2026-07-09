# Chapter 2 — Digital World Representation

---

## Purpose

The Digital World Representation defines how every product is represented internally once it has been converted into a Digital Twin.

The objective is not to replicate source code.

The objective is to construct a semantic representation of the world as experienced by a user.

Every Simulation Engine interacts exclusively with this representation.

No simulation should directly inspect HTML, CSS, screenshots, or Figma layers.

---

# Design Principles

The Digital World must satisfy the following principles.

## Semantic

Objects should represent meaningful concepts rather than implementation details.

Examples

Good

- Primary CTA
- Hero Section
- Pricing Card
- Testimonial
- Navigation Menu

Bad

- div.container:nth-child(3)

---

## Platform Independent

The representation must support

- Websites
- Mobile Applications
- Desktop Applications
- Figma Files
- Interactive Prototypes
- PDFs
- Future Interfaces

without changing the architecture.

---

## Graph-Based

The Digital World is represented as a directed graph.

It is NOT a tree.

Pages, Components, States, and Interactions may have many-to-many relationships.

---

## Immutable

The Digital Twin itself never changes during simulation.

Only the Simulation State changes.

---

## Explainable

Every object must be human-readable.

Every relationship should have semantic meaning.

---

# World Hierarchy

Digital Twin

↓

Experience Graph

↓

Pages

↓

Sections

↓

Components

↓

Elements

↓

Interaction States

↓

Transitions

---

# Experience Graph

The Experience Graph is the canonical representation of the digital product.

Each node represents a meaningful object.

Each edge represents a relationship.

Relationships may include

- contains
- navigates_to
- depends_on
- activates
- reveals
- hides
- replaces
- redirects_to

Example

Homepage

↓

Pricing

↓

Signup

↓

Dashboard

↓

Settings

Unlike a sitemap, the Experience Graph models every reachable state of the product.

---

# World Coordinates

Every object occupies a position inside the Digital World.

Position is represented using multiple coordinate systems.

## Physical Coordinates

Pixel position.

Bounding box.

Dimensions.

Viewport location.

---

## Relative Coordinates

Above

Below

Left Of

Right Of

Inside

Adjacent To

---

## Scroll Coordinates

Above Fold

Near Fold

Mid Page

Lower Page

Footer Region

---

## Reading Coordinates

Reading Order

Importance Order

Visual Flow

Semantic Flow

Different users may traverse these differently.

---

# Spatial Relationships

Every object maintains spatial relationships.

Examples

CTA is inside Hero

Pricing is below Features

FAQ is after Pricing

Navigation is fixed

Relationships are first-class objects.

---

# Visibility Model

Visibility is not binary.

Each object contains

Visibility Score

0.0 → Invisible

1.0 → Fully Visible

Visibility depends upon

- viewport
- overlays
- animations
- scrolling
- hidden state
- device size

Objects may exist but not be visible.

---

# Discoverability

Every object has a Discoverability Score.

This estimates how likely users are to find the object.

Factors include

- navigation depth
- visual prominence
- semantic clarity
- information scent
- accessibility

Low discoverability is one of the strongest predictors of user frustration.

---

# Attention Zones

The Environment is divided into attention regions.

Primary Attention

Secondary Attention

Peripheral Attention

Ignored Region

Objects inherit attention probabilities based on

- size
- contrast
- motion
- position
- whitespace
- visual hierarchy

Different synthetic humans allocate attention differently.

---

# Visual Salience

Each object receives a Visual Salience Score.

Factors include

- size
- contrast
- color
- motion
- spacing
- isolation
- typography
- iconography

Visual salience influences observation order.

---

# Information Scent

Every navigational element emits an Information Scent.

Information Scent estimates how clearly an element communicates what lies behind it.

Examples

Strong

View Pricing

Weak

Learn More

Higher Information Scent increases click probability.

---

# Affordance Model

Every interactive object exposes perceived affordances.

Examples

Looks Clickable

Looks Draggable

Looks Disabled

Looks Editable

Looks Expandable

Looks Dangerous

Looks Secondary

Affordance affects user decisions independently of actual functionality.

---

# Semantic Relationships

Objects maintain semantic relationships.

Examples

Button confirms Form

Heading introduces Section

Image supports Copy

Testimonial validates Claim

CTA relates to Pricing

These relationships improve reasoning.

---

# Interaction Reachability

Not every object is immediately reachable.

Objects may require

- scrolling
- authentication
- expansion
- modal opening
- tab switching
- previous steps

Reachability is explicitly represented.

---

# Environment Constraints

Objects may impose constraints.

Examples

Disabled

Requires Login

Feature Flag

Region Locked

Enterprise Only

Timed

Rate Limited

Constraints affect simulation.

---

# Responsive Worlds

Desktop

Tablet

Mobile

Wearable

Large Display

Each viewport generates an independent Digital World.

The engine never assumes that layouts are equivalent.

---

# World Metrics

The Environment continuously computes structural metrics.

Examples

Information Density

Interaction Density

Navigation Complexity

Visual Complexity

Reading Complexity

Trust Density

Decision Density

These metrics become inputs to the Simulation Engine.

---

# Object Identity

Every object must possess a globally unique identifier.

Objects remain identifiable across

- observations
- simulations
- reports
- versions

Stable identities enable historical comparison.

---

# World Invariants

The following properties must always remain true.

Every object has one semantic meaning.

Every relationship is directional.

Every interaction is explicit.

Every object is addressable.

Every simulation observes the same Digital World.

---

# Summary

The Digital World Representation transforms raw interfaces into a structured semantic universe.

Rather than reasoning over implementation artifacts such as HTML or screenshots, every synthetic human navigates an explainable graph of meaningful objects, relationships, and interaction opportunities.

This abstraction enables the Simulation Engine to reason consistently across websites, mobile applications, prototypes, and future interface paradigms while remaining independent of the underlying implementation technology.