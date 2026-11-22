import type { Metadata } from "next";
import { LogoMark, LogoWordmark } from "@/components/Logo";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Connexion" };

export default function ConnexionPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="vl-card w-full max-w-[420px] rounded-[28px] p-8">
        <div className="mb-8 flex items-center gap-2.5">
          <LogoMark size={36} />
          <LogoWordmark />
        </div>
        <h1 className="m-0 text-[28px] font-semibold tracking-[-0.02em]">Espace admin</h1>
        <p className="mt-2 mb-7 text-[15px] text-muted">Connectez-vous pour gérer votre site.</p>
        <LoginForm />
      </div>
    </div>
  );
}
