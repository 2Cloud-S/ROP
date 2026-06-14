---
name: ROP path-based artifact routing (frontend↔backend)
description: Why the web app's same-origin /api base is correct and needs no proxy/port config.
---

In this pnpm-workspace monorepo, frontend↔backend connectivity is handled by
Replit **path-based artifact routing**, NOT by a Vite proxy or a configurable API
origin. Each artifact's `.replit-artifact/artifact.toml` declares `paths`:
- `artifacts/api-server` → `paths = ["/api"]`
- `artifacts/rop` (web) → `paths = ["/"]`, `router = "path"`

The shared workspace proxy (dev, `localhost:80` / the `.replit.dev` domain) and the
application deployment router (prod, `deploymentTarget=autoscale`, `router="application"`)
route `/api/*` to the backend service and everything else to the SPA. The web
client therefore correctly uses a same-origin base `` `${import.meta.env.BASE_URL}api` ``.

**Why:** code review repeatedly flagged this as a "blocking integration failure"
(claiming frontend/backend are on separate ports with no bridge, citing `.replit`
`[[ports]]` like `8082->3001`). Those raw `.replit` port mappings are unused
leftovers — per the deployment skill, in a pnpm workspace the `.replit`
`deployment.run` is ignored and routing/run is governed by each artifact's
`artifact.toml`. Verified empirically: `POST /api/session` and `/api/healthz`
return valid JSON / 200 through both `localhost:80` and the dev domain, while `/`
returns SPA HTML.

**How to apply:** do NOT add a Vite `server.proxy` for `/api`, do NOT introduce a
`VITE_API_BASE_URL` pointing at another origin, and do NOT edit `.replit` ports to
"fix" connectivity — that would break the platform's path routing. Same-origin
base prefixed with `BASE_URL` is the correct, platform-recommended pattern.
