import { EmployeeControllerHttpAdapter } from ".";
import {
  BadRequestError,
  NotFoundError,
  ServerError,
} from "../../../core/errors";
import { DataBaseError } from "../../../data/errors";
import Employee from "../../../domain/entities/Employee";
import { EmployeeNotFound, InvalidAgeError, MissingParamError } from "../../../domain/error";
import {
  CreateEmployeeUseCase,
  DeleteEmployeeUseCase,
  ReadAllEmployeeUseCase,
  ReadOneEmployeeUseCase,
  UpdateEmployeeUseCase,
} from "../../../domain/usecases";
import { createEmployeeRepositoryMock } from "../../../helpers";
import { EmployeeController, HttpRequest, HttpResponse } from "../ports";

describe("EmployeeControllerHttpAdapter", () => {
  let mockCreateEmployeeUseCase: jest.SpyInstance<any>;
  let mockReadOneEmployeeUseCase: jest.SpyInstance<any>;
  let readAllEmployeeUseCase: ReadAllEmployeeUseCase;
  let updateEmployeeUseCase: UpdateEmployeeUseCase;
  let deleteEmployeeUseCase: DeleteEmployeeUseCase;

  let sut: EmployeeController<HttpRequest, HttpResponse>;

  beforeAll(() => {
    const createEmployeeUseCase = new CreateEmployeeUseCase(
      createEmployeeRepositoryMock()
    );
    mockCreateEmployeeUseCase = jest.spyOn(createEmployeeUseCase, "execute");
    const readOneEmployeeUseCase = new ReadOneEmployeeUseCase(
      createEmployeeRepositoryMock()
    );
    mockReadOneEmployeeUseCase = jest.spyOn(readOneEmployeeUseCase, 'execute');

    readAllEmployeeUseCase = new ReadAllEmployeeUseCase(
      createEmployeeRepositoryMock()
    );
    updateEmployeeUseCase = new UpdateEmployeeUseCase(
      createEmployeeRepositoryMock()
    );
    deleteEmployeeUseCase = new DeleteEmployeeUseCase(
      createEmployeeRepositoryMock()
    );

    sut = new EmployeeControllerHttpAdapter({
      createUseCase: createEmployeeUseCase,
      readOneUseCase: readOneEmployeeUseCase,
      readAllUseCase: readAllEmployeeUseCase,
      updateUseCase: updateEmployeeUseCase,
      deleteUseCase: deleteEmployeeUseCase,
    });
  });

  describe("#post", () => {
    const fixturePost = { name: "Jane Doe", age: 25, role: "seller" };
    const request: HttpRequest = {
      body: fixturePost,
      params: null,
    };
    const employee = new Employee("Jane Doe", 25, "seller", "123abc");

    test("should call CreateEmployeeUseCase with correct params", async () => {
      await sut.create(request);
      expect(mockCreateEmployeeUseCase).toHaveBeenCalledWith(request.body);
    });

    test("should return body with fields and status 200 when creation has succees", async () => {
      mockCreateEmployeeUseCase.mockResolvedValue(employee);
      const result = await sut.create(request);
      expect(result).toHaveProperty("body");
      expect(result.status).toBe(200);
    });

    test("should return BadRequestError when age is negative", async () => {
      const invalidRequest = { ...request, body: { ...request.body, age: -1 } };
      mockCreateEmployeeUseCase.mockRejectedValue(new InvalidAgeError());

      const result = await sut.create(invalidRequest);
      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("message");
    });
    test("should return BadRequestError when age is zero", async () => {
      const invalidRequest = { ...request, body: { ...request.body, age: 0 } };
      mockCreateEmployeeUseCase.mockRejectedValue(new InvalidAgeError());

      const result = await sut.create(invalidRequest);
      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("message");
    });

    test("should return BadRequestError when Missing params", async () => {
      const invalidRequest = { ...request, body: { age: 25, role: "seller" } };
      const result = await sut.create(invalidRequest);
      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("message", "param [name] is missing");
    });

    test("should return BadRequestError when ParamTypeError is thrown", async () => {
      const invalidRequest = {
        ...request,
        body: { name: "Jane Doe", age: "25", role: "seller" },
      };
      const result = await sut.create(invalidRequest);
      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty(
        "message",
        "age type should be number but string was given"
      );
    });

    test("should return InternalError when database fails", async () => {
      mockCreateEmployeeUseCase.mockRejectedValue(new DataBaseError());
      const result = await sut.create(request);
      expect(result.status).toBe(500);
      expect(result.body).toHaveProperty("message", "Internal Server Error");
    });
  });

  describe("#readOne", () => {
    const fixturePost = {};
    const request: HttpRequest = {
      body: fixturePost,
      params: {employeeId: '123abc'},
    };
    const employee = new Employee("Jane Doe", 25, "seller", "123abc");

    test('should call ReadOneEmployeeUseCase with correct params', async () => {
      mockReadOneEmployeeUseCase.mockResolvedValue(employee);
      await sut.readOne(request);
      expect(mockReadOneEmployeeUseCase).toHaveBeenCalledWith(request.params.employeeId)
    });

    test('should return Employee when id exists', async () => {
      mockReadOneEmployeeUseCase.mockResolvedValue(employee);
      const result = await sut.readOne(request);
      expect(result.status).toBe(200);
      expect(result.body).toHaveProperty('name', employee.name);
      expect(result.body).toHaveProperty('age', employee.age);
      expect(result.body).toHaveProperty('role', employee.role);
      expect(result.body).toHaveProperty('employeeId', employee.employeeId);
    })

    test('should return response with status 404 when user does not exist', async () => {
      mockReadOneEmployeeUseCase.mockRejectedValue(new EmployeeNotFound());
      const result = await sut.readOne(request);
      expect(result.status).toBe(404);
    });

    test('should return MissingParamError when employeeId is not given', async () => {
      const request = {params: null, body: null};
      const result = await sut.readOne(request);
      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty('message', 'param [employeeId] is missing');
    });
    test('should return response with status 500 when DataBase fails', async () => {
      mockReadOneEmployeeUseCase.mockRejectedValue(new DataBaseError());
      const result = await sut.readOne(request);
      expect(result.status).toBe(500);
    });
  });
});
