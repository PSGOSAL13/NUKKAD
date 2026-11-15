import type { Locale } from "@/i18n/config";
import { dateFormat, numberFormat } from "./intl";
import type { Day } from "@/content/schema";

const intlLocale: Record<Locale, string> = { en: "en-IN", ml: "ml-IN" };

/** "07:30" → "7:30 am" (or the Malayalam equivalent). */
export function formatTime(hhmm: string, locale: Locale): string {
  const [h, m] = hhmm.split(":").map(Number);
  return dateFormat(intlLocale[locale], {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(Date.UTC(2000, 0, 1, h, m));
}

/** ₹ with Indian digit grouping. */
export function formatPrice(rupees: number, locale: Locale): string {
  return numberFormat(intlLocale[locale], {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupees);
}

/** "+919876543210" → "+91 98765 43210" */
export function formatPhone(e164: string): string {
  const m = e164.match(/^\+91(\d{5})(\d{5})$/);
  return m ? `+91 ${m[1]} ${m[2]}` : e164;
}

/**
 * Google Maps directions link (official Maps URLs, no API key).
 * Prefers an exact share link, then coordinates, then the address text —
 * placeholder text is never sent to Google.
 */
export function directionsHref(s: {
  mapsUrl?: string;
  geo?: { lat: number; lng: number };
  address: { line1: { en: string }; city: { en: string }; state: { en: string } };
}): string {
  if (s.mapsUrl) return s.mapsUrl;
  const base = "https://www.google.com/maps/dir/?api=1&destination=";
  if (s.geo) return `${base}${s.geo.lat},${s.geo.lng}`;
  const parts = [s.address.line1.en, s.address.city.en, s.address.state.en].filter(
    (p) => !p.includes("PLACEHOLDER"),
  );
  return base + encodeURIComponent(["NUKKAD", ...parts].join(", "));
}

export const telHref = (e164: string) => `tel:${e164}`;
/** WhatsApp click-to-chat link, optionally with a pre-filled message. */
export const whatsappHref = (e164: string, message?: string) =>
  `https://wa.me/${e164.replace(/^\+/, "")}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

export const dayOrder: Day[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

/** ["mon","tue","wed"] → "Monday – Wednesday"; non-consecutive days are listed. */
export function formatDays(days: Day[], names: Record<Day, string>): string {
  const sorted = [...days].sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
  const consecutive = sorted.every(
    (d, i) => i === 0 || dayOrder.indexOf(d) === dayOrder.indexOf(sorted[i - 1]) + 1,
  );
  if (sorted.length > 2 && consecutive) return `${names[sorted[0]]} – ${names[sorted.at(-1)!]}`;
  return sorted.map((d) => names[d]).join(", ");
}
