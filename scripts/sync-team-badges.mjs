import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const predictionsRoot = path.join(root, "src", "data", "predictions");
const outputDir = path.join(root, "public", "team-badges");
const generatedFile = path.join(root, "src", "data", "team-badge-assets.generated.ts");
const teamSearchAliases = {
  "Lecce": "US Lecce",
  "Osasuna": "CA Osasuna",
  "Getafe": "Getafe CF",
  "Remo": "Clube do Remo",
  "Coritiba": "Coritiba Foot Ball Club",
  "Estoril": "G.D. Estoril Praia",
  "Rayo Vallecano": "Rayo Vallecano",
  "Vitória de Guimarães": "Vitória S.C.",
  "Atlético Mineiro": "Clube Atlético Mineiro",
  "Cruzeiro": "Cruzeiro Esporte Clube",
};
const manualBadgeUrls = {
  "Lecce": "https://toppng.com/public/uploads/preview/us-lecce-1908-vector-logo-115737268299es9ikw80h.png",
  "Osasuna": "https://paladarnegro.net/escudoteca/espana/laliga/png/osasuna.png",
  "Getafe": "https://www.footylogos.com/downloads/logo/getafe-cf-logo-footylogos.png",
  "Remo": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Escudo_oficial_do_Clube_do_Remo.png",
  "Coritiba": "https://assets.footylogos.com/logos/coritiba/coritiba-logo-footylogos.svg",
  "Estoril": "https://assets.football-logos.cc/logos/portugal/1500x1500/estoril.72c556cd.png",
  "Rayo Vallecano": "https://cdn.freebiesupply.com/logos/large/2x/rayo-vallecano-logo-png-transparent.png",
  "Vitória de Guimarães": "https://brandlogos.net/wp-content/uploads/2013/11/vitoria-sc-vector-logo-400x400.png",
  "Twente": "https://eredivisie.b-cdn.net/production/clubs/fc-twente/FCTwente_Logo.png?height=256&quality=90&width=256",
  "FC Twente": "https://eredivisie.b-cdn.net/production/clubs/fc-twente/FCTwente_Logo.png?height=256&quality=90&width=256",
  "Utrecht": "https://eredivisie.b-cdn.net/production/clubs/fc-utrecht/FCUtrecht_Logo.png?height=256&quality=90&width=256",
  "FC Utrecht": "https://eredivisie.b-cdn.net/production/clubs/fc-utrecht/FCUtrecht_Logo.png?height=256&quality=90&width=256",
  "NEC Nijmegen": "https://eredivisie.b-cdn.net/production/clubs/nec-nijmegen/NEC_Nijmegen_Logo.png?height=256&quality=90&width=256",
  "PEC Zwolle": "https://eredivisie.b-cdn.net/production/clubs/pec-zwolle/PECZwolle_Logo.png?height=256&quality=90&width=256",
  "PSV Eindhoven": "https://eredivisie.b-cdn.net/production/clubs/psv/PSV_Logo.png?height=256&quality=90&width=256",
  "SC Cambuur": "https://eredivisie.b-cdn.net/production/clubs/sc-cambuur/SCCambuur_Logo.png?height=256&quality=90&width=256",
  "Heerenveen": "https://eredivisie.b-cdn.net/production/clubs/sc-heerenveen/scHeerenveen_Logo.png?height=256&quality=90&width=256",
  "SC Heerenveen": "https://eredivisie.b-cdn.net/production/clubs/sc-heerenveen/scHeerenveen_Logo.png?height=256&quality=90&width=256",
  "Sparta Rotterdam": "https://eredivisie.b-cdn.net/production/clubs/sparta-rotterdam/SpartaRotterdam_Logo.png?height=256&quality=90&width=256",
  "Telstar": "https://eredivisie.b-cdn.net/production/clubs/telstar/Telstar_Logo.png?height=256&quality=90&width=256",
};

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function slugify(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const teams = new Set();
for (const file of walk(predictionsRoot).filter((file) => file.endsWith(".ts") && !file.endsWith(`${path.sep}index.ts`))) {
  const source = fs.readFileSync(file, "utf8");
  for (const match of source.matchAll(/["']?(?:homeTeam|awayTeam)["']?\s*:\s*["']([^"']+)["']/g)) teams.add(match[1]);
}

fs.mkdirSync(outputDir, { recursive: true });
const assets = {};
for (const team of [...teams].sort((left, right) => left.localeCompare(right))) {
  const searchTeam = teamSearchAliases[team] ?? team;
  const existing = fs.readdirSync(outputDir).find((name) => path.parse(name).name === slugify(team));
  if (existing && !manualBadgeUrls[team]) {
    assets[team] = {
      src: `/team-badges/${existing}`,
      sourceUrl: `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(team)}`,
    };
    continue;
  }
  let badgeUrl = manualBadgeUrls[team];
  let sourceUrl = badgeUrl;
  const response = badgeUrl ? null : await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(searchTeam)}`);
  if (response?.ok) {
    const data = await response.json();
    const normalized = team.toLowerCase();
    const picked = data.teams?.find((item) => item.strSport === "Soccer" && item.strTeam?.toLowerCase() === normalized)
      ?? data.teams?.find((item) => item.strSport === "Soccer");
    badgeUrl = picked?.strBadge;
    sourceUrl = picked?.strBadge;
  }
  if (!badgeUrl) {
    const params = new URLSearchParams({
      action: "query",
      generator: "search",
      gsrsearch: `\"${searchTeam}\" association football club`,
      gsrlimit: "1",
      prop: "pageimages|info",
      inprop: "url",
      pithumbsize: "256",
      format: "json",
      origin: "*",
    });
    const wikiResponse = await fetch(`https://en.wikipedia.org/w/api.php?${params}`);
    if (wikiResponse.ok) {
      const wiki = await wikiResponse.json();
      const page = Object.values(wiki.query?.pages ?? {})[0];
      badgeUrl = page?.thumbnail?.source;
      sourceUrl = page?.fullurl;
    }
  }
  if (!badgeUrl) continue;
  const extension = new URL(badgeUrl).pathname.split(".").pop()?.toLowerCase() || "png";
  const filename = `${slugify(team)}.${extension}`;
  const destination = path.join(outputDir, filename);
  if (!fs.existsSync(destination) || manualBadgeUrls[team]) {
    const badgeResponse = await fetch(badgeUrl);
    if (!badgeResponse.ok) continue;
    fs.writeFileSync(destination, Buffer.from(await badgeResponse.arrayBuffer()));
  }
  assets[team] = { src: `/team-badges/${filename}`, sourceUrl };
}

const output = `import type { TeamBadgeAsset } from "@/data/teams";\n\nexport const generatedTeamBadgeAssets: Record<string, TeamBadgeAsset> = ${JSON.stringify(assets, null, 2)};\n`;
fs.writeFileSync(generatedFile, output, "utf8");
console.log(`Generated ${Object.keys(assets).length} local team badges.`);
