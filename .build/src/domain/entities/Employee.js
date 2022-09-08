"use strict";
exports.__esModule = true;
var error_1 = require("../error");
var Employee = /** @class */ (function () {
    function Employee(name, age, role, employeeId) {
        this.name = name;
        this.age = age;
        this.role = role;
        this.employeeId = employeeId;
    }
    Employee.validate = function (params) {
        if (params.age <= 0) {
            throw new error_1.InvalidAgeError();
        }
    };
    return Employee;
}());
exports["default"] = Employee;
