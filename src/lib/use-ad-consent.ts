"use client";

import { useEffect, useState } from "react";
import { canLoadAdSense } from "@/lib/ads";
import { observeAdConsent, type TcfApi } from "@/lib/ad-consent";

export function useAdConsent() {
  const [granted, setGranted] = useState(false);
  useEffect(() => {
    if (!canLoadAdSense()) return;
    let unsubscribe: (() => void) | undefined;
    const connect = () => {
      const api = (window as Window & { __tcfapi?: TcfApi }).__tcfapi;
      if (!unsubscribe && typeof api === "function") {
        unsubscribe = observeAdConsent(api, setGranted);
      }
    };
    connect();
    const timer = window.setInterval(connect, 500);
    return () => { window.clearInterval(timer); unsubscribe?.(); };
  }, []);
  return granted;
}
