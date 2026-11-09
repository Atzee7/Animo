export function parseEpisodeNumber(value: string | number): number {
  if (typeof value === "number") return value;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function findEpisodeByNumber<T extends { number: string | number }>(
  episodes: T[],
  episodeNumber: number,
): T | undefined {
  return episodes.find(
    (episode) => parseEpisodeNumber(episode.number) === episodeNumber,
  );
}

export function episodeLabel(value: string | number): string {
  const number = parseEpisodeNumber(value);
  return Number.isInteger(number) ? String(number) : number.toFixed(1);
}
