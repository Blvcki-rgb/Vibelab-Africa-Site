import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getBlocks } from "@/lib/content";
import { saveGeneral } from "../actions";
import { BackLink, PageHead, Saved, SubmitButton, fieldCls, gridCls, labelCls, sectionCls } from "../../ui";

export const metadata: Metadata = { title: "Coordonnées et textes" };

export default async function GeneralPage({ searchParams }: PageProps<"/admin/contenus/general">) {
  await requireAdmin();
  const [{ contact, texts }, { ok }] = await Promise.all([getBlocks(), searchParams]);
  return (
    <>
      <BackLink href="/admin/contenus">Contenus</BackLink>
      <div className="mt-4">
        <PageHead title="Coordonnées et textes clés" />
      </div>
      <Saved show={!!ok} />
      <form action={saveGeneral} className="flex flex-col gap-6">
        <section className={sectionCls}>
          <h2 className="m-0 text-lg font-semibold">Coordonnées</h2>
          <div className={gridCls}>
            <label className={labelCls}>
              Numéro WhatsApp (format international)
              <input name="whatsappNumber" inputMode="tel" defaultValue={contact.whatsappNumber} placeholder="212600000000" className={fieldCls} />
              <span className="font-mono text-xs">Indicatif pays + numéro, sans « + » ni espaces.</span>
            </label>
            <label className={labelCls}>
              E-mail de contact
              <input name="email" type="email" defaultValue={contact.email} placeholder="contact@vibelab.africa" className={fieldCls} />
            </label>
            <label className={labelCls}>
              Instagram
              <input name="instagram" defaultValue={contact.instagram} placeholder="@vibelab.africa" className={fieldCls} />
            </label>
          </div>
          <label className={labelCls}>
            Message WhatsApp pré-rempli
            <input name="whatsappMessage" defaultValue={contact.whatsappMessage} className={fieldCls} />
          </label>
        </section>

        <section className={sectionCls}>
          <h2 className="m-0 text-lg font-semibold">Textes clés</h2>
          <div className={gridCls}>
            <label className={labelCls}>
              Délai de réponse aux demandes
              <input name="delaiReponse" defaultValue={texts.delaiReponse} placeholder="24 heures" className={fieldCls} />
              <span className="font-mono text-xs">Affiché sur la page Démarrer : « Je vous recontacte sous … »</span>
            </label>
            <label className={labelCls}>
              Prix de la maintenance
              <input name="prixMaintenance" defaultValue={texts.prixMaintenance} placeholder="500 MAD / mois" className={fieldCls} />
              <span className="font-mono text-xs">Page Tarifs, carte « Maintenance en option ».</span>
            </label>
          </div>
          <label className={labelCls}>
            Source de la comparaison des prix (agences / freelances)
            <input name="sourceComparaison" defaultValue={texts.sourceComparaison} className={fieldCls} />
          </label>
        </section>

        <SubmitButton />
      </form>
    </>
  );
}
