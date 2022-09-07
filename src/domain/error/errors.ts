import { BadRequestError, NotFoundError } from "../../core/errors";

export class InvalidAgeError extends BadRequestError {
  constructor() {
    super("Employee age can not be negative or zero");
  }
}

export class MissingParamError extends BadRequestError {
  constructor(paramName: string) {
    super(`param [${paramName}] is missing`)
  }
}

export class ParamTypeError extends BadRequestError {
  constructor(paramName: string, expectedType: string, givenType: string) {
    super(`${paramName} type should be ${expectedType} but ${givenType} was given`);
  }
}

export class EmployeeNotFound extends NotFoundError {
  constructor() {
    super('Does not exist an Employee for given id');
  }
}