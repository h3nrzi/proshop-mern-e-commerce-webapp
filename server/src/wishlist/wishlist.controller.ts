import { Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AuthUser } from "../auth/auth-user.interface";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { WishlistService } from "./wishlist.service";

@Controller("api/wishlist")
@UseGuards(AuthGuard)
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Get()
  async getWishlist(@CurrentUser() user: AuthUser) {
    return this.wishlistService.getWishlist(user._id);
  }

  @Post(":productId")
  async addToWishlist(@CurrentUser() user: AuthUser, @Param("productId") productId: string) {
    return this.wishlistService.addToWishlist(user._id, productId);
  }

  @Delete(":productId")
  async removeFromWishlist(@CurrentUser() user: AuthUser, @Param("productId") productId: string) {
    return this.wishlistService.removeFromWishlist(user._id, productId);
  }
}
