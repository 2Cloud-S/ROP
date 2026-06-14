import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const HOUR = 1000 * 60 * 60;

export function useSpecies() {
  return useQuery({
    queryKey: ["content", "species"],
    queryFn: () => api.content.species(),
    staleTime: HOUR,
  });
}

export function useSpeciesBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["content", "species", slug],
    queryFn: () => api.content.speciesBySlug(slug as string),
    enabled: !!slug,
    staleTime: HOUR,
  });
}

export function useEvolutions() {
  return useQuery({
    queryKey: ["content", "evolutions"],
    queryFn: () => api.content.evolutions(),
    staleTime: HOUR,
  });
}

export function useTasks() {
  return useQuery({
    queryKey: ["content", "tasks"],
    queryFn: () => api.content.tasks(),
    staleTime: HOUR,
  });
}

export function useRarities() {
  return useQuery({
    queryKey: ["content", "rarities"],
    queryFn: () => api.content.rarities(),
    staleTime: HOUR,
  });
}

export function useCodex() {
  return useQuery({
    queryKey: ["content", "codex"],
    queryFn: () => api.content.codex(),
    staleTime: HOUR,
  });
}

export function useCodexBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["content", "codex", slug],
    queryFn: () => api.content.codexBySlug(slug as string),
    enabled: !!slug,
    staleTime: HOUR,
  });
}
