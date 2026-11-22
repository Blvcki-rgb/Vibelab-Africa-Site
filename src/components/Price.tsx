"use client";

import { useCurrency } from "./CurrencyProvider";
import { formatNumber, convert, fromPrice, formatPrice, formatRange, unit } from "@/lib/prices";

/** « dès 3 000 MAD » */
export function FromPrice({ mad }: { mad: number }) {
  const { currency } = useCurrency();
  return <>{fromPrice(mad, currency)}</>;
}

/** « 3 000 MAD » */
export function PriceText({ mad }: { mad: number }) {
  const { currency } = useCurrency();
  return <>{formatPrice(mad, currency)}</>;
}

/** Nombre seul, « 3 000 » */
export function PriceNumber({ mad }: { mad: number }) {
  const { currency } = useCurrency();
  return <>{formatNumber(convert(mad, currency))}</>;
}

export function PriceUnit() {
  const { currency } = useCurrency();
  return <>{unit(currency)}</>;
}

export function PriceRange({ min, max }: { min: number; max: number }) {
  const { currency } = useCurrency();
  return <>{formatRange(min, max, currency)}</>;
}

/** Mention affichée uniquement en FCFA */
export function ConversionNote({ className = "" }: { className?: string }) {
  const { currency } = useCurrency();
  if (currency !== "XOF") return null;
  return (
    <p className={`font-mono text-[11.5px] text-muted ${className}`}>
      Conversion indicative : 1 MAD ≈ 60 FCFA, arrondie à 5 000 FCFA près.
    </p>
  );
}
