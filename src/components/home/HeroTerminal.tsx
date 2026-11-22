"use client";

import { useEffect, useRef, useState } from "react";
import { useCurrency } from "../CurrencyProvider";
import { unit } from "@/lib/prices";
import { useReducedMotion } from "@/lib/hooks";

type Scenario = {
  chip: string;
  type: "shop" | "dash" | "site";
  title: string;
  prompt: string;
  steps: [string, string][];
};

const SCENARIOS: Scenario[] = [
  {
    chip: "Une boutique de parfums",
    type: "shop",
    title: "Maison Ambre",
    prompt:
      "Crée une boutique en ligne pour ma marque de parfums, avec commande sur WhatsApp et paiement à la livraison.",
    steps: [
      ["Analyse de la demande", "boutique · parfums"],
      ["Design de l’interface", "mobile d’abord"],
      ["Code assisté par IA", "<Shop />"],
      ["Relecture et corrections", "validé à la main"],
      ["Mise en ligne", "vercel deploy --prod"],
    ],
  },
  {
    chip: "Un dashboard de ventes",
    type: "dash",
    title: "Tableau de bord",
    prompt:
      "Crée un dashboard qui suit mes ventes, mon stock et mes meilleurs produits, mis à jour chaque jour.",
    steps: [
      ["Analyse de la demande", "ventes · stock"],
      ["Design de l’interface", "graphiques"],
      ["Code assisté par IA", "<Dashboard />"],
      ["Relecture et corrections", "validé à la main"],
      ["Mise en ligne", "vercel deploy --prod"],
    ],
  },
  {
    chip: "Un site vitrine",
    type: "site",
    title: "Cabinet Nour",
    prompt:
      "Crée un site vitrine élégant pour mon cabinet, avec prise de rendez-vous et une page contact.",
    steps: [
      ["Analyse de la demande", "site · cabinet"],
      ["Design de l’interface", "4 pages"],
      ["Code assisté par IA", "<Hero />"],
      ["Relecture et corrections", "validé à la main"],
      ["Mise en ligne", "vercel deploy --prod"],
    ],
  },
];

const CH = 28; // ms par caractère
const ST = 520; // intervalle entre étapes
const CYCLE_MS = 9000;
const BARS = [42, 64, 50, 82, 58, 96, 74];

function derive(t: number, s: Scenario, reduced: boolean) {
  const len = s.prompt.length;
  if (reduced) return { typed: s.prompt, typing: false, vis: 5, done: 5, pv: true, grown: true };
  const typedN = Math.min(len, Math.floor(t / CH));
  const tEnd = len * CH + 300;
  const vis = t < tEnd ? 0 : Math.min(5, Math.floor((t - tEnd) / ST) + 1);
  const done = t < tEnd + 400 ? 0 : Math.min(5, Math.floor((t - tEnd - 400) / ST) + 1);
  const pvAt = tEnd + 400 + 4 * ST + 350;
  return { typed: s.prompt.slice(0, typedN), typing: typedN < len, vis, done, pv: t > pvAt, grown: t > pvAt + 180 };
}

export function HeroTerminal() {
  const { currency } = useCurrency();
  const [sc, setSc] = useState(0);
  const [t, setT] = useState(0);
  const [manual, setManual] = useState(false);
  const [run, setRun] = useState(0); // relance du scénario au clic
  const reduced = useReducedMotion();
  const start = useRef(0);
  const key = useRef("");

  useEffect(() => {
    start.current = performance.now();
    key.current = "";
    if (reduced) return;
    const iv = setInterval(() => {
      const now = performance.now();
      const elapsed = now - start.current;
      if (!manual && elapsed > CYCLE_MS) {
        setSc((x) => (x + 1) % SCENARIOS.length);
        setT(0);
        return;
      }
      const d = derive(elapsed, SCENARIOS[sc], false);
      const k = [d.typed.length, d.vis, d.done, d.pv, d.grown].join("|");
      if (k !== key.current) {
        key.current = k;
        setT(elapsed);
      }
    }, 40);
    return () => clearInterval(iv);
  }, [sc, manual, reduced, run]);

  const pick = (i: number) => {
    setManual(true);
    setT(0);
    setSc(i);
    setRun((r) => r + 1);
  };

  const s = SCENARIOS[sc];
  const d = derive(t, s, reduced);
  const status = d.pv ? "● en ligne" : d.vis > 0 ? "génération…" : "saisie…";
  const pct = Math.round((d.done / 5) * 100);

  return (
    <div className="relative mb-16">
      <div role="group" aria-label="Choisir un exemple" className="mb-3.5 flex flex-wrap gap-2">
        {SCENARIOS.map((c, i) => {
          const active = i === sc;
          return (
            <button
              key={c.chip}
              type="button"
              onClick={() => pick(i)}
              aria-pressed={active}
              className="min-h-11 cursor-pointer rounded-full border px-4 text-sm font-medium transition-all duration-200"
              style={{
                borderColor: active ? "#E89B2C" : "rgba(246,243,236,0.14)",
                background: active ? "rgba(232,155,44,0.14)" : "rgba(23,27,40,0.6)",
                color: active ? "#F6F3EC" : "#C9C4B8",
              }}
            >
              {c.chip}
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-[22px] border border-ivory/10 bg-card shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        <div className="flex items-center gap-2 border-b border-ivory/7 px-[18px] py-3.5">
          <span className="size-2.5 rounded-full bg-ivory/16" />
          <span className="size-2.5 rounded-full bg-ivory/16" />
          <span className="size-2.5 rounded-full bg-ivory/16" />
          <span className="ml-2.5 truncate font-mono text-xs text-muted">agent@vlab ~ nouveau-projet</span>
          <span
            className="ml-auto font-mono text-[11px] whitespace-nowrap"
            style={{ color: d.pv ? "#1FB5A3" : "#C9C4B8" }}
          >
            {status}
          </span>
        </div>
        <div aria-live="polite" className="min-h-[332px] px-5 pt-5 pb-[22px] font-mono text-[13.5px] leading-[1.65]">
          <div className="flex min-h-[66px] gap-2.5 text-ivory">
            <span className="text-saffron">›</span>
            <span>
              {d.typed}
              <span
                aria-hidden="true"
                className="ml-0.5 inline-block h-[15px] w-2 bg-ivory align-[-2px] [animation:vl-blink_1s_steps(1)_infinite]"
                style={{ opacity: d.typing || d.vis === 0 ? 1 : 0 }}
              />
            </span>
          </div>
          <div className="mt-[18px] flex flex-col gap-2.5">
            {s.steps.map(([label, detail], i) => {
              const visible = d.vis > i;
              const done = d.done > i;
              return (
                <div
                  key={label}
                  className="flex items-center gap-3 transition-[opacity,transform] duration-350"
                  style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(6px)" }}
                >
                  <span
                    className="flex size-[22px] flex-none items-center justify-center rounded-[7px] text-xs font-semibold"
                    style={{
                      background: done ? "#E89B2C" : "rgba(31,181,163,0.12)",
                      color: done ? "#0F1220" : "#1FB5A3",
                    }}
                  >
                    {done ? "✓" : "›"}
                  </span>
                  <span className="text-ivory">{label}</span>
                  <span className="ml-auto max-w-[46%] truncate text-[11.5px] text-muted">{detail}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-[22px] flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-md bg-ivory/8">
              <div
                className="h-full rounded-md bg-saffron transition-[width] duration-450 ease-[cubic-bezier(.2,.7,.2,1)]"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="min-w-[38px] text-right text-xs text-muted">{pct}%</span>
          </div>
        </div>
      </div>

      {/* Aperçu qui surgit */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 w-[min(300px,82%)] rounded-[18px] bg-ivory p-3.5 text-night shadow-[0_30px_70px_rgba(0,0,0,0.55)]"
        style={{
          right: "clamp(-28px,-2vw,-6px)",
          opacity: d.pv ? 1 : 0,
          transform: d.pv ? "translateY(0) rotate(-2deg) scale(1)" : "translateY(24px) rotate(0deg) scale(0.92)",
          transition: "opacity .5s, transform .6s cubic-bezier(.2,.9,.25,1.2)",
        }}
      >
        <div className="mb-2.5 flex items-center justify-between">
          <span className="text-[13px] font-semibold">{s.title}</span>
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-teal-light-bg">
            <span className="size-1.5 rounded-full bg-teal-light-bg" />
            en ligne
          </span>
        </div>

        {s.type === "shop" && (
          <>
            <div className="grid grid-cols-3 gap-2">
              {["Oud Nuit", "Safran", "Ambre"].map((n) => (
                <div key={n} className="flex flex-col gap-[5px]">
                  <div
                    className="aspect-[3/4] rounded-[10px]"
                    style={{ background: "repeating-linear-gradient(135deg,#E8E3D8 0 6px,#EFEBE2 6px 12px)" }}
                  />
                  <span className="text-[10.5px] font-semibold">{n}</span>
                  <span className="font-mono text-[9.5px] text-muted-light">[PRIX] {unit(currency)}</span>
                </div>
              ))}
            </div>
            <div className="mt-2.5 rounded-full bg-night p-2 text-center text-[11px] font-semibold text-ivory">
              Commander sur WhatsApp
            </div>
          </>
        )}

        {s.type === "dash" && (
          <>
            <span className="font-mono text-[10px] text-muted-light">Ventes · 7 derniers jours</span>
            <div className="mt-2.5 flex h-[110px] items-end gap-[7px] border-b border-[#DDD7CA] pb-1">
              {BARS.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-[5px] rounded-b-[2px]"
                  style={{
                    height: d.grown ? `${h}%` : "0%",
                    background: i === 5 ? "#E89B2C" : "#12857A",
                    transition: `height .8s cubic-bezier(.2,.8,.2,1) ${i * 0.06}s`,
                  }}
                />
              ))}
            </div>
            <div className="mt-1.5 flex gap-[7px]">
              {"LMMJVSD".split("").map((l, i) => (
                <span key={i} className="flex-1 text-center font-mono text-[9px] text-muted-light">
                  {l}
                </span>
              ))}
            </div>
          </>
        )}

        {s.type === "site" && (
          <>
            <div className="flex flex-col gap-2 rounded-xl bg-night p-3.5">
              <div className="flex justify-end gap-[5px]">
                <span className="h-1 w-[18px] rounded bg-ivory/30" />
                <span className="h-1 w-[18px] rounded bg-ivory/30" />
                <span className="h-1 w-[18px] rounded bg-saffron" />
              </div>
              <span className="mt-2.5 h-[11px] w-[78%] rounded bg-ivory" />
              <span className="h-[11px] w-[56%] rounded bg-ivory" />
              <span className="mt-1 h-[5px] w-[88%] rounded bg-ivory/30" />
              <span className="h-[5px] w-[70%] rounded bg-ivory/30" />
              <span className="mt-1.5 h-[22px] w-24 rounded-full bg-saffron" />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="h-10 rounded-[10px]"
                  style={{ background: "repeating-linear-gradient(135deg,#E8E3D8 0 6px,#EFEBE2 6px 12px)" }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
