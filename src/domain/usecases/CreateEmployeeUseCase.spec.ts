import { createEmployeeRepositoryMock } from "../../helpers";
import Employee from "../entities/Employee";
import { InvalidAgeError } from "../error";
import { EmployeeRepository } from "../repositories";
import { CreateEmployeeUseCase } from "./CreateEmployeeUseCase";


describe("CreateEmployeeUseCase", () => {
  let sut: CreateEmployeeUseCase;
  let mockEmployeeRepository: jest.Mocked<EmployeeRepository>;

  const validEmployeeFixture = { name: "Jane Doe", age: 25, role: "seller" };

  beforeAll(() => {
    mockEmployeeRepository = createEmployeeRepositoryMock();
    sut = new CreateEmployeeUseCase(mockEmployeeRepository);
  });

  test("should call repository with correct args [name, age, role]", async () => {
    await sut.execute(validEmployeeFixture);
    expect(mockEmployeeRepository.create).toBeCalledWith(validEmployeeFixture);
  });

  test("should return Employee entity when succeeds", async () => {
    const expectedEmployee =  new Employee(
        validEmployeeFixture.name,
        validEmployeeFixture.age,
        validEmployeeFixture.role,
        '123abc'
      )
    mockEmployeeRepository.create.mockResolvedValue(expectedEmployee)
     
    const result = await sut.execute(validEmployeeFixture);
    
    expect(result).toBe(expectedEmployee);
  });

  test("should throw InvalidAgeError error when age is negative", async () => {
    const employeeWithNegativeAge = Object.assign({}, { ...validEmployeeFixture, age: -1 });
    await expect(sut.execute(employeeWithNegativeAge)).rejects.toThrow(
      InvalidAgeError
    );
  });

  test("should throw InvalidAgeError error when age is zero", async () => {
    const employeeWithNegativeAge = Object.assign({}, { ...validEmployeeFixture, age: 0 });
    await expect(sut.execute(employeeWithNegativeAge)).rejects.toThrow(
      InvalidAgeError
    );
  });
});
