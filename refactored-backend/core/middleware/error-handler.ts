import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import { AppError, DatabaseError } from "../errors";
import { Logger } from "../services";
import { container } from "../container";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  const logger = container.resolve(Logger);
  const normalizedError =
    err instanceof AppError
      ? err
      : err instanceof mongoose.Error
      ? new DatabaseError("Database operation failed", err, err)
      : new AppError({ message: "Internal server error", cause: err });
  const status = normalizedError.statusCode;
  const code = normalizedError.code;
  const message = normalizedError.message || "Internal server error";

  logger.error("Request failed", {
    status,
    code,
    message,
    stack: err.stack ?? normalizedError.stack,
    details: normalizedError instanceof AppError ? normalizedError.details : undefined,
  });

  res.status(status).json({
    error: message,
    code,
  });
}
