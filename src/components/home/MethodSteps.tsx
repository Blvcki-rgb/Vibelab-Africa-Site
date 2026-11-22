"use client";

import { useEffect, useRef } from "react";
import { METHOD } from "@/lib/data";

/**
 * Les 4 étapes, reliées par une ligne qui se remplit en safran au défilement.
 * Horizontale ≥ 880px, verticale à gauche en dessous.
 */
export function MethodSteps() {
  const root = useRef<HTMLDivElement>(null);
  const fillH = useRef<HTMLDivElement>(null);
  const fillV = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const update = () => {
      const el = root.current?.closest("section");
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = reduced ? 1 : Math.max(0, Math.min(1, (vh * 0.75 - r.top - 120) / (r.height - 120)));
      if (fillH.current) fillH.current.style.width = `${p * 100}%`;
      if (fillV.current) fillV.current.style.height = `${p * 100}%`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={root} className="relative">
      <div aria-hidden="true" className="absolute inset-x-[22px] top-[22px] hidden h-0.5 bg-ivory/10 method:block">
        <div ref={fillH} className="h-full w-0 bg-saffron transition-[width] duration-150 ease-linear" />
      </div>
      <div aria-hidden="true" className="absolute top-[22px] bottom-[22px] left-[21px] w-0.5 bg-ivory/10 method:hidden">
        <div ref={fillV} className="h-0 w-full bg-saffron transition-[height] duration-150 ease-linear" />
      </div>
      <ol className="relative m-0 grid list-none grid-cols-1 gap-9 p-0 method:grid-cols-4 method:gap-7">
        {METHOD.map((m) => (
          <li key={m.n} className="flex flex-row gap-5 method:flex-col">
            <span className="flex size-11 flex-none items-center justify-center rounded-full border-2 border-saffron bg-night font-mono text-[13px] font-semibold text-saffron">
              {m.n}
            </span>
            <div>
              <h3 className="m-0 mb-2 text-[21px] font-semibold tracking-[-0.01em]">{m.t}</h3>
              <p className="m-0 text-[15px] leading-relaxed text-muted">{m.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
