import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { OFFER_SLUGS, getBlocks } from "@/lib/content";
import { formatMad } from "@/lib/admin";
import { savePlans } from "../actions";
import { BackLink, PageHead, Saved, SubmitButton, fieldCls, gridCls, labelCls, sectionCls } from "../../ui";

export const metadata: Metadata = { title: "Prix et offres" };

export default async function OffresAdminPage({ searchParams }: PageProps<"/admin/contenus/offres">) {
  await requireAdmin();
  const [{ plans, offers }, { ok }] = await Promise.all([getBlocks(), searchParams]);
  return (
    <>
      <BackLink href="/admin/contenus">Contenus</BackLink>
      <div className="mt-4">
        <PageHead title="Prix et offres" sub="Tous les prix sont en MAD ; la conversion en FCFA se fait automatiquement." />
      </div>
      <Saved show={!!ok} />

      <form action={savePlans} className={`${sectionCls} mb-8`}>
        <div>
          <h2 className="m-0 text-lg font-semibold">Les 3 formules</h2>
          <p className="mt-1 mb-0 text-sm text-muted">
            Affichées sur l&apos;accueil et la page Tarifs. Le prix « Essentiel » sert aussi de « dès … » dans la comparaison avec les agences.
          </p>
        </div>
        <div className={gridCls}>
          <label className={labelCls}>
            Essentiel (dès, MAD)
            <input name="essentiel" inputMode="numeric" required defaultValue={plans.essentiel} className={fieldCls} />
          </label>
          <label className={labelCls}>
            Business (dès, MAD)
            <input name="business" inputMode="numeric" required defaultValue={plans.business} className={fieldCls} />
          </label>
          <label className={labelCls}>
            Sur mesure (dès, MAD)
            <input name="surMesure" inputMode="numeric" required defaultValue={plans.surMesure} className={fieldCls} />
          </label>
        </div>
        <SubmitButton>Enregistrer les formules</SubmitButton>
      </form>

      <h2 className="mt-0 mb-4 text-lg font-semibold">Les pages d&apos;offre</h2>
      <div className="vl-card overflow-hidden rounded-3xl">
        {OFFER_SLUGS.map((s) => (
          <Link
            key={s}
            href={`/admin/contenus/offres/${s}`}
            className="flex items-center justify-between gap-4 border-b border-ivory/8 px-5 py-4 last:border-0 hover:bg-ivory/4"
          >
            <span className="min-w-0">
              <span className="block font-medium">{offers[s].title}</span>
              <span className="block truncate font-mono text-xs text-muted">/services/{s}</span>
            </span>
            <span className="font-mono text-sm whitespace-nowrap text-saffron">
              {offers[s].price === null ? "sur devis" : `dès ${formatMad(offers[s].price)}`}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
