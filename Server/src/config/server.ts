import path from "path";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { env } from "./env";
import { auth } from "./auth";
import { errorHandler } from "../shared/middleware/errorHandler";
import { apiLimiter } from "../shared/middleware/rateLimiter";
import userRoutes from "../features/users/routes/user.routes";
import favoriteRoutes from "../features/favorites/routes/favorite.routes";
import animalRoutes from "../features/animals/routes/animal.routes";
import clinicalHistoryRoutes from "../features/clinical-history/routes/clinicalHistory.routes";
import entryRoutes from "../features/clinical-history/routes/entry.routes";
import requestRoutes from "../features/requests/routes/request.routes";
import locationRoutes from "../features/locations/routes/location.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads/user", express.static(path.join(process.cwd(), "uploads/user")));
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));
app.use("/api/auth", toNodeHandler(auth));
app.use("/locations", locationRoutes);
app.use(apiLimiter);

app.use("/users", userRoutes);
app.use("/favorites", favoriteRoutes);
app.use("/animals", animalRoutes);
app.use("/clinical-histories", clinicalHistoryRoutes);
app.use("/entries", entryRoutes);
app.use("/requests", requestRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
}

export default app;
