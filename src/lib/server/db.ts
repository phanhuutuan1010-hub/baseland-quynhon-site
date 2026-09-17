import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

// Cached on globalThis in every environment, not just dev. The common
// "only cache outside production" version of this snippet is written to
// survive dev's HMR module reloads, but on Vercel a warm serverless
// function reuses the same Node process (and thus the same globalThis)
// across multiple invocations — skipping the cache there means a fresh
// PrismaClient/pooler connection gets created on every single request
// instead of only on a true cold start, which is where the connection-setup
// cost this session measured (~500-600ms) was actually coming from.
export const prisma = globalForPrisma.prisma ?? createClient();
globalForPrisma.prisma = prisma;
