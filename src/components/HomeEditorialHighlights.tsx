import Link from "@/components/DocumentLink";
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
          <article className="home-best-multiple">
            <div className="home-best-multiple__head">
              <div>
                <span className="eyebrow">NHL</span>
                <h2 id="nhl-best-multiple-title">NHL BEST MULTIPLE TODAY</h2>
              </div>
              <span className="psp-badge psp-badge--free">FREE MULTIPLE</span>
            </div>
            <div className="home-best-multiple__legs">
              <div><span>New Jersey Devils vs Utah Mammoth</span><strong>New Jersey Devils to win</strong></div>
              <b aria-hidden="true">+</b>
              <div><span>Detroit Red Wings vs Ottawa Senators</span><strong>Over 5.5 Goals</strong></div>
            </div>
            <p>This editorial multiple is FREE and does not change either game's individual access level. No combined official odds are stated.</p>
          </article>
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
