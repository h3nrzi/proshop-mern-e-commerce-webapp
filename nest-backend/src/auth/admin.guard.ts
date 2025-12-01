import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthUser } from "./auth-user.interface";

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{ user?: AuthUser }>();
    if (req.user?.isAdmin) {
      return true;
    }
    throw new UnauthorizedException("Not authorized as admin!");
  }
}
