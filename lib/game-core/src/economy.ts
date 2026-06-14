/**
 * Rise of the Plants — economy constants and balancing tables.
 * These are the canonical numbers the backend uses as gameplay authority.
 */

export const MAX_LEVEL = 20;

/** Cumulative total XP required to *reach* each level (index = level). */
export const LEVEL_TOTAL_XP: readonly number[] = [
  0, // level 0 (unused)
  0, // level 1
  50,
  120,
  220,
  350,
  520,
  730,
  980,
  1270,
  1600,
  1980,
  2410,
  2890,
  3420,
  4000,
  4630,
  5310,
  6040,
  6820,
  7650, // level 20
];

export const START_RESOURCES = {
  water: 20,
  nutrients: 20,
  sunlight: 20,
} as const;

/** XP granted per unit of resource invested in growth. */
export const XP_PER_RESOURCE = 2;

export type GrowthActionId = "nurture" | "tend" | "flourish";

/**
 * Growth actions. `cost` is the total number of resources consumed from the
 * combined pool (water + nutrients + sunlight). Per the economy spec
 * (1 resource = 2 XP), xp = cost * XP_PER_RESOURCE, i.e. 2/5/10 → 4/10/20.
 */
export const GROWTH_ACTIONS: Record<
  GrowthActionId,
  { id: GrowthActionId; label: string; cost: number; xp: number }
> = {
  nurture: { id: "nurture", label: "Nurture", cost: 2, xp: 4 },
  tend: { id: "tend", label: "Tend", cost: 5, xp: 10 },
  flourish: { id: "flourish", label: "Flourish", cost: 10, xp: 20 },
};

export const DEMO_XP_MULTIPLIER = 3;

/** Evolution stage thresholds (min plant level to be at a given stage). */
export const EVOLUTION_THRESHOLDS = {
  normal: [1, 3, 7, 12], // stage 1..4
  demo: [1, 2, 4, 6],
} as const;

export const MAX_STAGE = 4;

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export const RARITIES: readonly Rarity[] = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
];

/** Discovery roll weights by rarity tier. */
export const DISCOVERY_WEIGHTS: Record<
  "normal" | "demo",
  Record<Rarity, number>
> = {
  normal: { common: 55, uncommon: 25, rare: 14, epic: 5, legendary: 1 },
  demo: { common: 45, uncommon: 25, rare: 20, epic: 7, legendary: 3 },
};

/** Battle rewards. */
export const BATTLE_REWARDS = {
  victory: { water: 5, nutrients: 5, sunlight: 5, xp: 25 },
  defeat: { xp: 10 },
  rareDiscoveryChance: 0.1,
} as const;

/**
 * Allowed task reward kinds. The reward *values* (type, amount, cooldown) are
 * authored in Sanity (the content source of truth) and resolved at runtime by
 * the backend — they are intentionally NOT hard-coded here.
 */
export const TASK_REWARD_KINDS = [
  "water",
  "nutrients",
  "sunlight",
  "mixed",
  "discovery",
] as const;
export type TaskRewardKind = (typeof TASK_REWARD_KINDS)[number];

/** Collection milestones → player titles. */
export const MILESTONES: readonly { count: number; title: string }[] = [
  { count: 0, title: "Sprout" },
  { count: 3, title: "Beginner Botanist" },
  { count: 6, title: "Garden Keeper" },
  { count: 10, title: "Verdant Scholar" },
  { count: 13, title: "Master Botanist" },
];

/** Base stat scaling with level. */
export const STAT_SCALING = {
  attackPerLevel: 2,
  defensePerLevel: 2,
  healthPerLevel: 5,
} as const;
