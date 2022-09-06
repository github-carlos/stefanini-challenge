import { BadRequestError } from "../../core/errors";

export class InvalidAgeError extends BadRequestError {
  constructor() {
    super("Employee age can not be negative or zero");
  }
}