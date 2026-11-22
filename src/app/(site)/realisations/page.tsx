import type { Metadata } from "next";
import { ProjectCard } from "@/components/ProjectCard";
import { CtaBlock } from "@/components/CtaBlock";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Réalisations",
  description:
    "Boutiques, dashboards et sites vitrines conçus et codés avec l'aide de l'IA, puis mis en ligne pour de vrais clients.",
};

export default async function RealisationsPage() {
  const projects = await getProjects();
  return (
    <>
      <section className="vl-container vl-page-top">
        <span className="vl-eyebrow">Réalisations</span>
        <h1 className="vl-h1 mt-4 mb-0 max-w-[900px]">Déjà en ligne</h1>
        <p className="vl-intro mt-[22px] mb-0 max-w-[620px]">
          Des boutiques, des dashboards et des sites vitrines conçus et codés par moi avec l&apos;aide de
          l&apos;IA, puis mis en ligne pour de vrais clients.
        </p>
      </section>

      <section className="vl-container flex flex-col gap-5 pt-14">
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} p={p} variant="list" headingLevel={2} priority={i === 0} />
        ))}
      </section>

      <CtaBlock title="Le prochain projet en ligne, c'est le vôtre ?" />
    </>
  );
}
