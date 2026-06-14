import { createClient, type SanityClient } from "@sanity/client";
import {
  ALL_SPECIES_QUERY,
  SPECIES_BY_SLUG_QUERY,
  EVOLUTION_PATHS_QUERY,
  TASKS_QUERY,
  RARITIES_QUERY,
  CODEX_BY_SLUG_QUERY,
  ALL_CODEX_QUERY,
} from "./queries";
import type {
  SpeciesContent,
  EvolutionPathContent,
  TaskContent,
  RarityContent,
  CodexContent,
} from "./types";

export interface SanityConfig {
  projectId: string;
  dataset: string;
  apiVersion?: string;
  token?: string;
  useCdn?: boolean;
}

export const DEFAULT_API_VERSION = "2024-10-01";

export function createSanityClient(config: SanityConfig): SanityClient {
  return createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: config.apiVersion ?? DEFAULT_API_VERSION,
    token: config.token,
    // Use the CDN for fast public reads; disable when a token is present.
    useCdn: config.useCdn ?? !config.token,
    perspective: "published",
  });
}

/** Thin typed wrapper around a SanityClient exposing the game content queries. */
export class SanityContent {
  constructor(private readonly client: SanityClient) {}

  getAllSpecies(): Promise<SpeciesContent[]> {
    return this.client.fetch(ALL_SPECIES_QUERY);
  }

  getSpeciesBySlug(slug: string): Promise<SpeciesContent | null> {
    return this.client.fetch(SPECIES_BY_SLUG_QUERY, { slug });
  }

  getEvolutionPaths(): Promise<EvolutionPathContent[]> {
    return this.client.fetch(EVOLUTION_PATHS_QUERY);
  }

  getTasks(): Promise<TaskContent[]> {
    return this.client.fetch(TASKS_QUERY);
  }

  getRarities(): Promise<RarityContent[]> {
    return this.client.fetch(RARITIES_QUERY);
  }

  getCodexBySlug(slug: string): Promise<CodexContent | null> {
    return this.client.fetch(CODEX_BY_SLUG_QUERY, { slug });
  }

  getAllCodex(): Promise<CodexContent[]> {
    return this.client.fetch(ALL_CODEX_QUERY);
  }
}
