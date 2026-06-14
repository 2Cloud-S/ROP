import { randomUUID } from "node:crypto";
import {
  START_RESOURCES,
  titleForDiscoveries,
  type PlayerSave,
} from "@workspace/game-core";
import { ContentAPI } from "../lib/content";
import { coerceRarity } from "../lib/mappers";
import { AppError } from "../lib/envelope";

const PREFERRED_STARTER = "mossling";

/** Build a fresh authoritative player save with a single starter plant. */
export async function createSession(id?: string): Promise<PlayerSave> {
  const species = await ContentAPI.species();
  if (species.length === 0) {
    throw new AppError(503, "NO_CONTENT", "No species content is available yet.");
  }

  const starter =
    species.find((s) => s.slug === PREFERRED_STARTER) ??
    species.find((s) => coerceRarity(s.rarity) === "common") ??
    species[0]!;

  const now = new Date().toISOString();
  const plantId = randomUUID();

  return {
    id: id ?? randomUUID(),
    createdAt: now,
    title: titleForDiscoveries(1),
    resources: { ...START_RESOURCES },
    plants: [
      {
        id: plantId,
        speciesSlug: starter.slug,
        level: 1,
        xp: 0,
        stage: 1,
        createdAt: now,
      },
    ],
    activePlantId: plantId,
    discoveries: [starter.slug],
    achievements: [],
    stats: {
      evolutions: 0,
      battlesWon: 0,
      battlesLost: 0,
      tasksCompleted: 0,
      growthActions: 0,
    },
    lastTaskAt: {},
  };
}
