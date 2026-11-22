import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBlock } from "@/components/CtaBlock";
import { OfferPrice } from "@/components/ServiceCard";
import { OFFER_STEPS } from "@/lib/data";
import { OFFER_SLUGS, getBlocks, getProjects, type OfferSlug } from "@/lib/content";

const isSlug = (s: string): s is OfferSlug => (OFFER_SLUGS as readonly string[]).includes(s);

export function generateStaticParams() {
  return OFFER_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!isSlug(slug)) return {};
  const o = (await getBlocks()).offers[slug];
  return { title: o.title, description: o.intro };
}

export default async function OfferPage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  if (!isSlug(slug)) notFound();
  const [{ offers }, projects] = await Promise.all([getBlocks(), getProjects()]);
  const o = offers[slug];

  const ex = o.ex ? projects.find((p) => p.slug === o.ex) : null;
  const others = OFFER_SLUGS.filter((x) => x !== slug);
  const demarrer = `/demarrer?o=${slug}`;

  return (
    <>
      {/* En-tête */}
      <section className="vl-container vl-page-top">
        <nav aria-label="Fil d'Ariane" className="flex gap-2.5 font-mono text-[12.5px] text-muted">
          <Link href="/services" className="text-muted transition-colors hover:text-ivory">
            Services
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-teal" aria-current="page">
            {o.title}
          </span>
        </nav>
        <h1 className="vl-h1 mt-[22px] mb-0 max-w-[940px]">{o.h1}</h1>
        <p className="vl-intro mt-[22px] mb-0 max-w-[620px]">{o.intro}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href={demarrer} className="vl-btn vl-btn-primary min-h-[54px] px-[26px] text-base">
            Démarrer un projet <span aria-hidden="true">→</span>
          </Link>
          <span className="inline-flex min-h-[54px] items-center rounded-full border border-saffron/40 px-[22px] font-mono text-sm text-saffron">
            <OfferPrice price={o.price} />
          </span>
        </div>
      </section>

      {/* Pour qui */}
      <section className="vl-container" style={{ paddingTop: "clamp(72px,9vw,112px)" }}>
        <span className="vl-eyebrow">Pour qui ?</span>
        <h2 className="vl-h2-sub mt-3.5 mb-9">Cette offre est faite pour vous si…</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4">
          {o.pourQui.map((p) => (
            <div key={p} className="vl-card flex items-start gap-4 rounded-3xl px-6 py-7">
              <span aria-hidden="true" className="mt-[9px] size-[9px] flex-none rotate-45 bg-saffron" />
              <p className="m-0 text-[17px] leading-[1.55] text-ivory">{p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Inclus */}
      <section className="vl-container" style={{ paddingTop: "clamp(72px,9vw,112px)" }}>
        <div
          className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-start"
          style={{ gap: "clamp(32px,5vw,64px)" }}
        >
          <div>
            <span className="vl-eyebrow">Ce qui est inclus</span>
            <h2 className="vl-h2-sub mt-3.5 mb-[18px]">Ce que vous obtenez</h2>
            <p className="m-0 max-w-[440px] text-base leading-relaxed text-muted">
              Acompte de 50 % à la commande, solde à la mise en ligne. Maintenance en option.
            </p>
          </div>
          <ul className="m-0 flex list-none flex-col border-t border-ivory/10 p-0">
            {o.inclus.map((i) => (
              <li key={i} className="flex items-center gap-3.5 border-b border-ivory/10 py-[18px] text-[17px] leading-normal">
                <span
                  aria-hidden="true"
                  className="flex size-6 flex-none items-center justify-center rounded-lg bg-saffron font-mono text-xs font-semibold text-night"
                >
                  ✓
                </span>
                {i}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Étapes */}
      <section className="vl-container" style={{ paddingTop: "clamp(72px,9vw,112px)" }}>
        <span className="vl-eyebrow">Comment ça se passe</span>
        <h2 className="vl-h2-sub mt-3.5 mb-9">4 étapes, de l&apos;idée à la mise en ligne</h2>
        <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4 p-0">
          {OFFER_STEPS.map((m) => (
            <li key={m.n} className="rounded-3xl border border-ivory/8 px-6 py-[26px]">
              <span className="font-mono text-[13px] text-saffron">{m.n}</span>
              <h3 className="mt-3 mb-1.5 text-xl font-semibold">{m.t}</h3>
              <p className="m-0 text-[15px] leading-relaxed text-muted">{m.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Exemple */}
      {ex && ex.img && (
        <section className="vl-container" style={{ paddingTop: "clamp(72px,9vw,112px)" }}>
          <span className="vl-eyebrow">Un exemple</span>
          <Link
            href={`/realisations/${ex.slug}`}
            className="vl-card mt-5 grid items-center rounded-[28px] text-ivory transition-colors duration-250 grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] hover:border-saffron hover:text-ivory"
            style={{ gap: "clamp(20px,4vw,44px)", padding: "clamp(16px,2.4vw,24px)" }}
          >
            <Image
              src={ex.img}
              alt={ex.alt}
              width={ex.imgWidth}
              height={ex.imgHeight}
              sizes="(max-width: 900px) 100vw, 560px"
              className="block h-auto w-full rounded-2xl border border-ivory/10"
            />
            <div className="flex flex-col gap-3">
              <h3 className="m-0 font-semibold tracking-[-0.02em]" style={{ fontSize: "clamp(24px,3vw,32px)" }}>
                {ex.name}
              </h3>
              <p className="m-0 text-base leading-relaxed text-muted">{ex.text}</p>
              <span className="text-[15px] text-saffron">Voir l&apos;étude de cas →</span>
            </div>
          </Link>
        </section>
      )}

      {/* Autres services */}
      <section className="vl-container" style={{ paddingTop: "clamp(72px,9vw,112px)" }}>
        <span className="vl-eyebrow">Les autres services</span>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {others.map((x) => (
            <Link
              key={x}
              href={`/services/${x}`}
              className="inline-flex min-h-12 items-center gap-2.5 rounded-full border border-ivory/16 px-5 text-[15px] transition-colors hover:border-saffron hover:text-saffron"
            >
              {offers[x].title}
              <span className="font-mono text-xs text-muted">
                <OfferPrice price={offers[x].price} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <CtaBlock title="Votre projet mérite d'exister en ligne." demarrerHref={demarrer} />
    </>
  );
}
