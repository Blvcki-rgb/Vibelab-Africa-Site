"use client";

import { useEffect, useRef, useState } from "react";
import { useCurrency } from "./CurrencyProvider";
import { formatRange, fromPrice } from "@/lib/prices";
import { useContent } from "./ContentProvider";
import { ConversionNote } from "./Price";

const SCALE = 70000;

/** Comparaison agence / freelance / VibeLab : barres animées à l'entrée dans le viewport. */
export function PriceCompare({ withNote = false, source }: { withNote?: boolean; source: string }) {
  const { currency } = useCurrency();
  const { plans } = useContent();
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const rows = [
    { name: "Agence web", range: formatRange(25000, 70000, currency), min: 25000, max: 70000, c: "rgba(201,196,184,0.45)", strong: false },
    { name: "Freelance", range: formatRange(12000, 30000, currency), min: 12000, max: 30000, c: "rgba(201,196,184,0.3)", strong: false },
    { name: "VibeLab Africa", range: fromPrice(plans.essentiel, currency), min: 0, max: SCALE * 0.05, c: "#E89B2C", strong: true },
  ];

  return (
    <div
      ref={ref}
      className="vl-card flex flex-col gap-[26px] rounded-[28px]"
      style={{ padding: "clamp(22px,3vw,36px)" }}
    >
      {rows.map((r) => (
        <div key={r.name} className="flex flex-col gap-2.5">
          <div className="flex flex-wrap justify-between gap-x-4 gap-y-1.5">
            <span
              className="text-[17px]"
              style={{ fontWeight: r.strong ? 600 : 500, color: r.strong ? "#E89B2C" : "#C9C4B8" }}
            >
              {r.name}
            </span>
            <span className="font-mono text-[13.5px]" style={{ color: r.strong ? "#E89B2C" : "#C9C4B8" }}>
              {r.range}
            </span>
          </div>
          <div className="relative h-3.5 rounded-full bg-ivory/6">
            <div
              className="absolute inset-y-0 rounded-full"
              style={{
                left: `${(r.min / SCALE) * 100}%`,
                width: on ? `${((r.max - r.min) / SCALE) * 100}%` : "0%",
                background: r.c,
                transition: "width 1.1s cubic-bezier(.2,.8,.2,1)",
              }}
            />
          </div>
        </div>
      ))}
      <span className="font-mono text-[11px] text-muted">
        Source : {source}
      </span>
      {withNote && <ConversionNote className="-mt-4 mb-0" />}
    </div>
  );
}
