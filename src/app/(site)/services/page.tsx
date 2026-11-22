import type { Metadata } from "next";
import { ServiceCard } from "@/components/ServiceCard";
import { CtaBlock } from "@/components/CtaBlock";
import { METHOD } from "@/lib/data";
import { OFFER_SLUGS, getBlocks } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Site vitrine, boutique en ligne, application, outils IA, automatisation et refonte : six façons de mettre votre activité en ligne.",
};

// Étape 03 : version courte (sans « Vous suivez l'avancement »), comme dans la maquette
const STEPS = METHOD.map((m) =>
  m.n === "03" ? { ...m, d: "Je code votre projet avec l’aide de l’IA. Je relis, je corrige et je valide chaque ligne." } : m,
);

export default async function ServicesPage() {
  const { offers } = await getBlocks();
  return (
    <>
      <section className="vl-container vl-page-top">
        <span className="vl-eyebrow">Services</span>
        <h1 className="vl-h1 mt-4 mb-0 max-w-[900px]">Ce que je fabrique</h1>
        <p className="vl-intro mt-[22px] mb-0 max-w-[620px]">
          Six façons de mettre votre activité en ligne ou de vous faire gagner du temps. Chaque projet est
          conçu, codé et mis en ligne par moi, avec l&apos;aide de l&apos;IA.
        </p>
      </section>

      <section className="vl-container pt-14">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,330px),1fr))] gap-4">
          {OFFER_SLUGS.map((s) => (
            <ServiceCard key={s} slug={s} o={offers[s]} detailed />
          ))}
        </div>
      </section>

      <section className="vl-container vl-section">
        <span className="vl-eyebrow">La méthode</span>
        <h2
          className="mt-3.5 mb-11 leading-[1.05] font-semibold tracking-[-0.03em]"
          style={{ fontSize: "clamp(32px,4.2vw,50px)" }}
        >
          Pour chaque projet, les mêmes 4 étapes
        </h2>
        <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4 p-0">
          {STEPS.map((m) => (
            <li key={m.n} className="rounded-3xl border border-ivory/8 px-6 py-7">
              <span className="font-mono text-[13px] text-saffron">{m.n}</span>
              <h3 className="mt-3.5 mb-2 text-[21px] font-semibold">{m.t}</h3>
              <p className="m-0 text-[15px] leading-relaxed text-muted">{m.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <CtaBlock
        title="Vous ne savez pas quelle offre choisir ?"
        text="Décrivez votre projet en quelques minutes, je vous oriente vers la bonne solution."
      />
    </>
  );
}
