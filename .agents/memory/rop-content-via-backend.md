---
name: ROP content flows through the backend, not the client
description: Why the ROP frontend has no VITE_SANITY env and why the app can't boot until Sanity is seeded
---

The "Rise of the Plants" frontend consumes ALL Sanity content through the stateless
Express backend's `/api/content/*` endpoints (which wrap `@workspace/sanity-content`
with a ~1h cache). The browser never talks to Sanity directly.

**Why:** keeps the Sanity read path in one cached place, avoids shipping any Sanity
config to the client, and means only the backend needs `SANITY_PROJECT_ID` /
`SANITY_DATASET` / `SANITY_API_VERSION`. There is intentionally **no** `VITE_SANITY_*`
client env (this deviates from the original session-plan note that mentioned it).

**How to apply:** add new content reads as backend routes + a method on the typed
`api` client in `artifacts/rop/src/lib/api.ts`, then a React Query hook in
`useContent.ts`. Do not import `@sanity/client` into the frontend.

**Boot gotcha:** `createSession` (sessionService) calls `ContentAPI.species()` and
throws 503 `NO_CONTENT` when the dataset is empty. So the rop app cannot finish
`init()` / show the game until the Sanity dataset is seeded
(`pnpm --filter @workspace/sanity-studio run seed`). Seed needs `SANITY_WRITE_TOKEN`
(Editor); runtime reads do not.
