
export function createEmployeeRepositoryMock() {
  return { create: jest.fn(), readOne: jest.fn(), readAll: jest.fn(),  update: jest.fn(), delete: jest.fn() };
}