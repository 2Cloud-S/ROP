# FRONTEND_ARCHITECTURE.md

# Rise of the Plants (ROP)

## Frontend Architecture Specification

Version: 1.0

Purpose:

Define the complete frontend architecture for Rise of the Plants.

This document serves as the implementation blueprint for:

* React application structure
* Routing
* State management
* Sanity integration
* AR systems
* Data fetching
* Component organization
* Performance optimization

The goal is a scalable architecture that remains simple enough for Buildathon delivery.

---

# 1. Technology Stack

Frontend Framework

```text
React 19
```

---

Build Tool

```text
Vite
```

---

Language

```text
TypeScript
```

---

Routing

```text
React Router
```

---

Server State

```text
TanStack Query
```

---

Client State

```text
Zustand
```

---

Forms

```text
React Hook Form
```

---

Animations

```text
Framer Motion
```

---

AR / 3D

```text
Three.js

React Three Fiber

@react-three/drei
```

---

Content Backend

```text
Sanity
```

---

Styling

```text
Tailwind CSS
```

---

Icons

```text
Lucide React
```

---

# 2. Architectural Principles

The frontend should be:

* Component-first
* Mobile-first
* Content-driven
* Type-safe
* Feature-oriented

Avoid:

* Massive pages
* Deep prop drilling
* Business logic in components
* Global state abuse

---

# 3. High-Level Architecture

```text
UI Layer
│
├── Components
│
├── Pages
│
├── Hooks
│
├── Services
│
├── Stores
│
└── Integrations
       │
       ├── Sanity
       ├── AR
       └── Browser APIs
```

---

# 4. Folder Structure

```text
src/

├── app/
│
├── pages/
│
├── components/
│
├── features/
│
├── hooks/
│
├── services/
│
├── stores/
│
├── lib/
│
├── types/
│
├── assets/
│
├── constants/
│
└── routes/
```

---

# 5. App Layer

Purpose:

Global initialization.

---

Contains

```text
QueryClient

Router

Providers

Theme

Global Layout
```

---

Example

```text
src/app/
```

```text
providers.tsx

router.tsx

App.tsx
```

---

# 6. Pages Layer

Pages represent routes.

Pages should remain thin.

---

Pages

```text
LandingPage

GardenPage

TasksPage

CollectionPage

BattlePage

ProfilePage

CodexPage

ARViewerPage
```

---

Pages should:

* Fetch data
* Assemble components

Pages should NOT:

* Contain game logic

---

# 7. Feature Layer

Feature-oriented architecture.

---

Structure

```text
features/

garden/

tasks/

collection/

codex/

battle/

ar/
```

---

Each feature owns:

```text
components

hooks

services

types
```

---

Example

```text
features/garden/

components/

hooks/

services/

types/
```

---

# 8. Component Layer

Shared UI components.

---

Structure

```text
components/

core/

navigation/

feedback/

layout/
```

---

Examples

```text
Button

Card

Modal

Badge

ProgressBar
```

---

Should be reusable across features.

---

# 9. Routing Architecture

Router

```text
/
```

Landing

---

```text
/garden
```

Garden

---

```text
/tasks
```

Tasks

---

```text
/collection
```

Collection

---

```text
/collection/:slug
```

Codex Entry

---

```text
/battle
```

Battle

---

```text
/ar
```

AR Viewer

---

```text
/profile
```

Profile

---

# 10. Navigation Flow

```text
Landing

↓

Garden

↓

Tasks

↓

Grow

↓

Evolution

↓

Collection

↓

Codex

↓

Battle

↓

AR
```

---

# 11. State Management Strategy

Rule:

Use the smallest state scope possible.

---

# Local Component State

Use:

```typescript
useState()
```

For:

* Modals
* Inputs
* Toggles

---

# Server State

Use:

```text
TanStack Query
```

For:

* Species
* Tasks
* Codex Content
* Evolution Data

---

# Global State

Use:

```text
Zustand
```

Only for:

* Active Plant
* Inventory
* Player Progress
* Demo Mode

---

# 12. Zustand Stores

Structure

```text
stores/

playerStore.ts

plantStore.ts

uiStore.ts
```

---

# playerStore

Contains

```typescript
resources

discoveries

achievements
```

---

# plantStore

Contains

```typescript
activePlant

level

xp

evolutionState
```

---

# uiStore

Contains

```typescript
demoMode

modals

notifications
```

---

# 13. Data Fetching Architecture

All content originates from Sanity.

---

Pattern

```text
Page

↓

Hook

↓

Service

↓

Sanity Client
```

---

Never query Sanity directly inside components.

---

# 14. Sanity Integration Layer

Structure

```text
lib/sanity/

client.ts

queries.ts

types.ts
```

---

# client.ts

Purpose

Create Sanity client.

---

Responsibilities

```text
Project ID

Dataset

API Version

Caching
```

---

# queries.ts

Purpose

Centralized GROQ queries.

---

Example

```typescript
getSpecies()

getSpeciesBySlug()

getTasks()

getCodexEntry()
```

---

# types.ts

Purpose

Shared generated types.

---

# 15. React Query Hooks

Structure

```text
hooks/

useSpecies.ts

useTasks.ts

useCodex.ts

useEvolutions.ts
```

---

Example

```typescript
useSpecies()
```

Returns

```typescript
{
  data,
  isLoading,
  error
}
```

---

# 16. Caching Strategy

Species

```text
24 Hours
```

---

Tasks

```text
1 Hour
```

---

Codex Entries

```text
24 Hours
```

---

Static Content

Cache aggressively.

---

# 17. Type System

All major entities require interfaces.

---

Entities

```typescript
PlantSpecies

Task

Reward

Evolution

Rarity

PlayerProfile
```

---

Shared Types

```text
src/types/
```

---

# 18. AR Architecture

Structure

```text
features/ar/

components/

hooks/

scene/

controls/
```

---

# Scene Layer

Contains

```text
Plant Model

Lighting

Camera

Environment
```

---

# Controls Layer

Contains

```text
Rotate

Scale

Reset

Screenshot
```

---

# AR Fallback Strategy

If WebXR unavailable:

Show:

```text
Camera Overlay Mode
```

instead.

---

Never block access.

---

# 19. Animation Architecture

Library

```text
Framer Motion
```

---

Use For

```text
Page Transitions

XP Gain

Collection Reveal

Evolution

Reward Popups
```

---

Do Not Use For

```text
Layout Logic
```

---

# 20. Error Handling

Every query must support:

```typescript
Loading

Error

Success
```

---

Never assume content exists.

---

# 21. Empty State Strategy

Examples

```text
No Species

No Discoveries

No Active Plant
```

---

Use dedicated EmptyState component.

---

# 22. Accessibility

Required

```text
Keyboard Navigation

Screen Reader Labels

Focus States

ARIA Attributes
```

---

All interactive components must comply.

---

# 23. Performance Strategy

Lazy Load

```text
AR Viewer

Battle Screen

Codex Gallery
```

---

Prefetch

```text
Species Data

Tasks

Collection Data
```

---

Optimize Images

Use Sanity image transforms.

---

# 24. Demo Mode Architecture

Activated by:

```text
?demo=true
```

---

Behavior

```text
Faster XP

Faster Evolutions

Higher Discovery Rates
```

---

Stored in:

```text
uiStore
```

---

# 25. Environment Variables

Required

```env
VITE_SANITY_PROJECT_ID=

VITE_SANITY_DATASET=

VITE_SANITY_API_VERSION=
```

---

Optional

```env
VITE_ENABLE_DEMO_MODE=true
```

---

# 26. Testing Strategy

Unit Tests

```text
Hooks

Stores

Utilities
```

---

Component Tests

```text
Critical UI Components
```

---

Manual Testing

```text
Garden Loop

Evolution

Collection

Battle

AR
```

---

# 27. Deployment Readiness

Frontend is considered production-ready when:

✓ Routes work

✓ Sanity content loads

✓ Mobile layouts work

✓ AR fallback works

✓ Demo mode works

✓ Loading states exist

✓ Error states exist

✓ Accessibility requirements pass

✓ Lighthouse performance is acceptable

---

# 28. Definition of Done

The frontend architecture succeeds when:

* New features can be added without restructuring.
* Sanity content powers the game world.
* State remains predictable.
* Components remain reusable.
* Mobile performance remains smooth.
* Replit Agent can implement features without architectural ambiguity.

At that point Rise of the Plants has a frontend architecture suitable for both the Buildathon MVP and future expansion.
