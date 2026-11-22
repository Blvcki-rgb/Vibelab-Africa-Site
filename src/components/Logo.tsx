"use client";

import { useEffect, useId, useState } from "react";

/** Logo « La Fiole » : V ivoire, liquide safran, bulles teal. */
export function LogoMark({ size = 34, animate = false }: { size?: number; animate?: boolean }) {
  const id = useId().replace(/:/g, "");
  const [filled, setFilled] = useState(!animate);

  useEffect(() => {
    if (!animate) return;
    const t = setTimeout(() => setFilled(true), 200);
    return () => clearTimeout(t);
  }, [animate]);

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <clipPath id={`vl-clip-${id}`}>
          <rect className="vl-logo-fill" x="0" y={filled ? 19 : 36} width="40" height="40" />
        </clipPath>
      </defs>
      <path d="M13.5 21 L20 34 L26.5 21 Z" fill="#E89B2C" clipPath={`url(#vl-clip-${id})`} />
      <path
        d="M6 6 L20 34 L34 6"
        fill="none"
        stroke="#F6F3EC"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="16" r="1.8" fill="#1FB5A3" />
      <circle cx="17.6" cy="11" r="1.3" fill="#1FB5A3" />
      <circle cx="21.6" cy="6.6" r="1" fill="#1FB5A3" />
    </svg>
  );
}

export function LogoWordmark({ large = false }: { large?: boolean }) {
  return (
    <span className="flex flex-col leading-none">
      <span
        className="font-semibold tracking-[-0.02em] text-ivory"
        style={{ fontSize: large ? 26 : 22 }}
      >
        Lab
      </span>
      <span
        className="font-mono tracking-[0.28em] text-muted"
        style={{ fontSize: large ? 9 : 8.5, marginTop: large ? 5 : 4 }}
      >
        VIBELAB AFRICA
      </span>
    </span>
  );
}
