"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Tableau de bord", exact: true },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/projets", label: "Projets clients" },
  { href: "/admin/contenus", label: "Contenus du site" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Navigation admin" className="-mx-1 flex gap-1 overflow-x-auto md:mx-0 md:flex-col">
      {LINKS.map((l) => {
        const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-xl px-3 py-2.5 text-sm whitespace-nowrap transition-colors ${
              active ? "bg-ivory/10 text-ivory" : "text-muted hover:bg-ivory/6 hover:text-ivory"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
