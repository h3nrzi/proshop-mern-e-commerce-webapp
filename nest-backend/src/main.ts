import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as morgan from "morgan";
import * as path from "path";
import "reflect-metadata";
import { AppModule } from "./app.module";
import { MongooseExceptionFilter } from "./common/filters/mongoose-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const rootDir = path.resolve();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan("dev"));
  app.use("/uploads", express.static(path.join(rootDir, "/uploads")));

  app.setGlobalPrefix("api");
  app.useGlobalFilters(new MongooseExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
}

bootstrap();
