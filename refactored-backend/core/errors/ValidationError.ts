import { AppError } from "./AppError";

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super({
      message,
      details,
      statusCode: 400,
      code: "VALIDATION_ERROR",
    });
    this.name = "ValidationError";
  }
}

export default ValidationError;
