import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "../user/user.schema";
import { Product } from "../product/product.schema";

export type WishlistDocument = Wishlist & Document;

@Schema({ timestamps: true })
export class Wishlist {
  @Prop({ type: Types.ObjectId, ref: "User", required: true, unique: true })
  user!: Types.ObjectId | User;

  @Prop({ type: Types.ObjectId, ref: "Product" })
  products!: Types.ObjectId[] | Product[];
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);
