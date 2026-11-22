import Link from "next/link";
import { whatsappHref } from "@/lib/site";
import { getBlocks } from "@/lib/content";

/** Bloc CTA safran de fin de page. */
export async function CtaBlock({
  title,
  eyebrow,
  text,
  large = false,
  demarrerHref = "/demarrer",
}: {
  title: string;
  eyebrow?: string;
  text?: string;
  large?: boolean;
  demarrerHref?: string;
}) {
  const { contact } = await getBlocks();
  return (
    <section className="vl-container vl-section">
      <div
        className="relative flex flex-col items-start overflow-hidden bg-saffron text-night"
        style={{
          borderRadius: "clamp(28px,4vw,40px)",
          padding: large
            ? "clamp(44px,7vw,96px) clamp(24px,6vw,80px)"
            : "clamp(40px,6vw,80px) clamp(24px,6vw,72px)",
          gap: large ? 28 : 26,
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(rgba(15,18,32,0.12) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        {eyebrow && (
          <span className="relative font-mono text-xs tracking-[0.2em] text-night">{eyebrow}</span>
        )}
        <h2
          className="relative m-0 max-w-[880px] leading-none font-semibold tracking-[-0.035em]"
          style={{ fontSize: large ? "clamp(38px,6vw,76px)" : "clamp(34px,5vw,64px)" }}
        >
          {title}
        </h2>
        {text && <p className="relative m-0 max-w-[560px] text-lg leading-[1.55]">{text}</p>}
        <div className="relative flex flex-wrap gap-3">
          <Link
            href={demarrerHref}
            className="vl-btn min-h-14 bg-night px-7 text-base text-ivory hover:-translate-y-0.5"
          >
            Démarrer un projet <span aria-hidden="true">→</span>
          </Link>
          <a
            href={whatsappHref(contact.whatsappNumber, contact.whatsappMessage)}
            className="vl-btn min-h-14 border-[1.5px] border-night px-7 text-base text-night hover:bg-night/8"
          >
            Écrire sur WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
