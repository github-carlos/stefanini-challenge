import Employee from "../entities/Employee";

export interface EmployeeRepository {
  create(employeeData: Employee): Promise<void>;
  readOne(employeeId: string): Promise<Employee|null>;
  readAll(): Promise<Array<Employee>>;
  update(employeeId: string, data: any): Promise<Employee>;
  delete(employeeId: string): Promise<boolean>;
}