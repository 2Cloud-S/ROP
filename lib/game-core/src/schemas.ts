import { z } from "zod";

export const RaritySchema = z.enum([
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
]);

export const GrowthActionSchema = z.enum(["nurture", "tend", "flourish"]);

export const BattleActionSchema = z.enum(["attack", "defend", "special"]);

export const ResourcesSchema = z.object({
  water: z.number().int().min(0),
  nutrients: z.number().int().min(0),
  sunlight: z.number().int().min(0),
});

export const PlantInstanceSchema = z.object({
  id: z.string().min(1),
  speciesSlug: z.string().min(1),
  level: z.number().int().min(1),
  xp: z.number().int().min(0),
  stage: z.number().int().min(1).max(4),
  createdAt: z.string(),
  nickname: z.string().max(40).optional(),
});

export const PlayerStatsSchema = z.object({
  evolutions: z.number().int().min(0),
  battlesWon: z.number().int().min(0),
  battlesLost: z.number().int().min(0),
  tasksCompleted: z.number().int().min(0),
  growthActions: z.number().int().min(0),
});

export const PlayerSaveSchema = z.object({
  id: z.string().min(1),
  createdAt: z.string(),
  title: z.string(),
  resources: ResourcesSchema,
  plants: z.array(PlantInstanceSchema),
  activePlantId: z.string(),
  discoveries: z.array(z.string()),
  achievements: z.array(z.string()),
  stats: PlayerStatsSchema,
  lastTaskAt: z.record(z.string(), z.string()).default({}),
});

export const BattleCombatantSchema = z.object({
  speciesSlug: z.string(),
  name: z.string(),
  level: z.number().int().min(1),
  attack: z.number().int().min(0),
  defense: z.number().int().min(0),
  maxHp: z.number().int().min(1),
  hp: z.number().int().min(0),
});

export const BattleLogEntrySchema = z.object({
  turn: z.number().int(),
  actor: z.enum(["player", "enemy"]),
  action: BattleActionSchema,
  damage: z.number().int().min(0),
  message: z.string(),
});

export const BattleStateSchema = z.object({
  id: z.string(),
  status: z.enum(["active", "won", "lost"]),
  turn: z.number().int().min(1),
  player: BattleCombatantSchema,
  enemy: BattleCombatantSchema,
  log: z.array(BattleLogEntrySchema),
  playerDefending: z.boolean().default(false),
});

/* ---------- Request bodies ---------- */

export const GrowPlantBody = z.object({
  player: PlayerSaveSchema,
  plantId: z.string().min(1),
  action: GrowthActionSchema,
  demoMode: z.boolean().default(false),
});

export const EvolvePlantBody = z.object({
  player: PlayerSaveSchema,
  plantId: z.string().min(1),
  demoMode: z.boolean().default(false),
});

export const ActivatePlantBody = z.object({
  player: PlayerSaveSchema,
  plantId: z.string().min(1),
});

export const CompleteTaskBody = z.object({
  player: PlayerSaveSchema,
  taskId: z.string().min(1),
  demoMode: z.boolean().default(false),
});

export const StartBattleBody = z.object({
  player: PlayerSaveSchema,
  demoMode: z.boolean().default(false),
});

export const BattleActionBody = z.object({
  player: PlayerSaveSchema,
  battle: BattleStateSchema,
  action: BattleActionSchema,
  demoMode: z.boolean().default(false),
});

export const CreateSessionBody = z.object({
  id: z.string().optional(),
});
