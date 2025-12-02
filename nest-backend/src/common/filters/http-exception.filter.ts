import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  InternalServerErrorException
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      return response.status(status).json({
        statusCode: status,
        ...(typeof payload === "string" ? { message: payload } : payload),
        path: request.url
      });
    }

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const payload = new InternalServerErrorException("Something went wrong").getResponse();
    return response.status(status).json({
      statusCode: status,
      ...(typeof payload === "string" ? { message: payload } : payload),
      path: request.url
    });
  }
}
