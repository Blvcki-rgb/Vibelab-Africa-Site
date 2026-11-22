import Image from "next/image";
import Link from "next/link";
import type { ShowcaseProject } from "@/db/schema";

export function BrowserMockup({
  url,
  img,
  alt,
  width = 1820,
  height = 897,
  eager = false,
  large = false,
}: {
  url: string;
  img: string;
  alt: string;
  width?: number;
  height?: number;
  eager?: boolean;
  /** Variante grande (étude de cas) */
  large?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden border border-ivory/10 ${
        large ? "rounded-[22px] bg-card shadow-[0_30px_80px_rgba(0,0,0,0.4)]" : "rounded-2xl bg-night"
      }`}
    >
      <div className={`flex items-center border-b border-ivory/7 ${large ? "gap-[7px] px-4 py-3" : "gap-1.5 px-3 py-2.5"}`}>
        {[0, 1, 2].map((i) => (
          <span key={i} className={`rounded-full bg-ivory/18 ${large ? "size-2.5" : "size-2"}`} />
        ))}
        <span
          className={`flex-1 truncate rounded-full bg-ivory/6 font-mono text-muted ${
            large ? "ml-3 max-w-[420px] px-3 py-[5px] text-[11.5px]" : "ml-2.5 px-2.5 py-1 text-[10.5px]"
          }`}
        >
          {url}
        </span>
      </div>
      {/* Capture non recadrée (demande client) */}
      <Image
        src={img}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
        sizes={large ? "(max-width: 1240px) 100vw, 1200px" : "(max-width: 900px) 100vw, 600px"}
        className="block h-auto w-full"
      />
    </div>
  );
}

/**
 * Carte projet. `variant="home"` : « Voir le site » en premier, étude de cas en lien discret.
 * `variant="list"` : CTA safran « Étude de cas » en premier.
 */
export function ProjectCard({
  p,
  variant = "home",
  headingLevel = 3,
  priority = false,
}: {
  p: ShowcaseProject;
  variant?: "home" | "list";
  headingLevel?: 2 | 3;
  /** Charge la capture en priorité (premier élément visible) */
  priority?: boolean;
}) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const caseHref = `/realisations/${p.slug}`;
  return (
    <article
      className="vl-card grid items-center rounded-[28px] grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))]"
      style={{ gap: "clamp(24px,4vw,48px)", padding: "clamp(16px,2.4vw,28px)" }}
    >
      {p.img && (
        <BrowserMockup url={p.url} img={p.img} alt={p.alt} width={p.imgWidth} height={p.imgHeight} eager={priority} />
      )}
      <div className="flex flex-col items-start gap-[18px]" style={{ padding: "clamp(4px,1vw,12px)" }}>
        <div className="flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-teal/40 px-3 py-1.5 font-mono text-[11.5px] text-teal"
            >
              {t}
            </span>
          ))}
        </div>
        <H
          className="m-0 leading-[1.1] font-semibold tracking-[-0.02em]"
          style={{ fontSize: "clamp(26px,3vw,36px)" }}
        >
          {p.name}
        </H>
        <p className="m-0 max-w-[460px] text-base leading-relaxed text-muted">{p.text}</p>
        <div className="flex flex-wrap gap-2.5">
          {variant === "list" && (
            <Link href={caseHref} className="vl-btn vl-btn-primary min-h-12 px-5 text-[15px]">
              Étude de cas →
            </Link>
          )}
          {p.href && (
          <a
            href={p.href}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-12 items-center gap-2 rounded-full border border-ivory/20 px-5 text-[15px] font-medium transition-colors hover:border-saffron hover:text-saffron"
          >
            Voir le site ↗
          </a>
          )}
          {variant === "home" && (
            <Link
              href={caseHref}
              className="inline-flex min-h-12 items-center px-2 text-[15px] text-muted transition-colors hover:text-ivory"
            >
              Étude de cas →
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
