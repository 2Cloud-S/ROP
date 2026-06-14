export function isDemoMode(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  const value = params.get("demo");
  return value === "true" || value === "1";
}
