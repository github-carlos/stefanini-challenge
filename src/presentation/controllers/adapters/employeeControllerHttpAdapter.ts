import { ConfigurationServicePlaceholders } from "aws-sdk/lib/config_service_placeholders";
import { HttpErrorHandler } from ".";
import { BadRequestError, NotFoundError } from "../../../core/errors";
import { MissingParamError, ParamTypeError } from "../../../domain/error";
import { CreateEmployeeUseCase, DeleteEmployeeUseCase, ReadAllEmployeeUseCase, ReadOneEmployeeUseCase, UpdateEmployeeUseCase } from "../../../domain/usecases";
import { EmployeeController, HttpRequest, HttpResponse } from "../ports";

type ParamsControllerHttpAdapter = {
  createUseCase: CreateEmployeeUseCase;
  readOneUseCase: ReadOneEmployeeUseCase;
  readAllUseCase: ReadAllEmployeeUseCase;
  updateUseCase: UpdateEmployeeUseCase;
  deleteUseCase: DeleteEmployeeUseCase;
}

export class EmployeeControllerHttpAdapter implements EmployeeController<HttpRequest, HttpResponse> {

  private createUseCase: CreateEmployeeUseCase;
  private readOneUseCase: ReadOneEmployeeUseCase;
  private readAllUseCase: ReadAllEmployeeUseCase;
  private updateUseCase: UpdateEmployeeUseCase;
  private deleteUseCase: DeleteEmployeeUseCase;

  constructor(params: ParamsControllerHttpAdapter) {
    this.createUseCase = params.createUseCase;
    this.readOneUseCase = params.readOneUseCase;
    this.readAllUseCase = params.readAllUseCase;
    this.updateUseCase = params.updateUseCase;
    this.deleteUseCase = params.deleteUseCase;
  }

  async create(params: HttpRequest): Promise<HttpResponse> {
    try {

      this.validateRequiredFields(params.body, ['name', 'age', 'role']);

      if (typeof params.body['name'] !== 'string') {
        throw new ParamTypeError('name', 'string', typeof params.body['name']);
      }
      if (typeof params.body['age'] !== 'number') {
        throw new ParamTypeError('age', 'number', typeof params.body['age']);
      }
      if (typeof params.body['role'] !== 'string') {
        throw new ParamTypeError('role', 'string', typeof params.body['role']);
      }

      const createUseCaseDTO = {
        name: params.body.name,
        age: params.body.age,
        role: params.body.role,
      }
      const result = await this.createUseCase.execute(createUseCaseDTO);
      return {body: result, status: 200};
    } catch(err) {
      return HttpErrorHandler.handle(err);
    }
  }
  async readOne(params: HttpRequest): Promise<HttpResponse> {
    try {
      this.validateRequiredFields(params.params, ['employeeId']);
      const employeeId = params.params['employeeId'];
      const result = await this.readOneUseCase.execute(employeeId)
      return {body: result, status: 200};
    } catch(err) {
      return HttpErrorHandler.handle(err);
    }
  }
  async readAll(params: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.readAllUseCase.execute();
      return {body: result, status: 200};
    } catch(err) {
      return HttpErrorHandler.handle(err);
    }
  }
  update(params: HttpRequest): Promise<HttpResponse> {
    throw new Error("Method not implemented.");
  }
  async delete(params: HttpRequest): Promise<HttpResponse> {
    try {
      const employeeId = params.params['employeeId'];
      const result = await this.deleteUseCase.execute(employeeId);
      return {body: {message: 'ok'}, status: 200};
    } catch(err) {
      return HttpErrorHandler.handle(err);
    }
  }

  private validateRequiredFields(data: any, requiredFields: Array<string>): void {

    data = data || {};
    requiredFields = requiredFields || [];

    for (const field of requiredFields) {
      if (!data[field] && data[field] !== 0) {
        throw new MissingParamError(field);
      }
    }
  }
}