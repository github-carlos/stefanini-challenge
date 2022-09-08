"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.EmployeeControllerHttpAdapter = void 0;
var _1 = require(".");
var error_1 = require("../../../domain/error");
var EmployeeControllerHttpAdapter = /** @class */ (function () {
    function EmployeeControllerHttpAdapter(params) {
        this.createUseCase = params.createUseCase;
        this.readOneUseCase = params.readOneUseCase;
        this.readAllUseCase = params.readAllUseCase;
        this.updateUseCase = params.updateUseCase;
        this.deleteUseCase = params.deleteUseCase;
    }
    EmployeeControllerHttpAdapter.prototype.create = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var createUseCaseDTO, result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.validateRequiredFields(params.body, ['name', 'age', 'role']);
                        if (typeof params.body['name'] !== 'string') {
                            throw new error_1.ParamTypeError('name', 'string', typeof params.body['name']);
                        }
                        if (typeof params.body['age'] !== 'number') {
                            throw new error_1.ParamTypeError('age', 'number', typeof params.body['age']);
                        }
                        if (typeof params.body['role'] !== 'string') {
                            throw new error_1.ParamTypeError('role', 'string', typeof params.body['role']);
                        }
                        createUseCaseDTO = {
                            name: params.body.name,
                            age: params.body.age,
                            role: params.body.role
                        };
                        return [4 /*yield*/, this.createUseCase.execute(createUseCaseDTO)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, { body: result, status: 200 }];
                    case 2:
                        err_1 = _a.sent();
                        return [2 /*return*/, _1.HttpErrorHandler.handle(err_1)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EmployeeControllerHttpAdapter.prototype.readOne = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var employeeId, result, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.validateRequiredFields(params.params, ['employeeId']);
                        employeeId = params.params['employeeId'];
                        return [4 /*yield*/, this.readOneUseCase.execute(employeeId)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, { body: result, status: 200 }];
                    case 2:
                        err_2 = _a.sent();
                        return [2 /*return*/, _1.HttpErrorHandler.handle(err_2)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EmployeeControllerHttpAdapter.prototype.readAll = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var result, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.readAllUseCase.execute()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, { body: result, status: 200 }];
                    case 2:
                        err_3 = _a.sent();
                        return [2 /*return*/, _1.HttpErrorHandler.handle(err_3)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EmployeeControllerHttpAdapter.prototype.update = function (params) {
        throw new Error("Method not implemented.");
    };
    EmployeeControllerHttpAdapter.prototype["delete"] = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var employeeId, result, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        employeeId = params.params['employeeId'];
                        return [4 /*yield*/, this.deleteUseCase.execute(employeeId)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, { body: { message: 'ok' }, status: 200 }];
                    case 2:
                        err_4 = _a.sent();
                        return [2 /*return*/, _1.HttpErrorHandler.handle(err_4)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EmployeeControllerHttpAdapter.prototype.validateRequiredFields = function (data, requiredFields) {
        data = data || {};
        requiredFields = requiredFields || [];
        for (var _i = 0, requiredFields_1 = requiredFields; _i < requiredFields_1.length; _i++) {
            var field = requiredFields_1[_i];
            if (!data[field] && data[field] !== 0) {
                throw new error_1.MissingParamError(field);
            }
        }
    };
    return EmployeeControllerHttpAdapter;
}());
exports.EmployeeControllerHttpAdapter = EmployeeControllerHttpAdapter;
