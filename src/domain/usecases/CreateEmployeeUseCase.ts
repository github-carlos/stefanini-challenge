import { UseCase } from ".";
import Employee from "../entities/Employee";
import { EmployeeRepository } from "../repositories";
import { UuidGenerator } from "../../data/datasource/uidGenerator";

export type CreateEmployeeParams = {
  name: string;
  age: number;
  role: string;
};

export class CreateEmployeeUseCase
  implements UseCase<CreateEmployeeParams, Employee>
{
  constructor(private repository: EmployeeRepository, private uuidGenerator: UuidGenerator) {}

  async execute(params: CreateEmployeeParams): Promise<Employee> {
    Employee.validate(params);
    const employee = new Employee(params.name, params.age, params.role, this.uuidGenerator.generate());
    await this.repository.create(employee);
    return employee;
  }
}