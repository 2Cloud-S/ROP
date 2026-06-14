import {
  rollDiscovery,
  addDiscovery,
  type PlayerSave,
} from "@workspace/game-core";
import type { SpeciesContent } from "@workspace/sanity-content";
import { ContentAPI } from "../lib/content";
import { toDiscoveryCandidates } from "../lib/mappers";

export interface DiscoveryResult {
  player: PlayerSave;
  discovered: SpeciesContent | null;
  newlyDiscovered: boolean;
}

/** Roll a weighted discovery (AR scan / nature walk) and record it. */
export async function discover(
  player: PlayerSave,
  demoMode: boolean,
): Promise<DiscoveryResult> {
  const species = await ContentAPI.species();
  const slug = rollDiscovery(toDiscoveryCandidates(species), demoMode);
  if (!slug) return { player, discovered: null, newlyDiscovered: false };

  const { player: nextPlayer, newlyDiscovered } = addDiscovery(player, slug);
  const discovered = species.find((s) => s.slug === slug) ?? null;
  return { player: nextPlayer, discovered, newlyDiscovered };
}
