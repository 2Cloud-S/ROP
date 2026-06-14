# SANITY_ARCHITECTURE.md

# Rise of the Plants (ROP)

## Sanity Content Architecture

Version: 1.0

Purpose:

Define how Sanity powers the game world, content model, content relationships, query patterns, editorial workflows, and future scalability.

This document serves as the source of truth for all Sanity implementation decisions.

---

# 1. Philosophy

Sanity is not a CMS addon.

Sanity is not a marketing content system.

Sanity is the world database for Rise of the Plants.

Without Sanity:

* Species do not exist
* Lore does not exist
* Evolutions do not exist
* Tasks do not exist
* Codex entries do not exist

The game world is generated from structured content stored in Sanity.

---

# 2. Architectural Goals

The Sanity implementation should:

* Demonstrate structured content
* Demonstrate relational content
* Demonstrate queryable content
* Be visible to judges
* Be easy to expand without code changes

---

# 3. Content Ownership Model

Sanity owns:

### Species

Plant definitions

### Evolutions

Progression relationships

### Lore

Narrative content

### Tasks

Task definitions

### Rewards

Reward balancing

### Codex Entries

Collection content

### Rarity Definitions

Collection rarity system

---

Local Application owns:

### Player Progress

### XP

### Resources

### Inventory

### Unlocks

### Battle State

### Active Plant

These remain local for MVP simplicity.

---

# 4. Content Model Overview

```text
Plant Species
     │
     ▼
Evolution Path

Plant Species
     │
     ▼
Codex Entry

Task
     │
     ▼
Reward Definition

Plant Species
     │
     ▼
Rarity Definition
```

---

# 5. Schema Overview

The launch version contains six core schema types.

1. PlantSpecies
2. EvolutionPath
3. EncyclopediaEntry
4. Task
5. RewardDefinition
6. RarityDefinition

---

# 6. PlantSpecies Schema

This is the most important content type.

Every creature in the game originates here.

---

## Purpose

Define a playable species.

---

## Fields

```typescript
{
  name: string

  slug: string

  rarity: Reference

  description: string

  loreExcerpt: string

  habitat: string

  attack: number

  defense: number

  health: number

  evolutionStage: number

  image: Image

  gallery: Image[]

  primaryColor: string

  discoveryHint: string
}
```

---

## Editorial Example

Species:

Moon Fern

Rarity:

Rare

Habitat:

Lunar Groves

Description:

A mysterious plant that blooms beneath moonlight.

---

# 7. EvolutionPath Schema

Defines progression relationships.

---

## Purpose

Control evolution chains without code changes.

---

## Fields

```typescript
{
  fromPlant: Reference

  toPlant: Reference

  requiredLevel: number

  requiredRarity: string

  evolutionDescription: string
}
```

---

## Example

Seedling Fern

↓

Moon Fern

↓

Celestial Fern

---

# 8. EncyclopediaEntry Schema

Provides deep lore content.

---

## Purpose

Power the Codex experience.

---

## Fields

```typescript
{
  plantReference: Reference

  lore: PortableText

  habitatDetails: string

  discoveryStory: string

  botanicalNotes: string

  hiddenFact: string
}
```

---

## Why It Exists

Separates gameplay data from narrative content.

This demonstrates content modeling best practices.

---

# 9. Task Schema

Defines resource-generating activities.

---

## Purpose

Allow new tasks without code changes.

---

## Fields

```typescript
{
  title: string

  description: string

  icon: string

  rewardType: string

  rewardAmount: number

  category: string

  difficulty: string
}
```

---

## Example Tasks

Drink Water

Exercise

Study Session

Daily Check-In

Nature Walk

---

# 10. RewardDefinition Schema

Defines reward behavior.

---

## Purpose

Centralized balancing.

---

## Fields

```typescript
{
  rewardType: string

  displayName: string

  icon: string

  description: string

  value: number
}
```

---

# 11. RarityDefinition Schema

Controls rarity presentation.

---

## Purpose

Prevent hardcoded rarity systems.

---

## Fields

```typescript
{
  name: string

  dropRate: number

  colorHex: string

  glowEffect: string

  description: string
}
```

---

## Launch Values

Common

Rare

Legendary

---

# 12. Future-Ready Optional Schemas

Not required for MVP.

---

## Event

Seasonal content.

---

## Achievement

Collection milestones.

---

## Region

World map expansion.

---

## StoryArc

Narrative campaigns.

---

# 13. Content Relationships

ROP intentionally demonstrates relational content.

---

## Species → Rarity

```text
Moon Fern
     │
     ▼
Rare
```

---

## Species → Codex

```text
Moon Fern
     │
     ▼
Moon Fern Lore Entry
```

---

## Species → Evolution

```text
Fern Seed
     │
     ▼
Moon Fern
```

---

## Task → Reward

```text
Drink Water
     │
     ▼
Water Resource
```

---

# 14. Query Strategy

The frontend should never hardcode content.

Everything should be queried.

---

# 15. Core GROQ Queries

---

## All Species

```groq
*[_type == "plantSpecies"]{
  _id,
  name,
  rarity->,
  image,
  description
}
```

---

## Species Detail Page

```groq
*[
  _type == "plantSpecies"
  && slug.current == $slug
][0]
```

---

## Codex Entries

```groq
*[_type == "encyclopediaEntry"]{
  ...,
  plantReference->
}
```

---

## Tasks

```groq
*[_type == "task"]
```

---

## Evolution Paths

```groq
*[_type == "evolutionPath"]{
  fromPlant->,
  toPlant->
}
```

---

# 16. Judge Visibility Strategy

The Sanity integration should be obvious.

Judges should be able to:

1. Open Codex
2. Read lore
3. View evolution data
4. View species descriptions

and clearly understand:

"This content is coming from Sanity."

---

# 17. Recommended Demo Flow

Judge enters game.

↓

Unlocks species.

↓

Opens Codex.

↓

Reads lore.

↓

Views evolution chain.

↓

Discovers rare species.

↓

Recognizes dynamic content.

This is where Sanity becomes visible.

---

# 18. Editorial Workflow

Designer creates:

Species

↓

Adds lore

↓

Links rarity

↓

Links evolution

↓

Publishes

↓

Game updates automatically

No code changes required.

---

# 19. Buildathon Advantage

Many submissions use Sanity only for:

* Blogs
* Landing pages
* Documentation

ROP uses Sanity as:

* World database
* Creature database
* Lore system
* Evolution engine
* Collection engine

This creates a significantly stronger Buildathon story.

---

# 20. Success Criteria

The Sanity architecture succeeds when:

* All world content originates from Sanity
* Relationships are queryable
* Codex content is dynamic
* Evolution data is dynamic
* Tasks are dynamic
* New species can be added without code changes

At that point Sanity is functioning as a true content platform rather than a simple CMS.
