import { publishableWithGaps as p } from "../../editorial-tools/wave-27/factory";
const base={league:"eredivisie" as const,competition:"Eredivisie 2026/27",round:"Round 3",sourceName:"Versioned fixture snapshot",sourceUrl:"https://site.api.espn.com/apis/site/v2/sports/soccer/ned.1/scoreboard"};
export const eredivisieWave27=[
p({...base,home:"NEC Nijmegen",away:"Excelsior",slug:"nec-nijmegen-vs-excelsior",date:"2026-09-08",time:"18:45",pick:"NEC to Win",odds:1.55,evidence:"The project snapshot records the scheduled pairing and kickoff with provider agreement.",tactical:"NEC's home route is sustained occupation around the box, while Excelsior can challenge the pick by escaping pressure and attacking before the block resets."}),
p({...base,home:"FC Twente",away:"Telstar",slug:"fc-twente-vs-telstar",date:"2026-09-09",time:"18:45",pick:"Twente to Win + Over 2.5",odds:1.55,evidence:"The project snapshot records Twente against Telstar on September 9 with a confirmed kickoff.",tactical:"Twente must combine the home win with three total goals, so early territorial pressure needs efficient finishing rather than harmless circulation."}),
];
