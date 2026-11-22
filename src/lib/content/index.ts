import "server-only";
import { asc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { getDb } from "@/db";
import { showcaseProjects, siteContent, testimonials } from "@/db/schema";
import { DEFAULTS, OFFER_SLUGS, type ContentBlocks, type ContentKey } from "./defaults";

export * from "./defaults";

/** Tag de cache invalidé à chaque enregistrement dans l'admin. */
export const CONTENT_TAG = "site-content";

function merge<K extends ContentKey>(key: K, value: unknown): ContentBlocks[K] {
  const def = DEFAULTS[key];
  if (value == null) return def;
  if (Array.isArray(def)) return (Array.isArray(value) ? value : def) as ContentBlocks[K];
  if (key === "offers") {
    const v = value as Partial<ContentBlocks["offers"]>;
    return Object.fromEntries(OFFER_SLUGS.map((s) => [s, { ...DEFAULTS.offers[s], ...(v[s] ?? {}) }])) as ContentBlocks[K];
  }
  return { ...(def as object), ...(value as object) } as ContentBlocks[K];
}

/** Tous les blocs de contenu (valeurs en base fusionnées avec les valeurs par défaut). */
export async function getBlocks(): Promise<ContentBlocks> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("max");
  const rows = await getDb().select().from(siteContent);
  const byKey = new Map(rows.map((r) => [r.key, r.value]));
  return Object.fromEntries(
    (Object.keys(DEFAULTS) as ContentKey[]).map((k) => [k, merge(k, byKey.get(k))]),
  ) as ContentBlocks;
}

/** Réalisations publiées, dans l'ordre choisi. */
export async function getProjects() {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("max");
  return getDb()
    .select()
    .from(showcaseProjects)
    .where(eq(showcaseProjects.published, true))
    .orderBy(asc(showcaseProjects.position), asc(showcaseProjects.id));
}

/** Témoignages publiés. */
export async function getTestimonials() {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("max");
  return getDb()
    .select()
    .from(testimonials)
    .where(eq(testimonials.published, true))
    .orderBy(asc(testimonials.position), asc(testimonials.id));
}

/** Sous-ensemble transmis aux composants client (prix, coordonnées). */
export type PublicContent = {
  contact: ContentBlocks["contact"];
  plans: ContentBlocks["plans"];
  offerPrices: Record<string, number | null>;
  offerTitles: Record<string, string>;
  delaiReponse: string;
};

export async function getPublicContent(): Promise<PublicContent> {
  const b = await getBlocks();
  return {
    contact: b.contact,
    plans: b.plans,
    offerPrices: Object.fromEntries(OFFER_SLUGS.map((s) => [s, b.offers[s].price])),
    offerTitles: Object.fromEntries(OFFER_SLUGS.map((s) => [s, b.offers[s].title])),
    delaiReponse: b.texts.delaiReponse,
  };
}
