export interface AppErrorProps {
  message: string;
  statusCode?: number;
  code?: string;
  details?: unknown;
  cause?: Error;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code?: string;
  public readonly details?: unknown;
  public readonly cause?: Error;

  constructor({ message, statusCode = 500, code, details, cause }: AppErrorProps) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    if (cause) this.cause = cause;

    Error.captureStackTrace?.(this, AppError);
  }
}

export default AppError;
