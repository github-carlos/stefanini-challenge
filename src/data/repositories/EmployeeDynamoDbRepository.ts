import { DynamoDB } from "aws-sdk";
import Employee from "../../domain/entities/Employee";
import { EmployeeRepository } from "../../domain/repositories";
import { CreateEmployeeParams } from "../../domain/usecases";
import { DataBaseError } from "../errors";

export class EmployeeDynamoDbRepository implements EmployeeRepository {
  static readonly tableName = process.env.EMPLOYEE_TABLE || "";

  private get _tableName() {
    return EmployeeDynamoDbRepository.tableName;
  }

  constructor(private readonly client: DynamoDB.DocumentClient) {}

  async create(employeeData: Employee): Promise<void> {
    try {
      console.log('employeeData', employeeData);
      console.log('tableName', this._tableName);
      const result = await this.client
        .put({
          TableName: this._tableName,
          Item: employeeData,
          ReturnValues: "ALL_OLD",
        })
        .promise();
      console.log('result', result);
    } catch (err) {
      console.log('RepositoryError', err);
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
      console.log('RepositoryError', err);
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
        console.log('Items', Items);
      return Items!.map((item) =>
        this.toEntity({
          name: item["name"],
          age: item["age"],
          role: item["role"],
          employeeId: item["employeeId"],
        })
      );
    } catch(err) {
      console.log('RepositoryError', err);
      throw new DataBaseError();
    }
  }

  update(employeeId: string, data: any): Promise<Employee> {
    throw new Error("Method not implemented.");
  }
  async delete(employeeId: string): Promise<boolean> {
    try {
      await this.client.delete({
        TableName: this._tableName,
        Key: {
          employeeId
        }
      }).promise();
      return true;
    } catch(err) {
      throw new DataBaseError();
    }

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
