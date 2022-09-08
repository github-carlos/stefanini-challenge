"use strict";
exports.__esModule = true;
exports.employeeRoutes = void 0;
var express_1 = require("express");
var adapters_1 = require("../adapters");
var factories_1 = require("../factories");
function employeeRoutes(app) {
    var employeesRouter = (0, express_1.Router)();
    app.use(employeesRouter);
    var employeeController = (0, factories_1.makeEmployeeController)();
    employeesRouter.post('/employee', (0, adapters_1.adaptRoute)(employeeController.create.bind(employeeController)));
    employeesRouter.get('/employee', (0, adapters_1.adaptRoute)(employeeController.readAll.bind(employeeController)));
    employeesRouter.get('/employee/:employeeId', (0, adapters_1.adaptRoute)(employeeController.readOne.bind(employeeController)));
    employeesRouter["delete"]('/employee/:employeeId', (0, adapters_1.adaptRoute)(employeeController["delete"].bind(employeeController)));
    employeesRouter.put('/employee/:employeeId', (0, adapters_1.adaptRoute)(employeeController.update.bind(employeeController)));
}
exports.employeeRoutes = employeeRoutes;
