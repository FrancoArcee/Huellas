// ───────────────────────────────────────────────
//  Auth Middleware — Autenticación con Better Auth
// ───────────────────────────────────────────────
//  La instancia de Better Auth se inyecta en
//  `app.locals.auth` desde el archivo de configuración
//  que se creará posteriormente.
// ───────────────────────────────────────────────

import type { Request, Response, NextFunction } from "express";
import type { betterAuth as BetterAuthFn } from "better-auth";
type BetterAuth = ReturnType<typeof BetterAuthFn>;
import { sendError } from "../utils/response";

// ─── Extensión de tipos Express ───────────────
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name?: string;
        image?: string;
        emailVerified?: boolean;
        createdAt?: string;
        updatedAt?: string;
      };
    }
  }
}

declare module "express" {
  interface Locals {
    auth?: BetterAuth;
  }
}

// ─── Helpers ───────────────────────────────────

function extractBearerToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice(7);
}

function mapSessionUser(session: {
  user?: { id: string; email: string; name?: string; image?: string };
}): Request["user"] | null {
  if (!session?.user) return null;
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    image: session.user.image,
  };
}

// ─── requireAuth ───────────────────────────────
//  Rechaza la petición si no hay un token válido.

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const auth: BetterAuth | undefined = req.app.locals.auth;

  if (!auth) {
    sendError(
      res,
      500,
      "AUTH_NOT_CONFIGURED",
      "Authentication service is not configured"
    );
    return;
  }

  const token = extractBearerToken(req);
  if (!token) {
    sendError(res, 401, "UNAUTHORIZED", "Missing or invalid Bearer token");
    return;
  }

  auth.api
    .getSession({
      headers: { authorization: `Bearer ${token}` },
    })
    .then((session) => {
      const user = mapSessionUser(session as any);
      if (!user) {
        sendError(res, 401, "UNAUTHORIZED", "Invalid or expired token");
        return;
      }
      req.user = user;
      next();
    })
    .catch(() => {
      sendError(res, 401, "UNAUTHORIZED", "Invalid or expired token");
    });
}

// ─── optionalAuth ──────────────────────────────
//  Adjunta el usuario si hay token válido, pero
//  nunca rechaza la petición.

export function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const auth: BetterAuth | undefined = req.app.locals.auth;

  if (!auth) {
    next();
    return;
  }

  const token = extractBearerToken(req);
  if (!token) {
    next();
    return;
  }

  auth.api
    .getSession({
      headers: { authorization: `Bearer ${token}` },
    })
    .then((session) => {
      const user = mapSessionUser(session as any);
      if (user) {
        req.user = user;
      }
      next();
    })
    .catch(() => {
      next();
    });
}
