"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { briefs, clientProjects } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { PROJECT_STATUS_KEYS, type ProjectStatusKey } from "@/lib/admin";

const id = (v: FormDataEntryValue | null) => {
  const n = Number(v);
  if (!Number.isInteger(n) || n <= 0) throw new Error("Identifiant invalide");
  return n;
};
const txt = (v: FormDataEntryValue | null, max = 4000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/* ───────── Messages ───────── */

export async function setBriefStatus(formData: FormData) {
  await requireAdmin();
  const status = txt(formData.get("status"));
  if (!["nouveau", "lu", "archive"].includes(status)) throw new Error("Statut invalide");
  await getDb()
    .update(briefs)
    .set({ status: status as "nouveau" | "lu" | "archive" })
    .where(eq(briefs.id, id(formData.get("id"))));
  revalidatePath("/admin", "layout");
}

/** Transforme un brief en projet client (pré-rempli) et ouvre sa fiche. */
export async function createProjectFromBrief(formData: FormData) {
  await requireAdmin();
  const db = getDb();
  const briefId = id(formData.get("id"));
  const [b] = await db.select().from(briefs).where(eq(briefs.id, briefId));
  if (!b) throw new Error("Brief introuvable");

  const [p] = await db
    .insert(clientProjects)
    .values({
      briefId,
      client: b.activite ? `${b.nom} — ${b.activite}` : b.nom,
      contact: [b.tel, b.email].filter(Boolean).join(" · "),
      titre: b.type,
      type: b.type,
      notes: [b.objectif && `Objectif : ${b.objectif}`, b.budget && `Budget annoncé : ${b.budget}`, b.delai && `Délai : ${b.delai}`]
        .filter(Boolean)
        .join("\n"),
    })
    .returning({ id: clientProjects.id });
  if (b.status === "nouveau") await db.update(briefs).set({ status: "lu" }).where(eq(briefs.id, briefId));
  revalidatePath("/admin", "layout");
  redirect(`/admin/projets/${p.id}`);
}

/* ───────── Projets clients ───────── */

function projectFields(formData: FormData) {
  const status = txt(formData.get("status")) as ProjectStatusKey;
  const montantRaw = txt(formData.get("montant")).replace(/[\s ]/g, "");
  const montant = montantRaw === "" ? null : Number(montantRaw);
  const echeance = txt(formData.get("echeance"));
  const client = txt(formData.get("client"), 200);
  const titre = txt(formData.get("titre"), 200);
  if (!client || !titre) throw new Error("Client et titre obligatoires");
  if (montant !== null && (!Number.isInteger(montant) || montant < 0)) throw new Error("Montant invalide");
  return {
    client,
    titre,
    contact: txt(formData.get("contact"), 300),
    type: txt(formData.get("type"), 100),
    status: PROJECT_STATUS_KEYS.includes(status) ? status : "nouveau",
    montant,
    acomptePaye: formData.get("acomptePaye") === "on",
    soldePaye: formData.get("soldePaye") === "on",
    echeance: /^\d{4}-\d{2}-\d{2}$/.test(echeance) ? echeance : null,
    lienSite: txt(formData.get("lienSite"), 500),
    notes: txt(formData.get("notes"), 8000),
  };
}

export async function createProject(formData: FormData) {
  await requireAdmin();
  const [p] = await getDb().insert(clientProjects).values(projectFields(formData)).returning({ id: clientProjects.id });
  revalidatePath("/admin", "layout");
  redirect(`/admin/projets/${p.id}?ok=1`);
}

export async function updateProject(formData: FormData) {
  await requireAdmin();
  const projectId = id(formData.get("id"));
  await getDb().update(clientProjects).set(projectFields(formData)).where(eq(clientProjects.id, projectId));
  revalidatePath("/admin", "layout");
  redirect(`/admin/projets/${projectId}?ok=1`);
}

export async function deleteProject(formData: FormData) {
  await requireAdmin();
  await getDb().delete(clientProjects).where(eq(clientProjects.id, id(formData.get("id"))));
  revalidatePath("/admin", "layout");
  redirect("/admin/projets");
}
