/** Options et validation du brief (/demarrer), partagées entre le formulaire et le serveur. */

export type BriefForm = {
  nom: string;
  tel: string;
  email: string;
  activite: string;
  type: string;
  objectif: string;
  cible: string;
  pages: string[];
  fonct: string[];
  style: string[];
  refs: string;
  budget: string;
  delai: string;
};

export const EMPTY_BRIEF: BriefForm = {
  nom: "",
  tel: "",
  email: "",
  activite: "",
  type: "",
  objectif: "",
  cible: "",
  pages: [],
  fonct: [],
  style: [],
  refs: "",
  budget: "",
  delai: "",
};

export const STEP_NAMES = ["Coordonnées", "Type de projet", "Objectif et cible", "Pages et style", "Budget et délai"];

/** Types de projet proposés dans le brief. `slug` = offre correspondante (?o=) dont on affiche le prix. */
export const PROJECT_TYPES: { label: string; slug?: string; fixed?: string }[] = [
  { label: "Site vitrine", slug: "site-vitrine" },
  { label: "Boutique en ligne", slug: "boutique" },
  { label: "App / SaaS / Dashboard", slug: "app" },
  { label: "Outil IA", slug: "ia" },
  { label: "Automatisation", slug: "automatisation" },
  { label: "Refonte", slug: "refonte", fixed: "sur devis" },
  { label: "Je ne sais pas encore", fixed: "on en parle" },
];

export const CHOICE_GROUPS = [
  { key: "pages", title: "Pages souhaitées", items: ["Accueil", "À propos", "Services", "Boutique", "Blog", "Contact", "Réservation"] },
  {
    key: "fonct",
    title: "Fonctionnalités",
    items: ["Commande WhatsApp", "Paiement en ligne", "Paiement à la livraison", "Prise de rendez-vous", "Plusieurs langues", "Espace client", "Assistant IA"],
  },
  { key: "style", title: "Style", items: ["Sobre", "Luxe", "Coloré", "Minimaliste", "Tech", "Chaleureux"] },
] as const;

/** Budgets : bornes en MAD (null = libellé fixe). La valeur stockée est l'id. */
export const BUDGETS: { id: string; min?: number; max?: number; label?: string }[] = [
  { id: "2-3k", min: 2000, max: 3000 },
  { id: "3-6k", min: 3000, max: 6000 },
  { id: "6-12k", min: 6000, max: 12000 },
  { id: "12k+", min: 12000 },
  { id: "tbd", label: "À définir ensemble" },
];

export const DELAIS = ["Le plus vite possible", "Dans le mois", "Pas pressé"];

/** Retourne un message d'erreur pour l'étape donnée, ou "" si elle est valide. */
export function checkStep(step: number, f: BriefForm): string {
  if (step === 1 && !f.nom.trim()) return "Indiquez votre prénom et votre nom.";
  if (step === 1 && !f.tel.trim() && !f.email.trim())
    return "Indiquez un numéro WhatsApp ou un e-mail pour que je puisse vous répondre.";
  if (step === 1 && f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()))
    return "Cette adresse e-mail ne semble pas valide.";
  if (step === 2 && !f.type) return "Choisissez un type de projet.";
  return "";
}
