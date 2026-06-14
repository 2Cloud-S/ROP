import type {
  PlayerSave,
  BattleState,
  BattleAction,
  GrowthActionId,
  GrowthResult,
  EvolutionResult,
  Resources,
} from "@workspace/game-core";
import type {
  SpeciesContent,
  EvolutionPathContent,
  TaskContent,
  RarityContent,
  CodexContent,
} from "@workspace/sanity-content";

// Same-origin API base. This monorepo uses Replit path-based artifact routing:
// the api-server artifact declares `paths = ["/api"]` and this web artifact
// declares `paths = ["/"]`, so the shared proxy (dev) and the application
// deployment router (prod) route `/api/*` to the backend and everything else to
// this SPA. There is therefore NO separate API origin/port to configure and no
// Vite proxy needed — `${BASE_URL}api` is the correct, platform-recommended base.
const API_BASE = `${import.meta.env.BASE_URL}api`;

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type Envelope<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

async function request<T>(
  path: string,
  init?: Omit<RequestInit, "body"> & { body?: unknown },
): Promise<T> {
  const { body, ...rest } = init ?? {};
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...rest,
      headers: {
        "content-type": "application/json",
        ...(rest.headers ?? {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "Could not reach the server.");
  }

  let json: Envelope<T> | null = null;
  try {
    json = (await res.json()) as Envelope<T>;
  } catch {
    throw new ApiError(res.status, "BAD_RESPONSE", "Malformed server response.");
  }

  if (!json || json.success !== true) {
    const err = json && json.success === false ? json.error : undefined;
    throw new ApiError(
      res.status,
      err?.code ?? "UNKNOWN",
      err?.message ?? "Request failed.",
    );
  }
  return json.data;
}

export interface MilestoneUnlockInfo {
  milestone: number;
  slug: string;
  species: SpeciesContent | null;
}

export interface TaskResult {
  player: PlayerSave;
  reward: { kind: string; amount: number };
  discovered: SpeciesContent | null;
  newlyDiscovered: boolean;
  milestoneUnlocks?: MilestoneUnlockInfo[];
}

export interface DiscoveryResult {
  player: PlayerSave;
  discovered: SpeciesContent | null;
  newlyDiscovered: boolean;
  milestoneUnlocks?: MilestoneUnlockInfo[];
}

export interface EvolveResult extends EvolutionResult {
  milestoneUnlocks?: MilestoneUnlockInfo[];
}

export interface BattleRewards {
  outcome: "won" | "lost";
  xp: number;
  resources?: Resources;
  discovered?: SpeciesContent | null;
  newlyDiscovered?: boolean;
}

export interface BattleActionResult {
  battle: BattleState;
  player: PlayerSave;
  rewards?: BattleRewards;
  milestoneUnlocks?: MilestoneUnlockInfo[];
}

export const api = {
  content: {
    species: () => request<SpeciesContent[]>("/content/species"),
    speciesBySlug: (slug: string) =>
      request<SpeciesContent>(`/content/species/${encodeURIComponent(slug)}`),
    evolutions: () => request<EvolutionPathContent[]>("/content/evolutions"),
    tasks: () => request<TaskContent[]>("/content/tasks"),
    rarities: () => request<RarityContent[]>("/content/rarities"),
    codex: () => request<CodexContent[]>("/content/codex"),
    codexBySlug: (slug: string) =>
      request<CodexContent>(`/content/codex/${encodeURIComponent(slug)}`),
  },

  createSession: (id?: string) =>
    request<{ player: PlayerSave }>("/session", {
      method: "POST",
      body: { id },
    }),

  growPlant: (
    player: PlayerSave,
    plantId: string,
    action: GrowthActionId,
    demoMode: boolean,
  ) =>
    request<GrowthResult>("/plants/grow", {
      method: "POST",
      body: { player, plantId, action, demoMode },
    }),

  evolvePlant: (player: PlayerSave, plantId: string, demoMode: boolean) =>
    request<EvolveResult>("/plants/evolve", {
      method: "POST",
      body: { player, plantId, demoMode },
    }),

  activatePlant: (player: PlayerSave, plantId: string) =>
    request<{ player: PlayerSave }>("/plants/activate", {
      method: "POST",
      body: { player, plantId },
    }),

  completeTask: (player: PlayerSave, taskId: string, demoMode: boolean) =>
    request<TaskResult>("/tasks/complete", {
      method: "POST",
      body: { player, taskId, demoMode },
    }),

  discover: (player: PlayerSave, demoMode: boolean) =>
    request<DiscoveryResult>("/discover", {
      method: "POST",
      body: { player, demoMode },
    }),

  startBattle: (player: PlayerSave, demoMode: boolean) =>
    request<{ battle: BattleState }>("/battle/start", {
      method: "POST",
      body: { player, demoMode },
    }),

  battleAction: (
    player: PlayerSave,
    battle: BattleState,
    action: BattleAction,
    demoMode: boolean,
  ) =>
    request<BattleActionResult>("/battle/action", {
      method: "POST",
      body: { player, battle, action, demoMode },
    }),
};
