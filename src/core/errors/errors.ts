export class BadRequestError extends Error {
  constructor(public message: string, public name = 'BadRequestError') {
    super();
  }
}

export class ServerError extends Error {
  public message = 'Internal Server Error';
  public name = 'ServerError';
}

export class NotFoundError extends Error {
  constructor(public message: string, public name: string = 'NotFoundError') {
    super();
  }
}