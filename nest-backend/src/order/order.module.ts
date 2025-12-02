import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { Order, OrderSchema } from "./order.schema";
import { AuthGuard } from "../auth/auth.guard";
import { AdminGuard } from "../auth/admin.guard";
import { User, UserSchema } from "../user/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, AuthGuard, AdminGuard],
})
export class OrderModule {}
