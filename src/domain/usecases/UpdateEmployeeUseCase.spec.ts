import { NotFoundError } from "../../core/errors";
import { createEmployeeRepositoryMock } from "../../helpers";
import Employee from "../entities/Employee";
import { InvalidAgeError } from "../error";
import { EmployeeRepository } from "../repositories";
import { UseCase } from "./usecase.interface";

type UpdateEmployeeParams = {
  employeeId: string;
  data: any;
}

export class UpdateEmployeeUseCase implements UseCase<UpdateEmployeeParams, Employee> {
  constructor(private repository: EmployeeRepository) {}
  async execute(params: UpdateEmployeeParams): Promise<Employee> {
    
    const employee = await this.repository.readOne(params.employeeId);

    if (!employee) {
      throw new NotFoundError('Does not exist an Employee for given id');
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

describe("CreateEmployeeUseCase", () => {
  let sut: UpdateEmployeeUseCase;
  let mockEmployeeRepository: jest.Mocked<EmployeeRepository>;

  const employeeFixture = new Employee('Jane Doe', 25, 'seller', '123abc');
  const validUpdateFixture = {employeeId: '123abc', data: {name: 'Jane Doe v2'}};

  beforeAll(() => {
    mockEmployeeRepository = createEmployeeRepositoryMock();
    sut = new UpdateEmployeeUseCase(mockEmployeeRepository);
  });

  test("should throw NotFoundError when id does not exist", async () => {
    const params = {employeeId: 'invalidId', data: {}};
    mockEmployeeRepository.readOne.mockResolvedValue(null);
    await expect(sut.execute(params)).rejects.toThrow(NotFoundError);
  });

  test("should call repository with correct args", async () => {
    mockEmployeeRepository.readOne.mockResolvedValue(employeeFixture);
    await sut.execute(validUpdateFixture);
    expect(mockEmployeeRepository.update).toBeCalledWith(validUpdateFixture.employeeId, {...employeeFixture, ...validUpdateFixture.data});
  });

  test("should return Employee updated when succeeds", async () => {
    const expectedEmployee = new Employee(validUpdateFixture.data.name, 25, 'seller', '123abc');
    mockEmployeeRepository.readOne.mockResolvedValue(employeeFixture);
    mockEmployeeRepository.update.mockResolvedValue(expectedEmployee);
     
    const result = await sut.execute(validUpdateFixture);
    
    expect(result).toBe(expectedEmployee);
  });


  test("should throw InvalidAgeError error when age is negative", async () => {
    const employeeWithNegativeAge = Object.assign({}, { ...validUpdateFixture, data: {age: -1} });
    await expect(sut.execute(employeeWithNegativeAge)).rejects.toThrow(
      InvalidAgeError
    );
  });

  test("should throw InvalidAgeError error when age is zero", async () => {
    const employeeWithNegativeAge = Object.assign({}, { ...validUpdateFixture, data: { age: 0 }} );
    await expect(sut.execute(employeeWithNegativeAge)).rejects.toThrow(
      InvalidAgeError
    );
  });

});