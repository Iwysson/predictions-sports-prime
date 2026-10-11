"use client";

import { useEffect, useState } from "react";

const PROMO_DURATION_MS = 24 * 60 * 60 * 1000;
const PROMO_DEADLINE_KEY = "psp-prime-vip-promo-deadline";

function getRemainingSeconds(deadline: number) {
  return Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
}

function formatCountdown(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

export function PrimeVipCountdown() {
  const [remainingSeconds, setRemainingSeconds] = useState(23 * 60 * 60 + 59 * 60 + 59);

  useEffect(() => {
    const storedDeadline = Number(window.localStorage.getItem(PROMO_DEADLINE_KEY));
    const deadline = Number.isFinite(storedDeadline) && storedDeadline > Date.now()
      ? storedDeadline
      : Date.now() + PROMO_DURATION_MS - 1000;

    window.localStorage.setItem(PROMO_DEADLINE_KEY, String(deadline));

    const update = () => setRemainingSeconds(getRemainingSeconds(deadline));
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="prime-vip-offer__countdown" aria-label="Promotion time remaining" role="timer">
      {formatCountdown(remainingSeconds)}
    </div>
  );
}
