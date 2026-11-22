"use client";

import { createContext, useContext } from "react";
import type { PublicContent } from "@/lib/content";

const Ctx = createContext<PublicContent | null>(null);

/** Transmet aux composants client les contenus modifiables (prix, coordonnées). */
export function ContentProvider({ value, children }: { value: PublicContent; children: React.ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useContent(): PublicContent {
  const v = useContext(Ctx);
  if (!v) throw new Error("useContent doit être utilisé sous <ContentProvider>");
  return v;
}
