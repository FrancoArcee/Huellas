// ───────────────────────────────────────────────
//  Rate Limiter — Protección contra abuso de API
// ───────────────────────────────────────────────
//  Se recomienda utilizar express-rate-limit para
//  limitar la cantidad de peticiones por IP en
//  ventanas de tiempo definidas.
// ───────────────────────────────────────────────

import rateLimit from "express-rate-limit";

// ─── Rate limiter general ──────────────────────
//  100 peticiones por ventana de 15 minutos

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Rate limiter para autenticación ───────────
//  5 intentos de login/registro por ventana de 15 minutos

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});