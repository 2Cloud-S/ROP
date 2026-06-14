---
name: Dev workflow stale build (api-server)
description: api-server serves the previous bundle until the workflow restarts
---

`artifacts/api-server` dev script is `build && start` (esbuild → dist/index.mjs, then
node runs the bundle). It does NOT watch/rebuild. After editing backend source the
running workflow keeps serving the OLD bundle.

**Symptom:** new routes 404 ("Cannot POST /api/..."), old responses returned.

**Fix:** `restart_workflow("artifacts/api-server: API Server")` to rebuild + relaunch,
then re-test.
