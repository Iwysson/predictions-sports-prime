"use client";

import { useAuth } from "@/auth/AuthProvider";
import { VipCheckoutButton } from "@/components/VipCheckoutButton";

// Commercial PRIME VIP offer. Presentation only: no VIP content, prices come from the existing
// checkout flow. Hidden for confirmed VIP members (trialing or active). Shown while auth loads.
export function PrimeVipOfferCard() {
  const { loading, isVip } = useAuth();
  if (!loading && isVip) return null;

  return (
    <section className="section section--compact prime-vip-offer-section" aria-labelledby="prime-vip-offer-title">
      <div className="container">
        <article className="prime-vip-offer">
          <div className="prime-vip-offer__copy">
            <span className="psp-badge psp-badge--vip">PRIME VIP</span>
            <h2 id="prime-vip-offer-title">Unlock every prediction and full analysis.</h2>
            <strong className="prime-vip-offer__trial">1-Day Free Trial</strong>
            <ul>
              <li>Full match analyses</li><li>All VIP predictions</li><li>NHL &amp; NFL premium picks</li>
              <li>Best Bets</li><li>Prediction History</li><li>Ad-free experience</li>
            </ul>
          </div>
          <div className="prime-vip-offer__price">
            <del>$37.49</del>
            <strong>$29.99 <small>/ month</small></strong>
            <span>20% OFF</span>
            <VipCheckoutButton />
          </div>
        </article>
      </div>
    </section>
  );
}
