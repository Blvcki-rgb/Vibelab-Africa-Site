import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createProject } from "../../actions";
import { PageHead } from "../../ui";
import { ProjectForm } from "../ProjectForm";

export const metadata: Metadata = { title: "Nouveau projet" };

export default async function NouveauProjetPage() {
  await requireAdmin();
  return (
    <>
      <Link href="/admin/projets" className="font-mono text-xs text-muted hover:text-ivory">
        ← Projets clients
      </Link>
      <div className="mt-4">
        <PageHead title="Nouveau projet" />
      </div>
      <ProjectForm action={createProject} submitLabel="Créer le projet" />
    </>
  );
}
