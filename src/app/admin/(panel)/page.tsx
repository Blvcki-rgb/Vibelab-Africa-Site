import Link from "next/link";
import { desc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/db";
import { briefs, clientProjects } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { ACTIVE_STATUSES, BRIEF_STATUS, PROJECT_STATUS, formatDate, formatMad, remaining } from "@/lib/admin";
import { Badge, PageHead } from "./ui";

export default async function DashboardPage() {
  const s = await requireAdmin();
  const db = getDb();
  const [newBriefs, active, latest] = await Promise.all([
    db.select().from(briefs).where(eq(briefs.status, "nouveau")).orderBy(desc(briefs.createdAt)),
    db.select().from(clientProjects).where(inArray(clientProjects.status, ACTIVE_STATUSES)).orderBy(desc(clientProjects.updatedAt)),
    db.select().from(briefs).orderBy(desc(briefs.createdAt)).limit(5),
  ]);
  const toCollect = active.reduce((sum, p) => sum + remaining(p), 0);

  const stats = [
    { label: "Nouveaux messages", value: String(newBriefs.length), href: "/admin/messages", accent: newBriefs.length > 0 },
    { label: "Projets en cours", value: String(active.length), href: "/admin/projets" },
    { label: "Reste à encaisser", value: formatMad(toCollect), href: "/admin/projets" },
  ];

  return (
    <>
      <PageHead title={`Bonjour ${s.user.name.split(" ")[0]}`} sub="Voici où en est votre activité." />

      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))]">
        {stats.map((st) => (
          <Link
            key={st.label}
            href={st.href}
            className={`vl-card rounded-3xl px-6 py-6 transition-colors hover:border-saffron ${st.accent ? "border-saffron/60" : ""}`}
          >
            <span className="font-mono text-xs tracking-[0.12em] text-muted uppercase">{st.label}</span>
            <span className={`mt-3 block text-[32px] font-semibold tracking-[-0.02em] ${st.accent ? "text-saffron" : ""}`}>{st.value}</span>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid items-start gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr))]">
        <section>
          <h2 className="mt-0 mb-4 text-xl font-semibold">Derniers messages</h2>
          <div className="vl-card overflow-hidden rounded-3xl">
            {latest.length === 0 ? (
              <p className="m-0 px-5 py-8 text-center text-sm text-muted">Aucun message pour l&apos;instant.</p>
            ) : (
              latest.map((b) => (
                <Link key={b.id} href={`/admin/messages/${b.id}`} className="flex items-center justify-between gap-3 border-b border-ivory/8 px-5 py-4 last:border-0 hover:bg-ivory/4">
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{b.nom}</span>
                    <span className="block truncate font-mono text-xs text-muted">{b.type} · {formatDate(b.createdAt)}</span>
                  </span>
                  <Badge {...BRIEF_STATUS[b.status]} />
                </Link>
              ))
            )}
          </div>
        </section>
        <section>
          <h2 className="mt-0 mb-4 text-xl font-semibold">Projets en cours</h2>
          <div className="vl-card overflow-hidden rounded-3xl">
            {active.length === 0 ? (
              <p className="m-0 px-5 py-8 text-center text-sm text-muted">Aucun projet en cours.</p>
            ) : (
              active.slice(0, 6).map((p) => (
                <Link key={p.id} href={`/admin/projets/${p.id}`} className="flex items-center justify-between gap-3 border-b border-ivory/8 px-5 py-4 last:border-0 hover:bg-ivory/4">
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{p.titre}</span>
                    <span className="block truncate font-mono text-xs text-muted">
                      {p.client}
                      {p.echeance ? ` · échéance ${formatDate(p.echeance)}` : ""}
                    </span>
                  </span>
                  <Badge {...PROJECT_STATUS[p.status]} />
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </>
  );
}
