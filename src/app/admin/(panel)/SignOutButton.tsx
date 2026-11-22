"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await authClient.signOut();
        router.replace("/admin/connexion");
        router.refresh();
      }}
      className="w-full cursor-pointer rounded-xl border border-ivory/14 bg-transparent px-3 py-2.5 text-left text-sm text-muted hover:text-ivory"
    >
      Se déconnecter
    </button>
  );
}
