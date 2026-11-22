import type { ShowcaseProject } from "@/db/schema";
import { ImageField } from "../widgets";
import { SubmitButton, fieldCls, gridCls, labelCls, sectionCls } from "../../ui";

/** Formulaire réalisation (création et modification). */
export function ShowcaseForm({
  action,
  p,
  submitLabel,
}: {
  action: (fd: FormData) => Promise<void>;
  p?: ShowcaseProject;
  submitLabel: string;
}) {
  const area = `${fieldCls} resize-y leading-normal`;
  return (
    <form action={action} className="flex flex-col gap-6">
      {p && <input type="hidden" name="id" value={p.id} />}

      <section className={sectionCls}>
        <h2 className="m-0 text-lg font-semibold">Carte du projet</h2>
        <div className={gridCls}>
          <label className={labelCls}>
            Nom du projet *
            <input name="name" required defaultValue={p?.name} placeholder="Ex. Maison Ambre" className={fieldCls} />
          </label>
          <label className={labelCls}>
            Lien du site en ligne
            <input name="href" type="url" defaultValue={p?.href} placeholder="https://…" className={fieldCls} />
          </label>
          <label className={labelCls}>
            Ordre d&apos;affichage
            <input name="position" type="number" min={0} defaultValue={p?.position ?? 0} className={fieldCls} />
            <span className="font-mono text-xs">0 = en premier.</span>
          </label>
        </div>
        <label className={labelCls}>
          Étiquettes (une par ligne, ex. E-commerce)
          <textarea name="tags" rows={2} defaultValue={p?.tags.join("\n")} className={area} />
        </label>
        <label className={labelCls}>
          Description courte (cartes accueil et Réalisations)
          <textarea name="text" rows={2} defaultValue={p?.text} className={area} />
        </label>
        <ImageField
          name="img"
          current={p?.img}
          label="Capture d'écran du site"
          hint="Capture de la page d'accueil, largeur conseillée 1600 px ou plus. Elle n'est pas recadrée."
        />
        <label className={labelCls}>
          Description de la capture (pour les malvoyants et Google)
          <input name="alt" defaultValue={p?.alt} placeholder="Page d'accueil de la boutique …" className={fieldCls} />
        </label>
        <label className="flex items-center gap-2.5 text-[15px]">
          <input type="checkbox" name="published" defaultChecked={p?.published ?? true} className="size-5 accent-[#E89B2C]" />
          Afficher ce projet sur le site
        </label>
      </section>

      <section className={sectionCls}>
        <h2 className="m-0 text-lg font-semibold">Étude de cas</h2>
        <div className={gridCls}>
          <label className={labelCls}>
            Titre de l&apos;étude de cas
            <input name="caseName" defaultValue={p?.caseName} placeholder="Par défaut : le nom du projet" className={fieldCls} />
          </label>
          <label className={labelCls}>
            Adresse de la page
            <input name="slug" defaultValue={p?.slug} placeholder="Générée depuis le nom" className={fieldCls} />
            <span className="font-mono text-xs">/realisations/{p?.slug ?? "…"}</span>
          </label>
          <label className={labelCls}>
            Délai de réalisation
            <input name="delai" defaultValue={p?.delai} placeholder="Ex. 10 jours" className={fieldCls} />
          </label>
        </div>
        <label className={labelCls}>
          Introduction
          <textarea name="intro" rows={3} defaultValue={p?.intro} className={area} />
        </label>
        <label className={labelCls}>
          Le contexte (situation du client avant le projet)
          <textarea name="contexte" rows={4} defaultValue={p?.contexte} className={area} />
        </label>
        <label className={labelCls}>
          Ce qui a été livré (un élément par ligne)
          <textarea name="features" rows={5} defaultValue={p?.features.join("\n")} className={area} />
        </label>
        <label className={labelCls}>
          Résultats
          <textarea name="resultats" rows={3} defaultValue={p?.resultats} className={area} />
        </label>
        <div className={gridCls}>
          <label className={`${labelCls} md:col-span-2`}>
            Témoignage du client (facultatif)
            <textarea name="temoignage" rows={3} defaultValue={p?.temoignage} className={area} />
          </label>
          <label className={labelCls}>
            Auteur du témoignage
            <input name="temoignageAuteur" defaultValue={p?.temoignageAuteur} placeholder="Prénom · Ville" className={fieldCls} />
          </label>
        </div>
      </section>

      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
