import jwt from "jsonwebtoken";
import { inject, injectable } from "tsyringe";
import { AppError, NotFoundError } from "../../core/errors";
import { CacheService, ConfigService, Logger, ValidationService } from "../../core/services";
import {
  AuthPayload,
  RegisterUserInput,
  UpdateUserInput,
  UserDTO,
  loginSchema,
  registerUserSchema,
  updateUserSchema,
} from "./user.dto";
import { UserRepository } from "./user.repository";

const CACHE_KEY_ALL = "users:all";

@injectable()
export class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly cache: CacheService,
    private readonly logger: Logger,
    @inject(ValidationService) private readonly validator: ValidationService,
    private readonly config: ConfigService
  ) {}

  async register(payload: unknown): Promise<UserDTO> {
    const validated = this.validator.validate(registerUserSchema, payload);

    try {
      const existing = await this.repository.findByEmail(validated.email);
      if (existing) {
        throw new AppError({ message: "Email already in use", statusCode: 409 });
      }

      const created = await this.repository.create(validated as RegisterUserInput);
      this.cache.delete(CACHE_KEY_ALL);
      this.logger.info("User registered", { id: created.id, email: created.email });
      return created;
    } catch (error) {
      throw this.toAppError(error);
    }
  }

  async login(payload: unknown): Promise<AuthPayload> {
    const validated = this.validator.validate(loginSchema, payload);

    try {
      const userDoc = await this.repository.findAuthByEmail(validated.email);
      if (!userDoc) {
        throw new AppError({ message: "Invalid credentials", statusCode: 401 });
      }

      const validPassword = await userDoc.comparePassword(validated.password);
      if (!validPassword) {
        throw new AppError({ message: "Invalid credentials", statusCode: 401 });
      }

      const secret = this.config.require("JWT_SECRET");
      const token = jwt.sign(
        { userId: userDoc._id.toString(), email: userDoc.email, isAdmin: userDoc.isAdmin },
        secret,
        { expiresIn: "30d" }
      );

      return { user: this.repository.toDTO(userDoc), token };
    } catch (error) {
      throw this.toAppError(error);
    }
  }

  async findAll(): Promise<UserDTO[]> {
    const cached = this.cache.get<UserDTO[]>(CACHE_KEY_ALL);
    if (cached) {
      return cached;
    }

    try {
      const users = await this.repository.findAll();
      this.cache.set(CACHE_KEY_ALL, users, 5 * 60 * 1000);
      return users;
    } catch (error) {
      throw this.toAppError(error);
    }
  }

  async findById(id: string): Promise<UserDTO> {
    try {
      const user = await this.repository.findById(id);
      if (!user) {
        throw new NotFoundError("User not found");
      }
      return user;
    } catch (error) {
      throw this.toAppError(error);
    }
  }

  async update(id: string, payload: unknown): Promise<UserDTO> {
    const validated = this.validator.validate(updateUserSchema, payload);
    try {
      const updated = await this.repository.update(id, validated as UpdateUserInput);
      if (!updated) {
        throw new NotFoundError("User not found");
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
        throw new NotFoundError("User not found");
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
    this.logger.error("Unhandled user service error", { error });
    return new AppError({ message: "Internal server error", cause: error as Error });
  }
}

export default UserService;
