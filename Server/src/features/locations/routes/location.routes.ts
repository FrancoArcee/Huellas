import { Router } from "express";
import { georefLimiter } from "../../../shared/middleware/rateLimiter";
import {
  autocompleteLocations,
} from "../controller/location.controller";

const router = Router();

router.get("/autocomplete", georefLimiter, autocompleteLocations);

export default router;
