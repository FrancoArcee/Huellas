import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";

// Permite desactivar los limitadores mediante variable de entorno.
// Por defecto se desactiva (true) para evitar errores 429 en desarrollo y pruebas locales.
const disableRateLimit = process.env.DISABLE_RATE_LIMIT !== "false";

const skipLimiter = (req: Request, res: Response, next: NextFunction) => {
  next();
};

// ─── Rate limiter general ──────────────────────
//  100 peticiones por ventana de 15 minutos

export const apiLimiter = disableRateLimit
  ? skipLimiter
  : rateLimit({
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

export const authLimiter = disableRateLimit
  ? skipLimiter
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 5,
      message: {
        success: false,
        message: "Too many authentication attempts, please try again later.",
      },
      standardHeaders: true,
      legacyHeaders: false,
    });

export const georefLimiter = disableRateLimit
  ? skipLimiter
  : rateLimit({
      windowMs: 60 * 1000,
      max: 40,
      message: {
        success: false,
        message: "Too many location searches. Please try again shortly.",
      },
      standardHeaders: true,
      legacyHeaders: false,
    });

