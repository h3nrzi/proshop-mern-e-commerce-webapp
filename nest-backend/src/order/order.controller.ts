import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { AuthGuard } from "../auth/auth.guard";
import { AdminGuard } from "../auth/admin.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { AuthUser } from "../auth/auth-user.interface";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderPaidDto } from "./dto/update-order-paid.dto";

@Controller("orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard)
  @Get("myorders")
  getMyOrders(@CurrentUser() user: AuthUser) {
    return this.orderService.getMine(user);
  }

  @UseGuards(AuthGuard)
  @Patch(":id/pay")
  updateOrderToPaid(@Param("id") id: string, @Body() payload: UpdateOrderPaidDto) {
    return this.orderService.markPaid(id, payload);
  }

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createOrder(@Body() payload: CreateOrderDto, @CurrentUser() user: AuthUser) {
    return this.orderService.create(payload, user);
  }

  @UseGuards(AuthGuard)
  @Get(":id")
  getOrder(@Param("id") id: string) {
    return this.orderService.getById(id);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Get()
  getAll() {
    return this.orderService.getAll();
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Patch(":id/deliver")
  updateOrderToDeliver(@Param("id") id: string) {
    return this.orderService.markDelivered(id);
  }
}
