/** Liens globaux. Les coordonnées sont modifiables dans l'admin (Contenus › Coordonnées). */

/** Lien WhatsApp ; « #whatsapp » tant que le numéro n'est pas renseigné. */
export function whatsappHref(number: string, message = ""): string {
  const n = number.replace(/[^\d]/g, "");
  if (!n) return "#whatsapp";
  return `https://wa.me/${n}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

export function instagramHref(handle: string): string {
  const h = handle.trim().replace(/^@/, "");
  if (!h) return "#instagram";
  return h.startsWith("http") ? h : `https://instagram.com/${h}`;
}

export const NAV_LINKS = [
  { key: "services", label: "Services", href: "/services" },
  { key: "realisations", label: "Réalisations", href: "/realisations" },
  { key: "tarifs", label: "Tarifs", href: "/tarifs" },
  { key: "apropos", label: "À propos", href: "/a-propos" },
] as const;
