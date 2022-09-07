import { BadRequestError, NotFoundError, ServerError } from "../../../core/errors";
import { HttpResponse } from "../ports";

export class HttpErrorHandler {
  static handle(error: Error): HttpResponse {
    let status = 500;
    let message = error.message;
    if (error instanceof BadRequestError) {
      status = 400;
    }
    if (error instanceof NotFoundError) {
      status = 404;
    }
    if (error instanceof ServerError) {
      status = 500;
    }
    return {status, body: {message}};
  }
}