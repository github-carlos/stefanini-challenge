"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.EmployeeNotFound = exports.ParamTypeError = exports.MissingParamError = exports.InvalidAgeError = void 0;
var errors_1 = require("../../core/errors");
var InvalidAgeError = /** @class */ (function (_super) {
    __extends(InvalidAgeError, _super);
    function InvalidAgeError() {
        return _super.call(this, "Employee age can not be negative or zero") || this;
    }
    return InvalidAgeError;
}(errors_1.BadRequestError));
exports.InvalidAgeError = InvalidAgeError;
var MissingParamError = /** @class */ (function (_super) {
    __extends(MissingParamError, _super);
    function MissingParamError(paramName) {
        return _super.call(this, "param [".concat(paramName, "] is missing")) || this;
    }
    return MissingParamError;
}(errors_1.BadRequestError));
exports.MissingParamError = MissingParamError;
var ParamTypeError = /** @class */ (function (_super) {
    __extends(ParamTypeError, _super);
    function ParamTypeError(paramName, expectedType, givenType) {
        return _super.call(this, "".concat(paramName, " type should be ").concat(expectedType, " but ").concat(givenType, " was given")) || this;
    }
    return ParamTypeError;
}(errors_1.BadRequestError));
exports.ParamTypeError = ParamTypeError;
var EmployeeNotFound = /** @class */ (function (_super) {
    __extends(EmployeeNotFound, _super);
    function EmployeeNotFound() {
        return _super.call(this, 'Does not exist an Employee for given id') || this;
    }
    return EmployeeNotFound;
}(errors_1.NotFoundError));
exports.EmployeeNotFound = EmployeeNotFound;
