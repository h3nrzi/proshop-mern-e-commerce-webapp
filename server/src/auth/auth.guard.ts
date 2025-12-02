import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import * as jwt from "jsonwebtoken";
import { Request } from "express";
import { Model } from "mongoose";
import { AuthUser } from "./auth-user.interface";
import { User, UserDocument } from "../user/user.schema";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & { user?: AuthUser }>();
    const token = req.cookies?.jwt;
    const secret = this.config.get<string>("JWT_SECRET");
    if (!secret) {
      throw new UnauthorizedException("JWT secret not configured");
    }

    try {
      if (!token) {
        throw new UnauthorizedException("Not authorized, no token!");
      }
      const payload = jwt.verify(token, secret) as { userId: string };
      const user = await this.userModel.findById(payload.userId).exec();
      if (!user) {
        throw new UnauthorizedException("Not authorized, token failed!");
      }
      req.user = {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      };
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException("Not authorized, token failed!");
    }
  }
}
