import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuthUser } from "../auth/auth-user.interface";
import { Order, OrderDocument } from "./order.schema";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderPaidDto } from "./dto/update-order-paid.dto";

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>) {}

  async getAll(): Promise<OrderDocument[]> {
    return this.orderModel.find({}).populate("user", "_id name email").exec();
  }

  async getById(id: string): Promise<OrderDocument> {
    const order = await this.orderModel.findById(id).populate("user", "name email").exec();
    if (!order) {
      throw new NotFoundException("Order not found!");
    }
    return order;
  }

  async create(dto: CreateOrderDto, currentUser: AuthUser): Promise<OrderDocument> {
    if (!dto.orderItems || dto.orderItems.length === 0) {
      throw new NotFoundException("No order items");
    }

    const order = new this.orderModel({
      orderItems: dto.orderItems.map((item) => ({
        ...item,
        product: item._id,
        _id: undefined
      })),
      user: currentUser._id,
      shippingAddress: dto.shippingAddress,
      paymentMethod: dto.paymentMethod,
      itemsPrice: dto.itemsPrice,
      taxPrice: dto.taxPrice,
      shippingPrice: dto.shippingPrice,
      totalPrice: dto.totalPrice
    });

    return order.save();
  }

  async getMine(currentUser: AuthUser): Promise<OrderDocument[]> {
    return this.orderModel.find({ user: currentUser._id }).exec();
  }

  async markPaid(id: string, dto: UpdateOrderPaidDto): Promise<OrderDocument> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException("Order not found!");
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: dto.id,
      status: dto.status,
      update_time: dto.update_time,
      payer: dto.payer
    };
    return order.save();
  }

  async markDelivered(id: string): Promise<OrderDocument> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException("Order not found");
    }

    order.isDelivered = true;
    order.deliveredAt = new Date();
    return order.save();
  }
}
