import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { User, UserSchema } from "./user.schema";
import { AuthGuard } from "../auth/auth.guard";
import { AdminGuard } from "../auth/admin.guard";
import { Order, OrderSchema } from "../order/order.schema";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, AuthGuard, AdminGuard],
})
export class UserModule {}
