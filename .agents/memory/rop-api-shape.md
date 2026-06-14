---
name: ROP stateless game API shape
description: Contract between the ROP frontend and the stateless Express backend
---

Rise of the Plants backend (`artifacts/api-server`, mounted at `/api`) is STATELESS —
no DB. The browser holds the player state in localStorage and round-trips it to the
server on every mutation; the server is the rules authority (game-core) and returns
the updated state.

**Envelope:** success → `{ success: true, data }`; error → `{ success: false, error: { code, message } }`.

**Mutation pattern:** POST body includes the full `PlayerSave` (and `BattleState` for
battle actions) + `demoMode`. Server validates with game-core Zod, applies pure logic,
returns `{ player, ...meta }`. Battle state also round-trips through the client (no
server-side battle storage, no GET /battle/:id).

**Content:** `GET /api/content/{species,species/:slug,evolutions,tasks,rarities,codex,codex/:slug}`
served from Sanity via a 1h in-memory cache; lazy client init returns 503
`SANITY_NOT_CONFIGURED` until `SANITY_PROJECT_ID`/`SANITY_DATASET` env are set.

**Decision — no orval/OpenAPI for the game API.** The envelope + deeply nested
round-tripped state doesn't fit orval's codegen well. Use game-core Zod schemas +
a hand-written typed fetch client on the frontend instead.
**Why:** keeps a single source of truth (game-core) for both server validation and
client types without a codegen layer fighting the envelope.
