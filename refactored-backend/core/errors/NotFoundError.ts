import { AppError } from "./AppError";

export class NotFoundError extends AppError {
  constructor(message: string, details?: unknown) {
    super({
      message,
      details,
      statusCode: 404,
      code: "NOT_FOUND",
    });
    this.name = "NotFoundError";
  }
}

export default NotFoundError;
