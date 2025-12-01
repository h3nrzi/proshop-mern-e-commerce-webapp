import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
import mongoose, { Error as MongooseError } from "mongoose";

@Catch(MongooseError)
export class MongooseExceptionFilter implements ExceptionFilter {
  catch(exception: MongooseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = HttpStatus.BAD_REQUEST;
    let message = exception.message;

    if (exception instanceof mongoose.Error.ValidationError) {
      message = Object.values(exception.errors)
        .map((err) => err.message)
        .join(", ");
    } else if (
      (exception as any).name === "MongoServerError" &&
      (exception as any).code === 11000
    ) {
      message = "Duplicate key error";
    }

    const payload = new BadRequestException(message).getResponse();
    response.status(status).json({
      statusCode: status,
      ...(typeof payload === "string" ? { message: payload } : payload),
      path: request.url,
    });
  }
}
