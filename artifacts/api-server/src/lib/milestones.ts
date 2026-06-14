import {
  processMilestoneUnlocks,
  type PlayerSave,
} from "@workspace/game-core";
import type { SpeciesContent } from "@workspace/sanity-content";
import { ContentAPI } from "./content";
import { toDiscoveryCandidates } from "./mappers";

export interface MilestoneUnlockInfo {
  milestone: number;
  slug: string;
  species: SpeciesContent | null;
}

/**
 * Apply collection-milestone discovery unlocks (3/6/10/13) server-side. Safe to
 * call after any mutation that may have changed `player.discoveries`; it is
 * idempotent (already-claimed milestones are recorded in `player.achievements`).
 */
export async function applyMilestones(
  player: PlayerSave,
  demoMode: boolean,
): Promise<{ player: PlayerSave; milestoneUnlocks: MilestoneUnlockInfo[] }> {
  const species = await ContentAPI.species();
  const { player: next, unlocks } = processMilestoneUnlocks(
    player,
    toDiscoveryCandidates(species),
    demoMode,
  );
  return {
    player: next,
    milestoneUnlocks: unlocks.map((u) => ({
      milestone: u.milestone,
      slug: u.slug,
      species: species.find((s) => s.slug === u.slug) ?? null,
    })),
  };
}
