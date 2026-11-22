import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { createShowcase } from "../../actions";
import { ShowcaseForm } from "../ShowcaseForm";
import { BackLink, PageHead } from "../../../ui";

export const metadata: Metadata = { title: "Nouvelle réalisation" };

export default async function NouvelleRealisationPage() {
  await requireAdmin();
  return (
    <>
      <BackLink href="/admin/contenus/realisations">Réalisations</BackLink>
      <div className="mt-4">
        <PageHead title="Nouvelle réalisation" />
      </div>
      <ShowcaseForm action={createShowcase} submitLabel="Ajouter le projet" />
    </>
  );
}
