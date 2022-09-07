import { DynamoDB } from "aws-sdk";
import Employee from "../../domain/entities/Employee";
import { EmployeeRepository } from "../../domain/repositories";
import { CreateEmployeeParams } from "../../domain/usecases";
import { DataBaseError } from "../errors";

export class EmployeeDynamoDbRepository implements EmployeeRepository {
  static readonly tableName = process.env.EMPLOYEE_TABLE || "";

  get _tableName() {
    return EmployeeDynamoDbRepository.tableName;
  }

  constructor(private readonly client: DynamoDB.DocumentClient) {}

  async create(employeeData: CreateEmployeeParams): Promise<Employee> {
    try {
      const result = await this.client
        .put({
          TableName: this._tableName,
          Item: employeeData,
          ReturnValues: "ALL_OLD",
        })
        .promise();
      // console.log('result', result);
      return this.toEntity(result.$response.data! as any);
    } catch (err) {
      throw new DataBaseError();
    }
  }
  async readOne(employeeId: string): Promise<Employee | null> {
    try {
      const { Item } = await this.client
        .get({
          TableName: this._tableName,
          Key: {
            employeeId,
          },
        })
        .promise();
      return Item ? this.toEntity(Item! as any) : null;
    } catch (err) {
      throw new DataBaseError();
    }
  }
  async readAll(): Promise<Employee[]> {
    try {
      const { Items } = await this.client
        .query({
          TableName: this._tableName,
        })
        .promise();
      return Items!.map((item) =>
        this.toEntity({
          name: item["name"],
          age: item["age"],
          role: item["role"],
          employeeId: item["employeeId"],
        })
      );
    } catch(err) {
      throw new DataBaseError();
    }
  }

  update(employeeId: string, data: any): Promise<Employee> {
    throw new Error("Method not implemented.");
  }
  delete(employeeId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  private toEntity(data: {
    name: string;
    age: number;
    role: string;
    employeeId: string;
  }) {
    return new Employee(data.name, data.age, data.role, data.employeeId);
  }
}
