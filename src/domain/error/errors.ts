import { BadRequestError, NotFoundError } from "../../core/errors";

export class InvalidAgeError extends BadRequestError {
  constructor() {
    super("Employee age can not be negative or zero");
  }
}

export class EmployeeNotFound extends NotFoundError {
  constructor() {
    super('Does not exist an Employee for given id');
  }
}