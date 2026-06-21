import express from "express";
import cors from "cors";
import { env } from "./env";
import { errorHandler } from "../shared/middleware/errorHandler";
import { apiLimiter } from "../shared/middleware/rateLimiter";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";

import userRoutes from "../features/users/routes/user.routes";
import favoriteRoutes from "../features/favorites/routes/favorite.routes";
import animalRoutes from "../features/animals/routes/animal.routes";
import requestRoutes from "../features/requests/routes/request.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", toNodeHandler(auth));
app.use(apiLimiter);

// ─── API routes ─────────────────────────────────
app.use("/users", userRoutes);
app.use("/favorites", favoriteRoutes);
app.use("/animals", animalRoutes);
app.use("/requests", requestRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});
app.use(errorHandler);

// ─── Start server ──────────────────────────────
if (process.env.NODE_ENV !== "test") {
  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT}`);
  });
}

export default app;