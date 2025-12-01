import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery } from "mongoose";
import { AuthUser } from "../auth/auth-user.interface";
import { Product, ProductDocument, ProductModel } from "./product.schema";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { CreateProductReviewDto } from "./dto/create-product-review.dto";

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private readonly productModel: ProductModel) {}

  async getAll(keyword?: string, pageNumber?: number) {
    const pageSize = 8;
    const page = Number(pageNumber) || 1;
    const searchCriteria: FilterQuery<Product> = keyword
      ? { name: { $regex: keyword, $options: "i" } }
      : {};

    const productsCountDocs = await this.productModel.countDocuments(searchCriteria);
    const pages = Math.ceil(productsCountDocs / pageSize);

    const products = await this.productModel
      .find(searchCriteria)
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .exec();

    return { products, page, pages };
  }

  async getById(id: string): Promise<ProductDocument> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    return product;
  }

  async getTop(): Promise<ProductDocument[]> {
    return this.productModel.find({}).sort({ rating: -1 }).limit(3).exec();
  }

  async create(dto: CreateProductDto, currentUser: AuthUser): Promise<ProductDocument> {
    const product = new this.productModel({
      user: currentUser._id,
      name: dto.name,
      price: dto.price,
      image: dto.image,
      brand: dto.brand,
      category: dto.category,
      countInStock: dto.countInStock,
      numReviews: dto.numReviews,
      description: dto.description
    });

    return product.save();
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductDocument> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException("Product not found");
    }

    product.name = dto.name;
    product.price = dto.price;
    product.description = dto.description;
    product.image = dto.image;
    product.brand = dto.brand;
    product.category = dto.category;
    product.countInStock = dto.countInStock;

    return product.save();
  }

  async delete(id: string): Promise<{ message: string }> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException("Product not found");
    }

    await this.productModel.deleteOne({ _id: product._id }).exec();
    return { message: "Product deleted successfully" };
  }

  async createReview(id: string, dto: CreateProductReviewDto, currentUser: AuthUser): Promise<{ message: string }> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException("Product not found");
    }

    const review = {
      user: currentUser._id as any,
      name: currentUser.name,
      rating: dto.rating,
      comment: dto.comment
    };

    await product.addReview(review);
    await product.save();

    return { message: "Review Added" };
  }
}
