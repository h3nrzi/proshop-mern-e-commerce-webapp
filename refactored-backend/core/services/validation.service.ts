import { ZodSchema } from "zod";
import { ValidationError } from "../errors";

export class ValidationService {
  validate<T>(schema: ZodSchema<T>, payload: unknown): T {
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      throw new ValidationError("Validation failed", parsed.error.flatten());
    }

    return parsed.data;
  }
}

export default ValidationService;
