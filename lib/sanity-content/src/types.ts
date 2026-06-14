/** Normalized content shapes returned by the GROQ queries in this package. */

export interface RarityContent {
  name: string;
  slug: string;
  dropRate?: number;
  colorHex?: string;
  glowEffect?: string;
  description?: string;
}

export interface SpeciesContent {
  slug: string;
  name: string;
  description?: string;
  loreExcerpt?: string;
  habitat?: string;
  attack: number;
  defense: number;
  health: number;
  evolutionStage?: number;
  primaryColor?: string;
  discoveryHint?: string;
  rarity: string;
  rarityColor?: string;
  rarityGlow?: string;
  imageUrl?: string;
  gallery?: string[];
}

export interface EvolutionPathContent {
  from: string;
  to: string;
  requiredLevel: number;
  evolutionDescription?: string;
}

export interface TaskContent {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  rewardType?: string;
  rewardAmount?: number;
  cooldownHours?: number;
  category?: string;
  difficulty?: string;
}

/** Portable Text block (loosely typed to avoid a hard dependency). */
export type PortableTextBlock = Record<string, unknown>;

export interface CodexContent {
  plantSlug: string;
  plantName: string;
  lore: PortableTextBlock[];
  habitatDetails?: string;
  discoveryStory?: string;
  botanicalNotes?: string;
  hiddenFact?: string;
}
