import { bigint, boolean, index, integer, jsonb, pgEnum, pgTable, serial, text, timestamp, date } from "drizzle-orm/pg-core";

/* ───────────── Authentification (Better Auth) ───────────── */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (t) => [index("session_userId_idx").on(t.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [index("account_userId_idx").on(t.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [index("verification_identifier_idx").on(t.identifier)],
);

/** Compteurs anti-brute-force de la connexion (Better Auth, rateLimit.storage = "database") */
export const rateLimit = pgTable("rate_limit", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  count: integer("count").notNull(),
  lastRequest: bigint("last_request", { mode: "number" }).notNull(),
});

/* ───────────── Messages : briefs reçus via /demarrer ───────────── */

export const briefStatus = pgEnum("brief_status", ["nouveau", "lu", "archive"]);

export const briefs = pgTable(
  "briefs",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    status: briefStatus("status").default("nouveau").notNull(),
    nom: text("nom").notNull(),
    tel: text("tel").notNull().default(""),
    email: text("email").notNull().default(""),
    activite: text("activite").notNull().default(""),
    type: text("type").notNull(),
    objectif: text("objectif").notNull().default(""),
    cible: text("cible").notNull().default(""),
    pages: jsonb("pages").$type<string[]>().notNull().default([]),
    fonct: jsonb("fonct").$type<string[]>().notNull().default([]),
    style: jsonb("style").$type<string[]>().notNull().default([]),
    refs: text("refs").notNull().default(""),
    /** Libellé du budget en MAD (ex. « 3 000 – 6 000 MAD ») */
    budget: text("budget").notNull().default(""),
    delai: text("delai").notNull().default(""),
  },
  (t) => [index("briefs_status_idx").on(t.status)],
);

/* ───────────── Suivi des projets clients ───────────── */

export const projectStatus = pgEnum("project_status", [
  "nouveau",
  "devis_envoye",
  "acompte_recu",
  "en_cours",
  "livre",
  "annule",
]);

export const clientProjects = pgTable(
  "client_projects",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    briefId: integer("brief_id").references(() => briefs.id, { onDelete: "set null" }),
    client: text("client").notNull(),
    contact: text("contact").notNull().default(""),
    titre: text("titre").notNull(),
    type: text("type").notNull().default(""),
    status: projectStatus("status").default("nouveau").notNull(),
    /** Montant total du devis, en MAD */
    montant: integer("montant"),
    acomptePaye: boolean("acompte_paye").default(false).notNull(),
    soldePaye: boolean("solde_paye").default(false).notNull(),
    echeance: date("echeance"),
    lienSite: text("lien_site").notNull().default(""),
    notes: text("notes").notNull().default(""),
  },
  (t) => [index("client_projects_status_idx").on(t.status)],
);

export type Brief = typeof briefs.$inferSelect;
export type ClientProject = typeof clientProjects.$inferSelect;

/* ───────────── Contenus du site (édités depuis l'admin) ───────────── */

/** Blocs de contenu clé → valeur JSON (coordonnées, textes, offres, FAQ…). Voir lib/content. */
export const siteContent = pgTable("site_content", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

/** Réalisations affichées sur le site (cartes + études de cas). */
export const showcaseProjects = pgTable("showcase_projects", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  position: integer("position").notNull().default(0),
  published: boolean("published").notNull().default(true),
  /** Nom sur les cartes (ex. « L'Or des Sens + dashboard Luxe parfums ») */
  name: text("name").notNull(),
  /** Nom court de l'étude de cas (ex. « L'Or des Sens ») */
  caseName: text("case_name").notNull().default(""),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  /** URL affichée dans la barre du navigateur (sans https://) */
  url: text("url").notNull().default(""),
  /** Lien « Voir le site » */
  href: text("href").notNull().default(""),
  img: text("img").notNull().default(""),
  imgWidth: integer("img_width").notNull().default(1820),
  imgHeight: integer("img_height").notNull().default(897),
  alt: text("alt").notNull().default(""),
  text: text("text").notNull().default(""),
  intro: text("intro").notNull().default(""),
  features: jsonb("features").$type<string[]>().notNull().default([]),
  contexte: text("contexte").notNull().default(""),
  resultats: text("resultats").notNull().default(""),
  delai: text("delai").notNull().default(""),
  temoignage: text("temoignage").notNull().default(""),
  temoignageAuteur: text("temoignage_auteur").notNull().default(""),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

/** Témoignages clients affichés sur l'accueil. */
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  position: integer("position").notNull().default(0),
  published: boolean("published").notNull().default(true),
  quote: text("quote").notNull(),
  author: text("author").notNull(),
  city: text("city").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ShowcaseProject = typeof showcaseProjects.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
