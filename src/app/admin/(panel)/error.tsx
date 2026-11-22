"use client";

/** Erreur dans l'espace admin (ex. image refusée, champ manquant). */
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="vl-card max-w-[560px] rounded-3xl p-7">
      <h1 className="m-0 text-2xl font-semibold">Quelque chose n&apos;a pas fonctionné</h1>
      <p className="mt-3 mb-0 text-[15px] text-muted">
        {process.env.NODE_ENV === "development"
          ? error.message
          : "L'enregistrement a échoué. Vérifiez les champs (image de 3,8 Mo maximum, nom obligatoire) puis réessayez."}
      </p>
      <div className="mt-6 flex gap-3">
        <button type="button" onClick={reset} className="vl-btn vl-btn-primary min-h-11 cursor-pointer border-0 px-5 text-sm">
          Réessayer
        </button>
        <button type="button" onClick={() => history.back()} className="vl-btn vl-btn-ghost min-h-11 cursor-pointer bg-transparent px-5 text-sm">
          Revenir
        </button>
      </div>
    </div>
  );
}
