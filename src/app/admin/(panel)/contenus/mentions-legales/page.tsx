import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getBlocks } from "@/lib/content";
import { saveLegal } from "../actions";
import { BackLink, PageHead, Saved, SubmitButton, fieldCls, gridCls, labelCls, sectionCls } from "../../ui";

export const metadata: Metadata = { title: "Mentions légales" };

export default async function LegalAdminPage({ searchParams }: PageProps<"/admin/contenus/mentions-legales">) {
  await requireAdmin();
  const [{ legal }, { ok }] = await Promise.all([getBlocks(), searchParams]);
  const area = `${fieldCls} resize-y leading-normal`;
  return (
    <>
      <BackLink href="/admin/contenus">Contenus</BackLink>
      <div className="mt-4">
        <PageHead
          title="Mentions légales"
          sub="L'e-mail et le WhatsApp affichés viennent de « Coordonnées et textes clés »."
          action={
            <a href="/mentions-legales" target="_blank" className="font-mono text-xs text-muted hover:text-ivory">
              Voir la page ↗
            </a>
          }
        />
      </div>
      <Saved show={!!ok} />
      <form action={saveLegal} className="flex flex-col gap-6">
        <section className={sectionCls}>
          <h2 className="m-0 text-lg font-semibold">Éditeur du site</h2>
          <div className={gridCls}>
            <label className={labelCls}>
              Forme juridique
              <input name="formeJuridique" defaultValue={legal.formeJuridique} placeholder="SARL, auto-entrepreneur…" className={fieldCls} />
            </label>
            <label className={labelCls}>
              RC (registre de commerce)
              <input name="rc" defaultValue={legal.rc} className={fieldCls} />
            </label>
            <label className={labelCls}>
              ICE
              <input name="ice" defaultValue={legal.ice} className={fieldCls} />
            </label>
            <label className={labelCls}>
              Directeur de la publication
              <input name="directeur" defaultValue={legal.directeur} className={fieldCls} />
            </label>
          </div>
          <label className={labelCls}>
            Siège social
            <input name="siege" defaultValue={legal.siege} className={fieldCls} />
          </label>
        </section>

        <section className={sectionCls}>
          <h2 className="m-0 text-lg font-semibold">Hébergement, données et cookies</h2>
          <label className={labelCls}>
            Hébergement
            <textarea name="hebergeur" rows={3} defaultValue={legal.hebergeur} className={area} />
          </label>
          <label className={labelCls}>
            Durée de conservation des données du formulaire
            <input name="conservation" defaultValue={legal.conservation} className={fieldCls} />
          </label>
          <label className={labelCls}>
            Cookies
            <textarea name="cookies" rows={3} defaultValue={legal.cookies} className={area} />
          </label>
          <label className={labelCls}>
            Date de dernière mise à jour
            <input name="miseAJour" defaultValue={legal.miseAJour} className={fieldCls} />
          </label>
        </section>
        <SubmitButton />
      </form>
    </>
  );
}
