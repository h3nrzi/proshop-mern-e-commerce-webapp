import { Controller, Get } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Controller()
export class AppController {
  constructor(private readonly config: ConfigService) {}

  @Get("api/config/paypal")
  getPaypalConfig() {
    return { clientId: this.config.get<string>("PAYPAL_CLIENT_ID") };
  }
}
