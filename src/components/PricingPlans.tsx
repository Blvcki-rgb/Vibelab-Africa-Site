import Link from "next/link";
import type { Plans } from "@/lib/content/defaults";
import { PriceNumber, PriceUnit } from "./Price";

const planList = (plans: Plans) => [
  { name: "Essentiel", mad: plans.essentiel, text: "Landing ou site vitrine.", featured: false, o: "site-vitrine" },
  { name: "Business", mad: plans.business, text: "Boutique ou site premium.", featured: true, o: "boutique" },
  { name: "Sur mesure", mad: plans.surMesure, text: "Application, SaaS ou dashboard.", featured: false, o: "app" },
];

export function PricingPlans({ plans }: { plans: Plans }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,290px),1fr))] items-stretch gap-4">
      {planList(plans).map((p) => (
        <div
          key={p.name}
          className={`relative flex flex-col gap-4 rounded-[28px] px-7 py-8 ${
            p.featured
              ? "border-[1.5px] border-saffron bg-card-raised shadow-[0_20px_60px_rgba(232,155,44,0.12)]"
              : "border border-ivory/10 bg-card"
          }`}
        >
          {p.featured && (
            <span className="absolute -top-[13px] left-7 rounded-full bg-saffron px-3 py-[5px] font-mono text-[11px] font-semibold text-night">
              Le plus demandé
            </span>
          )}
          <h3 className="m-0 text-2xl font-semibold">{p.name}</h3>
          <span className="font-mono text-[15px] text-muted">
            dès{" "}
            <span className={`text-[30px] font-semibold ${p.featured ? "text-saffron" : "text-ivory"}`}>
              <PriceNumber mad={p.mad} />
            </span>{" "}
            <PriceUnit />
          </span>
          <p className="m-0 flex-1 text-base leading-[1.55] text-muted">{p.text}</p>
          <Link
            href={`/demarrer?o=${p.o}`}
            className={
              p.featured
                ? "vl-btn vl-btn-primary min-h-[52px] text-[15px]"
                : "flex min-h-[52px] items-center justify-center rounded-full border border-ivory/22 text-[15px] font-semibold transition-colors hover:border-saffron hover:text-saffron"
            }
          >
            Choisir {p.name}
          </Link>
        </div>
      ))}
    </div>
  );
}
