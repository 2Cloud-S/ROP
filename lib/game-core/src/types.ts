import type { z } from "zod";
import type {
  ResourcesSchema,
  PlantInstanceSchema,
  PlayerStatsSchema,
  PlayerSaveSchema,
  BattleCombatantSchema,
  BattleLogEntrySchema,
  BattleStateSchema,
} from "./schemas";

export type Resources = z.infer<typeof ResourcesSchema>;
export type PlantInstance = z.infer<typeof PlantInstanceSchema>;
export type PlayerStats = z.infer<typeof PlayerStatsSchema>;
export type PlayerSave = z.infer<typeof PlayerSaveSchema>;
export type BattleCombatant = z.infer<typeof BattleCombatantSchema>;
export type BattleLogEntry = z.infer<typeof BattleLogEntrySchema>;
export type BattleState = z.infer<typeof BattleStateSchema>;

export type BattleAction = "attack" | "defend" | "special";

/** Minimal species shape the pure logic needs (resolved from Sanity by callers). */
export interface SpeciesRef {
  slug: string;
  name: string;
  rarity: import("./economy").Rarity;
  baseAttack: number;
  baseDefense: number;
  baseHealth: number;
}

/** An evolution step resolved from Sanity. */
export interface EvolutionStep {
  toSlug: string;
  requiredLevel: number;
}
