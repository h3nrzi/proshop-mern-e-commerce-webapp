import { Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthUser } from "../auth/auth-user.interface";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { WishlistService } from "./wishlist.service";

@ApiTags("Wishlist")
@ApiBearerAuth()
@Controller("api/wishlist")
@UseGuards(AuthGuard)
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: "Get current user's wishlist" })
  @ApiResponse({ status: 200, description: "Wishlist retrieved successfully" })
  async getWishlist(@CurrentUser() user: AuthUser) {
    return this.wishlistService.getWishlist(user._id);
  }

  @Post(":productId")
  @ApiOperation({ summary: "Add a product to wishlist" })
  @ApiResponse({ status: 201, description: "Product added to wishlist" })
  @ApiResponse({ status: 404, description: "Product not found" })
  async addToWishlist(@CurrentUser() user: AuthUser, @Param("productId") productId: string) {
    return this.wishlistService.addToWishlist(user._id, productId);
  }

  @Delete(":productId")
  @ApiOperation({ summary: "Remove a product from wishlist" })
  @ApiResponse({ status: 200, description: "Product removed from wishlist" })
  @ApiResponse({ status: 404, description: "Wishlist or product not found" })
  async removeFromWishlist(@CurrentUser() user: AuthUser, @Param("productId") productId: string) {
    return this.wishlistService.removeFromWishlist(user._id, productId);
  }
}
