type Props = {
  homeTeam: string;
  awayTeam: string;
  slug: string;
};

const variants = [
  {
    portuguese: (fixture: string) =>
      `Confira a análise de ${fixture} e nosso prognóstico para a partida. ` +
      "Consulte também as odds disponíveis nesta página.",
    spanish: (fixture: string) =>
      `Consulta el análisis de ${fixture} y nuestro pronóstico para el partido. ` +
      "Revisa también las cuotas disponibles en esta página.",
  },
  {
    portuguese: (fixture: string) =>
      `Nossa análise de ${fixture} apresenta o prognóstico da partida e reúne ` +
      "as odds disponíveis de forma simples.",
    spanish: (fixture: string) =>
      `Nuestro análisis de ${fixture} presenta el pronóstico del partido y reúne ` +
      "las cuotas disponibles de forma sencilla.",
  },
  {
    portuguese: (fixture: string) =>
      `Leia a análise de ${fixture} e conheça nosso prognóstico para o confronto. ` +
      "As odds disponíveis estão reunidas nesta página.",
    spanish: (fixture: string) =>
      `Lee el análisis de ${fixture} y conoce el pronóstico para el encuentro. ` +
      "Las cuotas disponibles están reunidas en esta página.",
  },
] as const;

function variantIndex(slug: string) {
  return Array.from(slug).reduce(
    (total, character) => total + character.charCodeAt(0),
    2
  ) % variants.length;
}

export function MatchSearchIntent({ homeTeam, awayTeam, slug }: Props) {
  const fixture = `${homeTeam} x ${awayTeam}`;
  const variant = variants[variantIndex(slug)];
  const portuguese = variant.portuguese(fixture);
  const spanish = variant.spanish(fixture.replace(" x ", " vs "));

  return (
    <aside className="match-search-intent" aria-label="Match prediction summary">
      <p lang="pt-BR">{portuguese}</p>
      <p lang="es">{spanish}</p>
    </aside>
  );
}
