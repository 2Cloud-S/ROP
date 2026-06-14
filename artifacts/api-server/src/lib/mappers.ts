import { RARITIES, type Rarity, type SpeciesRef } from "@workspace/game-core";
import type { SpeciesContent } from "@workspace/sanity-content";

/** Coerce an arbitrary content rarity string into a known Rarity tier. */
export function coerceRarity(value?: string): Rarity {
  const v = (value ?? "").toLowerCase();
  return (RARITIES as readonly string[]).includes(v) ? (v as Rarity) : "common";
}

/** Map Sanity species content into the minimal shape the pure logic needs. */
export function toSpeciesRef(s: SpeciesContent): SpeciesRef {
  return {
    slug: s.slug,
    name: s.name,
    rarity: coerceRarity(s.rarity),
    baseAttack: s.attack,
    baseDefense: s.defense,
    baseHealth: s.health,
  };
}

/** Discovery candidate list for the weighted roll. */
export function toDiscoveryCandidates(
  species: SpeciesContent[],
): { slug: string; rarity: Rarity }[] {
  return species.map((s) => ({ slug: s.slug, rarity: coerceRarity(s.rarity) }));
}
