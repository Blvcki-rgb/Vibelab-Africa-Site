"use client";

import { useState } from "react";
import { fieldCls } from "../ui";

/** Champ image : aperçu immédiat + dimensions envoyées avec le formulaire. */
export function ImageField({
  name,
  current,
  label,
  hint,
  ratio = "aspect-[2/1]",
}: {
  name: string;
  current?: string;
  label: string;
  hint?: string;
  ratio?: string;
}) {
  const [preview, setPreview] = useState(current ?? "");
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const [err, setErr] = useState("");

  return (
    <div className="flex flex-col gap-2 text-sm text-muted">
      <span>{label}</span>
      <div className={`relative w-full max-w-[520px] overflow-hidden rounded-xl border border-ivory/14 bg-night ${ratio}`}>
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- aperçu local (blob:) avant envoi
          <img src={preview} alt="" className="absolute inset-0 size-full object-contain" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center font-mono text-xs">Aucune image</span>
        )}
      </div>
      <input
        type="file"
        name={name}
        accept="image/png,image/jpeg,image/webp,image/avif"
        className="text-sm file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-ivory/10 file:px-4 file:py-2 file:text-ivory"
        onChange={(e) => {
          setErr("");
          const f = e.target.files?.[0];
          if (!f) return;
          if (f.size > 3.8 * 1024 * 1024) {
            setErr("Image trop lourde (3,8 Mo maximum). Compressez-la avant de l'envoyer.");
            e.target.value = "";
            return;
          }
          const url = URL.createObjectURL(f);
          setPreview(url);
          const img = new Image();
          img.onload = () => setDims({ w: img.naturalWidth, h: img.naturalHeight });
          img.src = url;
        }}
      />
      {dims && (
        <>
          <input type="hidden" name="imgWidth" value={dims.w} />
          <input type="hidden" name="imgHeight" value={dims.h} />
        </>
      )}
      {hint && <span className="font-mono text-xs">{hint}</span>}
      {err && (
        <span role="alert" className="text-saffron">
          {err}
        </span>
      )}
    </div>
  );
}

type Faq = { q: string; a: string };

/** Éditeur de FAQ : ajouter, modifier, réordonner, supprimer des questions. */
export function FaqEditor({ initial }: { initial: Faq[] }) {
  const [items, setItems] = useState<Faq[]>(initial);
  const update = (i: number, patch: Partial<Faq>) => setItems((xs) => xs.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const move = (i: number, d: -1 | 1) =>
    setItems((xs) => {
      const j = i + d;
      if (j < 0 || j >= xs.length) return xs;
      const c = [...xs];
      [c[i], c[j]] = [c[j], c[i]];
      return c;
    });
  const small = "cursor-pointer rounded-lg border border-ivory/14 bg-transparent px-2.5 py-1.5 text-xs text-muted hover:text-ivory disabled:opacity-30";

  return (
    <div className="flex flex-col gap-4">
      <input type="hidden" name="items" value={JSON.stringify(items)} />
      {items.map((it, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-2xl border border-ivory/10 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs text-saffron">Question {i + 1}</span>
            <span className="flex gap-1.5">
              <button type="button" className={small} onClick={() => move(i, -1)} disabled={i === 0} aria-label="Monter">
                ↑
              </button>
              <button type="button" className={small} onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Descendre">
                ↓
              </button>
              <button type="button" className={small} onClick={() => setItems((xs) => xs.filter((_, j) => j !== i))}>
                Supprimer
              </button>
            </span>
          </div>
          <input aria-label={`Question ${i + 1}`} value={it.q} onChange={(e) => update(i, { q: e.target.value })} className={fieldCls} placeholder="La question" />
          <textarea
            aria-label={`Réponse ${i + 1}`}
            value={it.a}
            onChange={(e) => update(i, { a: e.target.value })}
            rows={3}
            className={`${fieldCls} resize-y leading-normal`}
            placeholder="La réponse"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => setItems((xs) => [...xs, { q: "", a: "" }])}
        className="cursor-pointer self-start rounded-full border border-dashed border-ivory/25 bg-transparent px-4 py-2 text-sm text-muted hover:text-ivory"
      >
        + Ajouter une question
      </button>
    </div>
  );
}

/** Bouton de suppression avec confirmation. */
export function ConfirmDelete({
  action,
  id,
  label = "Supprimer",
  message,
}: {
  action: (fd: FormData) => Promise<void>;
  id: number;
  label?: string;
  message: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="cursor-pointer border-0 bg-transparent p-0 text-sm text-muted underline hover:text-saffron">
        {label}
      </button>
    </form>
  );
}
