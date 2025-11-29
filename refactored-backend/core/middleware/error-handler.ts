import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors";
import { Logger } from "../services";
import { container } from "../container";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  const logger = container.resolve(Logger);
  const status = err instanceof AppError ? err.statusCode : 500;
  const code = err instanceof AppError ? err.code : undefined;
  const message = err.message || "Internal server error";

  logger.error("Request failed", { status, code, message, stack: err.stack });

  res.status(status).json({
    error: message,
    code,
  });
}
