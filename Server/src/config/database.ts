// ───────────────────────────────────────────────
//  Database — Prisma Client singleton
// ───────────────────────────────────────────────
//  Prisma 7.x uses the "client" engine by default,
//  which requires a driver adapter to connect.
//  We use @prisma/adapter-pg for PostgreSQL.
// ───────────────────────────────────────────────

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

export default prisma;