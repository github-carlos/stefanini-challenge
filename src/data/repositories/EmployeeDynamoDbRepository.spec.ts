import Employee from "../../domain/entities/Employee";
import { DataBaseError } from "../errors";
import { EmployeeDynamoDbRepository } from "./EmployeeDynamoDbRepository";

describe("EmployeeDynamoDbRepository", () => {
  let sut: EmployeeDynamoDbRepository;
  let mockDynamoDbClient: jest.Mocked<any>;

  const employeeFixture = new Employee("Jane Doe", 25, "seller", "1234c");

  function createMockDynamoDbClient(): jest.Mocked<any> {
    return {
      batchGet: jest.fn(),
      batchWrite: jest.fn(),
      createSet: jest.fn(),
      delete: jest.fn(),
      get: jest.fn(),
      put: jest.fn(),
      query: jest.fn(),
      scan: jest.fn(),
      transactGet: jest.fn(),
      transactWrite: jest.fn(),
      update: jest.fn(),
    };
  }

  beforeAll(() => {
    mockDynamoDbClient = createMockDynamoDbClient();
    sut = new EmployeeDynamoDbRepository(mockDynamoDbClient);
  });

  describe("#Create", () => {
    const employeeCreateFixture = { name: "Jane Doe", age: 25, role: "seller", employeeId: '123abc'};
    function mockValidReturn() {
      return mockDynamoDbClient.put.mockReturnValue({
        promise: async () => {},
      });
    }
    test("should call put method with correct params", async () => {
      mockValidReturn();
      await sut.create(employeeCreateFixture);
      expect(mockDynamoDbClient.put).toBeCalledWith({
        TableName: EmployeeDynamoDbRepository.tableName,
        ReturnValues: "ALL_OLD",
        Item: employeeCreateFixture,
      });
    });

    test("should throw DataBaseError when something goes wrong", async () => {
      mockDynamoDbClient.put.mockReturnValue({
        promise: async () => {
          throw new Error();
        },
      });

      await expect(sut.create(employeeCreateFixture)).rejects.toThrow(
        DataBaseError
      );
    });

    test("should not throw when everything succeeds", async () => {
      mockValidReturn();
      await expect(sut.create(employeeCreateFixture)).resolves.not.toThrow();
    });
  });

  describe("Read", () => {
    function mockValidReturn() {
      mockDynamoDbClient.get.mockReturnValue({
        promise: async () => ({
          Item: {
            name: employeeFixture.name,
            age: employeeFixture.age,
            role: employeeFixture.role,
            employeeId: employeeFixture.employeeId,
          },
        }),
      });
    }

    test("should call get method with correct params", async () => {
      mockValidReturn();
      await sut.readOne(employeeFixture.employeeId);
      expect(mockDynamoDbClient.get).toHaveBeenCalledWith({
        TableName: EmployeeDynamoDbRepository.tableName,
        Key: {
          employeeId: employeeFixture.employeeId,
        },
      });
    });

    test("should return Employee entity when employeeId exists", async () => {
      mockValidReturn();
      const result = await sut.readOne(employeeFixture.employeeId);
      expect(result).toBeInstanceOf(Employee);
      expect(result!.employeeId).toBe(employeeFixture.employeeId);
    });

    test("should return null when does not exist Employee for given id", async () => {
      mockDynamoDbClient.get.mockReturnValue({promise: async () => {
        return { Item: null }
      }})
      const result = await sut.readOne(employeeFixture.employeeId);
      expect(result).toBeNull();
    });

    test("should throw DataBaseError when dynamodb client throws", async () => {
      mockDynamoDbClient.get.mockReturnValue({promise: async () => {
        throw new Error();
      }});
      await expect(sut.readOne(employeeFixture.employeeId)).rejects.toThrow(DataBaseError);
    });
  });

  describe("ReadAll", () => {
    test("should call getItems with correct params", async () => {
      mockDynamoDbClient.query.mockReturnValue({promise: async () => {
        return {Items: []};
      }})
      await sut.readAll();
      expect(mockDynamoDbClient.query).toBeCalledWith({TableName: EmployeeDynamoDbRepository.tableName});
    });

    test("should throw DataBaseError when dynamodb client throws", async () => {
      mockDynamoDbClient.query.mockReturnValue({promise: async () => {
        throw new Error();
      }});
      await expect(sut.readAll()).rejects.toThrow(DataBaseError);
    });
  });

  describe("Delete", () => {
    const employeeId = "123abc";
    test("should call delete with correct params", async() => {
      mockDynamoDbClient.delete.mockReturnValue({promise: async () => {}});
      await sut.delete(employeeId);
      expect(mockDynamoDbClient.delete).toHaveBeenCalledWith({
        TableName: EmployeeDynamoDbRepository.tableName,
        Key: {
          employeeId
        }
      })
    });
    test("should throw DataBaseError when dynamodb client throws", async () => {
      mockDynamoDbClient.delete.mockReturnValue({promise: async () => {
        throw new Error();
      }})
      await expect(sut.delete(employeeId)).rejects.toThrow(DataBaseError);
    });
  });
});
