import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { clientProjects } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { PROJECT_STATUS, formatDate, formatMad, remaining } from "@/lib/admin";
import { updateProject } from "../../actions";
import { Badge } from "../../ui";
import { ProjectForm } from "../ProjectForm";
import { DeleteProjectButton } from "./DeleteProjectButton";

export const metadata: Metadata = { title: "Projet" };

export default async function ProjetPage({ params, searchParams }: PageProps<"/admin/projets/[id]">) {
  await requireAdmin();
  const [{ id }, { ok }] = await Promise.all([params, searchParams]);
  const n = Number(id);
  if (!Number.isInteger(n)) notFound();
  const [p] = await getDb().select().from(clientProjects).where(eq(clientProjects.id, n));
  if (!p) notFound();
  const rest = remaining(p);

  return (
    <>
      <Link href="/admin/projets" className="font-mono text-xs text-muted hover:text-ivory">
        ← Projets clients
      </Link>
      <div className="mt-4 mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 text-[clamp(26px,4vw,36px)] font-semibold tracking-[-0.025em]">{p.titre}</h1>
          <p className="mt-2 mb-0 font-mono text-xs text-muted">
            {p.client} · créé le {formatDate(p.createdAt)} · modifié le {formatDate(p.updatedAt, true)}
          </p>
        </div>
        <Badge {...PROJECT_STATUS[p.status]} />
      </div>

      {ok && (
        <p role="status" className="mb-5 rounded-xl bg-teal/15 px-4 py-3 text-[15px] text-ivory">
          Projet enregistré.
        </p>
      )}

      <div className="mb-5 flex flex-wrap gap-3 font-mono text-xs">
        <span className="rounded-full border border-ivory/14 px-3 py-1.5">Devis : {formatMad(p.montant)}</span>
        {p.montant ? (
          <span className={`rounded-full px-3 py-1.5 ${rest > 0 ? "bg-saffron/15 text-saffron" : "bg-teal/15 text-teal"}`}>
            {rest > 0 ? `Reste à encaisser : ${formatMad(rest)}` : "Tout est encaissé"}
          </span>
        ) : null}
        {p.briefId && (
          <Link href={`/admin/messages/${p.briefId}`} className="rounded-full border border-ivory/14 px-3 py-1.5 hover:text-saffron">
            Voir le brief d&apos;origine →
          </Link>
        )}
        {p.lienSite && (
          <a href={p.lienSite} target="_blank" rel="noopener" className="rounded-full border border-ivory/14 px-3 py-1.5 hover:text-saffron">
            Voir le site ↗
          </a>
        )}
      </div>

      <ProjectForm key={p.updatedAt.toISOString()} action={updateProject} p={p} submitLabel="Enregistrer" />

      <div className="mt-8">
        <DeleteProjectButton id={p.id} />
      </div>
    </>
  );
}
