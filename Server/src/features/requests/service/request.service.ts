// ───────────────────────────────────────────────
//  Request Service — Business logic for search
// ───────────────────────────────────────────────

import { requestRepository } from "../repository/request.repository";
import type { SearchFilters } from "../repository/request.repository";
import { HttpError } from "../../../shared/errors/HttpError";

// ─── Service ───────────────────────────────────

export const requestService = {
  /**
   * Search posts with advanced filters and pagination.
   * Validates geographic parameters and delegates to repository.
   */
  async searchPosts(
    filters: SearchFilters,
    page?: number,
    limit?: number,
  ) {
    // ── Validate geo params: if one is present, all three are required ──
    const hasAnyGeoParam =
      filters.latitude !== undefined ||
      filters.longitude !== undefined ||
      filters.radius !== undefined;

    if (hasAnyGeoParam) {
      if (
        filters.latitude === undefined ||
        filters.longitude === undefined ||
        filters.radius === undefined
      ) {
        throw HttpError.badRequest(
          "Geographic search requires latitude, longitude, and radius together",
        );
      }
    }

    // ── Validate age range ──
    if (filters.minAge !== undefined && filters.maxAge !== undefined) {
      if (filters.minAge > filters.maxAge) {
        throw HttpError.badRequest("minAge cannot be greater than maxAge");
      }
    }

    return requestRepository.searchPosts(filters, page, limit);
  },
};