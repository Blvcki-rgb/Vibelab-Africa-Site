import { defineConfig } from "drizzle-kit";

// Lancer via : npm run db:push (charge .env.local)
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL! },
});
