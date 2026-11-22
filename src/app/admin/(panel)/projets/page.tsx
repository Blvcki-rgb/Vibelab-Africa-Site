import type { Metadata } from "next";
import Link from "next/link";
import { desc, inArray, notInArray } from "drizzle-orm";
import { getDb } from "@/db";
import { clientProjects } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { ACTIVE_STATUSES, PROJECT_STATUS, formatDate, formatMad, remaining } from "@/lib/admin";
import { Badge, Empty, PageHead, PrimaryLink } from "../ui";

export const metadata: Metadata = { title: "Projets clients" };

export default async function ProjetsPage({ searchParams }: PageProps<"/admin/projets">) {
  await requireAdmin();
  const { vue } = await searchParams;
  const done = vue === "termines";
  const list = await getDb()
    .select()
    .from(clientProjects)
    .where(done ? notInArray(clientProjects.status, ACTIVE_STATUSES) : inArray(clientProjects.status, ACTIVE_STATUSES))
    .orderBy(desc(clientProjects.updatedAt));

  const tab = (href: string, label: string, on: boolean) => (
    <Link
      href={href}
      aria-current={on ? "page" : undefined}
      className={`rounded-full px-4 py-2 text-sm ${on ? "bg-ivory text-night" : "border border-ivory/14 text-muted hover:text-ivory"}`}
    >
      {label}
    </Link>
  );

  return (
    <>
      <PageHead
        title="Projets clients"
        sub="Suivez chaque projet, du devis à la mise en ligne."
        action={<PrimaryLink href="/admin/projets/nouveau">+ Nouveau projet</PrimaryLink>}
      />
      <div className="mb-5 flex gap-2">
        {tab("/admin/projets", "En cours", !done)}
        {tab("/admin/projets?vue=termines", "Livrés et annulés", done)}
      </div>
      {list.length === 0 ? (
        <Empty>
          {done ? "Aucun projet terminé." : "Aucun projet en cours. Créez-en un, ou transformez un message en projet."}
        </Empty>
      ) : (
        <div className="grid gap-3">
          {list.map((p) => {
            const rest = remaining(p);
            return (
              <Link
                key={p.id}
                href={`/admin/projets/${p.id}`}
                className="vl-card grid items-center gap-x-5 gap-y-2 rounded-2xl px-5 py-4 transition-colors hover:border-saffron sm:grid-cols-[1fr_auto_auto]"
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">{p.titre}</span>
                  <span className="block truncate font-mono text-xs text-muted">
                    {p.client}
                    {p.echeance ? ` · échéance ${formatDate(p.echeance)}` : ""}
                  </span>
                </span>
                <span className="font-mono text-xs text-muted">
                  {formatMad(p.montant)}
                  {rest > 0 && <span className="block text-saffron">reste {formatMad(rest)}</span>}
                </span>
                <Badge {...PROJECT_STATUS[p.status]} />
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
