import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import { getDb } from "@/db";
import { testimonials, type Testimonial } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { deleteTestimonial, saveTestimonial } from "../actions";
import { ConfirmDelete } from "../widgets";
import {
  BackLink,
  PageHead,
  Saved,
  SubmitButton,
  fieldCls,
  labelCls,
  sectionCls,
} from "../../ui";

export const metadata: Metadata = { title: "Témoignages" };

function TestimonialForm({ t }: { t?: Testimonial }) {
  return (
    <div className={sectionCls}>
      <form action={saveTestimonial} className="flex flex-col gap-5">
        {t && <input type="hidden" name="id" value={t.id} />}
        <label className={labelCls}>
          Témoignage *
          <textarea
            name="quote"
            required
            rows={3}
            defaultValue={t?.quote}
            className={`${fieldCls} resize-y leading-normal`}
          />
        </label>
        <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr))]">
          <label className={labelCls}>
            Prénom (ou nom de l&apos;entreprise) *
            <input
              name="author"
              required
              defaultValue={t?.author}
              className={fieldCls}
            />
          </label>
          <label className={labelCls}>
            Ville
            <input name="city" defaultValue={t?.city} className={fieldCls} />
          </label>
          <label className={labelCls}>
            Ordre
            <input
              name="position"
              type="number"
              min={0}
              defaultValue={t?.position ?? 0}
              className={fieldCls}
            />
          </label>
        </div>
        <label className="flex items-center gap-2.5 text-[15px]">
          <input
            type="checkbox"
            name="published"
            defaultChecked={t?.published ?? true}
            className="size-5 accent-[#E89B2C]"
          />
          Afficher sur l&apos;accueil
        </label>
        <SubmitButton>
          {t ? "Enregistrer" : "Ajouter le témoignage"}
        </SubmitButton>
      </form>
      {/* Formulaire séparé : un <form> ne peut pas en contenir un autre */}
      {t && (
        <ConfirmDelete
          action={deleteTestimonial}
          id={t.id}
          message="Supprimer définitivement ce témoignage ?"
        />
      )}
    </div>
  );
}

export default async function TemoignagesPage({
  searchParams,
}: PageProps<"/admin/contenus/temoignages">) {
  await requireAdmin();
  const [list, { ok }] = await Promise.all([
    getDb()
      .select()
      .from(testimonials)
      .orderBy(asc(testimonials.position), asc(testimonials.id)),
    searchParams,
  ]);
  return (
    <>
      <BackLink href="/admin/contenus">Contenus</BackLink>
      <div className="mt-4">
        <PageHead
          title="Témoignages"
          sub="La section « Ils en parlent » de l'accueil n'apparaît que lorsqu'au moins un témoignage est affiché."
        />
      </div>
      <Saved show={!!ok} />
      <div className="flex flex-col gap-5">
        {list.map((t) => (
          <TestimonialForm
            key={`${t.id}-${t.quote.length}-${t.position}`}
            t={t}
          />
        ))}
        <h2 className="mt-4 mb-0 text-lg font-semibold">
          Ajouter un témoignage
        </h2>
        <TestimonialForm key={`new-${list.length}`} />
      </div>
    </>
  );
}
