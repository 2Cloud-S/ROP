# GAME_ECONOMY_AND_BALANCING.md

# Rise of the Plants (ROP)

## Game Economy & Balancing Guide

Version: 1.0

Purpose:

Define progression pacing, XP curves, resource generation, evolution requirements, battle rewards, rarity probabilities, and demo-mode adjustments.

This document serves as the balancing source of truth for the game.

---

# 1. Design Philosophy

ROP is not a grind-heavy RPG.

ROP is not a competitive battle game.

ROP is a discovery-focused collection experience.

The economy should encourage:

* Growth
* Discovery
* Collection
* Exploration

and avoid:

* Excessive grinding
* Punishing progression
* Resource starvation
* Waiting mechanics

---

# 2. Core Progression Goals

A first-time player should:

### Within 30 Seconds

Complete first task.

---

### Within 60 Seconds

Grow first plant.

---

### Within 2 Minutes

Reach first evolution.

---

### Within 3 Minutes

Unlock Codex content.

---

### Within 5 Minutes

Discover a rare species.

---

### Within 10 Minutes

Experience the full gameplay loop.

---

# 3. Resource Types

ROP uses three core resources.

---

## Water

Represents hydration and growth.

Primary Source:

Drink Water task

Secondary Sources:

* Battles
* Daily Rewards
* Discoveries

---

## Nutrients

Represents nourishment.

Primary Source:

Exercise task

Secondary Sources:

* Battles
* Achievements

---

## Sunlight

Represents magical energy.

Primary Source:

Study Session task

Secondary Sources:

* Daily Check-In
* Discoveries

---

# 4. Starting Resources

New Player Inventory

```text
Water: 20

Nutrients: 20

Sunlight: 20
```

Purpose:

Allow immediate interaction.

Players should never hit zero during onboarding.

---

# 5. Starter Species

Every player receives:

```text
Mossling
```

Level:

```text
1
```

XP:

```text
0
```

---

# 6. XP System

XP is the primary progression currency.

---

## XP Formula

```text
XP Gain

=
(Water Used × 2)

+
(Nutrients Used × 2)

+
(Sunlight Used × 2)
```

Simplified:

```text
1 Resource

=

2 XP
```

---

## Example

Spend:

```text
Water: 5
Nutrients: 5
Sunlight: 5
```

XP Gained:

```text
30 XP
```

---

# 7. Level Curve

Launch Target:

Level 1–20

---

## XP Requirements

| Level | Total XP |
| ----- | -------: |
| 1     |        0 |
| 2     |       50 |
| 3     |      120 |
| 4     |      220 |
| 5     |      350 |
| 6     |      520 |
| 7     |      730 |
| 8     |      980 |
| 9     |     1270 |
| 10    |     1600 |
| 11    |     1980 |
| 12    |     2410 |
| 13    |     2890 |
| 14    |     3420 |
| 15    |     4000 |
| 16    |     4630 |
| 17    |     5310 |
| 18    |     6040 |
| 19    |     6820 |
| 20    |     7650 |

---

# 8. Evolution Thresholds

Evolutions should happen frequently enough to maintain excitement.

---

## Stage 1

Seed

Starting Form

---

## Stage 2

Sprout

Unlock Level:

```text
3
```

Expected Time:

1–2 minutes

---

## Stage 3

Bloom

Unlock Level:

```text
7
```

Expected Time:

5–10 minutes

---

## Stage 4

Ascended Form

Unlock Level:

```text
12
```

Expected Time:

15–30 minutes

---

# 9. Resource Costs

---

## Small Growth

```text
Water: 2
Nutrients: 2
Sunlight: 2
```

XP Reward:

```text
12 XP
```

---

## Medium Growth

```text
Water: 5
Nutrients: 5
Sunlight: 5
```

XP Reward:

```text
30 XP
```

---

## Major Growth

```text
Water: 10
Nutrients: 10
Sunlight: 10
```

XP Reward:

```text
60 XP
```

---

# 10. Task Rewards

Tasks should always feel worthwhile.

---

## Drink Water

Reward:

```text
Water +10
```

Cooldown:

None

---

## Exercise

Reward:

```text
Nutrients +10
```

Cooldown:

None

---

## Study Session

Reward:

```text
Sunlight +10
```

Cooldown:

None

---

## Daily Check-In

Reward:

```text
Water +5
Nutrients +5
Sunlight +5
```

Cooldown:

24 Hours

---

## Nature Walk

Reward:

```text
Discovery Bonus
+5 All Resources
```

Cooldown:

None

---

# 11. Discovery System

Players can unlock new species through growth and progression.

---

## Common Species

Unlock Chance:

```text
70%
```

---

## Rare Species

Unlock Chance:

```text
25%
```

---

## Legendary Species

Unlock Chance:

```text
5%
```

---

# 12. Discovery Moments

Discovery rolls occur:

* Evolution
* Battle Victory
* Milestone Achievement

Not every action.

This makes discoveries feel special.

---

# 13. Battle Economy

Battles exist to accelerate progression.

---

## Battle Duration

Target:

```text
30–60 seconds
```

---

## Victory Rewards

```text
Water +5

Nutrients +5

Sunlight +5

XP +25
```

---

## Rare Victory Bonus

10% Chance

Reward:

```text
Species Discovery Roll
```

---

## Defeat Rewards

```text
XP +10
```

No resource rewards.

Players should never feel punished.

---

# 14. Stat Scaling

Base Formula:

```text
Attack

=
Base Attack
+
(Level × 2)
```

---

```text
Defense

=
Base Defense
+
(Level × 2)
```

---

```text
Health

=
Base Health
+
(Level × 5)
```

---

# 15. Rarity Progression

Players should not obtain legendary species immediately.

---

## Common

Expected:

First 5 Minutes

---

## Rare

Expected:

First Session

---

## Legendary

Expected:

Multiple Sessions

---

# 16. Collection Progression

Launch Collection:

```text
13 Species
```

---

Progress Milestones:

```text
3 Species
```

Beginner Botanist

---

```text
6 Species
```

Garden Keeper

---

```text
10 Species
```

Verdant Scholar

---

```text
13 Species
```

Master Botanist

---

# 17. Demo Mode

Required for Buildathon judging.

Enable:

```text
?demo=true
```

---

## Demo XP Multiplier

```text
3x
```

---

## Demo Evolution Thresholds

Stage 2:

```text
Level 2
```

---

Stage 3:

```text
Level 4
```

---

Stage 4:

```text
Level 6
```

---

## Demo Discovery Rates

Common:

```text
60%
```

---

Rare:

```text
35%
```

---

Legendary:

```text
5%
```

---

Purpose:

Allow judges to see the entire progression loop within a few minutes.

---

# 18. Anti-Frustration Rules

Never allow:

* Resource debt
* Negative XP
* Progress loss
* Evolution rollback
* Battle penalties

Players should always move forward.

---

# 19. Future Expansion Balancing

Future systems may add:

* Regions
* Seasonal Events
* Achievements
* Quest Chains
* Additional Species

These should extend progression rather than replace existing systems.

---

# 20. Definition of Success

The economy succeeds when:

* Players evolve their first plant within 2 minutes.
* Players unlock Codex content within 3 minutes.
* Players discover new species regularly.
* Battles feel rewarding.
* Progression feels steady.
* No activity feels grindy.

If players consistently feel growth, discovery, and anticipation, the economy is considered successful.
