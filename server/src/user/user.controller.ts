import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { UserService } from "./user.service";
import { RegisterUserDto } from "./dto/register-user.dto";
import { LoginDto } from "./dto/login.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserDto } from "./dto/user.dto";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { AuthUser } from "../auth/auth-user.interface";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { AdminGuard } from "../auth/admin.guard";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  @HttpCode(HttpStatus.OK)
  register(
    @Body() payload: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserDto> {
    return this.userService.register(payload, res);
  }

  @Post("auth")
  login(@Body() payload: LoginDto, @Res({ passthrough: true }) res: Response): Promise<UserDto> {
    return this.userService.login(payload, res);
  }

  @Post("logout")
  logout(@Res({ passthrough: true }) res: Response): Promise<{ message: string }> {
    return this.userService.logout(res);
  }

  @Get()
  @UseGuards(AuthGuard, AdminGuard)
  getAll(): Promise<UserDto[]> {
    return this.userService.findAll();
  }

  @Get("profile")
  @UseGuards(AuthGuard)
  getProfile(@CurrentUser() user: AuthUser): Promise<UserDto> {
    return this.userService.getProfile(user);
  }

  @Patch("profile")
  @UseGuards(AuthGuard)
  updateProfile(
    @CurrentUser() user: AuthUser,
    @Body() payload: UpdateProfileDto,
  ): Promise<UserDto> {
    return this.userService.updateProfile(user, payload);
  }

  @Get(":id")
  @UseGuards(AuthGuard, AdminGuard)
  getById(@Param("id") id: string): Promise<UserDto> {
    return this.userService.findById(id);
  }

  @Patch(":id")
  @UseGuards(AuthGuard, AdminGuard)
  update(@Param("id") id: string, @Body() payload: UpdateUserDto): Promise<UserDto> {
    return this.userService.update(id, payload);
  }

  @Delete(":id")
  @UseGuards(AuthGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  async delete(@Param("id") id: string): Promise<{ message: string }> {
    return this.userService.delete(id);
  }
}
