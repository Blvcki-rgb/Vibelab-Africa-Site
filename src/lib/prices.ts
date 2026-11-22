/**
 * Prix centralisés (en MAD). Conversion indicative en FCFA :
 * 1 MAD ≈ 60 FCFA, arrondie à 5 000 FCFA près.
 */
export type Currency = "MAD" | "XOF";

export const CURRENCY_STORAGE_KEY = "vlab-currency";
export const MAD_TO_XOF = 60;

export function convert(mad: number, cur: Currency): number {
  return cur === "XOF" ? Math.round((mad * MAD_TO_XOF) / 5000) * 5000 : mad;
}

export function formatNumber(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function unit(cur: Currency): string {
  return cur === "XOF" ? "FCFA" : "MAD";
}

/** « 3 000 MAD » */
export function formatPrice(mad: number, cur: Currency): string {
  return `${formatNumber(convert(mad, cur))} ${unit(cur)}`;
}

/** « dès 3 000 MAD » */
export function fromPrice(mad: number, cur: Currency): string {
  return `dès ${formatPrice(mad, cur)}`;
}

/** « 25 000 – 70 000 MAD » */
export function formatRange(minMad: number, maxMad: number, cur: Currency): string {
  return `${formatNumber(convert(minMad, cur))} – ${formatNumber(convert(maxMad, cur))} ${unit(cur)}`;
}
