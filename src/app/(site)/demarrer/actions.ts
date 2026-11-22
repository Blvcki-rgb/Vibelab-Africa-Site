"use server";

import { headers } from "next/headers";
import { getDb } from "@/db";
import { briefs } from "@/db/schema";
import { BUDGETS, CHOICE_GROUPS, DELAIS, PROJECT_TYPES, checkStep, type BriefForm } from "@/lib/brief";
import { formatNumber } from "@/lib/prices";

export type SendResult = { ok: true } | { ok: false; error: string };

const MAX = 2000; // longueur max d'un champ texte

// Limitation simple par IP (mémoire de l'instance) : 5 envois / 10 minutes.
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  return list.length > LIMIT;
}

const str = (v: unknown) => (typeof v === "string" ? v.trim().slice(0, MAX) : "");
const pick = (v: unknown, allowed: readonly string[]) =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && allowed.includes(x)) : [];

/** Nettoie les données reçues : le client n'est jamais digne de confiance. */
function sanitize(raw: unknown): BriefForm {
  const r = (raw ?? {}) as Record<string, unknown>;
  const groups = Object.fromEntries(CHOICE_GROUPS.map((g) => [g.key, g.items as readonly string[]]));
  const type = str(r.type);
  const budget = str(r.budget);
  const delai = str(r.delai);
  return {
    nom: str(r.nom).slice(0, 120),
    tel: str(r.tel).slice(0, 40),
    email: str(r.email).slice(0, 160),
    activite: str(r.activite).slice(0, 160),
    type: PROJECT_TYPES.some((t) => t.label === type) ? type : "",
    objectif: str(r.objectif),
    cible: str(r.cible),
    pages: pick(r.pages, groups.pages),
    fonct: pick(r.fonct, groups.fonct),
    style: pick(r.style, groups.style),
    refs: str(r.refs),
    budget: BUDGETS.some((b) => b.id === budget) ? budget : "",
    delai: DELAIS.includes(delai) ? delai : "",
  };
}

function budgetLabel(id: string): string {
  const b = BUDGETS.find((x) => x.id === id);
  if (!b) return "—";
  if (b.label) return b.label;
  if (b.max) return `${formatNumber(b.min!)} – ${formatNumber(b.max)} MAD`;
  return `+ de ${formatNumber(b.min!)} MAD`;
}

/** Reçoit le brief du formulaire /demarrer et l'enregistre dans la boîte de réception de l'admin. */
export async function sendBrief(raw: unknown, honeypot: string): Promise<SendResult> {
  // Champ piège rempli = robot : on fait semblant que tout va bien.
  if (honeypot) return { ok: true };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) {
    return { ok: false, error: "Trop de demandes envoyées. Réessayez dans quelques minutes ou écrivez-moi sur WhatsApp." };
  }

  const f = sanitize(raw);
  const err = checkStep(1, f) || checkStep(2, f);
  if (err) return { ok: false, error: err };

  try {
    await getDb()
      .insert(briefs)
      .values({ ...f, budget: f.budget ? budgetLabel(f.budget) : "" });
  } catch (e) {
    console.error("[brief] échec de l'enregistrement :", e);
    return { ok: false, error: "L'envoi a échoué. Réessayez ou écrivez-moi sur WhatsApp." };
  }
  return { ok: true };
}
