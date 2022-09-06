import { UseCase } from ".";
import Employee from "../entities/Employee";
import { EmployeeRepository } from "../repositories";

export class ReadAllEmployeeUseCase implements UseCase<null, Array<Employee>> {
  constructor(private repository: EmployeeRepository) {}
  async execute(): Promise<Employee[]> {
    const employees = await this.repository.readAll();
    return employees;
  }
}