---
name: Stateless authority guard
description: Server must reject already-terminal client-posted game state before applying rewards.
---

The ROP backend is stateless and trusts the client to round-trip `PlayerSave`/`BattleState`. Schema validation (Zod) alone is NOT enough for integrity.

**Rule:** Any endpoint that grants rewards from a state transition must verify the *incoming* state is still in-progress and let the server perform the transition. For battle: `/api/battle/action` rejects any incoming `battle.status !== "active"` with 400 `BATTLE_NOT_ACTIVE`, then `resolveBattleAction` derives won/lost from HP.

**Why:** A client could post a schema-valid battle with `status:"won"` (or `enemy.hp:0`); the old code short-circuited on non-active status and minted XP/resources without a real fight. Found in code review, verified live.

**How to apply:** When adding any reward-on-completion endpoint, gate on "is this transition the server's to make?" — never apply effects for a terminal state the client handed you. Cheating one's own localStorage progress is acceptable for this game; forging reward grants is not.
