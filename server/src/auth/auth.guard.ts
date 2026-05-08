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
    const request = this.getRequest(context);
    const secret = this.getJwtSecret();

    const token = this.extractTokenFromCookies(request);
    const payload = this.verifyToken(token, secret);
    const user = await this.findUserById(payload.userId);

    this.attachUserToRequest(request, user);
    return true;
  }

  private getRequest(context: ExecutionContext): Request & { user?: AuthUser } {
    return context.switchToHttp().getRequest();
  }

  private getJwtSecret(): string {
    const secret = this.config.get<string>("JWT_SECRET");
    if (!secret) {
      throw new UnauthorizedException("JWT secret not configured");
    }
    return secret;
  }

  private extractTokenFromCookies(request: Request): string {
    const token = request.cookies?.jwt;
    if (!token) {
      throw new UnauthorizedException("Not authorized, no token!");
    }
    return token;
  }

  private verifyToken(token: string, secret: string): { userId: string } {
    try {
      return jwt.verify(token, secret) as { userId: string };
    } catch (error) {
      throw new UnauthorizedException("Not authorized, token failed!");
    }
  }

  private async findUserById(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new UnauthorizedException("Not authorized, token failed!");
    }
    return user;
  }

  private attachUserToRequest(request: Request & { user?: AuthUser }, user: UserDocument): void {
    request.user = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    };
  }
}
