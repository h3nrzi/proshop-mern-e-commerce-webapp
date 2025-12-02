import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsObject,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";

class ShippingAddressDto {
  @IsString()
  address!: string;

  @IsString()
  city!: string;

  @IsString()
  postalCode!: string;

  @IsString()
  country!: string;
}

class OrderItemDto {
  @IsString()
  _id!: string;

  @IsString()
  name!: string;

  @IsString()
  image!: string;

  @IsString()
  description!: string;

  @IsString()
  brand!: string;

  @IsString()
  category!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsNumber()
  @Min(0)
  countInStock!: number;

  @IsNumber()
  @Min(0)
  rating!: number;

  @IsNumber()
  @Min(0)
  numReviews!: number;

  @IsNumber()
  @Min(1)
  qty!: number;
}

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems!: OrderItemDto[];

  @IsNumber()
  @Min(0)
  itemsPrice!: number;

  @IsNumber()
  @Min(0)
  shippingPrice!: number;

  @IsNumber()
  @Min(0)
  taxPrice!: number;

  @IsNumber()
  @Min(0)
  totalPrice!: number;

  @IsObject()
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress!: ShippingAddressDto;

  @IsString()
  paymentMethod!: string;
}
