import { UseCase } from ".";
import Employee from "../entities/Employee";
import { EmployeeNotFound } from "../error";
import { EmployeeRepository } from "../repositories";

export class ReadOneEmployeeUseCase implements UseCase<string, Employee> {
  constructor(public repository: EmployeeRepository) {}
  async execute(employeeId: string): Promise<Employee> {
    const employee = await this.repository.readOne(employeeId);

    if (!employee) {
      throw new EmployeeNotFound();
    }

    return employee;
  }
}