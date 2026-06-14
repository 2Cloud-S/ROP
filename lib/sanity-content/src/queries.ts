/**
 * Centralized GROQ queries. Sanity remains the content source of truth.
 * All projections normalize references (rarity, plant slugs) and resolve
 * image asset URLs so consumers receive flat, typed data.
 */

const SPECIES_PROJECTION = `{
  "slug": slug.current,
  name,
  description,
  loreExcerpt,
  habitat,
  "attack": coalesce(attack, 10),
  "defense": coalesce(defense, 10),
  "health": coalesce(health, 50),
  evolutionStage,
  primaryColor,
  discoveryHint,
  "rarity": lower(rarity->name),
  "rarityColor": rarity->colorHex,
  "rarityGlow": rarity->glowEffect,
  "imageUrl": image.asset->url,
  "gallery": gallery[].asset->url
}`;

export const ALL_SPECIES_QUERY = `*[_type == "plantSpecies"] | order(evolutionStage asc, name asc) ${SPECIES_PROJECTION}`;

export const SPECIES_BY_SLUG_QUERY = `*[_type == "plantSpecies" && slug.current == $slug][0] ${SPECIES_PROJECTION}`;

export const EVOLUTION_PATHS_QUERY = `*[_type == "evolutionPath"]{
  "from": fromPlant->slug.current,
  "to": toPlant->slug.current,
  requiredLevel,
  evolutionDescription
}`;

export const TASKS_QUERY = `*[_type == "task"] | order(category asc, title asc){
  "id": slug.current,
  title,
  description,
  icon,
  rewardType,
  rewardAmount,
  "cooldownHours": coalesce(cooldownHours, 0),
  category,
  difficulty
}`;

export const RARITIES_QUERY = `*[_type == "rarityDefinition"]{
  name,
  "slug": lower(name),
  dropRate,
  colorHex,
  glowEffect,
  description
}`;

export const CODEX_BY_SLUG_QUERY = `*[_type == "encyclopediaEntry" && plantReference->slug.current == $slug][0]{
  "plantSlug": plantReference->slug.current,
  "plantName": plantReference->name,
  lore,
  habitatDetails,
  discoveryStory,
  botanicalNotes,
  hiddenFact
}`;

export const ALL_CODEX_QUERY = `*[_type == "encyclopediaEntry"]{
  "plantSlug": plantReference->slug.current,
  "plantName": plantReference->name,
  lore,
  habitatDetails,
  discoveryStory,
  botanicalNotes,
  hiddenFact
}`;
