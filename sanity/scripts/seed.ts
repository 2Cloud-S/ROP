/**
 * Seeds the Sanity dataset with the canonical Rise of the Plants launch content.
 * Idempotent: uses deterministic _ids + createOrReplace, so it can be re-run safely.
 *
 * Required env: SANITY_PROJECT_ID, SANITY_DATASET, SANITY_WRITE_TOKEN
 * Optional env: SANITY_API_VERSION
 *
 * Run: pnpm --filter @workspace/sanity-studio run seed
 */
import { createClient } from "@sanity/client";
import {
  rarities,
  species,
  evolutions,
  tasks,
  rewards,
  codex,
} from "../content/seedData";

const projectId = process.env.SANITY_PROJECT_ID ?? process.env.SANITY_STUDIO_PROJECT_ID;
const dataset =
  process.env.SANITY_DATASET ?? process.env.SANITY_STUDIO_DATASET ?? "production";
const token = process.env.SANITY_WRITE_TOKEN;
const apiVersion = process.env.SANITY_API_VERSION ?? "2024-10-01";

if (!projectId) {
  throw new Error("SANITY_PROJECT_ID is required to seed.");
}
if (!token) {
  throw new Error(
    "SANITY_WRITE_TOKEN is required to seed (needs write/editor permissions).",
  );
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const rarityId = (key: string) => `rarity-${key}`;
const speciesId = (slug: string) => `species-${slug}`;
const evolutionId = (from: string, to: string) => `evo-${from}-${to}`;
const taskId = (slug: string) => `task-${slug}`;
const rewardId = (type: string) => `reward-${type}`;
const codexId = (slug: string) => `codex-${slug}`;

/**
 * Documents from earlier seed revisions that are no longer part of the canonical
 * roster. createOrReplace only upserts by _id, so removed species/paths must be
 * deleted explicitly. Deleting a missing document is a safe no-op.
 */
const STALE_IDS = [
  "species-dewbud",
  "species-rootkin",
  "species-worldroot",
  "codex-dewbud",
  "codex-rootkin",
  "codex-worldroot",
  "evo-mossling-azure-orchid",
  "evo-azure-orchid-solar-lotus",
  "evo-moon-fern-celestial-rose",
  "evo-rootkin-thorn-sage",
  "evo-thorn-sage-worldroot",
  "evo-dewbud-crystal-vine",
  "evo-leaflet-ember-blossom",
];

let keyCounter = 0;
const nextKey = () => `k${(keyCounter++).toString(36)}`;

function toPortableText(paragraphs: string[]) {
  return paragraphs.map((text) => ({
    _type: "block",
    _key: nextKey(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: nextKey(), text, marks: [] }],
  }));
}

async function seed() {
  const tx = client.transaction();

  for (const id of STALE_IDS) {
    tx.delete(id);
  }

  for (const r of rarities) {
    tx.createOrReplace({
      _id: rarityId(r.key),
      _type: "rarityDefinition",
      name: r.name,
      dropRate: r.dropRate,
      colorHex: r.colorHex,
      glowEffect: r.glowEffect,
      description: r.description,
    });
  }

  for (const s of species) {
    tx.createOrReplace({
      _id: speciesId(s.slug),
      _type: "plantSpecies",
      name: s.name,
      slug: { _type: "slug", current: s.slug },
      rarity: { _type: "reference", _ref: rarityId(s.rarityKey) },
      description: s.description,
      loreExcerpt: s.loreExcerpt,
      personality: s.personality,
      habitat: s.habitat,
      attack: s.attack,
      defense: s.defense,
      health: s.health,
      evolutionStage: s.evolutionStage,
      primaryColor: s.primaryColor,
      discoveryHint: s.discoveryHint,
    });
  }

  for (const e of evolutions) {
    tx.createOrReplace({
      _id: evolutionId(e.from, e.to),
      _type: "evolutionPath",
      fromPlant: { _type: "reference", _ref: speciesId(e.from) },
      toPlant: { _type: "reference", _ref: speciesId(e.to) },
      requiredLevel: e.requiredLevel,
      evolutionDescription: e.evolutionDescription,
    });
  }

  for (const t of tasks) {
    tx.createOrReplace({
      _id: taskId(t.slug),
      _type: "task",
      title: t.title,
      slug: { _type: "slug", current: t.slug },
      description: t.description,
      icon: t.icon,
      rewardType: t.rewardType,
      rewardAmount: t.rewardAmount,
      category: t.category,
      difficulty: t.difficulty,
    });
  }

  for (const r of rewards) {
    tx.createOrReplace({
      _id: rewardId(r.rewardType),
      _type: "rewardDefinition",
      rewardType: r.rewardType,
      displayName: r.displayName,
      icon: r.icon,
      description: r.description,
      value: r.value,
    });
  }

  for (const c of codex) {
    tx.createOrReplace({
      _id: codexId(c.plantSlug),
      _type: "encyclopediaEntry",
      plantReference: { _type: "reference", _ref: speciesId(c.plantSlug) },
      lore: toPortableText(c.lore),
      habitatDetails: c.habitatDetails,
      discoveryStory: c.discoveryStory,
      botanicalNotes: c.botanicalNotes,
      hiddenFact: c.hiddenFact,
    });
  }

  const result = await tx.commit();
  console.log(
    `Seeded Sanity dataset "${dataset}": ${result.results.length} mutations applied.`,
  );
  console.log(
    `  ${rarities.length} rarities, ${species.length} species, ${evolutions.length} evolution paths, ${tasks.length} tasks, ${rewards.length} rewards, ${codex.length} codex entries.`,
  );
  console.log(`  ${STALE_IDS.length} stale documents removed (if present).`);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
