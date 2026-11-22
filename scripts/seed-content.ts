/**
 * Insère les réalisations de départ si la table est vide.
 * Usage : npm run db:seed (sans effet si des réalisations existent déjà)
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { showcaseProjects } from "../src/db/schema";
import { DEFAULT_PROJECTS } from "../src/lib/content/defaults";

async function main() {
  const db = drizzle(neon(process.env.DATABASE_URL!));
  const existing = await db.select({ id: showcaseProjects.id }).from(showcaseProjects).limit(1);
  if (existing.length) {
    console.log("Des réalisations existent déjà : rien à faire.");
    return;
  }
  await db.insert(showcaseProjects).values(DEFAULT_PROJECTS.map((p, i) => ({ ...p, position: i })));
  console.log(`${DEFAULT_PROJECTS.length} réalisations insérées.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
