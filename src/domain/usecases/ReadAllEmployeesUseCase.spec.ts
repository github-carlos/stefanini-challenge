import { ReadAllEmployeeUseCase, UseCase } from ".";
import { createEmployeeRepositoryMock } from "../../helpers";
import Employee from "../entities/Employee";
import { EmployeeRepository } from "../repositories";



describe("ReadAllEmployeeUseCase", () => {
  let mockEmployeeRepository: jest.Mocked<EmployeeRepository>;
  let sut: ReadAllEmployeeUseCase;

  const employees = 
  [new Employee('Jane Doe', 25, 'seller', '123a'),
  new Employee('Jane Doe', 25, 'seller', '123b')];

  beforeAll(() => {
    mockEmployeeRepository = createEmployeeRepositoryMock();
    sut = new ReadAllEmployeeUseCase(mockEmployeeRepository);
  });

  test("should call repository to get all employess", async () => {
    mockEmployeeRepository.readAll.mockResolvedValue(employees);
    await sut.execute();
    expect(mockEmployeeRepository.readAll).toBeCalled();
  });

  test("should return Employees", async () => {
    mockEmployeeRepository.readAll.mockResolvedValue(employees);
    const result = await sut.execute();
    expect(result).toBe(employees);
  })
});