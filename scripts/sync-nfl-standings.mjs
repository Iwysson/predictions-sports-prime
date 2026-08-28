import { readFile, rename, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { NFL_TEAM_BY_ID } from "../src/data/nfl/teams.ts";
import { validateNFLStandings } from "../src/lib/nfl-standings-provider.ts";

const season = Number(process.env.NFL_SEASON ?? 2026);
const regularSeasonStarts = { 2026: "2026-09-10T00:20:00.000Z" };
const regularSeasonStart = process.env.NFL_REGULAR_SEASON_START ?? regularSeasonStarts[season];
const sourceUrl = `https://site.api.espn.com/apis/v2/sports/football/nfl/standings?region=us&lang=en&contentorigin=espn&type=2&level=2&sort=playoffseed%3Aasc&season=${season}`;
const outputPath = resolve("src/data/nfl/standings.snapshot.json");
const temporaryPath = `${outputPath}.tmp`;
const abbreviationMap = { WSH: "wsh", WAS: "wsh", NE: "ne", NO: "no", SF: "sf", TB: "tb", GB: "gb", KC: "kc", LV: "lv", LAC: "lac", LAR: "lar", NYG: "nyg", NYJ: "nyj" };

function collectEntries(value, result = []) {
  if (!value || typeof value !== "object") return result;
  if (Array.isArray(value)) { value.forEach((item) => collectEntries(item, result)); return result; }
  if (Array.isArray(value.entries) && value.entries.some((entry) => entry?.team)) result.push(...value.entries);
  Object.values(value).forEach((child) => collectEntries(child, result));
  return result;
}
function statsByName(stats = []) { return Object.fromEntries(stats.flatMap((stat) => [[stat.name, stat], [stat.abbreviation, stat]]).filter(([name]) => name)); }
function number(stats, names, fallback) { for (const name of names) { const value = stats[name]?.value; if (Number.isFinite(value)) return value; } return fallback; }
function text(stats, names) { for (const name of names) { const value = stats[name]?.displayValue; if (typeof value === "string" && value.trim()) return value.trim(); } return undefined; }
function playoffStatus(stats, gamesPlayed) {
  const clincher = text(stats, ["clincher"])?.toLowerCase() ?? "";
  if (/[yz*]/.test(clincher)) return "clinched-division";
  if (clincher.includes("x")) return "clinched-playoff";
  if (clincher.includes("e")) return "eliminated";
  const seed = number(stats, ["playoffSeed", "playoffseed"], undefined);
  if (!seed || gamesPlayed === 0) return "none";
  if (seed <= 4) return "in-playoff-position";
  if (seed <= 7) return "wild-card";
  return gamesPlayed >= 8 && seed <= 10 ? "in-the-hunt" : "none";
}

const previous = JSON.parse(await readFile(outputPath, "utf8"));
if (regularSeasonStart && Date.now() < Date.parse(regularSeasonStart)) {
  console.log(`NFL regular season has not started; retaining the verified preseason baseline until ${regularSeasonStart}.`);
  process.exit(0);
}
let response;
try { response = await fetch(sourceUrl, { headers: { accept: "application/json", "user-agent": "PredictionsSportsPrime/1.0 standings snapshot updater" } }); }
catch (error) { console.error(`NFL standings fetch failed; retaining last known good snapshot: ${error.message}`); process.exit(0); }
if (!response.ok) { console.error(`NFL standings returned ${response.status}; retaining last known good snapshot.`); process.exit(0); }

const payload = await response.json();
const uniqueEntries = new Map();
for (const entry of collectEntries(payload)) {
  const abbreviation = entry.team?.abbreviation?.toUpperCase();
  const teamId = abbreviationMap[abbreviation] ?? abbreviation?.toLowerCase();
  if (teamId && NFL_TEAM_BY_ID[teamId]) uniqueEntries.set(teamId, entry);
}
const standings = [...uniqueEntries].map(([teamId, entry]) => {
  const stats = statsByName(entry.stats); const wins = number(stats, ["wins"], 0); const losses = number(stats, ["losses"], 0); const ties = number(stats, ["ties"], 0); const gamesPlayed = wins + losses + ties;
  const pointsFor = number(stats, ["pointsFor", "pointsfor"], undefined); const pointsAgainst = number(stats, ["pointsAgainst", "pointsagainst"], undefined);
  return { teamId, wins, losses, ties, winPct: number(stats, ["winPercent", "winpercent"], gamesPlayed ? wins / gamesPlayed : 0), ...(pointsFor !== undefined ? { pointsFor } : {}), ...(pointsAgainst !== undefined ? { pointsAgainst } : {}), ...(pointsFor !== undefined && pointsAgainst !== undefined ? { pointDifferential: pointsFor - pointsAgainst } : {}), divisionRank: number(stats, ["divisionRank", "divisionrank"], undefined), conferenceRank: number(stats, ["playoffSeed", "playoffseed", "conferenceRank"], undefined), streak: text(stats, ["streak"]), playoffStatus: playoffStatus(stats, gamesPlayed) };
});
const gamesPlayed = standings.reduce((total, row) => total + row.wins + row.losses + row.ties, 0);
const next = { version: 1, season, generatedAt: new Date().toISOString(), source: "ESPN public standings feed", sourceUrl, seasonPhase: gamesPlayed === 0 ? "preseason" : "regular", standings };
const errors = validateNFLStandings(next);
if (errors.length) { console.error(`Provider data rejected; retaining last known good snapshot:\n- ${errors.join("\n- ")}`); process.exit(0); }
const comparable = (value) => JSON.stringify({ season: value.season, source: value.source, seasonPhase: value.seasonPhase, standings: value.standings });
if (comparable(previous) === comparable(next)) { console.log(`NFL standings unchanged; retained snapshot from ${previous.generatedAt}.`); process.exit(0); }
await writeFile(temporaryPath, `${JSON.stringify(next, null, 2)}\n`, "utf8"); await rename(temporaryPath, outputPath);
console.log(`NFL standings snapshot updated: ${next.generatedAt}`);
