import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { PageHead } from "../ui";

export const metadata: Metadata = { title: "Contenus du site" };

const SECTIONS = [
  { href: "/admin/contenus/general", title: "Coordonnées et textes clés", text: "WhatsApp, e-mail, Instagram, délai de réponse, prix de la maintenance, source des comparaisons." },
  { href: "/admin/contenus/offres", title: "Prix et offres", text: "Les 3 formules et les 6 pages d'offre : prix, textes, « pour qui », « ce qui est inclus »." },
  { href: "/admin/contenus/realisations", title: "Réalisations", text: "Ajouter un projet, changer une capture, compléter une étude de cas." },
  { href: "/admin/contenus/temoignages", title: "Témoignages", text: "Les avis clients affichés sur l'accueil." },
  { href: "/admin/contenus/a-propos", title: "À propos", text: "Votre nom, votre parcours et votre photo." },
  { href: "/admin/contenus/faq", title: "Questions fréquentes", text: "La FAQ de l'accueil et celle de la page Tarifs." },
  { href: "/admin/contenus/mentions-legales", title: "Mentions légales", text: "Forme juridique, siège, RC, ICE, hébergeur, conservation des données, cookies." },
];

export default async function ContenusPage() {
  await requireAdmin();
  return (
    <>
      <PageHead title="Contenus du site" sub="Chaque modification est visible sur le site dès l'enregistrement." />
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))]">
        {SECTIONS.map((s) => (
          <Link key={s.href} href={s.href} className="vl-card flex flex-col gap-2 rounded-3xl p-6 transition-colors hover:border-saffron">
            <span className="text-lg font-semibold">{s.title}</span>
            <span className="text-sm leading-relaxed text-muted">{s.text}</span>
            <span className="mt-2 text-sm text-saffron">Modifier →</span>
          </Link>
        ))}
      </div>
    </>
  );
}
