import { NotFoundError } from "../../core/errors";
import { createEmployeeRepositoryMock } from "../../helpers";
import Employee from "../entities/Employee";
import { EmployeeNotFound } from "../error";
import { EmployeeRepository } from "../repositories";
import { UseCase } from "./usecase.interface";

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

describe("DeleteEmployeeUseCase", () => {
  let mockEmployeeRepository: jest.Mocked<EmployeeRepository>;
  let sut: DeleteEmployeeUseCase;

  const employeeId = '123abc';
  const employee = new Employee('Jane Doe', 25, 'seller', employeeId);

  function mockValues() {
    mockEmployeeRepository.readOne.mockResolvedValue(employee);
    mockEmployeeRepository.delete.mockResolvedValue(true);
  }

  beforeAll(() => {
    mockEmployeeRepository = createEmployeeRepositoryMock();
    sut = new DeleteEmployeeUseCase(mockEmployeeRepository);
  });

  beforeEach(() => {
    mockValues()
  });

  test("should call repository with correct params", async () => {
    await sut.execute(employeeId);
    expect(mockEmployeeRepository.delete).toBeCalledWith(employeeId);
  });

  test("should return success message when employee is deleted", async () => {
    const result = await sut.execute(employeeId);
    expect(result.message).toBe('Employee deleted with success');
  })

  test("should throw EmployeeNotFound when id does not exist", async () => {
    mockEmployeeRepository.readOne.mockResolvedValue(null);
    mockEmployeeRepository.delete.mockResolvedValue(null);
    await expect(sut.execute('idNotKnown')).rejects.toThrow(EmployeeNotFound);
  });
});