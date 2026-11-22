import Link from "next/link";
import { Suspense } from "react";
import { LogoMark } from "@/components/Logo";
import { AdminNav } from "./AdminNav";
import { SignOutButton } from "./SignOutButton";

// Espace privé, toujours rendu à la demande (session lue à chaque requête) :
// on désactive la validation « navigation instantanée » de Cache Components.
export const instant = false;

/** Coque de l'espace admin : barre latérale (en haut sur mobile) + contenu. */
export default function PanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <aside className="sticky top-0 z-30 flex flex-col gap-4 border-b border-ivory/8 bg-night/95 px-4 py-3 backdrop-blur md:h-screen md:border-r md:border-b-0 md:px-5 md:py-6">
        <div className="flex items-center justify-between gap-3">
          <Link href="/admin" className="flex items-center gap-2.5">
            <LogoMark size={30} />
            <span className="flex flex-col leading-none">
              <span className="text-lg font-semibold">Admin</span>
              <span className="mt-1 font-mono text-[8.5px] tracking-[0.28em] text-muted">VIBELAB AFRICA</span>
            </span>
          </Link>
          <Link href="/" target="_blank" className="font-mono text-xs text-muted hover:text-ivory md:hidden">
            Voir le site ↗
          </Link>
        </div>
        <Suspense fallback={<div className="h-10" />}>
          <AdminNav />
        </Suspense>
        <div className="mt-auto hidden flex-col gap-2 md:flex">
          <Link href="/" target="_blank" className="rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-ivory/6 hover:text-ivory">
            Voir le site ↗
          </Link>
          <SignOutButton />
        </div>
      </aside>
      <main className="min-w-0 px-4 py-8 md:px-10 md:py-10">
        <Suspense fallback={<p className="font-mono text-sm text-muted">Chargement…</p>}>{children}</Suspense>
        <div className="mt-12 md:hidden">
          <SignOutButton />
        </div>
      </main>
    </div>
  );
}
