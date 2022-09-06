import { UpdateEmployeeUseCase } from ".";
import { NotFoundError } from "../../core/errors";
import { createEmployeeRepositoryMock } from "../../helpers";
import Employee from "../entities/Employee";
import { InvalidAgeError } from "../error";
import { EmployeeRepository } from "../repositories";
import { UseCase } from "./usecase.interface";

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