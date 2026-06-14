---
name: Composite lib typecheck
description: Why consumers of composite libs throw TS6305 and how to fix
---

Composite libs in `lib/*` (e.g. game-core, sanity-content) set `composite: true` +
`emitDeclarationOnly` and `exports` point at `./src/index.ts` (consumed as source by
Vite/esbuild). Their `dist/*.d.ts` is NOT emitted by a plain install.

A consumer package whose `tsconfig.json` lists them under `references` will fail
`tsc -p tsconfig.json --noEmit` with `TS6305: Output file '.../dist/index.d.ts' has
not been built` — and that cascades into bogus implicit-any / unknown errors
because the imported types resolve to `any`.

**Fix:** run `pnpm run typecheck:libs` (which is `tsc --build`) once to emit the lib
declarations, then the per-package typecheck passes.

**How to apply:** after adding a new `lib/*` reference to a package's tsconfig, build
libs before typechecking. esbuild bundling does NOT need this (it resolves src via
package exports) — only `tsc` project-reference typecheck does.
