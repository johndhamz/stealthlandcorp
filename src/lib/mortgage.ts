/**
 * Indicative mortgage model carried over from the original site.
 * These are illustrative figures only and not an offer or quotation.
 */
export const PRICE_PER_SQM = 210_000;
export const BASE_FEES = 1_488_834.75;
export const USD_RATE = 55;

export const ROOM_TYPES = [
  { value: "studio", label: "Studio", sqm: 32 },
  { value: "1br", label: "1 BR", sqm: 40 },
  { value: "2br", label: "2 BR", sqm: 55 },
] as const;

export const FINISHES = [
  { value: "full", label: "Fully-furnished", addOn: 2_000_000 },
  { value: "semi", label: "Semi-furnished", addOn: 1_250_000 },
  { value: "none", label: "Bare / Standard finish", addOn: 0 },
] as const;

export const TERMS = Array.from({ length: 13 }, (_, i) => i + 3); // 3..15 years

export const SQM_MIN = 32;
export const SQM_MAX = 55;

export type RoomType = (typeof ROOM_TYPES)[number]["value"];
export type Finish = (typeof FINISHES)[number]["value"];

export function unitPrice(sqm: number, finish: Finish) {
  const addOn = FINISHES.find((f) => f.value === finish)?.addOn ?? 0;
  return PRICE_PER_SQM * sqm + BASE_FEES + addOn;
}

export function computeMortgage(input: {
  sqm: number;
  finish: Finish;
  years: number;
  downpaymentPct: number;
}) {
  const total = unitPrice(input.sqm, input.finish);
  const downpayment = total * (input.downpaymentPct / 100);
  const financed = total - downpayment;
  const months = input.years * 12;
  const monthly = financed / months;
  return { total, downpayment, financed, months, monthly };
}

export function toCurrency(amountPhp: number, currency: "PHP" | "USD") {
  return currency === "USD" ? amountPhp / USD_RATE : amountPhp;
}
