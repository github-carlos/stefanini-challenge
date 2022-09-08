import { BadRequestError, NotFoundError, ServerError } from "../../../core/errors";
import { HttpResponse } from "../ports";

export class HttpErrorHandler {
  static handle(error: Error): HttpResponse {
    let status: number;
    let message = error.message;
    switch(error.name) {
      case 'BadRequestError':
        status = 400;
        break;
      case 'NotFoundError':
        status = 404;
        break;
      default:
        status = 500;
    }
    return {status, body: {message}};
  }
}