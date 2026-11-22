"use server";

import { del, put } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { showcaseProjects, siteContent, testimonials } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { CONTENT_TAG, OFFER_SLUGS, getBlocks, type ContentBlocks, type ContentKey, type FaqItem, type OfferSlug } from "@/lib/content";

/* ───────── utilitaires ───────── */

const txt = (fd: FormData, k: string, max = 4000) => {
  const v = fd.get(k);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
};
const lines = (fd: FormData, k: string) =>
  txt(fd, k, 20000)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 50);
const int = (fd: FormData, k: string): number | null => {
  const raw = txt(fd, k).replace(/[\s ]/g, "");
  if (raw === "") return null;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 0 || n > 100_000_000) throw new Error(`Valeur invalide pour « ${k} »`);
  return n;
};
const isBlobUrl = (u: string) => /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i.test(u);

async function saveBlock<K extends ContentKey>(key: K, value: ContentBlocks[K]) {
  await getDb()
    .insert(siteContent)
    .values({ key, value })
    .onConflictDoUpdate({ target: siteContent.key, set: { value, updatedAt: new Date() } });
}

function done(path: string): never {
  updateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
  redirect(`${path}${path.includes("?") ? "&" : "?"}ok=1`);
}

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/avif"];
const MAX_IMAGE = 3.8 * 1024 * 1024;

/**
 * Téléverse l'image du champ `field` (si un fichier est choisi) dans Vercel Blob.
 * Renvoie la nouvelle URL, ou null si aucun fichier n'a été envoyé.
 */
async function uploadImage(fd: FormData, field: string, folder: string): Promise<string | null> {
  const f = fd.get(field);
  if (!(f instanceof File) || f.size === 0) return null;
  if (!IMAGE_TYPES.includes(f.type)) throw new Error("Format d'image non accepté (PNG, JPEG, WebP ou AVIF).");
  if (f.size > MAX_IMAGE) throw new Error("Image trop lourde (3,8 Mo maximum).");
  const ext = f.type.split("/")[1].replace("jpeg", "jpg");
  const blob = await put(`${folder}/${Date.now()}.${ext}`, f, { access: "public", contentType: f.type, addRandomSuffix: true });
  return blob.url;
}

/** Supprime une ancienne image du Blob (jamais les images d'origine du dossier /public). */
async function removeOld(url: string | undefined | null) {
  if (url && isBlobUrl(url)) {
    try {
      await del(url);
    } catch (e) {
      console.error("[contenus] suppression d'image impossible :", e);
    }
  }
}

/* ───────── Coordonnées, textes, À propos ───────── */

export async function saveGeneral(fd: FormData) {
  await requireAdmin();
  const b = await getBlocks();
  await saveBlock("contact", {
    whatsappNumber: txt(fd, "whatsappNumber", 30).replace(/[^\d]/g, ""),
    whatsappMessage: txt(fd, "whatsappMessage", 300),
    email: txt(fd, "email", 160),
    instagram: txt(fd, "instagram", 200),
  });
  await saveBlock("texts", {
    delaiReponse: txt(fd, "delaiReponse", 120) || b.texts.delaiReponse,
    sourceComparaison: txt(fd, "sourceComparaison", 300),
    prixMaintenance: txt(fd, "prixMaintenance", 120),
  });
  done("/admin/contenus/general");
}

export async function saveAbout(fd: FormData) {
  await requireAdmin();
  const { about } = await getBlocks();
  let photo = about.photo;
  const uploaded = await uploadImage(fd, "photo", "a-propos");
  if (uploaded) {
    await removeOld(about.photo);
    photo = uploaded;
  } else if (fd.get("removePhoto") === "on") {
    await removeOld(about.photo);
    photo = "";
  }
  await saveBlock("about", {
    nom: txt(fd, "nom", 120),
    parcours: txt(fd, "parcours", 3000),
    pourquoi: txt(fd, "pourquoi", 3000),
    photo,
  });
  done("/admin/contenus/a-propos");
}

/* ───────── FAQ ───────── */

export async function saveFaq(fd: FormData) {
  await requireAdmin();
  const key = txt(fd, "key");
  if (key !== "faq_home" && key !== "faq_pricing") throw new Error("FAQ inconnue");
  let items: FaqItem[] = [];
  try {
    const raw = JSON.parse(txt(fd, "items", 50000)) as unknown;
    if (Array.isArray(raw)) {
      items = raw
        .map((x) => ({ q: String((x as FaqItem)?.q ?? "").trim().slice(0, 300), a: String((x as FaqItem)?.a ?? "").trim().slice(0, 3000) }))
        .filter((x) => x.q && x.a)
        .slice(0, 30);
    }
  } catch {
    throw new Error("Données de FAQ invalides");
  }
  await saveBlock(key, items);
  done("/admin/contenus/faq");
}

/* ───────── Prix et offres ───────── */

export async function savePlans(fd: FormData) {
  await requireAdmin();
  const { plans } = await getBlocks();
  await saveBlock("plans", {
    essentiel: int(fd, "essentiel") ?? plans.essentiel,
    business: int(fd, "business") ?? plans.business,
    surMesure: int(fd, "surMesure") ?? plans.surMesure,
  });
  done("/admin/contenus/offres");
}

export async function saveOffer(fd: FormData) {
  await requireAdmin();
  const slug = txt(fd, "slug") as OfferSlug;
  if (!OFFER_SLUGS.includes(slug)) throw new Error("Offre inconnue");
  const { offers } = await getBlocks();
  const title = txt(fd, "title", 80);
  if (!title) throw new Error("Le nom de l'offre est obligatoire.");
  await saveBlock("offers", {
    ...offers,
    [slug]: {
      title,
      cardText: txt(fd, "cardText", 400),
      price: fd.get("surDevis") === "on" ? null : int(fd, "price"),
      h1: txt(fd, "h1", 200),
      intro: txt(fd, "intro", 600),
      pourQui: lines(fd, "pourQui"),
      inclus: lines(fd, "inclus"),
      ex: txt(fd, "ex", 80),
    },
  });
  done(`/admin/contenus/offres/${slug}`);
}

/* ───────── Réalisations ───────── */

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function projectFields(fd: FormData) {
  const name = txt(fd, "name", 160);
  if (!name) throw new Error("Le nom du projet est obligatoire.");
  const href = txt(fd, "href", 500);
  if (href && !/^https?:\/\//i.test(href)) throw new Error("Le lien du site doit commencer par https://");
  return {
    name,
    caseName: txt(fd, "caseName", 120),
    slug: slugify(txt(fd, "slug", 80) || name),
    tags: lines(fd, "tags").slice(0, 6),
    href,
    url: href.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, ""),
    alt: txt(fd, "alt", 300) || `Page d'accueil du site ${name}`,
    text: txt(fd, "text", 600),
    intro: txt(fd, "intro", 800),
    features: lines(fd, "features"),
    contexte: txt(fd, "contexte", 3000),
    resultats: txt(fd, "resultats", 3000),
    delai: txt(fd, "delai", 120),
    temoignage: txt(fd, "temoignage", 1500),
    temoignageAuteur: txt(fd, "temoignageAuteur", 160),
    position: int(fd, "position") ?? 0,
    published: fd.get("published") === "on",
  };
}

function imageDims(fd: FormData) {
  const w = int(fd, "imgWidth");
  const h = int(fd, "imgHeight");
  return w && h ? { imgWidth: w, imgHeight: h } : {};
}

export async function createShowcase(fd: FormData) {
  await requireAdmin();
  const fields = projectFields(fd);
  if (!fields.slug) throw new Error("Nom de projet invalide.");
  const img = await uploadImage(fd, "img", "realisations");
  const [p] = await getDb()
    .insert(showcaseProjects)
    .values({ ...fields, ...(img ? { img, ...imageDims(fd) } : {}) })
    .returning({ id: showcaseProjects.id });
  done(`/admin/contenus/realisations/${p.id}`);
}

export async function updateShowcase(fd: FormData) {
  await requireAdmin();
  const id = int(fd, "id");
  if (!id) throw new Error("Identifiant invalide");
  const db = getDb();
  const [old] = await db.select().from(showcaseProjects).where(eq(showcaseProjects.id, id));
  if (!old) throw new Error("Réalisation introuvable");
  const fields = projectFields(fd);
  const img = await uploadImage(fd, "img", "realisations");
  if (img) await removeOld(old.img);
  await db
    .update(showcaseProjects)
    .set({ ...fields, ...(img ? { img, ...imageDims(fd) } : {}) })
    .where(eq(showcaseProjects.id, id));
  done(`/admin/contenus/realisations/${id}`);
}

export async function deleteShowcase(fd: FormData) {
  await requireAdmin();
  const id = int(fd, "id");
  if (!id) throw new Error("Identifiant invalide");
  const [old] = await getDb().delete(showcaseProjects).where(eq(showcaseProjects.id, id)).returning();
  await removeOld(old?.img);
  done("/admin/contenus/realisations");
}

/* ───────── Témoignages ───────── */

export async function saveTestimonial(fd: FormData) {
  await requireAdmin();
  const id = int(fd, "id");
  const values = {
    quote: txt(fd, "quote", 1500),
    author: txt(fd, "author", 120),
    city: txt(fd, "city", 120),
    position: int(fd, "position") ?? 0,
    published: fd.get("published") === "on",
  };
  if (!values.quote || !values.author) throw new Error("Le témoignage et le nom sont obligatoires.");
  const db = getDb();
  if (id) await db.update(testimonials).set(values).where(eq(testimonials.id, id));
  else await db.insert(testimonials).values(values);
  done("/admin/contenus/temoignages");
}

export async function deleteTestimonial(fd: FormData) {
  await requireAdmin();
  const id = int(fd, "id");
  if (!id) throw new Error("Identifiant invalide");
  await getDb().delete(testimonials).where(eq(testimonials.id, id));
  done("/admin/contenus/temoignages");
}

/* ───────── Mentions légales ───────── */

export async function saveLegal(fd: FormData) {
  await requireAdmin();
  const f = (k: string, max = 2000) => txt(fd, k, max);
  await saveBlock("legal", {
    formeJuridique: f("formeJuridique", 120),
    siege: f("siege", 300),
    rc: f("rc", 60),
    ice: f("ice", 60),
    directeur: f("directeur", 120),
    hebergeur: f("hebergeur"),
    conservation: f("conservation", 300),
    cookies: f("cookies"),
    miseAJour: f("miseAJour", 60),
  });
  done("/admin/contenus/mentions-legales");
}
