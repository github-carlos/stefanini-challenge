import { ReadOneEmployeeUseCase } from ".";
import { createEmployeeRepositoryMock } from "../../helpers";
import Employee from "../entities/Employee";
import { EmployeeNotFound } from "../error";
import { EmployeeRepository } from "../repositories";

describe("ReadOneEmployeeUseCase", () => {
  let mockEmployeeRepository: jest.Mocked<EmployeeRepository>;
  let sut: ReadOneEmployeeUseCase;

  const employeeId = '123abc';
  const employee = new Employee('Jane Doe', 25, 'seller', employeeId);

  function mockValues() {
    mockEmployeeRepository.readOne.mockResolvedValue(employee);
  }

  beforeAll(() => {
    mockEmployeeRepository = createEmployeeRepositoryMock();
    sut = new ReadOneEmployeeUseCase(mockEmployeeRepository);
  });

  beforeEach(() => {
    mockValues();
  });

  test("should call repository with correct params", async () => {
    await sut.execute(employeeId);
    expect(mockEmployeeRepository.readOne).toBeCalledWith(employeeId);
  });

  test("should return Employee when id exists", async () => {
    const result = await sut.execute(employeeId);
    expect(result).toBe(employee);
  })

  test("should throw EmployeeNotFound when id does not exist", async () => {
    mockEmployeeRepository.readOne.mockResolvedValue(null);
    await expect(sut.execute('idNotKnown')).rejects.toThrow(EmployeeNotFound);
  });
});