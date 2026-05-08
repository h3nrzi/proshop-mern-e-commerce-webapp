import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as express from "express";
import * as path from "path";
import "reflect-metadata";
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { MongooseExceptionFilter } from "./common/filters/mongoose-exception.filter";

async function bootstrap() {
  // ----------------------------------------
  // CREATE NEST APPLICATION
  // ----------------------------------------
  const app = await NestFactory.create(AppModule);

  // ----------------------------------------
  // SWAGGER (OPENAPI) DOCUMENTATION
  // ----------------------------------------
  const config = new DocumentBuilder()
    .setTitle("ProShop API")
    .setDescription("E-commerce API for ProShop application")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  // ----------------------------------------
  // STATIC & MIDDLEWARE SETUP
  // ----------------------------------------
  const rootDir = path.resolve();
  const server: express.Express = app.getHttpAdapter().getInstance();

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Cookies & logging
  app.use(cookieParser());
  app.use(morgan("dev"));

  // Serve uploaded files statically
  server.use("/uploads", express.static(path.join(rootDir, "/uploads")));

  // ----------------------------------------
  // GLOBAL PREFIX, FILTERS & PIPES
  // ----------------------------------------
  app.setGlobalPrefix("api");
  app.useGlobalFilters(new MongooseExceptionFilter(), new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // ----------------------------------------
  // PRODUCTION vs DEVELOPMENT ROUTING
  // ----------------------------------------
  if (process.env.NODE_ENV === "production") {
    // Serve React static files
    server.use(express.static(path.join(rootDir, "/client/dist")));

    // Catch-all: forward non-API routes to React index.html
    server.get("*", (req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (req.path.startsWith("/api")) return next();
      return res.sendFile(path.join(rootDir, "/client/dist/index.html"));
    });
  } else {
    // Development: simple API running message
    server.get("/", (_req: express.Request, res: express.Response) =>
      res.send("API is running..."),
    );
  }

  // ----------------------------------------
  // START SERVER
  // ----------------------------------------
  const port = process.env.PORT || 3000;
  await app.listen(port);
}

bootstrap();
