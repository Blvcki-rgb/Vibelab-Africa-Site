import Link from "next/link";
import { LogoMark, LogoWordmark } from "./Logo";
import { getBlocks } from "@/lib/content";
import { instagramHref, whatsappHref } from "@/lib/site";

const linkCls = "flex min-h-10 items-center text-[15px] text-ivory transition-colors hover:text-saffron";

function formatPhone(n: string) {
  const d = n.replace(/[^\d]/g, "");
  return d ? `+${d}` : "";
}

export async function Footer() {
  const { contact } = await getBlocks();
  return (
    <footer
      className="mx-auto max-w-[1200px] text-ivory"
      style={{ padding: "clamp(72px,8vw,104px) clamp(20px,4vw,40px) 110px" }}
    >
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-10 border-b border-ivory/10 pb-11">
        <div className="flex flex-col gap-[18px]">
          <Link href="/" aria-label="VibeLab Africa — accueil" className="flex items-center gap-2.5">
            <LogoMark size={40} />
            <LogoWordmark large />
          </Link>
          <p className="m-0 text-base leading-normal text-muted">
            Votre business en ligne, propulsé par l&apos;IA.
          </p>
          <span className="font-mono text-[11.5px] tracking-[0.24em] text-teal">CASABLANCA · DAKAR</span>
        </div>
        <nav aria-label="Pied de page" className="flex flex-col gap-0.5">
          <span className="mb-2 font-mono text-[11px] tracking-[0.2em] text-muted">PAGES</span>
          <Link href="/services" className={linkCls}>Services</Link>
          <Link href="/realisations" className={linkCls}>Réalisations</Link>
          <Link href="/tarifs" className={linkCls}>Tarifs</Link>
          <Link href="/a-propos" className={linkCls}>À propos</Link>
          <Link href="/demarrer" className={linkCls}>Démarrer un projet</Link>
        </nav>
        <div className="flex flex-col gap-0.5">
          <span className="mb-2 font-mono text-[11px] tracking-[0.2em] text-muted">CONTACT</span>
          <a href={whatsappHref(contact.whatsappNumber, contact.whatsappMessage)} className={linkCls}>
            WhatsApp : {formatPhone(contact.whatsappNumber) || "[NUMÉRO À REMPLACER]"}
          </a>
          <a href={contact.email ? `mailto:${contact.email}` : "#email"} className={linkCls}>
            {contact.email || "[EMAIL À REMPLACER]"}
          </a>
          <a href={instagramHref(contact.instagram)} target={contact.instagram ? "_blank" : undefined} rel="noopener" className={linkCls}>
            Instagram : {contact.instagram || "[À REMPLACER]"}
          </a>
        </div>
      </div>
      <div className="flex flex-wrap justify-between gap-3 pt-6 font-mono text-xs text-muted">
        <span>VibeLab Africa, une marque de Global Trading Africa</span>
        <Link href="/mentions-legales" className="min-h-6 text-muted hover:text-ivory">
          Mentions légales
        </Link>
      </div>
    </footer>
  );
}
