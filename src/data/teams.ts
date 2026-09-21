import { TeamVisual } from "@/types";
import { generatedTeamBadgeAssets } from "@/data/team-badge-assets.generated";

export type TeamBadgeAsset = { src: string; sourceUrl: string };

export const teamBadgeAssets: Record<string, TeamBadgeAsset> = {
  // Canonical overrides (correct badge file when generated table has wrong path)
  "Inter Milan": generatedTeamBadgeAssets["Internazionale Milano"],
  // MLS badges added from verified league/provider assets.
  "Seattle Sounders": { src: "/team-badges/seattle-sounders.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/2dy5cx1706711036.png" },
  "Seattle Sounders FC": { src: "/team-badges/seattle-sounders.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/2dy5cx1706711036.png" },
  "Real Salt Lake": { src: "/team-badges/real-salt-lake.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/kkjlfa1556488022.png" },
  "Philadelphia Union": { src: "/team-badges/philadelphia-union.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/gyznyo1602103682.png" },
  "St. Louis City": { src: "/team-badges/st-louis-city-sc.svg", sourceUrl: "https://images.mlssoccer.com/image/upload/v1610563329/assets/logos/STL.svg" },
  "St. Louis City SC": { src: "/team-badges/st-louis-city-sc.svg", sourceUrl: "https://images.mlssoccer.com/image/upload/v1610563329/assets/logos/STL.svg" },
  "St. Louis CITY SC": { src: "/team-badges/st-louis-city-sc.svg", sourceUrl: "https://images.mlssoccer.com/image/upload/v1610563329/assets/logos/STL.svg" },
  "Sporting Kansas City": { src: "/team-badges/sporting-kansas-city.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/tqupxw1473536504.png" },
  "Toronto FC": { src: "/team-badges/toronto-fc.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/rsxyrr1473536512.png" },
  "San Diego FC": { src: "/team-badges/san-diego-fc.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/7ka2xd1734621068.png" },
  "Vancouver Whitecaps": { src: "/team-badges/vancouver-whitecaps.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/tpwxpy1473536521.png" },
  "Vancouver Whitecaps FC": { src: "/team-badges/vancouver-whitecaps.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/tpwxpy1473536521.png" },
  "San Jose Earthquakes": { src: "/team-badges/san-jose-earthquakes.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/xyrqqt1420781048.png" },
  "Portland Timbers": { src: "/team-badges/portland-timbers.svg", sourceUrl: "https://images.mlssoccer.com/image/upload/v1626094359/assets/logos/POR-Logo_wviuqh.svg" },
  // UEFA Nations League national teams
  Netherlands: { src: "/team-badges/netherlands.png", sourceUrl: "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Netherlands" },
  Germany: { src: "/team-badges/germany.png", sourceUrl: "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Germany" },
  Norway: { src: "/team-badges/norway.png", sourceUrl: "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Norway" },
  Denmark: { src: "/team-badges/denmark.png", sourceUrl: "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Denmark" },
  Portugal: { src: "/team-badges/portugal.png", sourceUrl: "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Portugal" },
  Wales: { src: "/team-badges/wales.png", sourceUrl: "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Wales" },
  Serbia: { src: "/team-badges/serbia.png", sourceUrl: "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Serbia" },
  Greece: { src: "/team-badges/greece.png", sourceUrl: "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Greece" },
  Italy: { src: "/team-badges/italy.png", sourceUrl: "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Italy" },
  Belgium: { src: "/team-badges/belgium.png", sourceUrl: "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Belgium" },
  "Türkiye": { src: "/team-badges/turkiye.png", sourceUrl: "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Turkey" },
  France: { src: "/team-badges/france.png", sourceUrl: "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=France" },
  Czechia: { src: "/team-badges/czechia.png", sourceUrl: "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Czech%20Republic" },
  Croatia: { src: "/team-badges/croatia.png", sourceUrl: "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Croatia" },
  England: { src: "/team-badges/england.png", sourceUrl: "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=England" },
  Spain: { src: "/team-badges/spain.png", sourceUrl: "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Spain" },
  Austria: { src: "/team-badges/austria.png", sourceUrl: "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Austria" },
  Israel: { src: "/team-badges/israel.png", sourceUrl: "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Israel" },
  Kosovo: { src: "/team-badges/kosovo.png", sourceUrl: "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Kosovo" },
  "Republic of Ireland": { src: "/team-badges/republic-of-ireland.png", sourceUrl: "https://www.thesportsdb.com/api/v1/json/3/lookupteam.php?id=133911" },
  Georgia: { src: "/team-badges/georgia.png", sourceUrl: "https://www.thesportsdb.com/api/v1/json/3/lookupteam.php?id=135930" },
  "Northern Ireland": { src: "/team-badges/northern-ireland.png", sourceUrl: "https://www.thesportsdb.com/api/v1/json/3/lookupteam.php?id=135984" },
  Hungary: { src: "/team-badges/hungary.png", sourceUrl: "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Hungary" },
  Ukraine: { src: "/team-badges/ukraine.png", sourceUrl: "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Ukraine" },
  Poland: { src: "/team-badges/poland.png", sourceUrl: "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Poland" },
  "Bosnia and Herzegovina": { src: "/team-badges/bosnia-and-herzegovina.png", sourceUrl: "https://www.thesportsdb.com/api/v1/json/3/lookupteam.php?id=134510" },
  Sweden: { src: "/team-badges/sweden.png", sourceUrl: "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Sweden" },
  Romania: { src: "/team-badges/romania.png", sourceUrl: "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Romania" },
  Slovenia: { src: "/team-badges/slovenia.png", sourceUrl: "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Slovenia" },
  Scotland: { src: "/team-badges/scotland.png", sourceUrl: "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Scotland" },
  "North Macedonia": { src: "/team-badges/north-macedonia.png", sourceUrl: "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=North%20Macedonia" },
  Switzerland: { src: "/team-badges/switzerland.png", sourceUrl: "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Switzerland" },

  "Kasımpaşa": { src: "/team-badges/kasimpasa.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/uryxtp1448203236.png" },

  // Turkish clubs
  "Gençlerbirliği": { src: "/team-badges/genclerbirligi.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/5hnd1c1639569938.png" },
  Galatasaray: { src: "/team-badges/galatasaray.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/io7jk21767941298.png" },
  Samsunspor: { src: "/team-badges/samsunspor.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/vz05y71679456608.png" },
  Trabzonspor: { src: "/team-badges/trabzonspor.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/96s34o1776827629.png" },
  Alanyaspor: { src: "/team-badges/alanyaspor.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/9fr3071601667898.png" },
  "Gaziantep FK": { src: "/team-badges/gaziantep-fk.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/54j6ik1579458093.png" },
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

  // Scottish clubs
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

  // Display-name aliases: team name as stored in match data → canonical badge asset
  // English clubs
  "AFC Bournemouth": generatedTeamBadgeAssets["Bournemouth"],

  // Spanish clubs
  "Atlético de Madrid": generatedTeamBadgeAssets["Atlético Madrid"],
  "CA Osasuna": generatedTeamBadgeAssets["Osasuna"],
  "Celta": generatedTeamBadgeAssets["Celta Vigo"],
  "Elche CF": generatedTeamBadgeAssets["Elche"],
  "FC Barcelona": generatedTeamBadgeAssets["Barcelona"],
  "Getafe CF": generatedTeamBadgeAssets["Getafe"],
  "Málaga CF": generatedTeamBadgeAssets["Málaga"],
  "RC Celta de Vigo": generatedTeamBadgeAssets["Celta Vigo"],
  "RC Deportivo": generatedTeamBadgeAssets["Deportivo"],
  "RC Deportivo La Coruña": generatedTeamBadgeAssets["Deportivo La Coruña"],
  "RC Lens": generatedTeamBadgeAssets["Lens"],
  "RCD Espanyol": generatedTeamBadgeAssets["Espanyol"],
  "RCD Espanyol de Barcelona": generatedTeamBadgeAssets["Espanyol"],
  "Rayo Vallecano de Madrid": generatedTeamBadgeAssets["Rayo Vallecano"],
  "Athletic Bilbao": generatedTeamBadgeAssets["Athletic Club"],

  // German clubs
  "Bayer Leverkusen": generatedTeamBadgeAssets["Bayer 04 Leverkusen"],
  "Bayern Munich": generatedTeamBadgeAssets["Bayern München"],
  "FC Augsburg": generatedTeamBadgeAssets["Augsburg"],
  "FC Schalke 04": generatedTeamBadgeAssets["Schalke 04"],
  "Leverkusen": generatedTeamBadgeAssets["Bayer 04 Leverkusen"],
  "Mainz 05": generatedTeamBadgeAssets["1. FSV Mainz 05"],
  "Union Berlin": generatedTeamBadgeAssets["1. FC Union Berlin"],

  // Italian clubs
  "Frosinone Calcio": generatedTeamBadgeAssets["Frosinone"],
  "Roma": generatedTeamBadgeAssets["AS Roma"],
  "SS Lazio": generatedTeamBadgeAssets["Lazio"],
  "SSC Napoli": generatedTeamBadgeAssets["Napoli"],
  "Udinese": generatedTeamBadgeAssets["Udinese Calcio"],

  // French clubs
  "AJ Auxerre": generatedTeamBadgeAssets["Auxerre"],
  "Angers SCO": generatedTeamBadgeAssets["Angers"],
  "AS Monaco": generatedTeamBadgeAssets["Monaco"],
  "FC Lorient": generatedTeamBadgeAssets["Lorient"],
  "Lille OSC": generatedTeamBadgeAssets["Lille"],
  "Marseille": generatedTeamBadgeAssets["Olympique de Marseille"],
  "OGC Nice": generatedTeamBadgeAssets["Nice"],
  "Olympique Lyonnais": generatedTeamBadgeAssets["Lyon"],
  "Olympique Marseille": generatedTeamBadgeAssets["Olympique de Marseille"],
  "Stade Brestois 29": generatedTeamBadgeAssets["Brest"],

  // Dutch clubs
  "AZ": generatedTeamBadgeAssets["AZ Alkmaar"],
  "Excelsior Rotterdam": generatedTeamBadgeAssets["Excelsior"],
  "N.E.C.": generatedTeamBadgeAssets["NEC Nijmegen"],
  "sc Heerenveen": generatedTeamBadgeAssets["SC Heerenveen"],

  // Portuguese clubs
  "Estoril": generatedTeamBadgeAssets["Estoril Praia"],
  "Porto": generatedTeamBadgeAssets["FC Porto"],
  "SC Braga": generatedTeamBadgeAssets["Braga"],

  // Scottish aliases (without accent / alternative spellings)
  "Dundee FC": generatedTeamBadgeAssets["Dundee"],
  "Heart of Midlothian": generatedTeamBadgeAssets["Hearts"],

  // Turkish aliases (without special characters)
  "Basaksehir": { src: "/team-badges/istanbul-basaksehir.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/895mqt1685993958.png" },
  "Besiktas": { src: "/team-badges/besiktas.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/svo05k1776827439.png" },
  "Corum FK": { src: "/team-badges/corum-fk.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/ivoq4l1679510278.png" },
  "Eyupspor": generatedTeamBadgeAssets["Eyüpspor"],
  "Fenerbahce": generatedTeamBadgeAssets["Fenerbahçe"],
  "Genclerbirligi": generatedTeamBadgeAssets["Gençlerbirliği"],
  "Goztepe": generatedTeamBadgeAssets["Göztepe"],
  "Kasimpasa": { src: "/team-badges/kasimpasa.png", sourceUrl: "https://r2.thesportsdb.com/images/media/team/badge/uryxtp1448203236.png" },
  "Rizespor": generatedTeamBadgeAssets["Çaykur Rizespor"],

  // MLS clubs
  "Atlanta United FC": generatedTeamBadgeAssets["Atlanta United"],
  "Chicago Fire FC": generatedTeamBadgeAssets["Chicago Fire"],
  "Houston Dynamo FC": generatedTeamBadgeAssets["Houston Dynamo"],
  "Minnesota United FC": generatedTeamBadgeAssets["Minnesota United"],
  "Orlando City SC": generatedTeamBadgeAssets["Orlando City"],

  // Brazilian clubs
  "Athletico-PR": generatedTeamBadgeAssets["Athletico Paranaense"],

  // Other
  "Le Havre AC": generatedTeamBadgeAssets["Le Havre"],
  "Le Mans FC": generatedTeamBadgeAssets["Le Mans"],
  "PSV": generatedTeamBadgeAssets["PSV Eindhoven"],
};

export function getTeamBadgeAsset(team: string) {
  return teamBadgeAssets[team] ?? generatedTeamBadgeAssets[team];
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
