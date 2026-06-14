import {
  LEVEL_TOTAL_XP,
  MAX_LEVEL,
  GROWTH_ACTIONS,
  type GrowthActionId,
  DEMO_XP_MULTIPLIER,
  EVOLUTION_THRESHOLDS,
  MAX_STAGE,
  DISCOVERY_WEIGHTS,
  MILESTONES,
  STAT_SCALING,
  type Rarity,
} from "./economy";
import type {
  PlayerSave,
  PlantInstance,
  BattleState,
  BattleCombatant,
  BattleLogEntry,
  BattleAction,
  SpeciesRef,
  EvolutionStep,
  Resources,
} from "./types";

export type Rng = () => number;

/* ----------------------------- XP / Level ----------------------------- */

export function levelForXp(xp: number): number {
  let level = 1;
  for (let l = MAX_LEVEL; l >= 1; l--) {
    if (xp >= (LEVEL_TOTAL_XP[l] ?? Infinity)) {
      level = l;
      break;
    }
  }
  return level;
}

export function xpToReachLevel(level: number): number {
  const clamped = Math.max(1, Math.min(MAX_LEVEL, level));
  return LEVEL_TOTAL_XP[clamped] ?? 0;
}

/** Progress info for a plant's current level (for progress bars). */
export function levelProgress(xp: number): {
  level: number;
  xpIntoLevel: number;
  xpForLevel: number;
  isMax: boolean;
} {
  const level = levelForXp(xp);
  const current = xpToReachLevel(level);
  if (level >= MAX_LEVEL) {
    return { level, xpIntoLevel: 0, xpForLevel: 0, isMax: true };
  }
  const next = xpToReachLevel(level + 1);
  return {
    level,
    xpIntoLevel: xp - current,
    xpForLevel: next - current,
    isMax: false,
  };
}

export function stageForLevel(level: number, demoMode: boolean): number {
  const thresholds = demoMode
    ? EVOLUTION_THRESHOLDS.demo
    : EVOLUTION_THRESHOLDS.normal;
  let stage = 1;
  for (let i = 0; i < thresholds.length; i++) {
    if (level >= (thresholds[i] as number)) stage = i + 1;
  }
  return Math.min(stage, MAX_STAGE);
}

/* ----------------------------- Titles ----------------------------- */

export function titleForDiscoveries(count: number): string {
  let title = MILESTONES[0]!.title;
  for (const m of MILESTONES) {
    if (count >= m.count) title = m.title;
  }
  return title;
}

/* ----------------------------- Growth ----------------------------- */

export interface GrowthResult {
  player: PlayerSave;
  xpGained: number;
  fromLevel: number;
  toLevel: number;
  leveledUp: boolean;
  fromStage: number;
  toStage: number;
  evolutionReady: boolean;
}

export class GameError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "GameError";
  }
}

function findPlant(player: PlayerSave, plantId: string): PlantInstance {
  const plant = player.plants.find((p) => p.id === plantId);
  if (!plant) throw new GameError("PLANT_NOT_FOUND", "Plant not found");
  return plant;
}

export function applyGrowth(
  player: PlayerSave,
  plantId: string,
  actionId: GrowthActionId,
  demoMode: boolean,
): GrowthResult {
  const next: PlayerSave = structuredClone(player);
  const plant = findPlant(next, plantId);
  const action = GROWTH_ACTIONS[actionId];

  const { water, nutrients, sunlight } = next.resources;
  if (water < action.cost || nutrients < action.cost || sunlight < action.cost) {
    throw new GameError(
      "INSUFFICIENT_RESOURCES",
      "Not enough resources for this action",
    );
  }

  next.resources.water -= action.cost;
  next.resources.nutrients -= action.cost;
  next.resources.sunlight -= action.cost;

  const xpGained = action.xp * (demoMode ? DEMO_XP_MULTIPLIER : 1);
  const fromLevel = plant.level;
  const fromStage = plant.stage;

  plant.xp += xpGained;
  plant.level = levelForXp(plant.xp);
  plant.stage = stageForLevel(plant.level, demoMode);

  next.stats.growthActions += 1;

  return {
    player: next,
    xpGained,
    fromLevel,
    toLevel: plant.level,
    leveledUp: plant.level > fromLevel,
    fromStage,
    toStage: plant.stage,
    evolutionReady: plant.stage > fromStage,
  };
}

/* ----------------------------- Evolution ----------------------------- */

export interface EvolutionResult {
  player: PlayerSave;
  fromSlug: string;
  toSlug: string;
  newlyDiscovered: boolean;
}

/**
 * Determine which evolution step (if any) a plant qualifies for.
 * `chain` is the ordered list of evolution steps for the plant's current species.
 */
export function nextEvolution(
  plant: PlantInstance,
  chain: EvolutionStep[],
  demoMode: boolean,
): EvolutionStep | null {
  for (const step of chain) {
    const required = demoMode
      ? Math.min(step.requiredLevel, demoRequiredLevel(step.requiredLevel))
      : step.requiredLevel;
    if (plant.level >= required) return step;
  }
  return null;
}

/** Map a normal required level onto the compressed demo curve. */
function demoRequiredLevel(normalLevel: number): number {
  const normal = EVOLUTION_THRESHOLDS.normal;
  const demo = EVOLUTION_THRESHOLDS.demo;
  const idx = normal.findIndex((l) => l === normalLevel);
  if (idx >= 0) return demo[idx] as number;
  return normalLevel;
}

export function applyEvolution(
  player: PlayerSave,
  plantId: string,
  step: EvolutionStep,
  demoMode: boolean,
): EvolutionResult {
  const next: PlayerSave = structuredClone(player);
  const plant = findPlant(next, plantId);
  const fromSlug = plant.speciesSlug;

  plant.speciesSlug = step.toSlug;
  plant.stage = stageForLevel(plant.level, demoMode);

  let newlyDiscovered = false;
  if (!next.discoveries.includes(step.toSlug)) {
    next.discoveries.push(step.toSlug);
    newlyDiscovered = true;
  }

  next.stats.evolutions += 1;
  next.title = titleForDiscoveries(next.discoveries.length);

  return { player: next, fromSlug, toSlug: step.toSlug, newlyDiscovered };
}

/* ----------------------------- Discovery ----------------------------- */

export function rollDiscovery(
  candidates: { slug: string; rarity: Rarity }[],
  demoMode: boolean,
  rng: Rng = Math.random,
): string | null {
  if (candidates.length === 0) return null;
  const weights = demoMode ? DISCOVERY_WEIGHTS.demo : DISCOVERY_WEIGHTS.normal;

  const byRarity = new Map<Rarity, string[]>();
  for (const c of candidates) {
    const list = byRarity.get(c.rarity) ?? [];
    list.push(c.slug);
    byRarity.set(c.rarity, list);
  }

  const presentTiers = [...byRarity.keys()];
  const totalWeight = presentTiers.reduce((sum, r) => sum + (weights[r] ?? 0), 0);
  if (totalWeight <= 0) {
    const all = candidates.map((c) => c.slug);
    return all[Math.floor(rng() * all.length)] ?? null;
  }

  let roll = rng() * totalWeight;
  let chosenTier: Rarity = presentTiers[0]!;
  for (const tier of presentTiers) {
    roll -= weights[tier] ?? 0;
    if (roll <= 0) {
      chosenTier = tier;
      break;
    }
  }

  const pool = byRarity.get(chosenTier)!;
  return pool[Math.floor(rng() * pool.length)] ?? null;
}

export function addDiscovery(player: PlayerSave, slug: string): {
  player: PlayerSave;
  newlyDiscovered: boolean;
} {
  if (player.discoveries.includes(slug)) {
    return { player, newlyDiscovered: false };
  }
  const next: PlayerSave = structuredClone(player);
  next.discoveries.push(slug);
  next.title = titleForDiscoveries(next.discoveries.length);
  return { player: next, newlyDiscovered: true };
}

/* ----------------------------- Resources / Tasks ----------------------------- */

export function addResources(
  resources: Resources,
  delta: Partial<Resources>,
): Resources {
  return {
    water: Math.max(0, resources.water + (delta.water ?? 0)),
    nutrients: Math.max(0, resources.nutrients + (delta.nutrients ?? 0)),
    sunlight: Math.max(0, resources.sunlight + (delta.sunlight ?? 0)),
  };
}

/* ----------------------------- Battle ----------------------------- */

export function scaleStats(
  base: { baseAttack: number; baseDefense: number; baseHealth: number },
  level: number,
): { attack: number; defense: number; maxHp: number } {
  return {
    attack: base.baseAttack + level * STAT_SCALING.attackPerLevel,
    defense: base.baseDefense + level * STAT_SCALING.defensePerLevel,
    maxHp: base.baseHealth + level * STAT_SCALING.healthPerLevel,
  };
}

export function makeCombatant(
  species: SpeciesRef,
  level: number,
): BattleCombatant {
  const stats = scaleStats(species, level);
  return {
    speciesSlug: species.slug,
    name: species.name,
    level,
    attack: stats.attack,
    defense: stats.defense,
    maxHp: stats.maxHp,
    hp: stats.maxHp,
  };
}

export function createBattle(
  id: string,
  playerCombatant: BattleCombatant,
  enemyCombatant: BattleCombatant,
): BattleState {
  return {
    id,
    status: "active",
    turn: 1,
    player: playerCombatant,
    enemy: enemyCombatant,
    log: [],
    playerDefending: false,
  };
}

function computeDamage(
  attack: number,
  defense: number,
  defending: boolean,
  rng: Rng,
): number {
  const raw = attack - defense * 0.5;
  const base = Math.max(1, raw);
  const variance = 0.85 + rng() * 0.3; // ±15%
  let dmg = Math.round(base * variance);
  if (defending) dmg = Math.max(1, Math.round(dmg * 0.5));
  return Math.max(1, dmg);
}

export function resolveBattleAction(
  battle: BattleState,
  action: BattleAction,
  rng: Rng = Math.random,
): BattleState {
  if (battle.status !== "active") return battle;
  const next: BattleState = structuredClone(battle);
  const log: BattleLogEntry[] = next.log;

  // --- Player action ---
  next.playerDefending = false;
  if (action === "defend") {
    next.playerDefending = true;
    log.push({
      turn: next.turn,
      actor: "player",
      action,
      damage: 0,
      message: `${next.player.name} braces and gathers strength.`,
    });
  } else {
    const power = action === "special" ? next.player.attack * 1.6 : next.player.attack;
    const dmg = computeDamage(power, next.enemy.defense, false, rng);
    next.enemy.hp = Math.max(0, next.enemy.hp - dmg);
    log.push({
      turn: next.turn,
      actor: "player",
      action,
      damage: dmg,
      message:
        action === "special"
          ? `${next.player.name} unleashes a surge of life energy for ${dmg}!`
          : `${next.player.name} strikes for ${dmg}.`,
    });
  }

  if (next.enemy.hp <= 0) {
    next.status = "won";
    return next;
  }

  // --- Enemy action (simple AI) ---
  const enemyRoll = rng();
  let enemyAction: BattleAction = "attack";
  if (enemyRoll > 0.85) enemyAction = "special";
  if (enemyRoll < 0.12) enemyAction = "defend";

  if (enemyAction === "defend") {
    log.push({
      turn: next.turn,
      actor: "enemy",
      action: enemyAction,
      damage: 0,
      message: `${next.enemy.name} hardens its bark.`,
    });
  } else {
    const power =
      enemyAction === "special" ? next.enemy.attack * 1.5 : next.enemy.attack;
    const dmg = computeDamage(power, next.player.defense, next.playerDefending, rng);
    next.player.hp = Math.max(0, next.player.hp - dmg);
    log.push({
      turn: next.turn,
      actor: "enemy",
      action: enemyAction,
      damage: dmg,
      message:
        enemyAction === "special"
          ? `${next.enemy.name} retaliates fiercely for ${dmg}!`
          : `${next.enemy.name} hits back for ${dmg}.`,
    });
  }

  if (next.player.hp <= 0) {
    next.status = "lost";
    return next;
  }

  next.turn += 1;
  return next;
}
