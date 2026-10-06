import { NhlBestMultiple } from "@/components/NhlBestMultiple";
import { PrimeVipOfferCard } from "@/components/PrimeVipOfferCard";

export function HomeEditorialHighlights() {
  return (
    <div className="home-editorial-highlights">
      <section className="section section--compact" aria-labelledby="nhl-best-multiple-title">
        <div className="container">
          <NhlBestMultiple />
        </div>
      </section>

      <PrimeVipOfferCard />
    </div>
  );
}
