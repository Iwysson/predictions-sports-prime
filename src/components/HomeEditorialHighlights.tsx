import Link from "@/components/DocumentLink";
import { NhlBestMultiple } from "@/components/NhlBestMultiple";
import { VipCheckoutButton } from "@/components/VipCheckoutButton";

export function HomeEditorialHighlights() {
  return (
    <div className="home-editorial-highlights">
      <section className="section section--compact" aria-labelledby="sports-highlights-title">
        <div className="container">
          <div className="section-heading section-heading--compact">
            <div>
              <span className="eyebrow">Featured sports</span>
              <h2 id="sports-highlights-title">NHL &amp; NFL Predictions</h2>
            </div>
          </div>
          <div className="home-sport-features">
            <article className="home-sport-feature">
              <span className="home-sport-feature__league">NHL</span>
              <h3>NHL Predictions</h3>
              <p>Today's NHL picks, analysis and premium insights.</p>
              <Link className="button button--small" href="/nhl/">View NHL Predictions</Link>
            </article>
            <article className="home-sport-feature">
              <span className="home-sport-feature__league">NFL</span>
              <h3>NFL Predictions</h3>
              <p>Weekly NFL picks, matchup analysis and premium predictions.</p>
              <Link className="button button--small" href="/nfl/">View NFL Predictions</Link>
            </article>
          </div>
        </div>
      </section>

      <section className="section section--compact" aria-labelledby="nhl-best-multiple-title">
        <div className="container">
          <NhlBestMultiple />
        </div>
      </section>

      <section className="section section--compact" aria-labelledby="prime-vip-offer-title">
        <div className="container">
          <article className="home-vip-offer">
            <div className="home-vip-offer__copy">
              <span className="psp-badge psp-badge--vip">PRIME VIP</span>
              <h2 id="prime-vip-offer-title">Unlock every prediction and full analysis.</h2>
              <strong className="home-vip-offer__trial">3-Day Free Trial</strong>
              <ul>
                <li>Full match analyses</li><li>All VIP predictions</li><li>NHL &amp; NFL premium picks</li>
                <li>Best Bets</li><li>Prediction History</li><li>Ad-free experience</li>
              </ul>
            </div>
            <div className="home-vip-offer__price">
              <del>$37.49</del>
              <strong>$29.99 <small>/ month</small></strong>
              <span>20% OFF</span>
              <VipCheckoutButton />
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
