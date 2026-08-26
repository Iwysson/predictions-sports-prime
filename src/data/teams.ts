import { TeamVisual } from "@/types";

export type TeamBadgeAsset = { src: string; sourceUrl: string };

export const teamBadgeAssets: Record<string, TeamBadgeAsset> = {
  "Gençlerbirliği": { src: "/team-badges/genclerbirligi.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/5hnd1c1639569938.png" },
  Galatasaray: { src: "/team-badges/galatasaray.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/io7jk21767941298.png" },
  Samsunspor: { src: "/team-badges/samsunspor.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/vz05y71679456608.png" },
  Trabzonspor: { src: "/team-badges/trabzonspor.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/96s34o1776827629.png" },
  Alanyaspor: { src: "/team-badges/alanyaspor.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/9fr3071601667898.png" },
  "Gaziantep FK": { src: "/team-badges/gaziantep-fk.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/54j6ik1579458093.png" },
  "Kasımpaşa": { src: "/team-badges/kasimpasa.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/uryxtp1448203236.png" },
  "Fenerbahçe": { src: "/team-badges/fenerbahce.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/twxxvs1448199691.png" },
  Amedspor: { src: "/team-badges/amedspor.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/4fqdgh1783788571.png" },
  "İstanbul Başakşehir": { src: "/team-badges/istanbul-basaksehir.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/895mqt1685993958.png" },
  Kocaelispor: { src: "/team-badges/kocaelispor.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/f6erki1626445224.png" },
  "Beşiktaş": { src: "/team-badges/besiktas.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/svo05k1776827439.png" },
  "Çaykur Rizespor": { src: "/team-badges/caykur-rizespor.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/t7senr1657195719.png" },
  "Göztepe": { src: "/team-badges/goztepe.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/9jwk7o1513952059.png" },
  "Çorum FK": { src: "/team-badges/corum-fk.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/ivoq4l1679510278.png" },
  "Eyüpspor": { src: "/team-badges/eyupspor.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/7fb0ub1626445710.png" },
  Konyaspor: { src: "/team-badges/konyaspor.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/rxwptr1448203413.png" },
  Erzurumspor: { src: "/team-badges/erzurumspor.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/7sepx01783701613.png" },
  Celtic: { src: "/team-badges/celtic.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/3uv1641758780002.png" },
  Dundee: { src: "/team-badges/dundee.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/tlei9x1750743461.png" },
  "St Mirren": { src: "/team-badges/st-mirren.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/xvtuvv1447604452.png" },
  Motherwell: { src: "/team-badges/motherwell.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/3e1dtj1785820999.png" },
  Hearts: { src: "/team-badges/hearts.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/twqvyt1447597939.png" },
  "St Johnstone": { src: "/team-badges/st-johnstone.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/j7o7cc1781888845.png" },
  Hibernian: { src: "/team-badges/hibernian.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/qjys3z1684928969.png" },
  Aberdeen: { src: "/team-badges/aberdeen.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/f9s6vg1781155578.png" },
  Rangers: { src: "/team-badges/rangers.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/ti24j61614290048.png" },
  Falkirk: { src: "/team-badges/falkirk.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/w37ucy1685023169.png" },
  "Dundee United": { src: "/team-badges/dundee-united.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/orfh821655722356.png" },
  Kilmarnock: { src: "/team-badges/kilmarnock.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/ihxzq71785820059.png" },
};

export function getTeamBadgeAsset(team: string) {
  return teamBadgeAssets[team];
}

export const teamVisuals: Record<string, TeamVisual> = {
  Arsenal: {
    code: "ARS",
    primary: "#d71920",
    secondary: "#ffffff",
  },
  Chelsea: {
    code: "CHE",
    primary: "#034694",
    secondary: "#ffffff",
  },
  Liverpool: {
    code: "LIV",
    primary: "#c8102e",
    secondary: "#ffffff",
  },
  Everton: {
    code: "EVE",
    primary: "#003399",
    secondary: "#ffffff",
  },
  Barcelona: {
    code: "BAR",
    primary: "#a50044",
    secondary: "#004d98",
  },
  Sevilla: {
    code: "SEV",
    primary: "#d71920",
    secondary: "#ffffff",
  },
  Bayern: {
    code: "FCB",
    primary: "#dc052d",
    secondary: "#ffffff",
  },
  Dortmund: {
    code: "BVB",
    primary: "#fdeb00",
    secondary: "#111111",
  },
};

export function getTeamVisual(team: string): TeamVisual {
  return (
    teamVisuals[team] ?? {
      code: team.slice(0, 3).toUpperCase(),
      primary: "#1f6f54",
      secondary: "#ffffff",
    }
  );
}
