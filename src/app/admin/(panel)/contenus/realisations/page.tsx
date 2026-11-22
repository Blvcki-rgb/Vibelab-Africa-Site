import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { asc } from "drizzle-orm";
import { getDb } from "@/db";
import { showcaseProjects } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { BackLink, Badge, Empty, PageHead, PrimaryLink, Saved } from "../../ui";

export const metadata: Metadata = { title: "Réalisations" };

export default async function RealisationsAdminPage({ searchParams }: PageProps<"/admin/contenus/realisations">) {
  await requireAdmin();
  const [list, { ok }] = await Promise.all([
    getDb().select().from(showcaseProjects).orderBy(asc(showcaseProjects.position), asc(showcaseProjects.id)),
    searchParams,
  ]);
  return (
    <>
      <BackLink href="/admin/contenus">Contenus</BackLink>
      <div className="mt-4">
        <PageHead
          title="Réalisations"
          sub="Les projets affichés sur l'accueil, la page Réalisations et les études de cas."
          action={<PrimaryLink href="/admin/contenus/realisations/nouveau">+ Ajouter un projet</PrimaryLink>}
        />
      </div>
      <Saved show={!!ok} />
      {list.length === 0 ? (
        <Empty>Aucune réalisation. Ajoutez votre premier projet.</Empty>
      ) : (
        <div className="grid gap-3">
          {list.map((p) => (
            <Link
              key={p.id}
              href={`/admin/contenus/realisations/${p.id}`}
              className="vl-card grid grid-cols-[96px_1fr_auto] items-center gap-4 rounded-2xl p-3 pr-5 transition-colors hover:border-saffron"
            >
              <span className="relative block aspect-[2/1] overflow-hidden rounded-lg bg-night">
                {p.img && <Image src={p.img} alt="" fill sizes="96px" className="object-cover object-top" />}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-medium">{p.name}</span>
                <span className="block truncate font-mono text-xs text-muted">
                  #{p.position} · /realisations/{p.slug}
                </span>
              </span>
              <Badge {...(p.published ? { label: "En ligne", cls: "bg-teal/20 text-teal" } : { label: "Masqué", cls: "bg-ivory/5 text-muted" })} />
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
