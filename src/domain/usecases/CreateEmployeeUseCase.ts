import { UseCase } from ".";
import Employee from "../entities/Employee";
import { InvalidAgeError } from "../error";
import { EmployeeRepository } from "../repositories";

export type CreateEmployeeParams = {
  name: string;
  age: number;
  role: string;
};

export class CreateEmployeeUseCase
  implements UseCase<CreateEmployeeParams, Employee>
{
  constructor(private repository: EmployeeRepository) {}

  async execute(params: CreateEmployeeParams): Promise<Employee> {
    this.validateData(params);
    const newEmployee = await this.repository.create(params);
    return newEmployee;
  }

  private validateData(params: CreateEmployeeParams): void {
    if (params.age <= 0) throw new InvalidAgeError();
  }
}