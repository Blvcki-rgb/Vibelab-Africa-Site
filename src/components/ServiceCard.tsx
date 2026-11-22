import Link from "next/link";
import type { Offer } from "@/lib/content/defaults";
import { SERVICE_ICONS } from "@/lib/data";
import { FromPrice } from "./Price";

export function OfferPrice({ price }: { price: number | null }) {
  return price === null ? <>sur devis</> : <FromPrice mad={price} />;
}

/** Carte service compacte (accueil) ou détaillée (page Services, avec « Découvrir → »). */
export function ServiceCard({ slug, o, detailed = false }: { slug: string; o: Offer; detailed?: boolean }) {
  return (
    <Link
      href={`/services/${slug}`}
      className={`vl-card vl-card-hover flex flex-col gap-3.5 text-ivory hover:text-ivory ${
        detailed ? "rounded-[26px] px-7 py-8" : "rounded-3xl px-6 py-7"
      }`}
    >
      <span className={detailed ? "[&>svg]:size-8" : ""}>{SERVICE_ICONS[slug]}</span>
      {detailed ? (
        <h2 className="mt-2.5 text-[25px] font-semibold tracking-[-0.015em]">{o.title}</h2>
      ) : (
        <h3 className="mt-2 text-[21px] font-semibold tracking-[-0.01em]">{o.title}</h3>
      )}
      <p className={`m-0 flex-1 leading-[1.55] text-muted ${detailed ? "text-base" : "text-[15px]"}`}>{o.cardText}</p>
      {detailed ? (
        <div className="flex items-center justify-between border-t border-ivory/8 pt-3.5">
          <span className="font-mono text-[13px] text-saffron">
            <OfferPrice price={o.price} />
          </span>
          <span className="text-[15px] text-muted">Découvrir →</span>
        </div>
      ) : (
        <span className="font-mono text-[13px] text-saffron">
          <OfferPrice price={o.price} />
        </span>
      )}
    </Link>
  );
}
