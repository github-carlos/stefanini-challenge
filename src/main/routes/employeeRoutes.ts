import { Router, Express } from 'express'
import { adaptRoute } from '../adapters'
import { makeEmployeeController } from '../factories';
export function employeeRoutes (app: Express): void {
  const employeesRouter = Router();
  app.use(employeesRouter);
  const employeeController = makeEmployeeController();
  employeesRouter.post('/employee', adaptRoute(employeeController.create.bind(employeeController)));
  employeesRouter.get('/employee', adaptRoute(employeeController.readAll.bind(employeeController)));
  employeesRouter.get('/employee/:employeeId', adaptRoute(employeeController.readOne.bind(employeeController)));
  employeesRouter.delete('/employee/:employeeId', adaptRoute(employeeController.delete.bind(employeeController)));
  employeesRouter.put('/employee/:employeeId', adaptRoute(employeeController.update.bind(employeeController)));
}