# Rise of the Plants (ROP)

# Backend Architecture Specification

**Version:** 1.0

## Purpose

Define the backend architecture for Rise of the Plants.

This document establishes:

* API architecture
* Game state management
* Sanity integration patterns
* Session handling
* Battle systems
* Progression persistence
* Demo mode support
* Deployment architecture

The backend exists to manage gameplay state and progression.

**Sanity remains the content source of truth.**

---

# 1. Core Philosophy

## Backend Responsibilities

✅ Player progression

✅ Inventory

✅ Active plants

✅ Discoveries

✅ Battles

✅ Evolution tracking

✅ Session persistence

✅ Demo mode

---

## Backend Should NOT Manage

❌ Species lore

❌ Codex content

❌ Images

❌ Narrative content

❌ Worldbuilding content

Those belong in Sanity.

---

# 2. Architecture Overview

```text
Frontend (React)

        ↓

Game API

        ↓

Game Services

        ↓

Persistence Layer

        ↓

Sanity Content Layer
```

---

# 3. Source of Truth Model

## Sanity

Stores:

* Species
* Lore
* Habitats
* Evolution Chains
* Tasks
* Achievements
* Gallery Assets
* Codex Content

---

## Game Backend

Stores:

* Player Progress
* Inventory
* XP
* Level
* Discoveries
* Battle States
* Achievement Progress
* Active Plant

---

# 4. Recommended Stack

## Runtime

```text
Node.js
```

## Framework

```text
Express
```

or

```text
Hono
```

## Language

```text
TypeScript
```

## Validation

```text
Zod
```

## Content Backend

```text
Sanity
```

## Authentication

```text
Guest Sessions
```

(Buildathon MVP)

---

# 5. Backend Folder Structure

```text
server/

├── routes/
├── services/
├── repositories/
├── middleware/
├── validation/
├── types/
├── sanity/
├── utils/
└── app.ts
```

---

# 6. Route Layer

Purpose:

HTTP request handling only.

Routes should never contain business logic.

## Example

```text
routes/

session.ts
plants.ts
tasks.ts
battle.ts
collection.ts
profile.ts
achievements.ts
```

---

# 7. Service Layer

Purpose:

Contains all gameplay logic.

## Structure

```text
services/

PlayerService
PlantService
BattleService
TaskService
DiscoveryService
AchievementService
```

## Responsibilities

* XP calculations
* Evolution logic
* Battle logic
* Reward distribution
* Discovery unlocks
* Progression systems

---

# 8. Repository Layer

Purpose:

Abstract persistence from business logic.

Benefits:

* Easier future migrations
* Cleaner services
* Easier testing

## Example

```typescript
PlayerRepository
PlantRepository
BattleRepository
AchievementRepository
```

---

# 9. Session System

Buildathon MVP uses guest accounts only.

## Flow

```text
First Visit

↓

Generate Guest ID

↓

Store In Browser

↓

Create Profile

↓

Persist Progress
```

No login required.

No passwords required.

---

# 10. Guest Identity

Example:

```typescript
guest_9a8f3f2b
```

Stored in:

```text
localStorage
```

Used for:

* Progress
* Collection
* Inventory
* Battles
* Achievements

---

# 11. Player Model

```typescript
interface Player {
  id: string;
  createdAt: string;
  level: number;
  xp: number;
  discoveries: string[];
  achievements: string[];
  activePlantId: string;
}
```

---

# 12. Inventory Model

```typescript
interface Inventory {
  water: number;
  nutrients: number;
  sunlight: number;
}
```

---

# 13. Plant Instance Model

Important:

Species data comes from Sanity.

Plant instances belong to players.

```typescript
interface PlantInstance {
  id: string;
  speciesId: string;
  ownerId: string;
  level: number;
  xp: number;
  stage: number;
  createdAt: string;
}
```

---

# 14. Discovery Model

```typescript
interface Discovery {
  playerId: string;
  speciesId: string;
  discoveredAt: string;
}
```

Purpose:

Track collection progress.

---

# 15. Achievement Progress Model

```typescript
interface AchievementProgress {
  achievementId: string;
  unlocked: boolean;
  unlockedAt?: string;
}
```

Achievement definitions live in Sanity.

Achievement progress lives in backend storage.

---

# 16. Battle Architecture

Battle state should never exist exclusively on the frontend.

## Battle Flow

```text
Start Battle

↓

Generate Enemy

↓

Store Battle State

↓

Player Action

↓

Resolve Turn

↓

Return Result

↓

Victory / Defeat
```

---

# 17. Battle State Model

```typescript
interface BattleState {
  id: string;
  playerId: string;
  playerHp: number;
  enemyHp: number;
  turn: number;
  status: "active" | "won" | "lost";
}
```

---

# 18. Enemy Generation

Enemy templates originate from:

```text
Sanity Species
```

Generated values:

* Level
* Health
* Attack
* Defense

Scaled to player progression.

---

# 19. XP Service

Single source of truth.

Never calculate XP in the frontend.

## Examples

```typescript
calculateGrowthXP()

calculateBattleXP()

calculateDiscoveryXP()
```

---

# 20. Evolution Service

Responsible for:

* Evolution thresholds
* Evolution eligibility
* Stage advancement
* Evolution rewards

## Inputs

* Plant level
* Species configuration
* Demo mode state

## Output

```typescript
EvolutionResult
```

---

# 21. Discovery Service

Purpose:

Unlock new species.

## Triggered By

* Evolution
* Battle victories
* Milestone achievements

## Returns

```typescript
DiscoveryResult
```

---

# 22. Task Service

Task definitions originate from Sanity.

Backend validates:

* Rewards
* Cooldowns
* Eligibility
* Progress

## Example

```typescript
completeTask()
```

---

# 23. Achievement Service

Achievement content:

```text
Sanity
```

Achievement progress:

```text
Backend
```

Responsibilities:

* Progress tracking
* Unlock detection
* Reward distribution

---

# 24. Sanity Integration Layer

Structure:

```text
server/sanity/

client.ts
queries.ts
```

## client.ts

Creates configured Sanity client.

Responsibilities:

* Authentication
* Project configuration
* API versioning
* Caching

## queries.ts

Centralized GROQ queries.

Examples:

```typescript
getSpecies()

getSpeciesBySlug()

getTasks()

getAchievements()
```

---

# 25. Content Sync Strategy

The backend should never duplicate Sanity content.

Correct:

```text
Backend

↓

Query Sanity

↓

Cache

↓

Return
```

Avoid:

```text
Copying Content Into Local Storage Tables
```

Sanity remains authoritative.

---

# 26. API Design Principles

Use:

```text
REST
```

for MVP.

## Success Response

```json
{
  "success": true,
  "data": {}
}
```

## Error Response

```json
{
  "success": false,
  "error": "message"
}
```

---

# 27. Core API Endpoints

## Session

```http
POST /api/session
GET  /api/session/:id
```

---

## Plants

```http
GET  /api/plants
POST /api/plants/grow
POST /api/plants/evolve
POST /api/plants/activate
```

---

## Tasks

```http
GET  /api/tasks
POST /api/tasks/complete
```

---

## Collection

```http
GET /api/collection
```

---

## Battle

```http
POST /api/battle/start
POST /api/battle/action
GET  /api/battle/:id
```

---

## Profile

```http
GET /api/profile
```

---

## Achievements

```http
GET /api/achievements
```

---

# 28. Validation Layer

All mutation endpoints use Zod.

Examples:

```typescript
GrowPlantSchema

BattleActionSchema

CompleteTaskSchema
```

---

# 29. Error Handling

Every endpoint must support:

* Validation Errors
* Content Errors
* Not Found Errors
* Unexpected Errors

Never expose stack traces.

---

# 30. Caching Strategy

Cache:

* Species
* Tasks
* Achievements
* Codex Content

Minimum cache duration:

```text
1 Hour
```

---

# 31. Demo Mode

Activated by:

```text
?demo=true
```

Backend receives:

```typescript
demoMode = true;
```

Effects:

* 3× XP
* Faster evolutions
* Increased discovery rates

Purpose:

Allow judges to experience the full loop quickly.

---

# 32. Security

Buildathon scope only.

Required:

* Input validation
* Basic rate limiting
* Error sanitization

Not required:

* OAuth
* RBAC
* Enterprise security systems

---

# 33. Environment Variables

```env
SANITY_PROJECT_ID=

SANITY_DATASET=

SANITY_API_VERSION=

SANITY_READ_TOKEN=

ENABLE_DEMO_MODE=true
```

---

# 34. Deployment Architecture

```text
Frontend (React)

↓

Game API

↓

Sanity
```

Suggested deployment:

```text
Replit Deployments
```

Content Hosting:

```text
Sanity Cloud
```

---

# 35. Monitoring

Track:

* Session creation
* Plant growth
* Evolution events
* Battle completion
* Species discoveries

Purpose:

Debugging and demo reliability.

---

# 36. Future Expansion

Architecture should support:

* Accounts
* Multiplayer
* Trading
* Events
* Seasonal content
* Additional regions

without major restructuring.

---

# 37. Definition of Done

Backend architecture succeeds when:

* Player progress persists
* Discoveries persist
* Battles work reliably
* Evolutions are server validated
* Sanity remains the content source of truth
* Demo mode works
* Frontend contains no gameplay authority
* New systems can be added cleanly

At that point Rise of the Plants has a production-quality backend architecture suitable for both the Buildathon MVP and future expansion.
