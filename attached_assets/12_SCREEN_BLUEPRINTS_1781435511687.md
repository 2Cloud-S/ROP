# SCREEN_BLUEPRINTS.md

# Rise of the Plants (ROP)

## Screen Architecture & Layout Blueprints

Version: 1.0

Purpose:

Provide exact screen structures, navigation flows, component hierarchies, and layout guidance for all major screens in Rise of the Plants.

This document is intended to eliminate ambiguity during implementation.

---

# 1. Navigation Architecture

ROP uses a mobile-first bottom navigation system.

Maximum:

5 tabs

---

## Bottom Navigation

```text
🌱 Garden

✅ Tasks

📖 Collection

⚔️ Battle

👤 Profile
```

---

## Overlay Screens

Not part of navigation:

```text
Landing

Codex Detail

AR Viewer

Evolution Reveal

Settings
```

---

# 2. User Journey

Primary Journey:

```text
Landing

↓

Garden

↓

Tasks

↓

Grow Plant

↓

Evolution

↓

Collection

↓

Codex

↓

Battle

↓

AR Viewer
```

---

# 3. Landing Screen

Purpose:

Create immediate excitement.

---

## Layout

```text
┌─────────────────────┐
│                     │
│    Hero Artwork     │
│                     │
├─────────────────────┤
│ Rise of the Plants  │
│                     │
│ Magical tagline     │
│                     │
│   [ PLAY NOW ]      │
│                     │
└─────────────────────┘
```

---

## Required Components

Hero Illustration

Logo

Tagline

Primary CTA

Background Animation

---

## Success Criteria

Player understands:

* What the game is
* What they should do next

within 5 seconds.

---

# 4. Garden Screen

Purpose:

Primary progression hub.

Most important screen.

---

## Layout

```text
┌─────────────────────┐
│ Resources           │
│ 💧 ☀️ 🍃            │
├─────────────────────┤
│                     │
│     Active Plant    │
│                     │
├─────────────────────┤
│ Level               │
│ XP Bar              │
│ Evolution Status    │
├─────────────────────┤
│ [ GROW ]            │
└─────────────────────┘
```

---

## Visual Priority

1. Plant
2. XP Progress
3. Grow Action
4. Resources

---

## Components

ResourceBar

PlantViewer

XPBar

EvolutionIndicator

GrowButton

---

# 5. Growth Modal

Purpose:

Convert resources into XP.

---

## Layout

```text
┌─────────────────────┐
│ Grow Your Plant     │
├─────────────────────┤
│ Small Growth        │
│ Medium Growth       │
│ Major Growth        │
├─────────────────────┤
│ XP Preview          │
├─────────────────────┤
│ Confirm             │
└─────────────────────┘
```

---

## Components

GrowthCard

ResourceCostDisplay

XPPreview

ConfirmButton

---

# 6. Evolution Reveal Screen

Purpose:

Major emotional reward.

---

## Flow

```text
Glow

↓

Silhouette

↓

Transformation

↓

Reveal

↓

Continue
```

---

## Layout

```text
┌─────────────────────┐
│                     │
│    Evolution FX     │
│                     │
├─────────────────────┤
│ New Species Name    │
│                     │
│ New Stats           │
│                     │
│ [ Continue ]        │
└─────────────────────┘
```

---

## Fullscreen

Required.

No distractions.

---

# 7. Tasks Screen

Purpose:

Resource generation.

---

## Layout

```text
┌─────────────────────┐
│ Available Tasks     │
├─────────────────────┤
│ Task Card           │
│                     │
│ Reward              │
│                     │
│ [ Complete ]        │
├─────────────────────┤
│ Task Card           │
└─────────────────────┘
```

---

## Components

TaskCard

RewardDisplay

CompleteButton

CooldownIndicator

---

# 8. Task Completion Modal

Purpose:

Provide reward satisfaction.

---

## Layout

```text
┌─────────────────────┐
│ Task Complete!      │
├─────────────────────┤
│ Rewards Earned      │
│                     │
│ +10 Water           │
│                     │
│ [ Awesome ]         │
└─────────────────────┘
```

---

## Include

Confetti

Resource Animation

Reward Count-Up

---

# 9. Collection Screen

Purpose:

Encourage completionism.

---

## Layout

```text
┌─────────────────────┐
│ 7 / 13 Discovered   │
├─────────────────────┤
│ □ □ □               │
│ □ □ □               │
│ □ □ □               │
└─────────────────────┘
```

---

## Grid

2 columns mobile

3 columns tablet

4+ desktop

---

## Card States

Discovered

Undiscovered

Legendary

---

# 10. Species Card

Purpose:

Collection display.

---

## Layout

```text
┌─────────────┐
│   Image     │
├─────────────┤
│ Name        │
│ Rarity      │
└─────────────┘
```

---

## Undiscovered State

Show:

Silhouette

???

Locked Badge

---

# 11. Codex Detail Screen

Purpose:

Show Sanity-powered content.

One of the most important screens.

---

## Layout

```text
┌─────────────────────┐
│ Species Artwork     │
├─────────────────────┤
│ Name                │
│ Rarity              │
├─────────────────────┤
│ Description         │
├─────────────────────┤
│ Lore                │
├─────────────────────┤
│ Habitat             │
├─────────────────────┤
│ Evolution Chain     │
└─────────────────────┘
```

---

## Components

SpeciesHero

LoreSection

HabitatSection

EvolutionChain

Gallery

---

# 12. Evolution Chain Component

Purpose:

Visualize progression.

---

## Layout

```text
Seedling

↓

Moon Fern

↓

Celestial Fern
```

---

## Interaction

Clickable entries.

---

# 13. Battle Screen

Purpose:

Quick excitement.

---

## Layout

```text
┌─────────────────────┐
│ Enemy Plant         │
│ HP Bar              │
├─────────────────────┤
│ Battle Arena        │
├─────────────────────┤
│ Player Plant        │
│ HP Bar              │
├─────────────────────┤
│ Attack              │
│ Defend              │
│ Special             │
└─────────────────────┘
```

---

## Components

EnemyPlant

PlayerPlant

BattleLog

BattleActions

HealthBars

---

# 14. Battle Result Screen

Purpose:

Reward progression.

---

## Victory Layout

```text
┌─────────────────────┐
│ Victory!            │
├─────────────────────┤
│ Rewards             │
│ XP                  │
│ Resources           │
├─────────────────────┤
│ [ Continue ]        │
└─────────────────────┘
```

---

## Defeat Layout

Same structure.

Positive messaging only.

---

# 15. AR Viewer

Purpose:

Wonder.

---

## Layout

```text
┌─────────────────────┐
│                     │
│ Camera Feed         │
│                     │
│      Plant          │
│                     │
├─────────────────────┤
│ Rotate Scale Reset  │
├─────────────────────┤
│ Screenshot          │
└─────────────────────┘
```

---

## UI Rules

Minimal chrome.

Plant remains primary focus.

---

# 16. Profile Screen

Purpose:

Player progression.

---

## Layout

```text
┌─────────────────────┐
│ Avatar              │
│ Botanist Rank       │
├─────────────────────┤
│ Species Found       │
│ Evolutions          │
│ Battles Won         │
├─────────────────────┤
│ Achievements        │
└─────────────────────┘
```

---

# 17. Demo Mode Banner

Visible when:

```text
?demo=true
```

---

## Layout

```text
┌─────────────────────┐
│ Demo Mode Active    │
└─────────────────────┘
```

---

Purpose:

Inform judges they are seeing accelerated progression.

---

# 18. Loading States

Garden

Show plant silhouette.

---

Collection

Show skeleton cards.

---

Codex

Show content placeholders.

---

Battle

Show arena skeleton.

---

# 19. Error States

Every screen requires:

```text
Title

Description

Retry Button
```

---

No blank pages.

---

# 20. Empty States

Collection:

"No species discovered yet."

---

Battle:

"No active plant selected."

---

Codex:

"Discover a species first."

---

# 21. Animation Map

Landing

Subtle floating plants

---

Garden

XP fill animations

---

Growth

Resource transfer animation

---

Evolution

Major cinematic sequence

---

Collection

Card reveal

---

Battle

Attack impact effects

---

AR

Smooth placement transitions

---

# 22. Accessibility Blueprint

Touch Targets:

Minimum 44px

---

Contrast:

WCAG AA

---

Text Scaling:

Supported

---

Screen Reader Labels:

Required

---

# 23. Mobile Breakpoints

Primary:

```text
320–480px
```

---

Tablet:

```text
481–1024px
```

---

Desktop:

```text
1025px+
```

---

# 24. Screen Success Criteria

Every screen should:

1. Communicate purpose immediately.
2. Present one primary action.
3. Support progression.
4. Reinforce wonder and discovery.
5. Feel visually consistent.

If a judge can navigate the entire game without confusion, the screen architecture is successful.
