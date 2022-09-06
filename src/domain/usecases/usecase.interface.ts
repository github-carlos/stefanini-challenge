export interface UseCase<Params, Entity> {
  execute(params: Params): Promise<Entity>;
}