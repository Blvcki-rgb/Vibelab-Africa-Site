import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getBlocks } from "@/lib/content";
import { saveFaq } from "../actions";
import { FaqEditor } from "../widgets";
import { BackLink, PageHead, Saved, SubmitButton, sectionCls } from "../../ui";

export const metadata: Metadata = { title: "Questions fréquentes" };

export default async function FaqAdminPage({ searchParams }: PageProps<"/admin/contenus/faq">) {
  await requireAdmin();
  const [b, { ok }] = await Promise.all([getBlocks(), searchParams]);
  const blocks = [
    { key: "faq_home", title: "FAQ de l'accueil", items: b.faq_home },
    { key: "faq_pricing", title: "FAQ de la page Tarifs", items: b.faq_pricing },
  ];
  return (
    <>
      <BackLink href="/admin/contenus">Contenus</BackLink>
      <div className="mt-4">
        <PageHead title="Questions fréquentes" sub="Les questions vides sont ignorées à l'enregistrement." />
      </div>
      <Saved show={!!ok} />
      <div className="flex flex-col gap-6">
        {blocks.map((blk) => (
          <form key={blk.key} action={saveFaq} className={sectionCls}>
            <input type="hidden" name="key" value={blk.key} />
            <h2 className="m-0 text-lg font-semibold">{blk.title}</h2>
            <FaqEditor initial={blk.items} />
            <SubmitButton>Enregistrer cette FAQ</SubmitButton>
          </form>
        ))}
      </div>
    </>
  );
}
