import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BrowserMockup } from "@/components/ProjectCard";
import { CtaBlock } from "@/components/CtaBlock";
import { getProjects } from "@/lib/content";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/realisations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getProjects()).find((x) => x.slug === slug);
  if (!p) return {};
  return { title: `${p.caseName || p.name} — Étude de cas`, description: p.intro || p.text };
}

const cardCls = "vl-card rounded-3xl px-7 py-[30px]";

export default async function CaseStudyPage({ params }: PageProps<"/realisations/[slug]">) {
  const { slug } = await params;
  const projects = await getProjects();
  const idx = projects.findIndex((p) => p.slug === slug);
  if (idx === -1) notFound();

  const p = projects[idx];
  const name = p.caseName || p.name;
  const next = projects.length > 1 ? projects[(idx + 1) % projects.length] : null;

  return (
    <>
      {/* En-tête */}
      <section className="vl-container vl-page-top">
        <nav aria-label="Fil d'Ariane" className="flex gap-2.5 font-mono text-[12.5px] text-muted">
          <Link href="/realisations" className="text-muted transition-colors hover:text-ivory">
            Réalisations
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-teal" aria-current="page">
            {name}
          </span>
        </nav>
        {p.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <span key={t} className="rounded-full border border-teal/40 px-3 py-1.5 font-mono text-[11.5px] text-teal">
                {t}
              </span>
            ))}
          </div>
        )}
        <h1 className="vl-h1 mt-[18px] mb-0 max-w-[940px]">{name}</h1>
        <p className="vl-intro mt-5 mb-0 max-w-[640px]">{p.intro || p.text}</p>
        <div className="mt-[30px] flex flex-wrap gap-3">
          {p.href && (
            <a href={p.href} target="_blank" rel="noopener" className="vl-btn vl-btn-primary min-h-[54px] px-[26px] text-base">
              Voir le site ↗
            </a>
          )}
          <Link href="/demarrer" className="vl-btn vl-btn-ghost min-h-[54px] px-[26px] text-base">
            Un projet similaire ?
          </Link>
        </div>
      </section>

      {/* Grande capture */}
      {p.img && (
        <section className="vl-container pt-14">
          <BrowserMockup url={p.url} img={p.img} alt={p.alt} width={p.imgWidth} height={p.imgHeight} eager large />
        </section>
      )}

      {/* Contexte / livré / résultats */}
      <section
        className="vl-container grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-start gap-4"
        style={{ paddingTop: "clamp(72px,9vw,112px)" }}
      >
        <div className={cardCls}>
          <h2 className="vl-eyebrow m-0 font-normal">Le contexte</h2>
          <p className="mt-4 mb-0 text-[17px] leading-relaxed whitespace-pre-line text-ivory">
            {p.contexte || "[À REMPLACER : la situation du client avant le projet et ce qu'il voulait obtenir.]"}
          </p>
        </div>
        <div className={cardCls}>
          <h2 className="vl-eyebrow m-0 font-normal">Ce qui a été livré</h2>
          <ul className="mt-4 mb-0 flex list-none flex-col gap-3 p-0">
            {p.features.map((f) => (
              <li key={f} className="flex gap-3 text-base leading-normal">
                <span aria-hidden="true" className="font-mono text-saffron">
                  ✓
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className={cardCls}>
          <h2 className="vl-eyebrow m-0 font-normal">Résultats</h2>
          <p className="mt-4 mb-0 text-[17px] leading-relaxed whitespace-pre-line text-ivory">
            {p.resultats || "[Résultat à collecter auprès du client]"}
          </p>
          <p className="mt-3 mb-0 font-mono text-[13px] text-muted">Délai de réalisation : {p.delai || "[À REMPLACER]"}</p>
        </div>
      </section>

      {/* Témoignage (affiché seulement s'il est renseigné) */}
      {p.temoignage && (
        <section className="mx-auto max-w-[880px]" style={{ padding: "clamp(72px,9vw,112px) clamp(20px,4vw,40px) 0" }}>
          <figure className="m-0 flex flex-col gap-[22px]">
            <span aria-hidden="true" className="h-7 text-[64px] leading-[0.5] text-saffron">
              “
            </span>
            <blockquote className="m-0 leading-[1.35] font-medium tracking-[-0.015em]" style={{ fontSize: "clamp(22px,2.8vw,32px)" }}>
              {p.temoignage}
            </blockquote>
            {p.temoignageAuteur && <figcaption className="font-mono text-[13px] text-muted">{p.temoignageAuteur}</figcaption>}
          </figure>
        </section>
      )}

      {/* Projet suivant */}
      {next && (
        <section className="vl-container" style={{ paddingTop: "clamp(72px,9vw,112px)" }}>
          <Link
            href={`/realisations/${next.slug}`}
            className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-ivory/10 p-7 text-ivory transition-colors duration-250 hover:border-saffron hover:text-ivory"
          >
            <span className="flex flex-col gap-2">
              <span className="font-mono text-xs tracking-[0.2em] text-muted">PROJET SUIVANT</span>
              <span className="font-semibold tracking-[-0.02em]" style={{ fontSize: "clamp(24px,3vw,34px)" }}>
                {next.caseName || next.name}
              </span>
            </span>
            <span aria-hidden="true" className="flex size-14 items-center justify-center rounded-full bg-saffron text-[22px] text-night">
              →
            </span>
          </Link>
        </section>
      )}

      <CtaBlock title="Votre projet mérite d'exister en ligne." />
    </>
  );
}
