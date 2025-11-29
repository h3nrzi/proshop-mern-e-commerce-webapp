import { AppError } from "./AppError";

export class DatabaseError extends AppError {
  constructor(message: string, details?: unknown, cause?: Error) {
    super({
      message,
      details,
      cause,
      statusCode: 500,
      code: "DATABASE_ERROR",
    });
    this.name = "DatabaseError";
  }
}

export default DatabaseError;
