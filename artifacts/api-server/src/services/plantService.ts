import {
  applyGrowth,
  applyEvolution,
  nextEvolution,
  GameError,
  type PlayerSave,
  type GrowthActionId,
  type EvolutionStep,
  type GrowthResult,
  type EvolutionResult,
} from "@workspace/game-core";
import { ContentAPI } from "../lib/content";
import { AppError } from "../lib/envelope";

export function growPlant(
  player: PlayerSave,
  plantId: string,
  action: GrowthActionId,
  demoMode: boolean,
): GrowthResult {
  return applyGrowth(player, plantId, action, demoMode);
}

export async function evolvePlant(
  player: PlayerSave,
  plantId: string,
  demoMode: boolean,
): Promise<EvolutionResult> {
  const plant = player.plants.find((p) => p.id === plantId);
  if (!plant) throw new GameError("PLANT_NOT_FOUND", "Plant not found");

  const paths = await ContentAPI.evolutions();
  const chain: EvolutionStep[] = paths
    .filter((p) => p.from === plant.speciesSlug)
    .map((p) => ({ toSlug: p.to, requiredLevel: p.requiredLevel }));

  if (chain.length === 0) {
    throw new AppError(
      400,
      "NO_EVOLUTION",
      "This plant has reached the end of its evolution path.",
    );
  }

  const step = nextEvolution(plant, chain, demoMode);
  if (!step) {
    throw new AppError(
      400,
      "EVOLUTION_NOT_READY",
      "This plant needs to grow more before it can evolve.",
    );
  }

  return applyEvolution(player, plantId, step, demoMode);
}
