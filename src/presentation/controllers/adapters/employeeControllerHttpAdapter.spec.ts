import { EmployeeControllerHttpAdapter } from ".";
import {
  BadRequestError,
  NotFoundError,
  ServerError,
} from "../../../core/errors";
import { UuidGenerator } from "../../../data/datasource/uidGenerator";
import { DataBaseError } from "../../../data/errors";
import Employee from "../../../domain/entities/Employee";
import {
  EmployeeNotFound,
  InvalidAgeError,
  MissingParamError,
} from "../../../domain/error";
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
  let mockUuidGenerator: jest.Mocked<UuidGenerator>;
  let mockCreateEmployeeUseCase: jest.SpyInstance<any>;
  let mockReadOneEmployeeUseCase: jest.SpyInstance<any>;
  let mockReadAllEmployeeUseCase: jest.SpyInstance<any>;
  let mockUpdateEmployeeUseCase: jest.SpyInstance<any>;
  let mockDeleteEmployeeUseCase: jest.SpyInstance<any>;

  let sut: EmployeeController<HttpRequest, HttpResponse>;

  beforeAll(() => {
    mockUuidGenerator = {generate: jest.fn()};
    const createEmployeeUseCase = new CreateEmployeeUseCase(
      createEmployeeRepositoryMock(), mockUuidGenerator
    );
    mockCreateEmployeeUseCase = jest.spyOn(createEmployeeUseCase, "execute");
    const readOneEmployeeUseCase = new ReadOneEmployeeUseCase(
      createEmployeeRepositoryMock()
    );
    mockReadOneEmployeeUseCase = jest.spyOn(readOneEmployeeUseCase, "execute");

    const readAllEmployeeUseCase = new ReadAllEmployeeUseCase(
      createEmployeeRepositoryMock()
    );
    mockReadAllEmployeeUseCase = jest.spyOn(readAllEmployeeUseCase, "execute");

    const updateEmployeeUseCase = new UpdateEmployeeUseCase(
      createEmployeeRepositoryMock()
    );
    mockUpdateEmployeeUseCase = jest.spyOn(updateEmployeeUseCase, "execute");

    const deleteEmployeeUseCase = new DeleteEmployeeUseCase(
      createEmployeeRepositoryMock()
    );
    mockDeleteEmployeeUseCase = jest.spyOn(deleteEmployeeUseCase, "execute");

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
    const request: HttpRequest = {
      body: {},
      params: { employeeId: "123abc" },
    };
    const employee = new Employee("Jane Doe", 25, "seller", "123abc");

    test("should call ReadOneEmployeeUseCase with correct params", async () => {
      mockReadOneEmployeeUseCase.mockResolvedValue(employee);
      await sut.readOne(request);
      expect(mockReadOneEmployeeUseCase).toHaveBeenCalledWith(
        request.params.employeeId
      );
    });

    test("should return Employee when id exists", async () => {
      mockReadOneEmployeeUseCase.mockResolvedValue(employee);
      const result = await sut.readOne(request);
      expect(result.status).toBe(200);
      expect(result.body).toHaveProperty("name", employee.name);
      expect(result.body).toHaveProperty("age", employee.age);
      expect(result.body).toHaveProperty("role", employee.role);
      expect(result.body).toHaveProperty("employeeId", employee.employeeId);
    });

    test("should return response with status 404 when user does not exist", async () => {
      mockReadOneEmployeeUseCase.mockRejectedValue(new EmployeeNotFound());
      const result = await sut.readOne(request);
      expect(result.status).toBe(404);
    });

    test("should return MissingParamError when employeeId is not given", async () => {
      const request = { params: null, body: null };
      const result = await sut.readOne(request);
      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty(
        "message",
        "param [employeeId] is missing"
      );
    });
    test("should return response with status 500 when DataBase fails", async () => {
      mockReadOneEmployeeUseCase.mockRejectedValue(new DataBaseError());
      const result = await sut.readOne(request);
      expect(result.status).toBe(500);
    });
  });

  describe("#readOne", () => {
    const request: HttpRequest = {
      body: {},
      params: {},
    };
    const employees = [new Employee("Jane Doe", 25, "seller", "123abc")];

    test('should call ReadOneEmployeeUseCase with correct params', async () => {
      mockReadAllEmployeeUseCase.mockResolvedValue(employees);
      await sut.readAll(request);
      expect(mockReadAllEmployeeUseCase).toHaveBeenCalledTimes(1);
    });

    test('should return body with an array and status 200', async () => {
      mockReadAllEmployeeUseCase.mockResolvedValue(employees);
      const result = await sut.readAll(request);
      expect(result.status).toBe(200);
      expect(result.body).toBeInstanceOf(Array);
    });

    test('should return with status 500 when DataBase fails', async () => {
      mockReadAllEmployeeUseCase.mockRejectedValue(new DataBaseError());
      const result = await sut.readAll(request);
      expect(result.status).toBe(500);
    });
  });

  describe("#update", () => {
    const request = {
      params: {employeeId: '123abc'},
      body: {
        name: 'Carlos Eduardo'
      }
    }
    const newEmployee = new Employee('Carlos Eduardo', 25, 'Programmer', '123abc');
    
    test('should call UpdateEmployeeUseCase with correct params', async () => {
      mockUpdateEmployeeUseCase.mockResolvedValue(newEmployee);
      await sut.update(request);
      expect(mockUpdateEmployeeUseCase).toHaveBeenCalledWith({employeeId: request.params.employeeId, data: request.body});
    });

    test('should return body with with new data and status 200 when succeeds', async () => {
      mockUpdateEmployeeUseCase.mockResolvedValue(newEmployee);
      const result = await sut.update(request);
      expect(result.status).toBe(200);
      expect(result.body).toHaveProperty('name', 'Carlos Eduardo');
    });

    test('should return BadRequestError when employeeId is missing', async () => {
      const invalidRequest = {params: {}, body: {}};
      const result = await sut.update(invalidRequest);
      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty('message', 'param [employeeId] is missing');
    });

    test('should return with status 500 when DataBase fails', async () => {
      mockUpdateEmployeeUseCase.mockRejectedValue(new DataBaseError());
      const result = await sut.update(request);
      expect(result.status).toBe(500);
    });

  })

  describe("#delete", () => {
    const request: HttpRequest = {
      body: {},
      params: {employeeId: "123abc"},
    };

    test('should call DeleteEmployeeUseCase with correct params', async () => {
      mockDeleteEmployeeUseCase.mockResolvedValue(true);
      await sut.delete(request);
      expect(mockDeleteEmployeeUseCase).toHaveBeenCalledTimes(1);
    });

    test('should return body with an array and status 200', async () => {
      mockDeleteEmployeeUseCase.mockResolvedValue(true);
      const result = await sut.delete(request);
      expect(result.status).toBe(200);
      expect(result.body).toHaveProperty('message', 'ok');
    });

    test('should return BadRequestError when employeeId is missing', async () => {
      const invalidRequest = {params: {}, body: {}};
      const result = await sut.delete(invalidRequest);
      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty('message', 'param [employeeId] is missing');
    })

    test('should return with status 500 when DataBase fails', async () => {
      mockDeleteEmployeeUseCase.mockRejectedValue(new DataBaseError());
      const result = await sut.delete(request);
      expect(result.status).toBe(500);
    });
  });
});
