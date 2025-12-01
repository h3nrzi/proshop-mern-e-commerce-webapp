import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import path from "path";
import { AppModule } from "./app.module";
import { MongooseExceptionFilter } from "./common/filters/mongoose-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const rootDir = path.resolve();
  const nodeEnv = process.env.NODE_ENV;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  if (nodeEnv === "development") app.use(morgan("dev"));
  app.use("/uploads", express.static(path.join(rootDir, "/uploads")));
  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );
  app.useGlobalFilters(new MongooseExceptionFilter());

  const port = process.env.PORT || 3000;
  await app.listen(port);
}

bootstrap();
