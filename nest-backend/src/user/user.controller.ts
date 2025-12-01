import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { RegisterUserDto } from "./dto/register-user.dto";
import { LoginDto } from "./dto/login.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthPayload, UserDto } from "./dto/user.dto";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { AuthUser } from "../auth/auth-user.interface";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  register(@Body() payload: RegisterUserDto): Promise<UserDto> {
    return this.userService.register(payload);
  }

  @Post("login")
  login(@Body() payload: LoginDto): Promise<AuthPayload> {
    return this.userService.login(payload);
  }

  @Get()
  @UseGuards(AuthGuard)
  getAll(@CurrentUser() user: AuthUser): Promise<UserDto[]> {
    return this.userService.findAll(user);
  }

  @Get(":id")
  @UseGuards(AuthGuard)
  getById(@Param("id") id: string, @CurrentUser() user: AuthUser): Promise<UserDto> {
    return this.userService.findById(id, user);
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  update(@Param("id") id: string, @Body() payload: UpdateUserDto, @CurrentUser() user: AuthUser): Promise<UserDto> {
    return this.userService.update(id, payload, user);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id") id: string, @CurrentUser() user: AuthUser): Promise<void> {
    await this.userService.delete(id, user);
  }
}
