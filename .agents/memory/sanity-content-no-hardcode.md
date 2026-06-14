---
name: Sanity content must be runtime-resolved, not hardcoded
description: Buildathon rule — task rewards, cooldowns, codex lore, economy come from Sanity/spec at runtime; hardcoding them gets review-rejected.
---

# Sanity is the content source of truth — do not hardcode content

The ROP Buildathon premise is "Sanity = content source of truth." Any
player-facing content or reward value that lives in Sanity MUST be resolved
at runtime from Sanity (through the cached `/api/content/*` layer), not
baked into frontend or backend constants.

Things that got code-review-rejected for being hardcoded:
- Task reward kind/amount/cooldown — must come from the Sanity task doc, resolved
  at runtime by the backend, never a local constant table on either tier.
- Codex lore — Sanity stores Portable Text; render it with `@portabletext/react`,
  do not collapse it to a plain string.

When you resolve reward values from CMS content, bound them server-side
(non-negative, sane upper limit) so misconfigured content can't distort the economy.

**Why:** reviewers check fidelity to the "Sanity authority" premise, not just
that the feature works. A working feature fed by a local constant still fails
review because it defects from the architecture.

**How to apply:** before hardcoding any reward number, label, lore string, or
gameplay-content table, check whether it has (or should have) a Sanity schema
field. If yes, add the field, seed it, expose it through the content query/type,
and read it at runtime. Code constants are only for pure mechanics
(e.g. game-core economy formulas), never for editable content.

## Economy numbers are spec-defined, deduct from the combined pool
Growth actions cost 2/5/10 resources and grant 4/10/20 XP (1 resource = 2 XP).
The cost is deducted from the COMBINED resource pool (drain order
water → nutrients → sunlight), gated on `total >= cost` — not from all three
pools independently. Match the GAME_ECONOMY spec exactly; a wrong multiple
(e.g. 12/30/60) is a review failure even though the code "works."
