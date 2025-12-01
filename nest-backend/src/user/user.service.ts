import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import * as jwt from "jsonwebtoken";
import { FilterQuery, Model } from "mongoose";
import { Response } from "express";
import { User, UserDocument, UserModel } from "./user.schema";
import { RegisterUserDto } from "./dto/register-user.dto";
import { LoginDto } from "./dto/login.dto";
import { UserDto } from "./dto/user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthUser } from "../auth/auth-user.interface";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { Order, OrderDocument } from "../order/order.schema";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: UserModel,
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    private readonly config: ConfigService,
  ) {}

  private toDto(user: UserDocument): UserDto {
    const plain = user.toObject() as User & { _id?: string; createdAt?: Date; updatedAt?: Date };
    return {
      _id: plain._id?.toString() ?? user.id,
      name: plain.name,
      email: plain.email,
      isAdmin: plain.isAdmin,
    };
  }

  private ensureJwtSecret(): string {
    const secret = this.config.get<string>("JWT_SECRET");
    if (!secret) {
      throw new InternalServerErrorException("JWT_SECRET is not set");
    }
    return secret;
  }

  private setAuthCookie(res: Response, userId: string) {
    const token = jwt.sign({ userId }, this.ensureJwtSecret(), { expiresIn: "30d" });
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: this.config.get("NODE_ENV") === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  async register(dto: RegisterUserDto, res: Response): Promise<UserDto> {
    const existing = await this.userModel.findOne({ email: dto.email } satisfies FilterQuery<User>);
    if (existing) {
      throw new ConflictException("Email already in use");
    }

    const created = new this.userModel({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      isAdmin: dto.isAdmin ?? false,
    });

    const saved = await created.save();
    this.setAuthCookie(res, saved._id.toString());
    return this.toDto(saved);
  }

  async login(dto: LoginDto, res: Response): Promise<UserDto> {
    const user = await this.userModel
      .findOne({ email: dto.email } satisfies FilterQuery<User>)
      .select("+password");
    if (!user) {
      throw new UnauthorizedException("Invalid Email or Password");
    }

    const validPassword = await user.comparePassword(dto.password);
    if (!validPassword) {
      throw new UnauthorizedException("Invalid Email or Password");
    }

    this.setAuthCookie(res, user._id.toString());
    return this.toDto(user);
  }

  async logout(res: Response): Promise<{ message: string }> {
    res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
    return { message: "Logged out successfully!" };
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
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.email === "admin@gmail.com") {
      throw new BadRequestException("Cannot update this user");
    }

    user.name = dto.name || user.name;
    user.email = dto.email || user.email;
    user.isAdmin = dto.isAdmin ? true : false;

    const saved = await user.save();
    return this.toDto(saved);
  }

  async delete(id: string): Promise<{ message: string }> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.email === "admin@gmail.com") {
      throw new BadRequestException("Cannot delete this user");
    }

    await this.orderModel.deleteMany({ user: user._id });
    await this.userModel.deleteOne({ _id: user._id });

    return { message: "User deleted successfully" };
  }

  async getProfile(currentUser: AuthUser): Promise<UserDto> {
    const user = await this.userModel.findById(currentUser._id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return this.toDto(user);
  }

  async updateProfile(currentUser: AuthUser, dto: UpdateProfileDto): Promise<UserDto> {
    const user = await this.userModel.findById(currentUser._id);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    user.name = dto.name || user.name;
    user.email = dto.email || user.email;
    if (dto.password) {
      user.password = dto.password;
    }
    const updatedUser = await user.save();
    return this.toDto(updatedUser);
  }
}
