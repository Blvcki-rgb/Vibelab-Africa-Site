import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getBlocks } from "@/lib/content";
import { saveAbout } from "../actions";
import { ImageField } from "../widgets";
import { BackLink, PageHead, Saved, SubmitButton, fieldCls, labelCls, sectionCls } from "../../ui";

export const metadata: Metadata = { title: "À propos" };

export default async function AboutAdminPage({ searchParams }: PageProps<"/admin/contenus/a-propos">) {
  await requireAdmin();
  const [{ about }, { ok }] = await Promise.all([getBlocks(), searchParams]);
  return (
    <>
      <BackLink href="/admin/contenus">Contenus</BackLink>
      <div className="mt-4">
        <PageHead title="À propos" sub="Ce qui s'affiche dans « Qui suis-je ? » sur la page À propos." />
      </div>
      <Saved show={!!ok} />
      <form action={saveAbout} className={sectionCls}>
        <label className={labelCls}>
          Prénom et nom
          <input name="nom" required defaultValue={about.nom} className={fieldCls} />
        </label>
        <label className={labelCls}>
          Votre parcours
          <textarea name="parcours" rows={5} defaultValue={about.parcours} className={`${fieldCls} resize-y leading-normal`} />
        </label>
        <label className={labelCls}>
          Pourquoi VibeLab Africa, et pour qui
          <textarea name="pourquoi" rows={5} defaultValue={about.pourquoi} className={`${fieldCls} resize-y leading-normal`} />
        </label>
        <ImageField name="photo" current={about.photo} label="Photo (format portrait 4:5 conseillé)" ratio="aspect-[4/5] max-w-[280px]" />
        {about.photo && (
          <label className="flex items-center gap-2.5 text-sm text-muted">
            <input type="checkbox" name="removePhoto" className="size-4 accent-[#E89B2C]" />
            Retirer la photo actuelle
          </label>
        )}
        <SubmitButton />
      </form>
    </>
  );
}
