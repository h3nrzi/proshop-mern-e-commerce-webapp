import { IsNumber, IsString, Min, MinLength } from "class-validator";

export class UpdateProductDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsString()
  @MinLength(1)
  image!: string;

  @IsString()
  @MinLength(1)
  brand!: string;

  @IsString()
  @MinLength(1)
  category!: string;

  @IsNumber()
  @Min(0)
  countInStock!: number;

  @IsNumber()
  @Min(0)
  numReviews!: number;

  @IsString()
  @MinLength(1)
  description!: string;
}
