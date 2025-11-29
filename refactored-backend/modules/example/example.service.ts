import { inject, injectable } from "tsyringe";
import { AppError, NotFoundError } from "../../core/errors";
import { CacheService, Logger, ValidationService } from "../../core/services";
import { ExampleDTO, createExampleSchema, updateExampleSchema } from "./example.dto";
import { ExampleRepository } from "./example.repository";

const CACHE_KEY_ALL = "examples:all";

@injectable()
export class ExampleService {
  constructor(
    private readonly repository: ExampleRepository,
    private readonly cache: CacheService,
    private readonly logger: Logger,
    @inject(ValidationService) private readonly validator: ValidationService
  ) {}

  async create(payload: unknown): Promise<ExampleDTO> {
    const validated = this.validator.validate(createExampleSchema, payload);
    try {
      const created = await this.repository.create(validated);
      this.cache.delete(CACHE_KEY_ALL);
      this.logger.info("Example created", { id: created.id });
      return created;
    } catch (error) {
      throw this.toAppError(error);
    }
  }

  async findAll(): Promise<ExampleDTO[]> {
    const cached = this.cache.get<ExampleDTO[]>(CACHE_KEY_ALL);
    if (cached) {
      return cached;
    }

    try {
      const items = await this.repository.findAll();
      this.cache.set(CACHE_KEY_ALL, items, 5 * 60 * 1000);
      return items;
    } catch (error) {
      throw this.toAppError(error);
    }
  }

  async findById(id: string): Promise<ExampleDTO> {
    try {
      const item = await this.repository.findById(id);
      if (!item) {
        throw new NotFoundError("Example not found");
      }
      return item;
    } catch (error) {
      throw this.toAppError(error);
    }
  }

  async update(id: string, payload: unknown): Promise<ExampleDTO> {
    const validated = this.validator.validate(updateExampleSchema, payload);
    try {
      const updated = await this.repository.update(id, validated);
      if (!updated) {
        throw new NotFoundError("Example not found");
      }
      this.cache.delete(CACHE_KEY_ALL);
      return updated;
    } catch (error) {
      throw this.toAppError(error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const deleted = await this.repository.delete(id);
      if (!deleted) {
        throw new NotFoundError("Example not found");
      }
      this.cache.delete(CACHE_KEY_ALL);
      return true;
    } catch (error) {
      throw this.toAppError(error);
    }
  }

  private toAppError(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }
    this.logger.error("Unhandled service error", { error });
    return new AppError({ message: "Internal server error", cause: error as Error });
  }
}

export default ExampleService;
