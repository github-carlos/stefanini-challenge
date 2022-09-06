import { UseCase } from ".";
import Employee from "../entities/Employee";
import { EmployeeNotFound } from "../error";
import { EmployeeRepository } from "../repositories";

type UpdateEmployeeParams = {
  employeeId: string;
  data: any;
}

export class UpdateEmployeeUseCase implements UseCase<UpdateEmployeeParams, Employee> {
  constructor(private repository: EmployeeRepository) {}
  async execute(params: UpdateEmployeeParams): Promise<Employee> {
    
    const employee = await this.repository.readOne(params.employeeId);

    if (!employee) {
      throw new EmployeeNotFound();
    }

    const updatedData = {
      name: params.data.name || employee.name,
      age: params.data.age === 0 ? params.data.age : params.data.age || employee.age,
      role: params.data.role || employee.role,
      employeeId: employee.employeeId
    }

    Employee.validate(updatedData);

    const updatedEmployee = await this.repository.update(params.employeeId, updatedData);
    return updatedEmployee;
  }

}