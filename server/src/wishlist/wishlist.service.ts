import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Wishlist, WishlistDocument } from "./wishlist.schema";

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name)
    private wishlistModel: Model<WishlistDocument>,
  ) {}

  async getWishlist(userId: string) {
    let wishlist = await this.wishlistModel
      .findOne({ user: new Types.ObjectId(userId) })
      .populate("products");
    if (!wishlist) {
      wishlist = await this.wishlistModel.create({ user: userId, products: [] });
    }
    return wishlist;
  }

  async addToWishlist(userId: string, productId: string) {
    const wishlist = await this.wishlistModel.findOne({ user: userId });
    if (!wishlist) {
      const newWishlist = await this.wishlistModel.create({ user: userId, products: [productId] });
      return newWishlist.populate("products");
    }
    if (!wishlist.products.includes(productId as any)) {
      wishlist.products.push(productId as any);
      await wishlist.save();
    }
    return wishlist.populate("products");
  }

  async removeFromWishlist(userId: string, productId: string) {
    const wishlist = await this.wishlistModel.findOne({ user: userId });
    if (!wishlist) throw new NotFoundException("Wishlist not found");
    wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
    await wishlist.save();
    return wishlist.populate("products");
  }
}
