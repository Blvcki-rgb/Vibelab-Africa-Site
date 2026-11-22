import type { ReactNode } from "react";

/**
 * Éléments fixes du design (icônes, étapes de la méthode).
 * Les contenus modifiables (textes, prix, réalisations, FAQ…) sont dans lib/content.
 */

const ic = { width: 30, height: 30, viewBox: "0 0 28 28", fill: "none", stroke: "#1FB5A3", strokeWidth: 1.5, "aria-hidden": true } as const;

export const SERVICE_ICONS: Record<string, ReactNode> = {
  "site-vitrine": (
    <svg {...ic}>
      <rect x="3" y="5" width="22" height="18" rx="3" />
      <path d="M3 10 H25" />
    </svg>
  ),
  boutique: (
    <svg {...ic}>
      <rect x="5" y="10" width="18" height="14" rx="2.5" />
      <path d="M10 10 V8 a4 4 0 0 1 8 0 V10" />
    </svg>
  ),
  app: (
    <svg {...ic}>
      <rect x="5" y="15" width="4" height="8" rx="1" />
      <rect x="12" y="10" width="4" height="13" rx="1" />
      <rect x="19" y="5" width="4" height="18" rx="1" />
    </svg>
  ),
  ia: (
    <svg {...ic} strokeLinejoin="round">
      <path d="M14 3 L16.6 11.4 L25 14 L16.6 16.6 L14 25 L11.4 16.6 L3 14 L11.4 11.4 Z" />
    </svg>
  ),
  automatisation: (
    <svg {...ic}>
      <circle cx="7" cy="14" r="3" />
      <circle cx="21" cy="7" r="3" />
      <circle cx="21" cy="21" r="3" />
      <path d="M9.7 12.7 L18.3 8.3 M9.7 15.3 L18.3 19.7" />
    </svg>
  ),
  refonte: (
    <svg {...ic} strokeLinecap="round">
      <path d="M23 14a9 9 0 1 1-2.6-6.4" />
      <path d="M21 3v5h-5" />
    </svg>
  ),
};

export const METHOD = [
  { n: "01", t: "Brief", d: "Vous décrivez votre activité et votre idée, en ligne ou sur WhatsApp. Je vous envoie un devis clair." },
  { n: "02", t: "Maquettes", d: "Je vous montre à quoi ressemblera votre site avant d’écrire la moindre ligne de code." },
  { n: "03", t: "Développement assisté par IA", d: "Je code votre projet avec l’aide de l’IA. Je relis, je corrige et je valide chaque ligne. Vous suivez l’avancement." },
  { n: "04", t: "Mise en ligne & suivi", d: "Votre site est en ligne. Je reste disponible pour les ajustements et la maintenance." },
];

export const OFFER_STEPS = [
  { n: "01", t: "Brief", d: "Vous décrivez votre projet, je vous envoie un devis." },
  { n: "02", t: "Maquettes", d: "Vous validez le design avant le développement." },
  { n: "03", t: "Développement assisté par IA", d: "Je code avec l'aide de l'IA, puis je relis, corrige et valide tout." },
  { n: "04", t: "Mise en ligne & suivi", d: "Votre projet est en ligne, je reste disponible." },
];
