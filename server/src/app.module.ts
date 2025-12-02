import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./user/user.module";
import { ProductModule } from "./product/product.module";
import { OrderModule } from "./order/order.module";
import { UploadModule } from "./upload/upload.module";
import { AppController } from "./config/app.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>("MONGO_URI", "mongodb://localhost:27017/proshop"),
        dbName: config.get<string>("MONGO_DB", "proshop"),
      }),
    }),
    UserModule,
    ProductModule,
    OrderModule,
    UploadModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
