/**
 * Content access layer. Sanity is the source of truth; this wraps the shared
 * content client with a 1-hour in-memory cache so the stateless API stays fast.
 * The client is initialized lazily so the server can boot before Sanity
 * credentials are configured.
 */
import {
  createSanityClient,
  SanityContent,
  DEFAULT_API_VERSION,
  type SpeciesContent,
  type EvolutionPathContent,
  type TaskContent,
  type RarityContent,
  type CodexContent,
} from "@workspace/sanity-content";
import { AppError } from "./envelope";

const TTL_MS = 60 * 60 * 1000; // 1 hour

interface CacheEntry<T> {
  value: T;
  expires: number;
}

class TtlCache {
  private store = new Map<string, CacheEntry<unknown>>();

  async get<T>(key: string, loader: () => Promise<T>): Promise<T> {
    const hit = this.store.get(key);
    if (hit && hit.expires > Date.now()) return hit.value as T;
    const value = await loader();
    this.store.set(key, { value, expires: Date.now() + TTL_MS });
    return value;
  }

  clear(): void {
    this.store.clear();
  }
}

let content: SanityContent | null = null;

function getSanity(): SanityContent {
  if (content) return content;
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;
  if (!projectId || !dataset) {
    throw new AppError(
      503,
      "SANITY_NOT_CONFIGURED",
      "Sanity content is not configured yet. Set SANITY_PROJECT_ID and SANITY_DATASET.",
    );
  }
  const client = createSanityClient({
    projectId,
    dataset,
    apiVersion: process.env.SANITY_API_VERSION ?? DEFAULT_API_VERSION,
    // No token: public reads via CDN for speed.
  });
  content = new SanityContent(client);
  return content;
}

const cache = new TtlCache();

export const ContentAPI = {
  species: (): Promise<SpeciesContent[]> =>
    cache.get("species", () => getSanity().getAllSpecies()),

  async speciesBySlug(slug: string): Promise<SpeciesContent | null> {
    const all = await ContentAPI.species();
    return all.find((s) => s.slug === slug) ?? null;
  },

  evolutions: (): Promise<EvolutionPathContent[]> =>
    cache.get("evolutions", () => getSanity().getEvolutionPaths()),

  tasks: (): Promise<TaskContent[]> =>
    cache.get("tasks", () => getSanity().getTasks()),

  rarities: (): Promise<RarityContent[]> =>
    cache.get("rarities", () => getSanity().getRarities()),

  codex: (): Promise<CodexContent[]> =>
    cache.get("codex", () => getSanity().getAllCodex()),

  async codexBySlug(slug: string): Promise<CodexContent | null> {
    const all = await ContentAPI.codex();
    return all.find((c) => c.plantSlug === slug) ?? null;
  },

  clearCache(): void {
    cache.clear();
  },
};
