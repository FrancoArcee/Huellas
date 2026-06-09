// ───────────────────────────────────────────────
//  HttpError — Custom HTTP error class
// ───────────────────────────────────────────────

export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(statusCode: number, code: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = "HttpError";
  }

  static badRequest(message: string = "Bad Request"): HttpError {
    return new HttpError(400, "BAD_REQUEST", message);
  }

  static unauthorized(message: string = "Unauthorized"): HttpError {
    return new HttpError(401, "UNAUTHORIZED", message);
  }

  static forbidden(message: string = "Forbidden"): HttpError {
    return new HttpError(403, "FORBIDDEN", message);
  }

  static notFound(message: string = "Not Found"): HttpError {
    return new HttpError(404, "NOT_FOUND", message);
  }

  static conflict(message: string = "Conflict"): HttpError {
    return new HttpError(409, "CONFLICT", message);
  }

  static internal(message: string = "Internal Server Error"): HttpError {
    return new HttpError(500, "INTERNAL_ERROR", message);
  }
}