import type { Metadata } from "next";
import Link from "next/link";
import { PriceCompare } from "@/components/PriceCompare";
import { PricingPlans } from "@/components/PricingPlans";
import { OfferPrice } from "@/components/ServiceCard";
import { Faq } from "@/components/Faq";
import { CtaBlock } from "@/components/CtaBlock";
import { OFFER_SLUGS, getBlocks } from "@/lib/content";

export const metadata: Metadata = {
  title: "Tarifs",
  description:
    "Jusqu'à 10 fois moins cher qu'une agence : des prix annoncés à l'avance, un paiement en deux fois et aucune surprise à la livraison.",
};

const sectionPad = { paddingTop: "clamp(72px,9vw,112px)" };

const terms = (maintenance: string) => [
  { big: "50 %", color: "text-saffron", title: "À la commande", text: "Un acompte pour lancer le projet." },
  { big: "50 %", color: "text-saffron", title: "À la mise en ligne", text: "Le solde, une fois le résultat validé." },
  {
    big: "+",
    color: "text-teal",
    title: "Maintenance en option",
    text: `${maintenance} pour les mises à jour et l'accompagnement.`,
  },
];

export default async function TarifsPage() {
  const b = await getBlocks();
  return (
    <>
      <section className="vl-container vl-page-top">
        <span className="vl-eyebrow">Tarifs</span>
        <h1 className="vl-h1 mt-4 mb-0 max-w-[900px]">Jusqu&apos;à 10 fois moins cher qu&apos;une agence.</h1>
        <p className="vl-intro mt-[22px] mb-0 max-w-[620px]">
          Des prix annoncés à l&apos;avance, un paiement en deux fois et aucune surprise à la livraison.
        </p>
        <div className="mt-11">
          <PriceCompare withNote source={b.texts.sourceComparaison} />
        </div>
      </section>

      <section className="vl-container" style={sectionPad}>
        <span className="vl-eyebrow">Les formules</span>
        <h2 className="vl-h2-sub mt-3.5 mb-10">Choisissez votre point de départ</h2>
        <PricingPlans plans={b.plans} />
      </section>

      <section
        className="vl-container grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-start"
        style={{ ...sectionPad, gap: "clamp(32px,5vw,64px)" }}
      >
        <div>
          <span className="vl-eyebrow">Par service</span>
          <h2 className="vl-h2-sub mt-3.5 mb-0">Les prix de départ</h2>
        </div>
        <div className="flex flex-col border-t border-ivory/10">
          {OFFER_SLUGS.map((s) => (
            <Link
              key={s}
              href={`/services/${s}`}
              className="flex min-h-16 items-center justify-between gap-4 border-b border-ivory/10 py-3 text-lg transition-colors hover:text-saffron"
            >
              {b.offers[s].title}
              <span className="font-mono text-sm whitespace-nowrap text-saffron">
                <OfferPrice price={b.offers[s].price} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="vl-container" style={sectionPad}>
        <span className="vl-eyebrow">Modalités</span>
        <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4">
          {terms(b.texts.prixMaintenance).map((t) => (
            <div key={t.title} className="vl-card rounded-3xl px-6 py-7">
              <span className={`font-mono text-[30px] font-semibold ${t.color}`}>{t.big}</span>
              <h3 className="mt-3 mb-1.5 text-xl font-semibold">{t.title}</h3>
              <p className="m-0 text-[15px] leading-relaxed text-muted">{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        className="mx-auto max-w-[880px]"
        style={{ padding: "clamp(72px,9vw,112px) clamp(20px,4vw,40px) 0" }}
      >
        <h2 className="vl-h2-sub mt-0 mb-[30px]">Questions sur les prix</h2>
        <Faq items={b.faq_pricing} />
      </section>

      <CtaBlock title="Recevez un devis clair pour votre projet." />
    </>
  );
}
