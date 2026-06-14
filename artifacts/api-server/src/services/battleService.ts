import { randomUUID } from "node:crypto";
import {
  makeCombatant,
  createBattle,
  resolveBattleAction,
  levelForXp,
  stageForLevel,
  addResources,
  addDiscovery,
  rollDiscovery,
  BATTLE_REWARDS,
  DEMO_XP_MULTIPLIER,
  type PlayerSave,
  type BattleState,
  type BattleAction,
} from "@workspace/game-core";
import type { SpeciesContent } from "@workspace/sanity-content";
import { ContentAPI } from "../lib/content";
import { coerceRarity, toSpeciesRef, toDiscoveryCandidates } from "../lib/mappers";
import { AppError } from "../lib/envelope";

export async function startBattle(player: PlayerSave): Promise<BattleState> {
  const active = player.plants.find((p) => p.id === player.activePlantId);
  if (!active) {
    throw new AppError(400, "NO_ACTIVE_PLANT", "No active plant to battle with.");
  }

  const species = await ContentAPI.species();
  const playerSpecies = species.find((s) => s.slug === active.speciesSlug);
  if (!playerSpecies) {
    throw new AppError(
      404,
      "SPECIES_NOT_FOUND",
      "The active plant's species is missing from content.",
    );
  }

  const enemySpecies =
    species[Math.floor(Math.random() * species.length)] ?? playerSpecies;
  // Enemy level roughly matches the player's plant (-1 .. +2).
  const enemyLevel = Math.max(1, active.level + (Math.floor(Math.random() * 4) - 1));

  const playerCombatant = makeCombatant(toSpeciesRef(playerSpecies), active.level);
  const enemyCombatant = makeCombatant(toSpeciesRef(enemySpecies), enemyLevel);

  return createBattle(randomUUID(), playerCombatant, enemyCombatant);
}

export interface BattleActionResult {
  battle: BattleState;
  player: PlayerSave;
  rewards?: {
    outcome: "won" | "lost";
    xp: number;
    resources?: { water: number; nutrients: number; sunlight: number };
    discovered?: SpeciesContent | null;
    newlyDiscovered?: boolean;
  };
}

export async function performBattleAction(
  player: PlayerSave,
  battle: BattleState,
  action: BattleAction,
  demoMode: boolean,
): Promise<BattleActionResult> {
  // Authority guard: the server only ever applies rewards for battles it
  // transitions from "active" itself. A client cannot post an already-resolved
  // ("won"/"lost") battle to mint rewards without actually fighting.
  if (battle.status !== "active") {
    throw new AppError(
      400,
      "BATTLE_NOT_ACTIVE",
      "This battle is already resolved.",
    );
  }
  const nextBattle = resolveBattleAction(battle, action);

  // Battle still ongoing — nothing to apply to the player yet.
  if (nextBattle.status === "active") {
    return { battle: nextBattle, player };
  }

  let next: PlayerSave = structuredClone(player);
  const active = next.plants.find((p) => p.id === next.activePlantId);
  const mult = demoMode ? DEMO_XP_MULTIPLIER : 1;

  if (nextBattle.status === "won") {
    const v = BATTLE_REWARDS.victory;
    next.resources = addResources(next.resources, {
      water: v.water,
      nutrients: v.nutrients,
      sunlight: v.sunlight,
    });
    const xp = v.xp * mult;
    if (active) {
      active.xp += xp;
      active.level = levelForXp(active.xp);
      active.stage = stageForLevel(active.level, demoMode);
    }
    next.stats.battlesWon += 1;

    let discovered: SpeciesContent | null = null;
    let newlyDiscovered = false;
    if (Math.random() < BATTLE_REWARDS.rareDiscoveryChance) {
      const species = await ContentAPI.species();
      const rare = species.filter((s) => coerceRarity(s.rarity) !== "common");
      const slug = rollDiscovery(
        toDiscoveryCandidates(rare.length > 0 ? rare : species),
        demoMode,
      );
      if (slug) {
        const result = addDiscovery(next, slug);
        next = result.player;
        discovered = species.find((s) => s.slug === slug) ?? null;
        newlyDiscovered = result.newlyDiscovered;
      }
    }

    return {
      battle: nextBattle,
      player: next,
      rewards: {
        outcome: "won",
        xp,
        resources: { water: v.water, nutrients: v.nutrients, sunlight: v.sunlight },
        discovered,
        newlyDiscovered,
      },
    };
  }

  // Lost
  const xp = BATTLE_REWARDS.defeat.xp;
  if (active) {
    active.xp += xp;
    active.level = levelForXp(active.xp);
    active.stage = stageForLevel(active.level, demoMode);
  }
  next.stats.battlesLost += 1;

  return {
    battle: nextBattle,
    player: next,
    rewards: { outcome: "lost", xp },
  };
}
