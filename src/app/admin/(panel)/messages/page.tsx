import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq, ne } from "drizzle-orm";
import { getDb } from "@/db";
import { briefs } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { BRIEF_STATUS, formatDate } from "@/lib/admin";
import { Badge, Empty, PageHead } from "../ui";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage({ searchParams }: PageProps<"/admin/messages">) {
  await requireAdmin();
  const { vue } = await searchParams;
  const archived = vue === "archives";
  const list = await getDb()
    .select()
    .from(briefs)
    .where(archived ? eq(briefs.status, "archive") : ne(briefs.status, "archive"))
    .orderBy(desc(briefs.createdAt));

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
      <PageHead title="Messages" sub="Les briefs envoyés depuis la page « Démarrer un projet »." />
      <div className="mb-5 flex gap-2">
        {tab("/admin/messages", "Boîte de réception", !archived)}
        {tab("/admin/messages?vue=archives", "Archives", archived)}
      </div>
      {list.length === 0 ? (
        <Empty>{archived ? "Aucun message archivé." : "Aucun message pour l'instant. Les briefs du site arriveront ici."}</Empty>
      ) : (
        <div className="vl-card overflow-hidden rounded-3xl">
          {list.map((b) => (
            <Link
              key={b.id}
              href={`/admin/messages/${b.id}`}
              className={`grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 border-b border-ivory/8 px-5 py-4 last:border-0 hover:bg-ivory/4 ${
                b.status === "nouveau" ? "bg-saffron/5" : ""
              }`}
            >
              <span className={`truncate ${b.status === "nouveau" ? "font-semibold" : ""}`}>
                {b.nom}
                {b.activite && <span className="font-normal text-muted"> · {b.activite}</span>}
              </span>
              <Badge {...BRIEF_STATUS[b.status]} />
              <span className="truncate font-mono text-xs text-muted">
                {b.type}
                {b.budget && ` · ${b.budget}`}
              </span>
              <span className="text-right font-mono text-xs text-muted">{formatDate(b.createdAt, true)}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
