import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { briefs, clientProjects } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { BRIEF_STATUS, formatDate } from "@/lib/admin";
import { createProjectFromBrief, setBriefStatus } from "../../actions";
import { Badge } from "../../ui";

export const metadata: Metadata = { title: "Message" };

export default async function MessagePage({ params }: PageProps<"/admin/messages/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const n = Number(id);
  if (!Number.isInteger(n)) notFound();
  const db = getDb();
  let [b] = await db.select().from(briefs).where(eq(briefs.id, n));
  if (!b) notFound();

  // Ouvrir un message le marque comme lu
  if (b.status === "nouveau") {
    [b] = await db.update(briefs).set({ status: "lu" }).where(eq(briefs.id, n)).returning();
  }
  const [linked] = await db.select({ id: clientProjects.id }).from(clientProjects).where(eq(clientProjects.briefId, n));

  const phone = b.tel.replace(/[^\d]/g, "");
  const rows: [string, string][] = [
    ["Type de projet", b.type],
    ["Objectif", b.objectif],
    ["Clients visés", b.cible],
    ["Pages", b.pages.join(", ")],
    ["Fonctionnalités", b.fonct.join(", ")],
    ["Style", b.style.join(", ")],
    ["Références", b.refs],
    ["Budget", b.budget],
    ["Délai", b.delai],
  ];

  return (
    <>
      <Link href="/admin/messages" className="font-mono text-xs text-muted hover:text-ivory">
        ← Messages
      </Link>
      <div className="mt-4 mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 text-[clamp(26px,4vw,36px)] font-semibold tracking-[-0.025em]">{b.nom}</h1>
          <p className="mt-2 mb-0 font-mono text-xs text-muted">
            Reçu le {formatDate(b.createdAt, true)}
            {b.activite && ` · ${b.activite}`}
          </p>
        </div>
        <Badge {...BRIEF_STATUS[b.status]} />
      </div>

      <div className="grid items-start gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))] lg:grid-cols-[2fr_1fr]">
        <dl className="vl-card m-0 rounded-3xl px-6 py-2">
          {rows.map(([k, v]) => (
            <div key={k} className="grid gap-1 border-b border-ivory/8 py-4 last:border-0 sm:grid-cols-[160px_1fr] sm:gap-4">
              <dt className="font-mono text-xs tracking-[0.08em] text-teal uppercase">{k}</dt>
              <dd className="m-0 text-[15px] whitespace-pre-wrap">{v || <span className="text-muted">—</span>}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-col gap-4">
          <div className="vl-card flex flex-col gap-3 rounded-3xl p-6">
            <h2 className="m-0 text-lg font-semibold">Contacter</h2>
            {phone && (
              <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener" className="vl-btn min-h-11 bg-teal text-sm text-night">
                WhatsApp · {b.tel}
              </a>
            )}
            {b.email && (
              <a href={`mailto:${b.email}`} className="vl-btn vl-btn-ghost min-h-11 text-sm">
                {b.email}
              </a>
            )}
          </div>
          <div className="vl-card flex flex-col gap-3 rounded-3xl p-6">
            <h2 className="m-0 text-lg font-semibold">Suivi</h2>
            {linked ? (
              <Link href={`/admin/projets/${linked.id}`} className="vl-btn vl-btn-primary min-h-11 text-sm">
                Voir le projet lié →
              </Link>
            ) : (
              <form action={createProjectFromBrief}>
                <input type="hidden" name="id" value={b.id} />
                <button type="submit" className="vl-btn vl-btn-primary min-h-11 w-full cursor-pointer border-0 text-sm">
                  Créer un projet client
                </button>
              </form>
            )}
            <form action={setBriefStatus}>
              <input type="hidden" name="id" value={b.id} />
              <input type="hidden" name="status" value={b.status === "archive" ? "lu" : "archive"} />
              <button type="submit" className="vl-btn vl-btn-ghost min-h-11 w-full cursor-pointer bg-transparent text-sm">
                {b.status === "archive" ? "Désarchiver" : "Archiver"}
              </button>
            </form>
            {b.status !== "archive" && (
              <form action={setBriefStatus}>
                <input type="hidden" name="id" value={b.id} />
                <input type="hidden" name="status" value="nouveau" />
                <button type="submit" className="w-full cursor-pointer border-0 bg-transparent py-1 text-sm text-muted hover:text-ivory">
                  Marquer comme non lu
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
