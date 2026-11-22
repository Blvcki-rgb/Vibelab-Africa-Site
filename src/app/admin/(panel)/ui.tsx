import Link from "next/link";

/** Petits composants partagés de l'espace admin. */

export function PageHead({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="m-0 text-[clamp(28px,4vw,38px)] font-semibold tracking-[-0.025em]">{title}</h1>
        {sub && <p className="mt-2 mb-0 text-[15px] text-muted">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Badge({ label, cls }: { label: string; cls: string }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold whitespace-nowrap ${cls}`}>{label}</span>;
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <div className="rounded-3xl border border-dashed border-ivory/14 px-6 py-12 text-center text-[15px] text-muted">{children}</div>;
}

export function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="vl-btn vl-btn-primary min-h-11 px-5 text-sm">
      {children}
    </Link>
  );
}

export const fieldCls =
  "w-full rounded-[12px] border border-ivory/14 bg-night px-3.5 py-3 text-[15px] text-ivory placeholder:text-placeholder";
export const labelCls = "flex flex-col gap-1.5 text-sm text-muted";

export function Saved({ show, children = "Modifications enregistrées. Le site est à jour." }: { show: boolean; children?: React.ReactNode }) {
  if (!show) return null;
  return (
    <p role="status" className="mb-5 rounded-xl bg-teal/15 px-4 py-3 text-[15px] text-ivory">
      {children}
    </p>
  );
}

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="font-mono text-xs text-muted hover:text-ivory">
      ← {children}
    </Link>
  );
}

export function SubmitButton({ children = "Enregistrer" }: { children?: React.ReactNode }) {
  return (
    <button type="submit" className="vl-btn vl-btn-primary min-h-12 cursor-pointer self-start border-0 px-6 text-[15px]">
      {children}
    </button>
  );
}

export const sectionCls = "vl-card flex flex-col gap-5 rounded-3xl p-6 md:p-8";
export const gridCls = "grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]";
