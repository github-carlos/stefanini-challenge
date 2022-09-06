import { UseCase } from ".";
import { EmployeeNotFound } from "../error";
import { EmployeeRepository } from "../repositories";

type DeleteResponse = {
  message: string;
}

export class DeleteEmployeeUseCase implements UseCase<string, DeleteResponse> {
  constructor(private repository: EmployeeRepository) {}
  
  async execute(employeeId: string): Promise<DeleteResponse> {

    const employee = await this.repository.readOne(employeeId);

    if (!employee) {
      throw new EmployeeNotFound();
    }

    const deleted = await this.repository.delete(employeeId);
    if (deleted) {
      return {message: 'Employee deleted with success'};
    }
    return {message: 'Employee not deleted'};
  }
}