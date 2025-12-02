import { IsObject, IsString } from "class-validator";

export class UpdateOrderPaidDto {
  @IsString()
  id!: string;

  @IsString()
  status!: string;

  @IsString()
  update_time!: string;

  @IsObject()
  payer!: { email_address: string };
}
