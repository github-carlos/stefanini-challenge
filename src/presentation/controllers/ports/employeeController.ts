export interface EmployeeController<Args, Response> {
  create(params: Args): Promise<Response>;
  readOne(params: Args): Promise<Response>;
  readAll(params: Args): Promise<Response>;
  update(params: Args): Promise<Response>;
  delete(params: Args): Promise<Response>;
}