export function buildSearchIndex(displayName: string): string[] {
  const lower = displayName.toLowerCase();
  return Array.from({ length: lower.length }, (_, i) => lower.slice(0, i + 1));
}