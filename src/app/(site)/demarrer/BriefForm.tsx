"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useCurrency } from "@/components/CurrencyProvider";
import { useContent } from "@/components/ContentProvider";
import { WhatsAppIcon } from "@/components/Nav";
import { convert, formatNumber, fromPrice, unit, type Currency } from "@/lib/prices";
import { whatsappHref } from "@/lib/site";
import {
  BUDGETS,
  CHOICE_GROUPS,
  DELAIS,
  EMPTY_BRIEF,
  PROJECT_TYPES,
  STEP_NAMES,
  checkStep,
  type BriefForm as Form,
} from "@/lib/brief";
import { sendBrief } from "./actions";

type ArrayKey = "pages" | "fonct" | "style";
type TextKey = "nom" | "tel" | "email" | "activite" | "objectif" | "cible" | "refs";

const inputCls =
  "w-full rounded-[14px] border border-ivory/14 bg-night px-4 py-3.5 text-base text-ivory placeholder:text-placeholder";
const labelCls = "flex flex-col gap-2 text-[15px] text-muted";
const legendCls = "mb-[18px] p-0 text-[clamp(24px,3vw,30px)] font-semibold tracking-[-0.02em] text-ivory";

function budgetLabel(id: string, cur: Currency) {
  const b = BUDGETS.find((x) => x.id === id);
  if (!b) return "—";
  if (b.label) return b.label;
  const n = (m: number) => formatNumber(convert(m, cur));
  return b.max ? `${n(b.min!)} – ${n(b.max)} ${unit(cur)}` : `+ de ${n(b.min!)} ${unit(cur)}`;
}

function pillStyle(on: boolean) {
  return {
    borderColor: on ? "#E89B2C" : "rgba(246,243,236,0.14)",
    background: on ? "rgba(232,155,44,0.14)" : "#0F1220",
  };
}

export function BriefForm() {
  const params = useSearchParams();
  const { currency } = useCurrency();
  const { offerPrices, contact, delaiReponse } = useContent();
  const wa = whatsappHref(contact.whatsappNumber, contact.whatsappMessage);
  const [step, setStep] = useState(1);
  const [f, setF] = useState<Form>(() => {
    const o = params.get("o");
    const t = PROJECT_TYPES.find((x) => x.slug && x.slug === o);
    return { ...EMPTY_BRIEF, type: t?.label ?? "" };
  });
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);
  const [trap, setTrap] = useState("");
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setF((s) => ({ ...s, [k]: v }));
    setErr("");
  };
  const toggle = (k: ArrayKey, v: string) =>
    set(k, f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v]);
  const text = (k: TextKey) => ({
    value: f[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(k, e.target.value),
  });
  const top = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const next = () => {
    const e = checkStep(step, f);
    if (e) return setErr(e);
    setStep(step + 1);
    setErr("");
    top();
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 5) return next();
    startTransition(async () => {
      const res = await sendBrief(f, trap);
      if (res.ok) {
        setSent(true);
        top();
      } else setErr(res.error);
    });
  };

  if (sent) {
    const prenom = f.nom.trim().split(/\s+/)[0] ?? "";
    const recap: [string, string][] = [
      ["Projet", f.type || "—"],
      ["Budget", f.budget ? budgetLabel(f.budget, currency) : "—"],
      ["Délai", f.delai || "—"],
      ["Contact", f.tel || f.email || "—"],
    ];
    return (
      <section
        className="mx-auto flex max-w-[820px] flex-col items-start gap-6"
        style={{ padding: "clamp(140px,16vw,200px) clamp(20px,4vw,40px) 0" }}
      >
        <span
          aria-hidden="true"
          className="flex size-16 items-center justify-center rounded-[20px] bg-saffron font-mono text-[28px] font-semibold text-night"
        >
          ✓
        </span>
        <span className="vl-eyebrow">Demande envoyée</span>
        <h1
          className="m-0 leading-[1.04] font-semibold tracking-[-0.035em]"
          style={{ fontSize: "clamp(38px,5.6vw,64px)" }}
        >
          Merci {prenom}, votre projet est entre de bonnes mains.
        </h1>
        <p className="m-0 max-w-[600px] text-[19px] leading-relaxed text-muted">
          Je lis votre brief et je vous réponds sous{" "}
          <span className="font-semibold text-ivory">{delaiReponse}</span>, par WhatsApp ou par
          e-mail.
        </p>
        <div className="vl-card w-full rounded-[20px] px-6 py-[22px] font-mono text-[13.5px] leading-[1.9] text-muted">
          {recap.map(([k, v]) => (
            <div key={k} className="flex flex-wrap gap-3">
              <span className="min-w-[120px] text-teal">{k}</span>
              <span className="text-ivory">{v}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/realisations" className="vl-btn vl-btn-primary min-h-[54px] px-[26px] text-base">
            Voir les réalisations
          </Link>
          <Link href="/" className="vl-btn vl-btn-ghost min-h-[54px] px-[26px] text-base">
            Retour à l&apos;accueil
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="vl-container" style={{ paddingTop: "clamp(120px,14vw,160px)" }}>
      <span className="vl-eyebrow">Démarrer un projet</span>
      <h1
        className="mt-3.5 mb-0 max-w-[820px] leading-[1.04] font-semibold tracking-[-0.035em]"
        style={{ fontSize: "clamp(36px,5vw,60px)" }}
      >
        Parlez-moi de votre projet
      </h1>
      <p className="mt-4 mb-0 max-w-[560px] text-lg leading-relaxed text-muted">
        5 étapes courtes, environ 3 minutes. Vous recevez ensuite un devis clair.
      </p>

      <div className="mt-10 grid items-start gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))]">
        <form
          onSubmit={onSubmit}
          noValidate
          className="vl-card relative flex min-w-0 flex-col gap-7 rounded-[28px] min-[1060px]:col-span-2"
          style={{ padding: "clamp(22px,3.4vw,40px)" }}
        >
          {/* Progression */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3 font-mono text-[12.5px]">
              <span className="text-saffron">Étape {step} / 5</span>
              <span className="text-muted">{STEP_NAMES[step - 1]}</span>
            </div>
            <div
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={5}
              aria-valuenow={step}
              aria-label="Progression du formulaire"
              className="h-1.5 overflow-hidden rounded-md bg-ivory/8"
            >
              <div
                className="h-full rounded-md bg-saffron transition-[width] duration-400 ease-[cubic-bezier(.2,.7,.2,1)]"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Piège anti-robots, invisible pour les humains */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
              Ne pas remplir
              <input type="text" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
            </label>
          </div>

          {step === 1 && (
            <fieldset className="m-0 flex flex-col gap-[18px] border-0 p-0">
              <legend className={legendCls}>Vos coordonnées</legend>
              <label className={labelCls}>
                Prénom et nom *
                <input type="text" autoComplete="name" placeholder="Ex. Amina Diallo" className={`${inputCls} min-h-[54px]`} {...text("nom")} />
              </label>
              <div className="grid gap-[18px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))]">
                <label className={labelCls}>
                  WhatsApp / téléphone
                  <input type="tel" autoComplete="tel" placeholder="+212 …" className={`${inputCls} min-h-[54px]`} {...text("tel")} />
                </label>
                <label className={labelCls}>
                  E-mail
                  <input type="email" autoComplete="email" placeholder="vous@exemple.com" className={`${inputCls} min-h-[54px]`} {...text("email")} />
                </label>
              </div>
              <label className={labelCls}>
                Nom de votre activité
                <input type="text" placeholder="Ex. Maison Ambre" className={`${inputCls} min-h-[54px]`} {...text("activite")} />
              </label>
              <span className="font-mono text-xs text-muted">* Indiquez au moins un téléphone ou un e-mail.</span>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className="m-0 border-0 p-0">
              <legend className={legendCls}>Quel type de projet ?</legend>
              <div className="grid gap-2.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr))]">
                {PROJECT_TYPES.map((t) => {
                  const on = f.type === t.label;
                  return (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() => set("type", t.label)}
                      aria-pressed={on}
                      className="flex min-h-[92px] cursor-pointer flex-col justify-between gap-2.5 rounded-[18px] border-[1.5px] p-4 text-left text-ivory transition-colors"
                      style={pillStyle(on)}
                    >
                      <span className="text-base font-semibold">{t.label}</span>
                      <span className={`font-mono text-[11.5px] ${on ? "text-saffron" : "text-muted"}`}>
                        {t.fixed ?? (t.slug && offerPrices[t.slug] != null ? fromPrice(offerPrices[t.slug]!, currency) : "")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {step === 3 && (
            <fieldset className="m-0 flex flex-col gap-[18px] border-0 p-0">
              <legend className={legendCls}>Objectif et cible</legend>
              <label className={labelCls}>
                Que doit vous apporter ce projet ?
                <textarea rows={4} placeholder="Ex. recevoir des commandes sans passer par Instagram" className={`${inputCls} resize-y leading-normal`} {...text("objectif")} />
              </label>
              <label className={labelCls}>
                Qui sont vos clients ?
                <textarea rows={3} placeholder="Ex. femmes 25-45 ans à Casablanca et Rabat" className={`${inputCls} resize-y leading-normal`} {...text("cible")} />
              </label>
            </fieldset>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-[26px]">
              <h2 className="m-0 text-[clamp(24px,3vw,30px)] font-semibold tracking-[-0.02em]">
                Pages, fonctionnalités et style
              </h2>
              {CHOICE_GROUPS.map((g) => (
                <fieldset key={g.key} className="m-0 border-0 p-0">
                  <legend className="mb-3 p-0 text-[15px] text-muted">{g.title}</legend>
                  <div className="flex flex-wrap gap-2">
                    {g.items.map((label) => {
                      const on = f[g.key].includes(label);
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => toggle(g.key, label)}
                          aria-pressed={on}
                          className={`min-h-11 cursor-pointer rounded-full border px-4 text-[14.5px] font-medium ${on ? "text-ivory" : "text-muted"}`}
                          style={pillStyle(on)}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
              <label className={labelCls}>
                Des sites que vous aimez ? (liens, comptes Instagram…)
                <textarea rows={3} placeholder="https://…" className={`${inputCls} resize-y leading-normal`} {...text("refs")} />
              </label>
            </div>
          )}

          {step === 5 && (
            <div className="flex flex-col gap-[26px]">
              <h2 className="m-0 text-[clamp(24px,3vw,30px)] font-semibold tracking-[-0.02em]">Budget et délai</h2>
              <fieldset className="m-0 border-0 p-0">
                <legend className="mb-3 p-0 text-[15px] text-muted">Budget envisagé</legend>
                <div className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(min(100%,170px),1fr))]">
                  {BUDGETS.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => set("budget", b.id)}
                      aria-pressed={f.budget === b.id}
                      className="min-h-[52px] cursor-pointer rounded-[14px] border-[1.5px] px-3.5 font-mono text-[13.5px] text-ivory"
                      style={pillStyle(f.budget === b.id)}
                    >
                      {budgetLabel(b.id, currency)}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset className="m-0 border-0 p-0">
                <legend className="mb-3 p-0 text-[15px] text-muted">Pour quand ?</legend>
                <div className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(min(100%,170px),1fr))]">
                  {DELAIS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => set("delai", d)}
                      aria-pressed={f.delai === d}
                      className="min-h-[52px] cursor-pointer rounded-[14px] border-[1.5px] px-3.5 text-[15px] text-ivory"
                      style={pillStyle(f.delai === d)}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </fieldset>
              <p className="m-0 font-mono text-[12.5px] leading-relaxed text-muted">
                Acompte de 50 % à la commande · solde à la mise en ligne
              </p>
            </div>
          )}

          {err && (
            <p role="alert" className="m-0 rounded-xl bg-saffron/12 px-4 py-3 text-[15px] text-ivory">
              {err}
            </p>
          )}

          <div className="flex flex-wrap justify-between gap-3 border-t border-ivory/8 pt-1.5">
            {step > 1 && (
              <button
                type="button"
                onClick={() => {
                  setStep(step - 1);
                  setErr("");
                  top();
                }}
                className="mt-[18px] min-h-[52px] cursor-pointer rounded-full border border-ivory/20 bg-transparent px-[22px] text-[15px] font-medium text-ivory"
              >
                ← Retour
              </button>
            )}
            {step < 5 ? (
              <button
                key="next"
                type="button"
                onClick={next}
                className="vl-btn vl-btn-primary mt-[18px] ml-auto min-h-[52px] cursor-pointer border-0 px-[26px] text-base"
              >
                Continuer →
              </button>
            ) : (
              <button
                key="submit"
                type="submit"
                disabled={pending}
                className="vl-btn vl-btn-primary mt-[18px] ml-auto min-h-[52px] cursor-pointer border-0 px-[26px] text-base disabled:cursor-wait disabled:opacity-70"
              >
                {pending ? "Envoi…" : "Envoyer ma demande"}
              </button>
            )}
          </div>
        </form>

        <aside className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-col gap-3.5 rounded-3xl bg-teal px-6 py-7 text-night">
            <h2 className="m-0 text-[22px] font-semibold tracking-[-0.01em]">Vous préférez discuter ?</h2>
            <p className="m-0 text-[15.5px] leading-[1.55]">
              Décrivez votre projet directement sur WhatsApp, en texte ou en message vocal.
            </p>
            <a
              href={wa}
              className="flex min-h-[52px] items-center justify-center gap-2.5 rounded-full bg-night text-[15px] font-semibold text-ivory"
            >
              <WhatsAppIcon size={20} color="#F6F3EC" />
              Écrire sur WhatsApp
            </a>
          </div>
          <div className="rounded-3xl border border-ivory/8 px-6 py-[26px]">
            <span className="vl-eyebrow">Ensuite</span>
            <ol className="mt-4 mb-0 flex list-none flex-col gap-3 p-0 text-[15px] leading-normal text-muted">
              <li className="flex gap-3"><span className="font-mono text-saffron">01</span>Je lis votre brief.</li>
              <li className="flex gap-3"><span className="font-mono text-saffron">02</span>Je vous recontacte sous {delaiReponse}.</li>
              <li className="flex gap-3"><span className="font-mono text-saffron">03</span>Vous recevez un devis clair.</li>
            </ol>
          </div>
        </aside>
      </div>
    </section>
  );
}
