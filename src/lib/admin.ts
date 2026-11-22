/** Libellés et couleurs de l'espace admin. */

export const BRIEF_STATUS = {
  nouveau: { label: "Nouveau", cls: "bg-saffron text-night" },
  lu: { label: "Lu", cls: "bg-ivory/10 text-ivory" },
  archive: { label: "Archivé", cls: "bg-ivory/5 text-muted" },
} as const;

export const PROJECT_STATUS = {
  nouveau: { label: "Nouveau", cls: "bg-ivory/10 text-ivory" },
  devis_envoye: { label: "Devis envoyé", cls: "bg-[#3B4A7A] text-ivory" },
  acompte_recu: { label: "Acompte reçu", cls: "bg-teal-light-bg text-ivory" },
  en_cours: { label: "En cours", cls: "bg-saffron text-night" },
  livre: { label: "Livré", cls: "bg-teal text-night" },
  annule: { label: "Annulé", cls: "bg-ivory/5 text-muted line-through" },
} as const;

export type ProjectStatusKey = keyof typeof PROJECT_STATUS;
export const PROJECT_STATUS_KEYS = Object.keys(PROJECT_STATUS) as ProjectStatusKey[];
/** Statuts considérés comme « en cours » (ni livrés, ni annulés) */
export const ACTIVE_STATUSES: ProjectStatusKey[] = ["nouveau", "devis_envoye", "acompte_recu", "en_cours"];

export function formatMad(n: number | null | undefined) {
  if (n == null) return "—";
  return `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} MAD`;
}

export function formatDate(d: Date | string | null | undefined, withTime = false) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    timeZone: "Africa/Casablanca",
  });
}

/** Montant restant à encaisser sur un projet (acompte 50 % / solde 50 %). */
export function remaining(p: { montant: number | null; acomptePaye: boolean; soldePaye: boolean; status: string }) {
  if (!p.montant || p.status === "annule") return 0;
  const half = Math.round(p.montant / 2);
  return (p.acomptePaye ? 0 : half) + (p.soldePaye ? 0 : p.montant - half);
}
