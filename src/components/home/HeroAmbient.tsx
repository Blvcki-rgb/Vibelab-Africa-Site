"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks";

const BUBBLES: [number, number, number, number][] = [
  [6, 7, 13, 0], [17, 5, 16, 4], [29, 9, 11, 7], [44, 5, 15, 2],
  [58, 7, 12, 9], [71, 4, 17, 1], [83, 8, 14, 5], [93, 5, 12, 8],
];
const CODES: [string, string, string, number][] = [
  ["<Hero />", "4%", "9%", 0],
  ["vercel deploy --prod", "70%", "91%", 2],
  ["const shop = await ai.build()", "46%", "3%", 4],
  ["git push", "2%", "82%", 1],
];

/** Halo safran qui suit la souris, bulles teal et fragments de code (décoratif). */
export function HeroAmbient() {
  const halo = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion(true);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: MouseEvent) => {
      const h = halo.current;
      const hero = h?.parentElement;
      if (!h || !hero) return;
      const rect = hero.getBoundingClientRect();
      if (e.clientY > rect.bottom) return;
      h.style.transform = `translate(${e.clientX - rect.left - 300}px, ${e.clientY - rect.top - 300}px)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced]);

  if (reduced) return null;

  return (
    <>
      <div
        ref={halo}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 size-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(232,155,44,0.16) 0%, rgba(232,155,44,0) 62%)",
          transform: "translate(55vw,80px)",
          transition: "transform .25s ease-out",
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {BUBBLES.map(([l, s, dur, del], i) => (
          <span
            key={`b${i}`}
            className="absolute -bottom-5 rounded-full"
            style={{
              left: `${l}%`,
              width: s,
              height: s,
              border: "1px solid rgba(31,181,163,0.55)",
              background: "rgba(31,181,163,0.14)",
              animation: `vl-rise ${dur}s linear ${-del}s infinite`,
            }}
          />
        ))}
        {CODES.map(([txt, x, y, del], i) => (
          <span
            key={`c${i}`}
            className="absolute font-mono text-xs whitespace-nowrap"
            style={{
              left: x,
              top: y,
              color: "rgba(246,243,236,0.13)",
              animation: `vl-float 7s ease-in-out ${-del}s infinite`,
            }}
          >
            {txt}
          </span>
        ))}
      </div>
    </>
  );
}
