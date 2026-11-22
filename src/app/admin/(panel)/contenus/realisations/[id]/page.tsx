import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { showcaseProjects } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { deleteShowcase, updateShowcase } from "../../actions";
import { ConfirmDelete } from "../../widgets";
import { ShowcaseForm } from "../ShowcaseForm";
import { BackLink, PageHead, Saved } from "../../../ui";

export const metadata: Metadata = { title: "Réalisation" };

export default async function RealisationAdminPage({ params, searchParams }: PageProps<"/admin/contenus/realisations/[id]">) {
  await requireAdmin();
  const [{ id }, { ok }] = await Promise.all([params, searchParams]);
  const n = Number(id);
  if (!Number.isInteger(n)) notFound();
  const [p] = await getDb().select().from(showcaseProjects).where(eq(showcaseProjects.id, n));
  if (!p) notFound();

  return (
    <>
      <BackLink href="/admin/contenus/realisations">Réalisations</BackLink>
      <div className="mt-4">
        <PageHead
          title={p.name}
          action={
            p.published ? (
              <a href={`/realisations/${p.slug}`} target="_blank" className="font-mono text-xs text-muted hover:text-ivory">
                Voir l&apos;étude de cas ↗
              </a>
            ) : undefined
          }
        />
      </div>
      <Saved show={!!ok} />
      <ShowcaseForm key={p.updatedAt.toISOString()} action={updateShowcase} p={p} submitLabel="Enregistrer" />
      <div className="mt-8">
        <ConfirmDelete
          action={deleteShowcase}
          id={p.id}
          label="Supprimer ce projet"
          message="Supprimer définitivement cette réalisation et sa capture ? Pour la cacher sans la perdre, décochez plutôt « Afficher ce projet sur le site »."
        />
      </div>
    </>
  );
}
