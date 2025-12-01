import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import jwt from "jsonwebtoken";
import { FilterQuery } from "mongoose";
import { User, UserDocument, UserModel } from "./user.schema";
import { RegisterUserDto } from "./dto/register-user.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthPayload, UserDto } from "./dto/user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: UserModel, private readonly config: ConfigService) {}

  private toDto(user: UserDocument): UserDto {
    const plain = user.toObject() as User & { _id?: string; createdAt?: Date; updatedAt?: Date };
    return {
      id: plain._id?.toString() ?? user.id,
      name: plain.name,
      email: plain.email,
      isAdmin: plain.isAdmin,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt
    };
  }

  private ensureJwtSecret(): string {
    const secret = this.config.get<string>("JWT_SECRET");
    if (!secret) {
      throw new InternalServerErrorException("JWT_SECRET is not set");
    }
    return secret;
  }

  async register(dto: RegisterUserDto): Promise<UserDto> {
    const existing = await this.userModel.findOne({ email: dto.email } satisfies FilterQuery<User>);
    if (existing) {
      throw new ConflictException("Email already in use");
    }

    const created = new this.userModel({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      isAdmin: dto.isAdmin ?? false
    });

    const saved = await created.save();
    return this.toDto(saved);
  }

  async login(dto: LoginDto): Promise<AuthPayload> {
    const user = await this.userModel.findOne({ email: dto.email } satisfies FilterQuery<User>).select("+password");
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const validPassword = await user.comparePassword(dto.password);
    if (!validPassword) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, isAdmin: user.isAdmin },
      this.ensureJwtSecret(),
      { expiresIn: "30d" }
    );

    return { user: this.toDto(user), token };
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.userModel.find().exec();
    return users.map((user) => this.toDto(user));
  }

  async findById(id: string): Promise<UserDto> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return this.toDto(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserDto> {
    const user = await this.userModel.findById(id).select("+password");
    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (dto.name !== undefined) {
      user.name = dto.name;
    }
    if (dto.email !== undefined) {
      user.email = dto.email;
    }
    if (dto.password !== undefined) {
      user.password = dto.password;
    }
    if (dto.isAdmin !== undefined) {
      user.isAdmin = dto.isAdmin;
    }

    const saved = await user.save();
    return this.toDto(saved);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException("User not found");
    }
    return true;
  }
}
