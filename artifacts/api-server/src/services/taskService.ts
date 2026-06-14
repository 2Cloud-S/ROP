import {
  addResources,
  addDiscovery,
  rollDiscovery,
  TASK_REWARD_KINDS,
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
  // Sanity is the source of truth for task rewards/cooldowns.
  const tasks = await ContentAPI.tasks();
  const task = tasks.find((t) => t.id === taskId);
  if (!task) {
    throw new AppError(400, "INVALID_TASK", `Unknown task: ${taskId}`);
  }

  const kind = task.rewardType ?? "";
  if (!(TASK_REWARD_KINDS as readonly string[]).includes(kind)) {
    throw new AppError(
      400,
      "INVALID_TASK",
      `Task "${taskId}" has an unsupported reward type.`,
    );
  }

  const amount = task.rewardAmount ?? 0;
  if (!Number.isFinite(amount) || amount < 0 || amount > 1000) {
    throw new AppError(
      400,
      "INVALID_TASK",
      `Task "${taskId}" has an out-of-range reward amount.`,
    );
  }
  const cooldownHours = task.cooldownHours ?? 0;

  const now = Date.now();
  if (cooldownHours > 0) {
    const last = player.lastTaskAt[taskId];
    if (last) {
      const elapsedHours = (now - new Date(last).getTime()) / HOUR_MS;
      if (elapsedHours < cooldownHours) {
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

  switch (kind) {
    case "water":
      next.resources = addResources(next.resources, { water: amount });
      break;
    case "nutrients":
      next.resources = addResources(next.resources, {
        nutrients: amount,
      });
      break;
    case "sunlight":
      next.resources = addResources(next.resources, { sunlight: amount });
      break;
    case "mixed":
      next.resources = addResources(next.resources, {
        water: amount,
        nutrients: amount,
        sunlight: amount,
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
    reward: { kind, amount },
    discovered,
    newlyDiscovered,
  };
}
