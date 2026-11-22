"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";
import { CURRENCY_STORAGE_KEY, type Currency } from "@/lib/prices";

type Ctx = { currency: Currency; setCurrency: (c: Currency) => void };

const CurrencyContext = createContext<Ctx>({ currency: "MAD", setCurrency: () => {} });
const EVENT = "vlab-currency";

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENT, cb);
  };
}

function read(): Currency {
  try {
    return localStorage.getItem(CURRENCY_STORAGE_KEY) === "XOF" ? "XOF" : "MAD";
  } catch {
    return "MAD";
  }
}

/** Devise MAD / FCFA, persistée dans localStorage et partagée entre pages et onglets. */
export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const currency = useSyncExternalStore(subscribe, read, () => "MAD" as Currency);

  const setCurrency = useCallback((c: Currency) => {
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, c);
    } catch {}
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
