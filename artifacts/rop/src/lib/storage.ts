import { PlayerSaveSchema, type PlayerSave } from "@workspace/game-core";

const SAVE_KEY = "rop:save:v1";

export function loadPlayer(): PlayerSave | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  try {
    const parsed = PlayerSaveSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function savePlayer(player: PlayerSave): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(player));
  } catch {
    /* ignore quota / serialization errors */
  }
}

export function clearPlayer(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SAVE_KEY);
}
