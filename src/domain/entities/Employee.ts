import { InvalidAgeError } from "../error";

export default class Employee {
  constructor(public name: string, public age: number, public role: string, public employeeId: string) {}

  static validate(params: {name: string, age: number, role: string}) {
    if (params.age <= 0) {
      throw new InvalidAgeError()
    }
  }
}