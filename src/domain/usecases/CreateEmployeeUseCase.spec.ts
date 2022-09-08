import { UuidGenerator } from "../../data/datasource/uidGenerator";
import { createEmployeeRepositoryMock } from "../../helpers";
import Employee from "../entities/Employee";
import { InvalidAgeError } from "../error";
import { EmployeeRepository } from "../repositories";
import { CreateEmployeeUseCase } from "./CreateEmployeeUseCase";


describe("CreateEmployeeUseCase", () => {
  let sut: CreateEmployeeUseCase;
  let mockEmployeeRepository: jest.Mocked<EmployeeRepository>;
  let mockUuidGenerator: jest.Mocked<UuidGenerator>;

  const validEmployeeFixture = { name: "Jane Doe", age: 25, role: "seller" };

  beforeAll(() => {
    mockUuidGenerator = {generate: jest.fn()};
    mockEmployeeRepository = createEmployeeRepositoryMock();
    sut = new CreateEmployeeUseCase(mockEmployeeRepository, mockUuidGenerator);
  });

  test("should call repository with correct args [name, age, role]", async () => {
    mockUuidGenerator.generate.mockReturnValue('newUuid');
    await sut.execute(validEmployeeFixture);
    expect(mockEmployeeRepository.create).toBeCalledWith({...validEmployeeFixture, employeeId: 'newUuid'});
  });

  test("should return Employee entity when succeeds", async () => {
    const expectedData =  new Employee(
        validEmployeeFixture.name,
        validEmployeeFixture.age,
        validEmployeeFixture.role,
        'newUuid'
      )
    mockEmployeeRepository.create.mockResolvedValue();
     
    const result = await sut.execute(validEmployeeFixture);
    
    expect(JSON.stringify(result)).toMatch(JSON.stringify(expectedData));
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
