// ───────────────────────────────────────────────
//  Server — Express app setup and startup
// ───────────────────────────────────────────────

import express from "express";
import cors from "cors";
import { env } from "./env";
import { errorHandler } from "../shared/middleware/errorHandler";
import { apiLimiter } from "../shared/middleware/rateLimiter";

// Routes (lazy imports to avoid circular deps)
import userRoutes from "../features/users/routes/user.routes";
import favoriteRoutes from "../features/favorites/routes/favorite.routes";
import animalRoutes from "../features/animals/routes/animal.routes";

const app = express();

// ─── Global middleware ──────────────────────────
app.use(cors());
app.use(express.json());
app.use(apiLimiter);

// ─── API routes ─────────────────────────────────
app.use("/users", userRoutes);
app.use("/favorites", favoriteRoutes);
app.use("/animals", animalRoutes);

// ─── Health check ───────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Error handler (must be last) ──────────────
app.use(errorHandler);

// ─── Start server ──────────────────────────────
if (process.env.NODE_ENV !== "test") {
  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT}`);
  });
}

export default app;