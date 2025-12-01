import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model, SchemaTypes, Types } from "mongoose";

interface Review {
  user: Types.ObjectId;
  name: string;
  rating: number;
  comment: string;
}

export interface ProductDocumentMethods {
  addReview: (review: Review) => Promise<void>;
}

export type ProductDocument = HydratedDocument<Product> & ProductDocumentMethods;
export type ProductModel = Model<Product, Record<string, never>, ProductDocumentMethods>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: SchemaTypes.ObjectId, ref: "User", required: true })
  user!: Types.ObjectId;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  image!: string;

  @Prop({ required: true })
  brand!: string;

  @Prop({ required: true })
  category!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true, default: 0 })
  rating!: number;

  @Prop({ required: true, default: 0 })
  numReviews!: number;

  @Prop({ required: true, default: 0 })
  price!: number;

  @Prop({ required: true, default: 0 })
  countInStock!: number;

  @Prop({
    type: [
      {
        user: { type: SchemaTypes.ObjectId, ref: "User", required: true },
        name: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true }
      }
    ]
  })
  reviews!: Review[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.methods.addReview = async function (this: ProductDocument, review: Review) {
  this.reviews.push(review);
  this.numReviews = this.reviews.length;
  this.rating = this.reviews.reduce((sum, r) => sum + r.rating, 0) / this.numReviews;
};
