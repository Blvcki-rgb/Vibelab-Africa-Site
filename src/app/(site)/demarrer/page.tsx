import type { Metadata } from "next";
import { Suspense } from "react";
import { BriefForm } from "./BriefForm";

export const metadata: Metadata = {
  title: "Démarrer un projet",
  description: "Décrivez votre projet en 5 étapes courtes, environ 3 minutes. Vous recevez ensuite un devis clair.",
};

export default function DemarrerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <BriefForm />
    </Suspense>
  );
}
