import AWS, { DynamoDB } from "aws-sdk";
import { EmployeeDynamoDbRepository } from "../../data/repositories";
import { UuidGeneratorAdapter } from "../../datasources/uuidGeneratorAdapter";
import {
  CreateEmployeeUseCase,
  DeleteEmployeeUseCase,
  ReadAllEmployeeUseCase,
  ReadOneEmployeeUseCase,
  UpdateEmployeeUseCase,
} from "../../domain/usecases";
import { EmployeeControllerHttpAdapter } from "../../presentation/controllers/adapters";
import {
  EmployeeController,
  HttpRequest,
  HttpResponse,
} from "../../presentation/controllers/ports";

let employeeController: EmployeeController<HttpRequest, HttpResponse>;

export function makeEmployeeController(): EmployeeController<
  HttpRequest,
  HttpResponse
> {
  if (!employeeController) {
    const dynamoDbClientParams: any = {};
    if (process.env.IS_OFFLINE) {
      AWS.config.update({
        region: 'us-east-1',
        accessKeyId: 'xxxx',
        secretAccessKey: 'xxxx',
      });
      dynamoDbClientParams.region = "localhost";
      dynamoDbClientParams.endpoint = "http://localhost:8000";
    }
    const dynamoDbClient = new DynamoDB.DocumentClient(dynamoDbClientParams);
    const employeeRepository = new EmployeeDynamoDbRepository(dynamoDbClient);
    const uuidGenerator = new UuidGeneratorAdapter();

    employeeController = new EmployeeControllerHttpAdapter({
      createUseCase: new CreateEmployeeUseCase(employeeRepository, uuidGenerator),
      deleteUseCase: new DeleteEmployeeUseCase(employeeRepository),
      readAllUseCase: new ReadAllEmployeeUseCase(employeeRepository),
      readOneUseCase: new ReadOneEmployeeUseCase(employeeRepository),
      updateUseCase: new UpdateEmployeeUseCase(employeeRepository),
    });
  }
  return employeeController;
}
