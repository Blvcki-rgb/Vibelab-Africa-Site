import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { asc } from "drizzle-orm";
import { getDb } from "@/db";
import { showcaseProjects } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { OFFER_SLUGS, getBlocks, type OfferSlug } from "@/lib/content";
import { saveOffer } from "../../actions";
import { BackLink, PageHead, Saved, SubmitButton, fieldCls, gridCls, labelCls, sectionCls } from "../../../ui";

export const metadata: Metadata = { title: "Offre" };

export default async function OffreAdminPage({ params, searchParams }: PageProps<"/admin/contenus/offres/[slug]">) {
  await requireAdmin();
  const [{ slug }, { ok }] = await Promise.all([params, searchParams]);
  if (!(OFFER_SLUGS as readonly string[]).includes(slug)) notFound();
  const [{ offers }, projects] = await Promise.all([
    getBlocks(),
    getDb().select({ slug: showcaseProjects.slug, name: showcaseProjects.name }).from(showcaseProjects).orderBy(asc(showcaseProjects.position)),
  ]);
  const o = offers[slug as OfferSlug];

  return (
    <>
      <BackLink href="/admin/contenus/offres">Prix et offres</BackLink>
      <div className="mt-4">
        <PageHead
          title={o.title}
          action={
            <a href={`/services/${slug}`} target="_blank" className="font-mono text-xs text-muted hover:text-ivory">
              Voir la page ↗
            </a>
          }
        />
      </div>
      <Saved show={!!ok} />
      <form action={saveOffer} className="flex flex-col gap-6">
        <input type="hidden" name="slug" value={slug} />
        <section className={sectionCls}>
          <h2 className="m-0 text-lg font-semibold">Carte et prix</h2>
          <div className={gridCls}>
            <label className={labelCls}>
              Nom de l&apos;offre
              <input name="title" required defaultValue={o.title} className={fieldCls} />
            </label>
            <label className={labelCls}>
              Prix de départ (MAD)
              <input name="price" inputMode="numeric" defaultValue={o.price ?? ""} className={fieldCls} />
            </label>
            <label className="flex items-center gap-2.5 self-end pb-3 text-sm text-muted">
              <input type="checkbox" name="surDevis" defaultChecked={o.price === null} className="size-4 accent-[#E89B2C]" />
              Afficher « sur devis » au lieu d&apos;un prix
            </label>
          </div>
          <label className={labelCls}>
            Phrase de la carte (accueil et page Services)
            <textarea name="cardText" rows={2} defaultValue={o.cardText} className={`${fieldCls} resize-y`} />
          </label>
        </section>

        <section className={sectionCls}>
          <h2 className="m-0 text-lg font-semibold">Page de l&apos;offre</h2>
          <label className={labelCls}>
            Grand titre
            <input name="h1" defaultValue={o.h1} className={fieldCls} />
          </label>
          <label className={labelCls}>
            Introduction
            <textarea name="intro" rows={3} defaultValue={o.intro} className={`${fieldCls} resize-y`} />
          </label>
          <label className={labelCls}>
            « Cette offre est faite pour vous si… » (une phrase par ligne)
            <textarea name="pourQui" rows={4} defaultValue={o.pourQui.join("\n")} className={`${fieldCls} resize-y leading-normal`} />
          </label>
          <label className={labelCls}>
            « Ce que vous obtenez » (un élément par ligne)
            <textarea name="inclus" rows={6} defaultValue={o.inclus.join("\n")} className={`${fieldCls} resize-y leading-normal`} />
          </label>
          <label className={labelCls}>
            Réalisation donnée en exemple
            <select name="ex" defaultValue={o.ex} className={fieldCls}>
              <option value="">Aucune</option>
              {projects.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
        </section>
        <SubmitButton />
      </form>
    </>
  );
}
