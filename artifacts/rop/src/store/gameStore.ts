import { create } from "zustand";
import type {
  PlayerSave,
  PlantInstance,
  BattleState,
  BattleAction,
  GrowthActionId,
  GrowthResult,
  EvolutionResult,
} from "@workspace/game-core";
import {
  api,
  ApiError,
  type TaskResult,
  type DiscoveryResult,
  type BattleActionResult,
} from "@/lib/api";
import { loadPlayer, savePlayer, clearPlayer } from "@/lib/storage";
import { isDemoMode } from "@/lib/demo";

interface GameState {
  player: PlayerSave | null;
  demoMode: boolean;
  initialized: boolean;
  loading: boolean;
  error: string | null;

  battle: BattleState | null;
  battleRewards: BattleActionResult["rewards"] | null;

  init: () => Promise<void>;
  reset: () => Promise<void>;
  setPlayer: (player: PlayerSave) => void;

  activePlant: () => PlantInstance | undefined;

  grow: (plantId: string, action: GrowthActionId) => Promise<GrowthResult>;
  evolve: (plantId: string) => Promise<EvolutionResult>;
  activate: (plantId: string) => Promise<void>;
  completeTask: (taskId: string) => Promise<TaskResult>;
  discover: () => Promise<DiscoveryResult>;

  startBattle: () => Promise<BattleState>;
  battleAction: (action: BattleAction) => Promise<BattleActionResult>;
  endBattle: () => void;
}

function persist(player: PlayerSave) {
  savePlayer(player);
  return player;
}

function toMessage(e: unknown): string {
  return e instanceof ApiError ? e.message : "Something went wrong.";
}

export const useGameStore = create<GameState>((set, get) => ({
  player: null,
  demoMode: isDemoMode(),
  initialized: false,
  loading: false,
  error: null,
  battle: null,
  battleRewards: null,

  init: async () => {
    if (get().initialized) return;
    set({ loading: true, error: null });
    const existing = loadPlayer();
    if (existing) {
      set({ player: existing, initialized: true, loading: false });
      return;
    }
    try {
      const { player } = await api.createSession();
      persist(player);
      set({ player, initialized: true, loading: false });
    } catch (e) {
      set({ error: toMessage(e), loading: false });
    }
  },

  reset: async () => {
    clearPlayer();
    set({
      player: null,
      initialized: false,
      battle: null,
      battleRewards: null,
      error: null,
    });
    await get().init();
  },

  setPlayer: (player) => {
    persist(player);
    set({ player });
  },

  activePlant: () => {
    const p = get().player;
    if (!p) return undefined;
    return p.plants.find((pl) => pl.id === p.activePlantId);
  },

  grow: async (plantId, action) => {
    const player = get().player;
    if (!player) throw new ApiError(0, "NO_PLAYER", "No active game.");
    const result = await api.growPlant(player, plantId, action, get().demoMode);
    persist(result.player);
    set({ player: result.player });
    return result;
  },

  evolve: async (plantId) => {
    const player = get().player;
    if (!player) throw new ApiError(0, "NO_PLAYER", "No active game.");
    const result = await api.evolvePlant(player, plantId, get().demoMode);
    persist(result.player);
    set({ player: result.player });
    return result;
  },

  activate: async (plantId) => {
    const player = get().player;
    if (!player) throw new ApiError(0, "NO_PLAYER", "No active game.");
    const { player: next } = await api.activatePlant(player, plantId);
    persist(next);
    set({ player: next });
  },

  completeTask: async (taskId) => {
    const player = get().player;
    if (!player) throw new ApiError(0, "NO_PLAYER", "No active game.");
    const result = await api.completeTask(player, taskId, get().demoMode);
    persist(result.player);
    set({ player: result.player });
    return result;
  },

  discover: async () => {
    const player = get().player;
    if (!player) throw new ApiError(0, "NO_PLAYER", "No active game.");
    const result = await api.discover(player, get().demoMode);
    persist(result.player);
    set({ player: result.player });
    return result;
  },

  startBattle: async () => {
    const player = get().player;
    if (!player) throw new ApiError(0, "NO_PLAYER", "No active game.");
    const { battle } = await api.startBattle(player, get().demoMode);
    set({ battle, battleRewards: null });
    return battle;
  },

  battleAction: async (action) => {
    const player = get().player;
    const battle = get().battle;
    if (!player) throw new ApiError(0, "NO_PLAYER", "No active game.");
    if (!battle) throw new ApiError(0, "NO_BATTLE", "No active battle.");
    const result = await api.battleAction(player, battle, action, get().demoMode);
    persist(result.player);
    set({
      player: result.player,
      battle: result.battle,
      battleRewards: result.rewards ?? get().battleRewards,
    });
    return result;
  },

  endBattle: () => set({ battle: null, battleRewards: null }),
}));
