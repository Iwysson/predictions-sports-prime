import { NhlBestMultiple } from "@/components/NhlToday";
import { PrimeVipOfferCard } from "@/components/PrimeVipOfferCard";
import { getNhlTodayKey } from "@/lib/nhl-day";

export function HomeEditorialHighlights() {
  return (
    <div className="home-editorial-highlights">
      <section className="section section--compact" aria-labelledby="nhl-best-multiple-title">
        <div className="container">
          <NhlBestMultiple initialKey={getNhlTodayKey()} />
        </div>
      </section>

      <PrimeVipOfferCard />
    </div>
  );
}
