import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthGuard } from "../auth/auth.guard";
import { Product, ProductSchema } from "../product/product.schema";
import { User, UserSchema } from "../user/user.schema";
import { WishlistController } from "./wishlist.controller";
import { Wishlist, WishlistSchema } from "./wishlist.schema";
import { WishlistService } from "./wishlist.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Wishlist.name, schema: WishlistSchema },
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [WishlistController],
  providers: [WishlistService, AuthGuard],
})
export class WishlistModule {}
