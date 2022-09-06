import { UseCase } from ".";
import Employee from "../entities/Employee";
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
    Employee.validate(params);
    const newEmployee = await this.repository.create(params);
    return newEmployee;
  }
}