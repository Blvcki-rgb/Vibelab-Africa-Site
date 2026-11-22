"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const inputCls =
  "min-h-[52px] w-full rounded-[14px] border border-ivory/14 bg-night px-4 text-base text-ivory placeholder:text-placeholder";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setPending(true);
    const { error } = await authClient.signIn.email({ email, password });
    setPending(false);
    if (error) {
      setErr(error.status === 429 ? "Trop de tentatives. Réessayez dans une minute." : "E-mail ou mot de passe incorrect.");
      return;
    }
    router.replace("/admin");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2 text-[15px] text-muted">
        E-mail
        <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
      </label>
      <label className="flex flex-col gap-2 text-[15px] text-muted">
        Mot de passe
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputCls}
        />
      </label>
      {err && (
        <p role="alert" className="m-0 rounded-xl bg-saffron/12 px-4 py-3 text-[15px] text-ivory">
          {err}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="vl-btn vl-btn-primary mt-2 min-h-[52px] cursor-pointer border-0 text-base disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
