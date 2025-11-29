import { inject, injectable } from "tsyringe";
import { NotFoundError } from "../../core/errors";
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
    const created = await this.repository.create(validated);
    this.cache.delete(CACHE_KEY_ALL);
    this.logger.info("Example created", { id: created.id });
    return created;
  }

  async findAll(): Promise<ExampleDTO[]> {
    const cached = this.cache.get<ExampleDTO[]>(CACHE_KEY_ALL);
    if (cached) {
      return cached;
    }

    const items = await this.repository.findAll();
    this.cache.set(CACHE_KEY_ALL, items, 5 * 60 * 1000);
    return items;
  }

  async findById(id: string): Promise<ExampleDTO> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new NotFoundError("Example not found");
    }
    return item;
  }

  async update(id: string, payload: unknown): Promise<ExampleDTO> {
    const validated = this.validator.validate(updateExampleSchema, payload);
    const updated = await this.repository.update(id, validated);
    if (!updated) {
      throw new NotFoundError("Example not found");
    }
    this.cache.delete(CACHE_KEY_ALL);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new NotFoundError("Example not found");
    }
    this.cache.delete(CACHE_KEY_ALL);
    return true;
  }
}

export default ExampleService;
