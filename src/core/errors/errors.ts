export class BadRequestError extends Error {
  constructor(public message: string) {
    super();
  }
}

export class ServerError extends Error {
  public message = 'Internal Server Error';
}

export class NotFoundError extends Error {
  constructor(public message: string) {
    super();
  }
}