import type { Metadata } from "next";
import Image from "next/image";
import { CtaBlock } from "@/components/CtaBlock";
import { getBlocks } from "@/lib/content";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "VibeLab Africa, studio de vibe coding basé à Casablanca et actif au Sénégal : sites, boutiques, applications et automatisations IA.",
};

const sectionPad = { paddingTop: "clamp(72px,9vw,112px)" };

const PROCESS = [
  "Vous expliquez votre idée avec vos mots, sans jargon.",
  "Je conçois le projet : structure, design, fonctionnalités.",
  "Je demande à l'IA de m'aider sur le code, avec des instructions précises.",
  "Je relis, je corrige et je valide chaque ligne, puis je teste chaque page.",
  "Je mets votre projet en ligne et je reste disponible.",
];

const VALUES = [
  { tag: "/rapide", title: "Rapide", text: "Votre projet avance vite, sans semaines d'attente entre deux échanges." },
  { tag: "/premium", title: "Premium", text: "Un design soigné, pensé pour le téléphone, qui donne confiance." },
  { tag: "/accessible", title: "Accessible", text: "Des prix clairs et un paiement en deux fois." },
];

const PLACES = [
  { country: "Maroc", city: "Casablanca", text: "Le studio." },
  { country: "Sénégal", city: "Dakar", text: "Des projets accompagnés à distance." },
];

export default async function AProposPage() {
  const { about } = await getBlocks();
  return (
    <>
      {/* Hero */}
      <section
        className="vl-container vl-page-top grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-center"
        style={{ gap: "clamp(40px,6vw,72px)" }}
      >
        <div>
          <span className="vl-eyebrow">À propos</span>
          <h1
            className="mt-4 mb-0 leading-[1.03] font-semibold tracking-[-0.035em]"
            style={{ fontSize: "clamp(40px,5.6vw,68px)" }}
          >
            Un studio qui construit avec l&apos;IA, pour ceux qui se lancent.
          </h1>
          <p className="vl-intro mt-[22px] mb-0 max-w-[560px]">
            VibeLab Africa crée des sites, des boutiques en ligne, des applications, des dashboards et des
            automatisations IA grâce au vibe coding. Le studio est basé à Casablanca et actif au Sénégal.
          </p>
        </div>
        {about.photo ? (
          <div className="relative aspect-[4/5] max-h-[560px] overflow-hidden rounded-[28px] border border-ivory/10">
            <Image src={about.photo} alt={`Photo de ${about.nom}`} fill sizes="(max-width: 900px) 100vw, 560px" className="object-cover" />
          </div>
        ) : (
          <div
            className="flex aspect-[4/5] max-h-[560px] items-center justify-center rounded-[28px] border border-ivory/10"
            style={{ background: "repeating-linear-gradient(135deg,rgba(246,243,236,0.04) 0 10px,transparent 10px 20px)" }}
          >
            <span className="rounded-lg border border-dashed border-ivory/25 px-3 py-1.5 font-mono text-xs text-muted">
              [Photo du fondateur]
            </span>
          </div>
        )}
      </section>

      {/* Qui suis-je */}
      <section
        className="vl-container grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-start"
        style={{ ...sectionPad, gap: "clamp(32px,5vw,64px)" }}
      >
        <div>
          <span className="vl-eyebrow">Qui suis-je ?</span>
          <h2 className="vl-h2-sub mt-3.5 mb-0">{about.nom}</h2>
          <p className="mt-3 mb-0 font-mono text-[13px] text-muted">Fondateur de VibeLab Africa</p>
        </div>
        <div className="flex flex-col gap-[18px] text-lg leading-[1.65] text-muted">
          {about.parcours && <p className="m-0 whitespace-pre-line">{about.parcours}</p>}
          {about.pourquoi && <p className="m-0 whitespace-pre-line">{about.pourquoi}</p>}
        </div>
      </section>

      {/* Le vibe coding */}
      <section className="vl-container" style={sectionPad}>
        <div
          className="vl-card grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] rounded-[28px]"
          style={{ padding: "clamp(28px,4vw,52px)", gap: "clamp(28px,4vw,56px)" }}
        >
          <div>
            <span className="vl-eyebrow">Le vibe coding</span>
            <h2
              className="mt-3.5 mb-0 leading-[1.08] font-semibold tracking-[-0.03em]"
              style={{ fontSize: "clamp(28px,3.6vw,42px)" }}
            >
              Vous décrivez, je conçois, l&apos;IA m&apos;assiste.
            </h2>
            <p className="mt-4 mb-0 text-[17px] leading-relaxed text-muted">
              De la conception à la mise en ligne, tout passe par moi. L&apos;IA est un outil qui me fait gagner
              du temps ; c&apos;est moi qui décide, qui relis et qui valide.
            </p>
          </div>
          <ol className="m-0 flex list-none flex-col gap-[18px] p-0 font-mono text-[14.5px] leading-relaxed">
            {PROCESS.map((step, i) => (
              <li key={step} className="flex gap-3.5">
                <span className="text-saffron">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-ivory">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Valeurs */}
      <section className="vl-container" style={sectionPad}>
        <span className="vl-eyebrow">Ce qui compte</span>
        <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
          {VALUES.map((v) => (
            <div key={v.tag} className="rounded-3xl border border-ivory/8 px-7 py-8">
              <span className="font-mono text-xs text-saffron">{v.tag}</span>
              <h3 className="mt-4 mb-2.5 text-[26px] font-semibold">{v.title}</h3>
              <p className="m-0 text-base leading-relaxed text-muted">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Casablanca / Dakar */}
      <section className="vl-container" style={sectionPad}>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
          {PLACES.map((p) => (
            <div key={p.city} className="vl-card rounded-[28px] px-[30px] py-9">
              <span className="font-mono text-xs tracking-[0.24em] text-teal uppercase">{p.country}</span>
              <h3
                className="mt-3.5 mb-0 font-semibold tracking-[-0.03em]"
                style={{ fontSize: "clamp(32px,4vw,44px)" }}
              >
                {p.city}
              </h3>
              <p className="mt-2.5 mb-0 text-base text-muted">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <CtaBlock title="Votre projet mérite d'exister en ligne." />
    </>
  );
}
