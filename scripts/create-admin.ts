/**
 * Crée (ou réinitialise) le compte admin unique.
 * Usage : npm run admin:create
 * Le script demande l'e-mail, le nom et le mot de passe dans le terminal.
 */
import { neon } from "@neondatabase/serverless";
import { hashPassword } from "better-auth/crypto";
import { randomUUID } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL manquant (lancez via npm run admin:create).");

  const rl = createInterface({ input: stdin, output: stdout, terminal: true });
  const email = (process.env.ADMIN_EMAIL || (await rl.question("E-mail admin : "))).trim().toLowerCase();
  const name = (process.env.ADMIN_NAME || (await rl.question("Nom affiché : "))).trim() || "Admin";

  // Saisie masquée : les caractères tapés ne s'affichent pas.
  const askHidden = async (label: string) => {
    stdout.write(label);
    const out = rl as unknown as { _writeToOutput: (s: string) => void };
    const original = out._writeToOutput;
    out._writeToOutput = () => {};
    const value = await rl.question("");
    out._writeToOutput = original;
    stdout.write("\n");
    return value;
  };

  let password = process.env.ADMIN_PASSWORD ?? "";
  if (!password) {
    password = await askHidden("Mot de passe (10 caractères min., la saisie est masquée) : ");
    const confirm = await askHidden("Confirmez le mot de passe : ");
    if (password !== confirm) {
      rl.close();
      throw new Error("Les deux mots de passe ne correspondent pas. Relancez la commande.");
    }
  }
  rl.close();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("E-mail invalide.");
  if (password.length < 10) throw new Error("Mot de passe trop court (10 caractères minimum).");

  const sql = neon(url);
  const hash = await hashPassword(password);
  const existing = await sql`SELECT id FROM "user" WHERE email = ${email}`;

  if (existing.length) {
    const id = existing[0].id as string;
    await sql`UPDATE "user" SET name = ${name}, updated_at = now() WHERE id = ${id}`;
    await sql`UPDATE account SET password = ${hash}, updated_at = now() WHERE user_id = ${id} AND provider_id = 'credential'`;
    await sql`DELETE FROM session WHERE user_id = ${id}`;
    console.log(`Mot de passe mis à jour pour ${email}.`);
    return;
  }

  const id = randomUUID();
  await sql`INSERT INTO "user" (id, name, email, email_verified, created_at, updated_at)
            VALUES (${id}, ${name}, ${email}, true, now(), now())`;
  await sql`INSERT INTO account (id, account_id, provider_id, user_id, password, created_at, updated_at)
            VALUES (${randomUUID()}, ${id}, 'credential', ${id}, ${hash}, now(), now())`;
  console.log(`Compte admin créé pour ${email}. Connexion : /admin/connexion`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
