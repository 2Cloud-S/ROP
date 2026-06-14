---
name: Sanity CDN cold-start cache poisoning
description: Never cache empty content arrays — a CDN cold-start [] poisons the cache for the full TTL.
---

The api-server content layer (`artifacts/api-server/src/lib/content.ts`) caches Sanity reads for 1h. Right after a fresh seed, the token-less CDN read can briefly return `[]` before propagation.

**Rule:** The TtlCache refuses to store empty arrays, so the next request retries instead of serving `[]` for the whole TTL.

**Why:** After seeding 13 species, `/api/content/species` returned `[]` and the app couldn't boot (createSession needs species). Root cause: an early request cached the cold-start empty result; the data was actually in Sanity (direct curl returned 13). Restarting "fixed" it only because the CDN had since warmed.

**How to apply:** Any cache over eventually-consistent external content should treat empty/missing as non-cacheable (or use a short negative-TTL). Don't assume a restart is the fix — verify the upstream directly first.
