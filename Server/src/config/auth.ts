// ───────────────────────────────────────────────
//  Auth — Configuración de Better Auth
// ───────────────────────────────────────────────
// Better Auth maneja autenticación con proveedor
// externo, creación automática de usuarios y
// generación de sesiones. Se inyecta en app.locals
// para que los middlewares de auth lo consuman.
// ───────────────────────────────────────────────

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer } from "better-auth/plugins/bearer";
import prisma from "./database";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [bearer()],
  user: {
    additionalFields: {
      contact: {
        type: "string",
        required: true,
      },
      contactType: {
        type: "string",
        required: true,
      },
      profilePictureUrl: {
        type: "string",
        required: false,
      },
    },
  },
  // Configuración de seguridad
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
});
