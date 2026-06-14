import type { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodError } from "zod";
import { GameError } from "@workspace/game-core";

/** A controlled, client-safe error with an HTTP status + stable code. */
export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function sendData<T>(res: Response, data: T, status = 200): void {
  res.status(status).json({ success: true, data });
}

/** Wraps an async route so thrown/rejected errors flow to the error handler. */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (res.headersSent) return;

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request payload.",
        details: err.issues,
      },
    });
    return;
  }

  if (err instanceof AppError) {
    res
      .status(err.status)
      .json({ success: false, error: { code: err.code, message: err.message } });
    return;
  }

  if (err instanceof GameError) {
    res
      .status(400)
      .json({ success: false, error: { code: err.code, message: err.message } });
    return;
  }

  req.log?.error?.({ err }, "Unhandled error");
  res.status(500).json({
    success: false,
    error: { code: "INTERNAL_ERROR", message: "Something went wrong." },
  });
}
