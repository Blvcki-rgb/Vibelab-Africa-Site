"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoMark, LogoWordmark } from "./Logo";
import { useCurrency } from "./CurrencyProvider";
import { NAV_LINKS, whatsappHref } from "@/lib/site";
import { useContent } from "./ContentProvider";
import type { Currency } from "@/lib/prices";

function CurrencySwitch() {
  const { currency, setCurrency } = useCurrency();
  const btn = (c: Currency, label: string) => {
    const active = currency === c;
    return (
      <button
        type="button"
        onClick={() => setCurrency(c)}
        aria-pressed={active}
        className={`min-h-10 min-w-[50px] cursor-pointer rounded-full border-0 px-2.5 font-mono text-xs font-semibold ${
          active ? "bg-ivory text-night" : "bg-transparent text-muted"
        }`}
      >
        {label}
      </button>
    );
  };
  return (
    <div
      role="group"
      aria-label="Devise des prix"
      className="flex rounded-full border border-ivory/14 p-0.5"
    >
      {btn("MAD", "MAD")}
      {btn("XOF", "FCFA")}
    </div>
  );
}

export function WhatsAppIcon({ size = 22, color = "#0F1220" }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3.5a8.5 8.5 0 0 0-7.4 12.7L3.5 20.5l4.4-1.1A8.5 8.5 0 1 0 12 3.5Z" />
    </svg>
  );
}

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { contact } = useContent();
  const wa = whatsappHref(contact.whatsappNumber, contact.whatsappMessage);

  // Bloque le scroll quand le menu est ouvert ; Échap le ferme
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-3.5 z-50 flex justify-center px-3.5">
        <nav
          aria-label="Navigation principale"
          className="flex w-full max-w-[1160px] items-center justify-between gap-4 rounded-full border border-ivory/9 py-2 pr-2 pl-[18px] backdrop-blur-[14px]"
          style={{ background: "rgba(23,27,40,0.82)" }}
        >
          <Link
            href="/"
            aria-label="VibeLab Africa — accueil"
            className="flex min-h-11 items-center gap-2.5 text-ivory"
          >
            <LogoMark size={34} animate />
            <LogoWordmark />
          </Link>

          {/* Desktop */}
          <div className="hidden items-center gap-1 nav:flex">
            {NAV_LINKS.map((l) => {
              const active = isActive(pathname, l.href);
              return (
                <Link
                  key={l.key}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-4 py-3 text-[15px] transition-colors hover:bg-ivory/6 hover:text-ivory ${
                    active ? "bg-ivory/8 text-ivory" : "text-muted"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
          <div className="hidden items-center gap-2.5 nav:flex">
            <CurrencySwitch />
            <Link
              href="/demarrer"
              className="vl-btn vl-btn-primary min-h-11 px-[22px] text-[15px] hover:!-translate-y-px"
            >
              Démarrer un projet
            </Link>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-2 nav:hidden">
            <CurrencySwitch />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Ouvrir le menu"
              aria-expanded={open}
              className="flex h-12 w-12 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-full border border-ivory/14 bg-transparent"
            >
              <span className="h-0.5 w-[18px] rounded-sm bg-ivory" />
              <span className="h-0.5 w-[18px] rounded-sm bg-ivory" />
            </button>
          </div>
        </nav>
      </header>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-60 flex flex-col overflow-y-auto bg-night px-6 pt-[22px] pb-8"
          style={{
            backgroundImage: "radial-gradient(rgba(246,243,236,0.055) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] tracking-[0.28em] text-muted">MENU</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu"
              autoFocus
              className="h-12 w-12 cursor-pointer rounded-full border border-ivory/14 bg-transparent text-[22px] text-ivory"
            >
              ×
            </button>
          </div>
          <nav aria-label="Menu mobile" className="mt-10 flex flex-col gap-1">
            {[{ key: "accueil", label: "Accueil", href: "/" }, ...NAV_LINKS].map((l) => {
              const active = l.href === "/" ? pathname === "/" : isActive(pathname, l.href);
              return (
                <Link
                  key={l.key}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`border-b border-ivory/8 py-2.5 text-4xl font-semibold tracking-[-0.02em] ${
                    active ? "text-saffron" : "text-ivory"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto flex flex-col gap-3 pt-8">
            <Link
              href="/demarrer"
              onClick={() => setOpen(false)}
              className="vl-btn vl-btn-primary min-h-14 text-[17px]"
            >
              Démarrer un projet
            </Link>
            <a
              href={wa}
              className="flex min-h-14 items-center justify-center rounded-full border border-ivory/18 text-[17px] font-medium text-ivory"
            >
              Écrire sur WhatsApp
            </a>
            <span className="mt-2.5 text-center font-mono text-[11px] tracking-[0.28em] text-muted">
              CASABLANCA · DAKAR
            </span>
          </div>
        </div>
      )}

      {/* Bouton WhatsApp flottant */}
      <a
        href={wa}
        aria-label="Écrire sur WhatsApp"
        className="fixed right-[18px] bottom-[18px] z-40 flex min-h-14 min-w-14 items-center justify-center gap-2.5 rounded-full bg-teal px-0 text-[15px] font-semibold text-night shadow-[0_14px_40px_rgba(0,0,0,0.4)] transition-transform hover:-translate-y-[3px] nav:px-[22px]"
      >
        <WhatsAppIcon />
        <span className="hidden nav:inline">WhatsApp</span>
      </a>
    </>
  );
}
