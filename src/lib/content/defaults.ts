/**
 * Valeurs par défaut des contenus du site. Elles s'appliquent tant qu'un bloc
 * n'a pas été modifié depuis l'admin (table site_content).
 */

export const OFFER_SLUGS = ["site-vitrine", "boutique", "app", "ia", "automatisation", "refonte"] as const;
export type OfferSlug = (typeof OFFER_SLUGS)[number];

export type Contact = {
  /** Numéro au format international sans + ni espaces (ex. 212600000000) */
  whatsappNumber: string;
  whatsappMessage: string;
  email: string;
  instagram: string;
};

export type Texts = {
  delaiReponse: string;
  sourceComparaison: string;
  prixMaintenance: string;
};

export type About = {
  nom: string;
  parcours: string;
  pourquoi: string;
  /** URL de la photo (Blob) ou vide */
  photo: string;
};

export type Offer = {
  title: string;
  cardText: string;
  /** Prix « dès » en MAD, ou null = sur devis */
  price: number | null;
  h1: string;
  intro: string;
  pourQui: string[];
  inclus: string[];
  /** slug d'une réalisation utilisée comme exemple, ou "" */
  ex: string;
};

export type Legal = {
  formeJuridique: string;
  siege: string;
  rc: string;
  ice: string;
  directeur: string;
  hebergeur: string;
  conservation: string;
  cookies: string;
  miseAJour: string;
};

export type Plans = { essentiel: number; business: number; surMesure: number };
export type FaqItem = { q: string; a: string };

export type ContentBlocks = {
  contact: Contact;
  texts: Texts;
  about: About;
  legal: Legal;
  offers: Record<OfferSlug, Offer>;
  plans: Plans;
  faq_home: FaqItem[];
  faq_pricing: FaqItem[];
};
export type ContentKey = keyof ContentBlocks;

export const DEFAULTS: ContentBlocks = {
  contact: {
    whatsappNumber: "212684537916",
    whatsappMessage: "Bonjour VibeLab Africa, j'aimerais parler de mon projet.",
    email: "globaltradingafricasquad@gmail.com",
    instagram: "",
  },
  texts: {
    delaiReponse: "[DÉLAI DE RÉPONSE À REMPLACER]",
    sourceComparaison: "[À REMPLACER — source des prix moyens agences / freelances]",
    prixMaintenance: "[PRIX À REMPLACER]",
  },
  about: {
    nom: "[Prénom Nom]",
    parcours: "[À REMPLACER : votre parcours en quelques lignes, ce qui vous a amené au vibe coding.]",
    pourquoi: "[À REMPLACER : pourquoi vous avez créé VibeLab Africa et pour qui.]",
    photo: "",
  },
  legal: {
    formeJuridique: "[À REMPLACER]",
    siege: "[ADRESSE À REMPLACER], Casablanca, Maroc",
    rc: "[À REMPLACER]",
    ice: "[À REMPLACER]",
    directeur: "[À REMPLACER]",
    hebergeur:
      "Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — vercel.com.\nLes données du formulaire sont enregistrées dans une base de données Neon (neon.com) et les images dans Vercel Blob, deux services fournis via Vercel.",
    conservation: "[À REMPLACER : par exemple 3 ans après le dernier échange]",
    cookies:
      "Ce site n'utilise aucun cookie publicitaire ni de mesure d'audience. Il enregistre seulement dans votre navigateur votre choix de devise (MAD ou FCFA), sans aucune donnée personnelle. Un cookie de connexion est utilisé uniquement pour l'espace d'administration réservé à l'éditeur.",
    miseAJour: "22 novembre 2026",
  },
  plans: { essentiel: 2000, business: 3000, surMesure: 3000 },
  offers: {
    "site-vitrine": {
      title: "Site vitrine",
      cardText: "Une présence en ligne claire et soignée pour présenter votre activité et recevoir des demandes.",
      price: 3000,
      h1: "Un site vitrine qui donne envie de vous contacter.",
      intro: "Présentez votre activité, vos services et vos coordonnées sur un site clair, rapide et pensé pour le téléphone.",
      pourQui: [
        "Vous lancez votre activité et vous n’avez pas encore de site.",
        "Vos clients vous cherchent sur Google sans vous trouver.",
        "Vous voulez une image plus professionnelle que vos seuls réseaux sociaux.",
      ],
      inclus: [
        "Design sur mesure, adapté au mobile",
        "Pages essentielles : accueil, services, à propos, contact",
        "Formulaire de contact et bouton WhatsApp",
        "Référencement de base sur Google",
        "Mise en ligne sur votre nom de domaine",
        "[À COMPLÉTER : nombre de pages et de retours inclus]",
      ],
      ex: "be-helpful",
    },
    boutique: {
      title: "Boutique en ligne",
      cardText: "Vendez au-delà de WhatsApp et Instagram, avec un catalogue, un panier et des commandes simples.",
      price: 3000,
      h1: "Une boutique en ligne qui vend pour vous.",
      intro: "Un catalogue, un panier et des commandes simples : vos clients achètent sans passer par des dizaines de messages.",
      pourQui: [
        "Vous vendez sur WhatsApp ou Instagram et vous croulez sous les messages.",
        "Vous voulez présenter tout votre catalogue au même endroit.",
        "Vous souhaitez vendre dans plusieurs pays ou plusieurs devises.",
      ],
      inclus: [
        "Catalogue par catégories avec recherche",
        "Panier, commande sur WhatsApp ou paiement à la livraison",
        "Paiement en ligne [À CONFIRMER selon le pays]",
        "Fiches produits avec photos et prix",
        "Espace de gestion des commandes",
        "Mise en ligne sur votre nom de domaine",
      ],
      ex: "or-des-sens",
    },
    app: {
      title: "App / SaaS / Dashboard",
      cardText: "Un outil sur mesure pour gérer vos clients, vos ventes ou votre équipe au même endroit.",
      price: 3000,
      h1: "Un outil sur mesure pour piloter votre activité.",
      intro: "Suivez vos ventes, vos clients ou votre stock dans une application simple, faite pour votre façon de travailler.",
      pourQui: [
        "Vous gérez tout dans des fichiers Excel ou des cahiers.",
        "Vous voulez voir vos chiffres clés en un coup d’œil.",
        "Vous avez une idée d’application ou de service en ligne.",
      ],
      inclus: [
        "Tableau de bord avec vos indicateurs",
        "Comptes utilisateurs et accès sécurisés",
        "Gestion de vos données : clients, produits, commandes",
        "Export des données",
        "Utilisable sur téléphone",
        "Hébergement [À CONFIRMER]",
      ],
      ex: "or-des-sens",
    },
    ia: {
      title: "Outils IA",
      cardText: "Un assistant qui répond à vos clients, rédige vos contenus ou trie vos demandes.",
      price: 4000,
      h1: "L’IA au service de votre quotidien.",
      intro: "Un assistant qui répond à vos clients, rédige vos contenus ou trie vos demandes, branché sur vos outils.",
      pourQui: [
        "Vous répondez toute la journée aux mêmes questions.",
        "Vous passez trop de temps à écrire descriptions, posts ou e-mails.",
        "Vous recevez beaucoup de demandes à trier.",
      ],
      inclus: [
        "Assistant conversationnel pour votre site ou WhatsApp",
        "Rédaction automatique de contenus",
        "Tri et résumé des demandes entrantes",
        "Paramétrage avec les informations de votre activité",
        "Prise en main accompagnée",
      ],
      ex: "",
    },
    automatisation: {
      title: "Automatisation",
      cardText: "Les tâches répétitives se font toutes seules : relances, factures, tableaux, notifications.",
      price: 2000,
      h1: "Les tâches répétitives se font toutes seules.",
      intro: "Relances, factures, tableaux, notifications : on automatise ce qui vous prend du temps chaque semaine.",
      pourQui: [
        "Vous recopiez les mêmes informations dans plusieurs outils.",
        "Vous oubliez des relances clients.",
        "Vous voulez être prévenu dès qu’une commande arrive.",
      ],
      inclus: [
        "Repérage de vos tâches répétitives",
        "Connexion de vos outils : formulaires, tableurs, e-mail, WhatsApp",
        "Relances et notifications automatiques",
        "Génération de documents",
        "Suivi et ajustements",
      ],
      ex: "",
    },
    refonte: {
      title: "Refonte",
      cardText: "Votre site existe déjà ? Je le modernise, je l'accélère et je le rends parfait sur téléphone.",
      price: null,
      h1: "Votre site existe, donnons-lui une seconde vie.",
      intro: "Un site daté ou lent fait fuir vos visiteurs. Je le modernise, je l’accélère et je le rends parfait sur téléphone.",
      pourQui: [
        "Votre site ne s’affiche pas bien sur mobile.",
        "Il est lent ou difficile à modifier.",
        "Votre image a évolué, mais pas votre site.",
      ],
      inclus: [
        "Analyse de votre site actuel",
        "Nouveau design adapté au mobile",
        "Reprise de vos contenus",
        "Amélioration de la vitesse",
        "Conservation de votre référencement [À CONFIRMER]",
      ],
      ex: "",
    },
  },
  faq_home: [
    {
      q: "Combien de temps faut-il pour créer mon site ?",
      a: "Le délai dépend du projet : comptez [DÉLAI À REMPLACER] pour un site vitrine et [DÉLAI À REMPLACER] pour une boutique ou une application. Le planning exact est fixé dès le brief.",
    },
    {
      q: "Comment se passe le paiement ?",
      a: "Vous versez un acompte de 50 % à la commande. Le solde est réglé à la mise en ligne, une fois que vous avez validé le résultat.",
    },
    {
      q: "L’hébergement et le nom de domaine sont-ils inclus ?",
      a: "[À REMPLACER : préciser si l’hébergement et le domaine sont inclus, offerts la première année ou facturés à part.]",
    },
    {
      q: "Puis-je demander des modifications après la livraison ?",
      a: "[À REMPLACER : nombre de retours inclus et conditions.] Au-delà, une maintenance en option permet de faire évoluer votre site.",
    },
    {
      q: "Pourquoi utiliser l’IA pour créer un site ?",
      a: "L’IA est mon outil, pas mon remplaçant. Je conçois votre projet, je lui demande précisément ce dont j’ai besoin, puis je relis, je corrige et je valide chaque ligne de code avant la mise en ligne. Vous gagnez en rapidité et en prix, sans rien perdre en qualité.",
    },
  ],
  faq_pricing: [
    {
      q: "Comment se passe le paiement ?",
      a: "Vous versez un acompte de 50 % à la commande. Le solde est réglé à la mise en ligne, une fois que vous avez validé le résultat.",
    },
    {
      q: "L’hébergement et le nom de domaine sont-ils inclus ?",
      a: "[À REMPLACER : préciser si l’hébergement et le domaine sont inclus, offerts la première année ou facturés à part.]",
    },
    {
      q: "Pourquoi est-ce moins cher qu’une agence ?",
      a: "L’IA m’aide à produire plus vite. Je conçois, je relis et je corrige chaque ligne moi-même, sans les frais de structure d’une agence.",
    },
  ],
};

/** Réalisations insérées au premier lancement (npm run db:seed). */
export const DEFAULT_PROJECTS = [
  {
    slug: "or-des-sens",
    name: "L'Or des Sens + dashboard Luxe parfums",
    caseName: "L'Or des Sens",
    tags: ["E-commerce", "Dashboard"],
    url: "l-or-des-sens-store.vercel.app",
    href: "https://l-or-des-sens-store.vercel.app/",
    img: "/realisations/or-des-sens.png",
    imgWidth: 1907,
    imgHeight: 891,
    alt: "Page d'accueil de la boutique L'Or des Sens",
    text: "Une boutique en ligne pour une maison de parfums, accompagnée d’un dashboard de gestion pour suivre les commandes et le stock.",
    intro: "Une boutique en ligne pour une maison de parfums, accompagnée du dashboard Luxe parfums pour suivre les commandes et le stock.",
    features: [
      "Catalogue par familles : parfums classiques, de niche, coffrets, brumes & musc, diffuseurs",
      "Recherche de parfum, favoris et panier",
      "Composition de coffret sur mesure",
      "Paiement à la livraison partout au Maroc",
      "Dashboard de gestion Luxe parfums",
    ],
  },
  {
    slug: "mgb",
    name: "MGB Store",
    caseName: "MGB Store",
    tags: ["E-commerce international"],
    url: "mgb-store-final.vercel.app",
    href: "https://mgb-store-final.vercel.app/",
    img: "/realisations/mgb-store.png",
    imgWidth: 1817,
    imgHeight: 897,
    alt: "Page d'accueil de la boutique MGB Store",
    text: "Une boutique en ligne pensée pour vendre à l’international, simple à utiliser sur téléphone.",
    intro: "Une boutique en ligne pensée pour vendre à l’international, simple à utiliser sur téléphone.",
    features: [
      "Site bilingue français / anglais",
      "Prix affichés en plusieurs devises",
      "Catalogue par catégories et nouveautés",
      "Journal éditorial",
      "Compte client, favoris et panier",
    ],
  },
  {
    slug: "be-helpful",
    name: "Be Helpful Academy",
    caseName: "Be Helpful Academy",
    tags: ["Site vitrine", "SEO"],
    url: "behelpfulacademy.com",
    href: "https://www.behelpfulacademy.com/",
    img: "/realisations/be-helpful.png",
    imgWidth: 1810,
    imgHeight: 897,
    alt: "Page d'accueil du site Be Helpful Academy",
    text: "Un site vitrine clair, optimisé pour être trouvé sur Google.",
    intro: "Un site vitrine clair pour un organisme de formation, optimisé pour être trouvé sur Google.",
    features: [
      "Présentation des formations et des événements",
      "Pages Ressources et Helpful Experts",
      "Demande de programme en ligne",
      "Optimisation SEO",
    ],
  },
];
