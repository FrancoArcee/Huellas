import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { locationService } from "../service/location.service";

const autocompleteSchema = z.object({
  input: z.string().trim().min(3).max(200),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
});

export async function autocompleteLocations(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = autocompleteSchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Invalid location search",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { input, latitude, longitude } = parsed.data;
    const bias = latitude !== undefined && longitude !== undefined
      ? { latitude, longitude }
      : undefined;
    const suggestions = await locationService.autocomplete(input, bias);
    res.json({ success: true, data: suggestions });
  } catch (error) {
    next(error);
  }
}
