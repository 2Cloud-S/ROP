# COMPONENT_LIBRARY.md

# Rise of the Plants (ROP)

## Component Library & Design System Implementation

Version: 1.0

Purpose:

Define every reusable UI component used throughout Rise of the Plants.

This document serves as the implementation reference for React components, props, states, variants, accessibility requirements, and design consistency.

All screens should be composed from these reusable components whenever possible.

---

# 1. Design Principles

Every component should be:

* Reusable
* Accessible
* Mobile-first
* Consistent
* Animation-ready

Avoid:

* One-off screen-specific widgets
* Duplicate implementations
* Hardcoded styling
* Inconsistent spacing

---

# 2. Component Categories

ROP components are organized into:

```text
Core Components

Navigation Components

Garden Components

Task Components

Collection Components

Codex Components

Battle Components

AR Components

Feedback Components

Layout Components
```

---

# 3. Core Components

These are used everywhere.

---

# Button

Purpose:

Primary interaction element.

---

Variants

```text
Primary

Secondary

Ghost

Danger
```

---

Props

```typescript
interface ButtonProps {
  label: string
  variant?: ButtonVariant
  loading?: boolean
  disabled?: boolean
  icon?: ReactNode
  onClick: () => void
}
```

---

Requirements

Minimum height:

48px

Touch friendly.

---

# Card

Purpose:

Reusable content container.

---

Props

```typescript
interface CardProps {
  children: ReactNode
  interactive?: boolean
  onClick?: () => void
}
```

---

Design

```css
border-radius: 16px;
padding: 16px;
```

---

# Modal

Purpose:

Overlay interactions.

---

Used For

* Growth
* Evolution
* Rewards
* Battle Results

---

Props

```typescript
interface ModalProps {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
}
```

---

# Badge

Purpose:

Status indicator.

---

Variants

```text
Common

Rare

Legendary

Success

Warning
```

---

# ProgressBar

Purpose:

Display progression.

---

Used For

* XP
* Health
* Collection Completion

---

Props

```typescript
interface ProgressBarProps {
  value: number
  max: number
  animated?: boolean
}
```

---

# 4. Navigation Components

---

# BottomNavigation

Purpose:

Primary navigation system.

---

Tabs

```text
Garden

Tasks

Collection

Battle

Profile
```

---

Props

```typescript
interface BottomNavigationProps {
  activeTab: Tab
}
```

---

Requirements

Persistent on mobile.

---

# NavigationItem

Purpose:

Single tab.

---

Contains

Icon

Label

Active State

---

# 5. Garden Components

---

# PlantViewer

Purpose:

Display active plant.

---

Capabilities

* Idle animation
* Evolution transitions
* 3D-ready architecture

---

Props

```typescript
interface PlantViewerProps {
  species: PlantSpecies
  stage: EvolutionStage
}
```

---

# ResourceBar

Purpose:

Display player resources.

---

Displays

```text
Water

Nutrients

Sunlight
```

---

# ResourceChip

Purpose:

Single resource display.

---

Props

```typescript
interface ResourceChipProps {
  type: ResourceType
  amount: number
}
```

---

# XPBar

Purpose:

Visual progression.

---

Displays

```text
Current XP

Level

Progress %
```

---

Animations

Required.

---

# EvolutionIndicator

Purpose:

Show evolution readiness.

---

States

```text
Locked

Growing

Ready

Evolving
```

---

# GrowButton

Purpose:

Primary Garden CTA.

---

Behavior

Opens Growth Modal.

---

# 6. Growth Components

---

# GrowthModal

Purpose:

Convert resources into XP.

---

Contains

Small Growth

Medium Growth

Major Growth

---

# GrowthOptionCard

Purpose:

Single growth option.

---

Displays

```text
Cost

XP Reward

Resource Breakdown
```

---

# XPPreview

Purpose:

Preview XP gain before confirmation.

---

# 7. Task Components

---

# TaskCard

Purpose:

Display task.

---

Contents

Icon

Title

Description

Reward

Action

---

Props

```typescript
interface TaskCardProps {
  task: Task
  onComplete: () => void
}
```

---

# RewardDisplay

Purpose:

Visual reward summary.

---

Displays

```text
+10 Water

+10 Nutrients

+10 Sunlight
```

---

# CooldownBadge

Purpose:

Show task availability.

---

States

```text
Ready

Cooldown
```

---

# 8. Collection Components

---

# CollectionGrid

Purpose:

Species browser.

---

Responsive

```text
2 Columns Mobile

3 Columns Tablet

4+ Desktop
```

---

# SpeciesCard

Purpose:

Species preview.

---

Displays

Image

Name

Rarity

Discovery Status

---

States

```text
Discovered

Undiscovered

Legendary
```

---

# DiscoveryProgress

Purpose:

Collection completion.

---

Example

```text
7 / 13 Discovered
```

---

# 9. Codex Components

These are especially important because they showcase Sanity content.

---

# CodexEntry

Purpose:

Species detail view.

---

Displays

Name

Lore

Habitat

Stats

Rarity

---

Data Source

Sanity

---

# LoreSection

Purpose:

Render narrative content.

---

Supports

Portable Text

---

# HabitatSection

Purpose:

Display habitat information.

---

# EvolutionChain

Purpose:

Display progression path.

---

Example

```text
Fernlet

↓

Moon Fern

↓

Celestial Fern
```

---

Clickable.

---

# GalleryCarousel

Purpose:

Display species images.

---

Data Source

Sanity assets.

---

# 10. Battle Components

---

# BattleArena

Purpose:

Primary battle container.

---

Contains

Enemy

Player

Effects

Battle Log

---

# HealthBar

Purpose:

Display HP.

---

Animations

Required.

---

# BattleActionPanel

Purpose:

Player actions.

---

Buttons

```text
Attack

Defend

Special
```

---

# BattleLog

Purpose:

Display battle events.

---

Example

```text
Moon Fern used Special!

Enemy took 12 damage.
```

---

# BattleResultModal

Purpose:

Victory / Defeat summary.

---

Displays

Rewards

XP

Unlocks

---

# 11. AR Components

---

# ARViewer

Purpose:

Render AR experience.

---

Capabilities

Place

Rotate

Scale

Reset

Screenshot

---

# ARControls

Purpose:

Manipulate model.

---

Buttons

Rotate

Scale

Reset

---

# ScreenshotButton

Purpose:

Capture scene.

---

Exports image.

---

# 12. Feedback Components

---

# RewardModal

Purpose:

Celebrate rewards.

---

Animations

Count-up

Glow

Confetti

---

# DiscoveryModal

Purpose:

Species unlock.

---

Displays

Artwork

Name

Rarity

Lore Teaser

---

# EvolutionReveal

Purpose:

Major progression moment.

---

Sequence

```text
Glow

↓

Transformation

↓

Reveal

↓

Continue
```

---

Fullscreen required.

---

# Toast

Purpose:

Lightweight notifications.

---

Examples

```text
Task Complete

Resources Added

Battle Won
```

---

# 13. Layout Components

---

# ScreenContainer

Purpose:

Standard screen wrapper.

---

Responsibilities

Padding

Safe Areas

Responsive Width

---

# SectionHeader

Purpose:

Consistent headings.

---

Displays

Title

Optional Subtitle

Optional Action

---

# EmptyState

Purpose:

Handle missing content.

---

Props

```typescript
interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}
```

---

# LoadingSkeleton

Purpose:

Loading experience.

---

Variants

```text
Card

Plant

Codex

Collection
```

---

# ErrorState

Purpose:

Recoverable failures.

---

Displays

Title

Description

Retry Button

---

# 14. Accessibility Requirements

All components must:

* Support keyboard navigation
* Support screen readers
* Meet WCAG AA contrast
* Use semantic HTML
* Support focus states

---

# 15. Animation Standards

Microinteractions

150–250ms

---

Card Hover

200ms

---

Reward Reveal

400ms

---

Evolution Reveal

3000–5000ms

---

Never block gameplay with long animations.

---

# 16. State Management Rules

Components should be:

Presentation-focused.

Business logic belongs in:

```text
hooks/

services/

stores/
```

not inside UI components.

---

# 17. Folder Structure

```text
src/

components/
│
├── core/
├── navigation/
├── garden/
├── tasks/
├── collection/
├── codex/
├── battle/
├── ar/
├── feedback/
└── layout/
```

---

# 18. Definition of Done

The component library is complete when:

✓ Every screen can be assembled entirely from reusable components

✓ Components follow the design system

✓ Components are accessible

✓ Components are responsive

✓ Components support animation

✓ Sanity-powered content renders correctly

✓ New screens can be built without creating duplicate UI patterns

At that point the Rise of the Plants UI system can scale cleanly beyond the Buildathon MVP.
