import Employee from "../entities/Employee";
import { CreateEmployeeParams } from "../usecases/CreateEmployeeUseCase";

export interface EmployeeRepository {
  create(employeeData: CreateEmployeeParams): Promise<Employee>;
  readOne(employeeId: string): Promise<Employee>;
  readAll(): Promise<Array<Employee>>;
  update(employeeId: string, data: any): Promise<Employee>;
  delete(employeeId: string): Promise<boolean>;
}