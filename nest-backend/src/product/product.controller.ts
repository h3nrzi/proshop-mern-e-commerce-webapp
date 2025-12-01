import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { CreateProductReviewDto } from "./dto/create-product-review.dto";
import { AuthGuard } from "../auth/auth.guard";
import { AdminGuard } from "../auth/admin.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { AuthUser } from "../auth/auth-user.interface";

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getAll(@Query("keyword") keyword?: string, @Query("pageNumber") pageNumber?: number) {
    return this.productService.getAll(keyword, pageNumber);
  }

  @Get("top")
  getTop() {
    return this.productService.getTop();
  }

  @Get(":id")
  getById(@Param("id") id: string) {
    return this.productService.getById(id);
  }

  @UseGuards(AuthGuard)
  @Post(":id/review")
  createReview(
    @Param("id") id: string,
    @Body() payload: CreateProductReviewDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.productService.createReview(id, payload, user);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() payload: CreateProductDto, @CurrentUser() user: AuthUser) {
    return this.productService.create(payload, user);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() payload: UpdateProductDto) {
    return this.productService.update(id, payload);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.productService.delete(id);
  }
}
