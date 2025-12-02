import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as morgan from "morgan";
import * as path from "path";
import "reflect-metadata";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { MongooseExceptionFilter } from "./common/filters/mongoose-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const rootDir = path.resolve();
  const server: express.Express = app.getHttpAdapter().getInstance();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan("dev"));
  server.use("/uploads", express.static(path.join(rootDir, "/uploads")));

  app.setGlobalPrefix("api");
  app.useGlobalFilters(new MongooseExceptionFilter(), new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  if (process.env.NODE_ENV === "production") {
    server.use(express.static(path.join(rootDir, "/client/dist")));
    server.get("*", (req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (req.path.startsWith("/api")) return next();
      return res.sendFile(path.join(rootDir, "/client/dist/index.html"));
    });
  } else {
    server.get("/", (_req: express.Request, res: express.Response) =>
      res.send("API is running...")
    );
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
}

bootstrap();
