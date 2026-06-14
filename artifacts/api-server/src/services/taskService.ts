import {
  TASK_REWARDS,
  addResources,
  addDiscovery,
  rollDiscovery,
  type PlayerSave,
} from "@workspace/game-core";
import type { SpeciesContent } from "@workspace/sanity-content";
import { ContentAPI } from "../lib/content";
import { toDiscoveryCandidates } from "../lib/mappers";
import { AppError } from "../lib/envelope";

export interface TaskResult {
  player: PlayerSave;
  reward: { kind: string; amount: number };
  discovered: SpeciesContent | null;
  newlyDiscovered: boolean;
}

const HOUR_MS = 3_600_000;

export async function completeTask(
  player: PlayerSave,
  taskId: string,
  demoMode: boolean,
): Promise<TaskResult> {
  const reward = TASK_REWARDS[taskId];
  if (!reward) {
    throw new AppError(400, "INVALID_TASK", `Unknown task: ${taskId}`);
  }

  const now = Date.now();
  if (reward.cooldownHours) {
    const last = player.lastTaskAt[taskId];
    if (last) {
      const elapsedHours = (now - new Date(last).getTime()) / HOUR_MS;
      if (elapsedHours < reward.cooldownHours) {
        throw new AppError(
          429,
          "TASK_ON_COOLDOWN",
          "This task is still on cooldown.",
        );
      }
    }
  }

  let next: PlayerSave = structuredClone(player);
  let discovered: SpeciesContent | null = null;
  let newlyDiscovered = false;

  switch (reward.kind) {
    case "water":
      next.resources = addResources(next.resources, { water: reward.amount });
      break;
    case "nutrients":
      next.resources = addResources(next.resources, {
        nutrients: reward.amount,
      });
      break;
    case "sunlight":
      next.resources = addResources(next.resources, { sunlight: reward.amount });
      break;
    case "mixed":
      next.resources = addResources(next.resources, {
        water: reward.amount,
        nutrients: reward.amount,
        sunlight: reward.amount,
      });
      break;
    case "discovery": {
      const species = await ContentAPI.species();
      const slug = rollDiscovery(toDiscoveryCandidates(species), demoMode);
      if (slug) {
        const result = addDiscovery(next, slug);
        next = result.player;
        discovered = species.find((s) => s.slug === slug) ?? null;
        newlyDiscovered = result.newlyDiscovered;
      }
      break;
    }
  }

  next.stats.tasksCompleted += 1;
  next.lastTaskAt[taskId] = new Date(now).toISOString();

  return {
    player: next,
    reward: { kind: reward.kind, amount: reward.amount },
    discovered,
    newlyDiscovered,
  };
}
