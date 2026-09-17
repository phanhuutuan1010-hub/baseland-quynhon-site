import "dotenv/config";
import { defineConfig } from "prisma/config";

// DIRECT_URL is optional — only needed when DATABASE_URL points at a pooled
// connection (e.g. Neon/Supabase's pgbouncer endpoint), since Prisma Migrate
// needs a direct (non-pooled) connection. Falls back to DATABASE_URL for a
// plain self-hosted Postgres where there is no pooler in front of it.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || "",
  },
});
