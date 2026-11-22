import type { ClientProject } from "@/db/schema";
import { PROJECT_STATUS, PROJECT_STATUS_KEYS } from "@/lib/admin";
import { PROJECT_TYPES } from "@/lib/brief";
import { fieldCls, labelCls } from "../ui";

/** Formulaire projet client (création et modification). */
export function ProjectForm({
  action,
  p,
  submitLabel,
}: {
  action: (fd: FormData) => Promise<void>;
  p?: ClientProject;
  submitLabel: string;
}) {
  return (
    <form action={action} className="vl-card flex flex-col gap-5 rounded-3xl p-6 md:p-8">
      {p && <input type="hidden" name="id" value={p.id} />}
      <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))]">
        <label className={labelCls}>
          Titre du projet *
          <input name="titre" required defaultValue={p?.titre} placeholder="Ex. Boutique Maison Ambre" className={fieldCls} />
        </label>
        <label className={labelCls}>
          Client *
          <input name="client" required defaultValue={p?.client} placeholder="Nom — activité" className={fieldCls} />
        </label>
        <label className={labelCls}>
          Contact
          <input name="contact" defaultValue={p?.contact} placeholder="Téléphone, e-mail" className={fieldCls} />
        </label>
        <label className={labelCls}>
          Type
          <select name="type" defaultValue={p?.type ?? ""} className={fieldCls}>
            <option value="">—</option>
            {PROJECT_TYPES.map((t) => (
              <option key={t.label} value={t.label}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className={labelCls}>
          Statut
          <select name="status" defaultValue={p?.status ?? "nouveau"} className={fieldCls}>
            {PROJECT_STATUS_KEYS.map((k) => (
              <option key={k} value={k}>
                {PROJECT_STATUS[k].label}
              </option>
            ))}
          </select>
        </label>
        <label className={labelCls}>
          Montant du devis (MAD)
          <input name="montant" inputMode="numeric" pattern="[0-9 ]*" defaultValue={p?.montant ?? ""} placeholder="Ex. 4500" className={fieldCls} />
        </label>
        <label className={labelCls}>
          Échéance
          <input type="date" name="echeance" defaultValue={p?.echeance ?? ""} className={fieldCls} />
        </label>
        <label className={labelCls}>
          Lien du site (une fois en ligne)
          <input name="lienSite" type="url" defaultValue={p?.lienSite} placeholder="https://…" className={fieldCls} />
        </label>
      </div>

      <fieldset className="m-0 flex flex-wrap gap-x-8 gap-y-3 border-0 p-0">
        <legend className="mb-2 p-0 text-sm text-muted">Paiements</legend>
        <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-[15px]">
          <input type="checkbox" name="acomptePaye" defaultChecked={p?.acomptePaye} className="size-5 accent-[#E89B2C]" />
          Acompte (50 %) reçu
        </label>
        <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-[15px]">
          <input type="checkbox" name="soldePaye" defaultChecked={p?.soldePaye} className="size-5 accent-[#E89B2C]" />
          Solde (50 %) reçu
        </label>
      </fieldset>

      <label className={labelCls}>
        Notes
        <textarea name="notes" rows={6} defaultValue={p?.notes} placeholder="Échanges, demandes, prochaines étapes…" className={`${fieldCls} resize-y leading-normal`} />
      </label>

      <div>
        <button type="submit" className="vl-btn vl-btn-primary min-h-12 cursor-pointer border-0 px-6 text-[15px]">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
