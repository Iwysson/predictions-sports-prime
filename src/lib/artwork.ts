export type TeamArtwork = {
  team: string;
  badge: string | null;
};

async function fetchWithTimeout(url: string) {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), 8_000);

  try {
    return await fetch(url, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

export async function fetchTeamBadge(team: string): Promise<string | null> {
  const key = `psp-team-badge:${team.toLowerCase()}`;
  const ttl = 30 * 24 * 60 * 60 * 1000;

  if (typeof window !== "undefined") {
    const cachedRaw = window.localStorage.getItem(key);

    if (cachedRaw) {
      try {
        const cached = JSON.parse(cachedRaw) as {
          savedAt: number;
          badge: string | null;
        };

        if (Date.now() - cached.savedAt < ttl) {
          return cached.badge;
        }
      } catch {
        // ignore cache errors
      }
    }
  }

  try {
    const response = await fetchWithTimeout(
      `https://www.thesportsdb.com/api/v1/json/123/searchteams.php?t=${encodeURIComponent(team)}`
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      teams?: Array<{
        strTeam?: string;
        strSport?: string;
        strBadge?: string;
      }> | null;
    };

    const normalized = team.toLowerCase();
    const picked =
      data.teams?.find(
        (item) =>
          item.strSport === "Soccer" &&
          item.strTeam?.toLowerCase() === normalized
      ) ??
      data.teams?.find((item) => item.strSport === "Soccer") ??
      data.teams?.[0];

    const badge = picked?.strBadge ?? null;

    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        key,
        JSON.stringify({
          savedAt: Date.now(),
          badge,
        })
      );
    }

    return badge;
  } catch {
    return null;
  }
}
