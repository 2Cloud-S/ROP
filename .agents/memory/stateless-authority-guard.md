---
name: Stateless authority guard
description: Server must reject already-terminal client-posted game state before applying rewards.
---

The ROP backend is stateless and trusts the client to round-trip `PlayerSave`/`BattleState`. Schema validation (Zod) alone is NOT enough for integrity.

**Rule:** Any endpoint that grants rewards from a state transition must verify the *incoming* state is still in-progress and let the server perform the transition. For battle: `/api/battle/action` rejects any incoming `battle.status !== "active"` with 400 `BATTLE_NOT_ACTIVE`, then `resolveBattleAction` derives won/lost from HP.

**Why:** A client could post a schema-valid battle with `status:"won"` (or `enemy.hp:0`); the old code short-circuited on non-active status and minted XP/resources without a real fight. Found in code review, verified live.

**How to apply:** When adding any reward-on-completion endpoint, gate on "is this transition the server's to make?" — never apply effects for a terminal state the client handed you. Cheating one's own localStorage progress is acceptable for this game; forging reward grants is not.

## Idempotent milestone/threshold unlocks in a stateless model
Collection-milestone discovery unlocks (3/6/10/13) are granted server-side, but
the stateless server cannot tell "just crossed the threshold" from "client
re-submitted a save already past it." Record each claimed milestone in a
persisted marker on the save (the `achievements` array, e.g. `milestone:3`) and
skip any milestone already marked.

**Why:** without a claim marker, every request whose discovery count is >= a
threshold would re-roll a bonus, letting a player farm unlocks by replaying
requests. A milestone bonus also adds a discovery, which can cross the next
threshold, so process milestones in a loop until none remain.

**How to apply:** any "reward once when X reaches N" rule on a client-supplied
save needs an explicit persisted claim flag — never infer "first time" from the
current counter alone.
