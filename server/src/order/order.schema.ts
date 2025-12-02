import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";

interface OrderItem {
  name: string;
  qty: number;
  image: string;
  price: number;
  product: Types.ObjectId;
}

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface PaymentResult {
  id?: string;
  status?: string;
  update_time?: string;
  payer?: { email_address?: string };
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: SchemaTypes.ObjectId, ref: "User", required: true })
  user!: Types.ObjectId;

  @Prop({
    type: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: { type: SchemaTypes.ObjectId, ref: "Product", required: true },
      },
    ],
    required: true,
  })
  orderItems!: OrderItem[];

  @Prop({
    type: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    required: true,
  })
  shippingAddress!: ShippingAddress;

  @Prop({ required: true })
  paymentMethod!: string;

  @Prop({
    type: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      payer: { email_address: { type: String } },
    },
  })
  paymentResult?: PaymentResult;

  @Prop({ required: true, default: 0.0 })
  itemsPrice!: number;

  @Prop({ required: true, default: 0.0 })
  taxPrice!: number;

  @Prop({ required: true, default: 0.0 })
  shippingPrice!: number;

  @Prop({ required: true, default: 0.0 })
  totalPrice!: number;

  @Prop({ required: true, default: false })
  isPaid!: boolean;

  @Prop()
  paidAt?: Date;

  @Prop({ required: true, default: false })
  isDelivered!: boolean;

  @Prop()
  deliveredAt?: Date;
}

export type OrderDocument = HydratedDocument<Order>;
export const OrderSchema = SchemaFactory.createForClass(Order);
