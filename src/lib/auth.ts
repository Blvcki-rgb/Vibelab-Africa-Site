import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import * as schema from "@/db/schema";

/**
 * Connexion admin (un seul compte). Les inscriptions publiques sont désactivées :
 * le compte admin se crée avec `npm run admin:create`.
 */
export const auth = betterAuth({
  database: drizzleAdapter(getDb(), { provider: "pg", schema }),
  emailAndPassword: { enabled: true, disableSignUp: true, minPasswordLength: 10 },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 jours
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },
  rateLimit: { enabled: true, storage: "database", window: 60, max: 10 },
  plugins: [nextCookies()], // toujours en dernier
});

/** Session courante, ou null. */
export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** À appeler en tête de chaque page et action admin : redirige vers la connexion si besoin. */
export async function requireAdmin() {
  const s = await getSession();
  if (!s) redirect("/admin/connexion");
  return s;
}
