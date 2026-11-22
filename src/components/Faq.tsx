"use client";

import { useState } from "react";

/** Accordéon : une seule question ouverte à la fois. */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState(-1);
  return (
    <div className="flex flex-col border-t border-ivory/10">
      {items.map(({ q, a }, i) => {
        const isOpen = open === i;
        const id = `faq-${i}`;
        return (
          <div key={i} className="border-b border-ivory/10">
            <h3 className="m-0">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                aria-controls={id}
                className="flex min-h-[72px] w-full cursor-pointer items-center justify-between gap-5 border-0 bg-transparent py-[18px] text-left font-medium text-ivory"
                style={{ fontSize: "clamp(17px,2vw,20px)" }}
              >
                {q}
                <span
                  aria-hidden="true"
                  className={`flex size-[34px] flex-none items-center justify-center rounded-full border text-lg text-saffron transition-transform duration-250 ${
                    isOpen ? "rotate-45 border-saffron" : "border-ivory/18"
                  }`}
                >
                  +
                </span>
              </button>
            </h3>
            {isOpen && (
              <p id={id} className="m-0 pr-[50px] pb-6 text-base leading-[1.65] whitespace-pre-line text-muted">
                {a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
