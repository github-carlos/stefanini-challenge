"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
exports.__esModule = true;
exports.makeEmployeeController = void 0;
var aws_sdk_1 = __importStar(require("aws-sdk"));
var repositories_1 = require("../../data/repositories");
var uuidGeneratorAdapter_1 = require("../../datasources/uuidGeneratorAdapter");
var usecases_1 = require("../../domain/usecases");
var adapters_1 = require("../../presentation/controllers/adapters");
var employeeController;
function makeEmployeeController() {
    if (!employeeController) {
        var dynamoDbClientParams = {};
        if (process.env.IS_OFFLINE) {
            aws_sdk_1["default"].config.update({
                region: 'us-east-1',
                accessKeyId: 'xxxx',
                secretAccessKey: 'xxxx'
            });
            dynamoDbClientParams.region = "localhost";
            dynamoDbClientParams.endpoint = "http://localhost:8000";
        }
        var dynamoDbClient = new aws_sdk_1.DynamoDB.DocumentClient(dynamoDbClientParams);
        var employeeRepository = new repositories_1.EmployeeDynamoDbRepository(dynamoDbClient);
        var uuidGenerator = new uuidGeneratorAdapter_1.UuidGeneratorAdapter();
        employeeController = new adapters_1.EmployeeControllerHttpAdapter({
            createUseCase: new usecases_1.CreateEmployeeUseCase(employeeRepository, uuidGenerator),
            deleteUseCase: new usecases_1.DeleteEmployeeUseCase(employeeRepository),
            readAllUseCase: new usecases_1.ReadAllEmployeeUseCase(employeeRepository),
            readOneUseCase: new usecases_1.ReadOneEmployeeUseCase(employeeRepository),
            updateUseCase: new usecases_1.UpdateEmployeeUseCase(employeeRepository)
        });
    }
    return employeeController;
}
exports.makeEmployeeController = makeEmployeeController;
