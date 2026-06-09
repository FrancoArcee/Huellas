// ───────────────────────────────────────────────
//  Database — Prisma Client singleton
// ───────────────────────────────────────────────

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;