import Link from "next/link";
import { HeroTerminal } from "@/components/home/HeroTerminal";
import { HeroAmbient } from "@/components/home/HeroAmbient";
import { MethodSteps } from "@/components/home/MethodSteps";
import { ServiceCard } from "@/components/ServiceCard";
import { ProjectCard } from "@/components/ProjectCard";
import { PriceCompare } from "@/components/PriceCompare";
import { PricingPlans } from "@/components/PricingPlans";
import { ConversionNote } from "@/components/Price";
import { Faq } from "@/components/Faq";
import { CtaBlock } from "@/components/CtaBlock";
import { OFFER_SLUGS, getBlocks, getProjects, getTestimonials } from "@/lib/content";

const TRUST = ["L'Or des Sens", "Luxe parfums", "MGB Store", "Média sportif", "Be Helpful Academy"];

const WHY = [
  {
    tag: "/rapide",
    title: "Rapide",
    text: "L'IA m'aide à avancer plus vite, et je garde la main sur chaque étape. Votre site avance sans semaines d'attente entre deux échanges.",
  },
  {
    tag: "/premium",
    title: "Premium",
    text: "Un design soigné, pensé pour le téléphone, qui donne confiance à vos clients dès la première seconde.",
  },
  {
    tag: "/accessible",
    title: "Accessible",
    text: "Des prix clairs, annoncés à l'avance, et un paiement en deux fois : la moitié à la commande, le reste à la mise en ligne.",
  },
];

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-11">
      <span className="vl-eyebrow">{eyebrow}</span>
      <h2 className="vl-h2 mt-3.5 mb-0">{title}</h2>
    </div>
  );
}

export default async function HomePage() {
  const [blocks, projects, testimonials] = await Promise.all([getBlocks(), getProjects(), getTestimonials()]);
  return (
    <>
      {/* ───── HERO ───── */}
      <section
        id="top"
        className="relative overflow-hidden"
        style={{ padding: "clamp(120px,14vw,168px) 0 clamp(72px,9vw,120px)" }}
      >
        <HeroAmbient />
        <div
          className="vl-container relative grid items-center grid-cols-[repeat(auto-fit,minmax(min(100%,480px),1fr))]"
          style={{ gap: "clamp(48px,6vw,72px)" }}
        >
          <div className="flex flex-col items-start gap-7">
            <span className="inline-flex w-max max-w-full items-center gap-2.5 rounded-full border border-ivory/12 bg-card/70 px-3.5 py-2 font-mono text-xs text-muted">
              <span className="vl-pulse size-2 flex-none rounded-full bg-teal" />
              Studio de vibe coding · Casablanca — Dakar
            </span>
            <h1 className="m-0 flex flex-col gap-[18px]">
              <span className="vl-h1-hero">Votre business en ligne,</span>
              <span
                className="inline-flex w-max max-w-full flex-wrap items-center self-start rounded-2xl border border-ivory/12 bg-card font-mono font-medium tracking-[-0.01em] text-saffron"
                style={{ fontSize: "clamp(22px,3vw,36px)", gap: "0.4em", padding: "0.28em 0.6em" }}
              >
                <span className="text-teal">&gt;</span>
                <span className="whitespace-nowrap">propulsé par l&apos;IA.</span>
                <span aria-hidden="true" className="vl-blink inline-block h-[1em] w-[0.55em] bg-saffron" />
              </span>
            </h1>
            <p className="vl-intro m-0 max-w-[540px]">
              Sites vitrines, boutiques en ligne, dashboards et automatisations IA. Je conçois, je code et je
              mets en ligne votre projet, de A à Z. L&apos;IA m&apos;aide à aller plus vite, mais chaque ligne
              de code passe par moi.
            </p>
            <div className="flex w-full flex-wrap gap-3">
              <Link href="/demarrer" className="vl-btn vl-btn-primary min-h-[54px] px-[26px] text-base">
                Démarrer un projet <span aria-hidden="true">→</span>
              </Link>
              <Link href="/realisations" className="vl-btn vl-btn-ghost min-h-[54px] px-[26px] text-base">
                Voir les réalisations
              </Link>
            </div>
            <p className="m-0 font-mono text-[12.5px] leading-[1.7] text-muted">
              <span className="text-teal">Déjà en ligne :</span>{" "}
              {projects.map((p) => p.caseName || p.name).join(" · ")}
            </p>
          </div>
          <HeroTerminal />
        </div>
      </section>

      {/* ───── BANDEAU DE CONFIANCE ───── */}
      <div
        aria-label="Ils nous font confiance"
        className="overflow-hidden border-y border-ivory/8 bg-card/60 py-[22px]"
      >
        <div className="vl-marquee flex w-max">
          {[...TRUST, ...TRUST].map((t, i) => (
            <span
              key={i}
              aria-hidden={i >= TRUST.length ? true : undefined}
              className="flex items-center gap-10 pr-10 font-medium tracking-[-0.01em] whitespace-nowrap text-muted"
              style={{ fontSize: "clamp(18px,2vw,24px)" }}
            >
              {t}
              <span aria-hidden="true" className="size-[7px] rotate-45 bg-saffron" />
            </span>
          ))}
        </div>
      </div>

      {/* ───── 01 · SERVICES ───── */}
      <section id="services" className="vl-container vl-section scroll-mt-[90px]">
        <div className="mb-11 flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="vl-eyebrow">01 · Services</span>
            <h2 className="vl-h2 mt-3.5 mb-0">Ce que je fabrique</h2>
          </div>
          <Link
            href="/services"
            className="inline-flex min-h-11 items-center text-[15px] text-saffron transition-colors hover:text-saffron-hover"
          >
            Tous les services →
          </Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,212px),1fr))] gap-4">
          {OFFER_SLUGS.filter((s) => s !== "refonte").map((s) => (
            <ServiceCard key={s} slug={s} o={blocks.offers[s]} />
          ))}
        </div>
      </section>

      {/* ───── 02 · RÉALISATIONS ───── */}
      <section id="realisations" className="vl-container vl-section scroll-mt-[90px]">
        <SectionHead eyebrow="02 · Réalisations" title="Déjà en ligne" />
        <div className="flex flex-col gap-5">
          {projects.map((p) => (
            <ProjectCard key={p.slug} p={p} />
          ))}
        </div>
      </section>

      {/* ───── 03 · MÉTHODE ───── */}
      <section id="methode" className="vl-container vl-section scroll-mt-[90px]">
        <div className="mb-[52px]">
          <span className="vl-eyebrow">03 · La méthode</span>
          <h2 className="vl-h2 mt-3.5 mb-0">De l&apos;idée à la mise en ligne, en 4 étapes</h2>
          <p className="mt-[18px] mb-0 max-w-[640px] text-lg leading-relaxed text-muted">
            <span className="font-semibold text-ivory">De la conception à la mise en ligne, tout passe par moi.</span>{" "}
            L&apos;IA m&apos;assiste ; c&apos;est moi qui conçois, qui relis, qui corrige et qui valide le code.
          </p>
        </div>
        <MethodSteps />
      </section>

      {/* ───── 04 · POURQUOI ───── */}
      <section className="vl-container vl-section">
        <SectionHead eyebrow="04 · Pourquoi VibeLab" title="Le meilleur des deux mondes" />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
          {WHY.map((w) => (
            <div key={w.tag} className="vl-card rounded-3xl px-7 py-8">
              <span className="font-mono text-xs text-saffron">{w.tag}</span>
              <h3 className="mt-[18px] mb-2.5 text-[28px] font-semibold tracking-[-0.02em]">{w.title}</h3>
              <p className="m-0 text-base leading-relaxed text-muted">{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── 05 · TARIFS ───── */}
      <section id="tarifs" className="vl-container vl-section scroll-mt-[90px]">
        <span className="vl-eyebrow">05 · Tarifs</span>
        <h2
          className="mt-3.5 mb-0 max-w-[820px] leading-[1.04] font-semibold tracking-[-0.03em]"
          style={{ fontSize: "clamp(34px,4.8vw,60px)" }}
        >
          Jusqu&apos;à 10 fois moins cher qu&apos;une agence.
        </h2>
        <div className="mt-11">
          <PriceCompare source={blocks.texts.sourceComparaison} />
        </div>
        <div className="mt-5">
          <PricingPlans plans={blocks.plans} />
        </div>
        <p className="mt-[22px] mb-0 font-mono text-[12.5px] leading-[1.7] text-muted">
          Acompte de 50 % à la commande · solde à la mise en ligne · maintenance en option
        </p>
        <ConversionNote className="mt-2.5 mb-0" />
      </section>

      {/* ───── 06 · TÉMOIGNAGES (masqué tant qu'il n'y en a aucun) ───── */}
      {testimonials.length > 0 && (
        <section className="vl-container vl-section">
          <SectionHead eyebrow="06 · Témoignages" title="Ils en parlent" />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
            {testimonials.map((t) => (
              <figure key={t.id} className="vl-card m-0 flex flex-col gap-6 rounded-3xl px-7 py-[30px]">
                <span aria-hidden="true" className="h-5 text-[44px] leading-[0.6] text-saffron">
                  “
                </span>
                <blockquote className="m-0 flex-1 text-lg leading-[1.55] whitespace-pre-line text-ivory">{t.quote}</blockquote>
                <figcaption className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex size-[42px] flex-none items-center justify-center rounded-full border border-ivory/12 bg-ivory/5 font-semibold text-saffron"
                  >
                    {t.author.trim().charAt(0).toUpperCase()}
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="text-[15px] font-semibold">{t.author}</span>
                    {t.city && <span className="font-mono text-xs text-muted">{t.city}</span>}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* ───── 07 · FAQ ───── */}
      <section
        className="mx-auto max-w-[880px]"
        style={{ padding: "clamp(80px,10vw,128px) clamp(20px,4vw,40px) 0" }}
      >
        <span className="vl-eyebrow">{testimonials.length > 0 ? "07" : "06"} · FAQ</span>
        <h2 className="vl-h2 mt-3.5 mb-9">Vos questions</h2>
        <Faq items={blocks.faq_home} />
      </section>

      {/* ───── CTA FINAL ───── */}
      <CtaBlock large eyebrow="PRÊT À LANCER ?" title="Votre projet mérite d'exister en ligne." />
    </>
  );
}
