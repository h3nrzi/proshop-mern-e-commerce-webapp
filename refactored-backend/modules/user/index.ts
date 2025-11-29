import { DependencyContainer } from "tsyringe";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";

export function registerUserModule(container: DependencyContainer): void {
  container.registerSingleton(UserRepository, UserRepository);
  container.registerSingleton(UserService, UserService);
  container.registerSingleton(UserController, UserController);
}

export * from "./user.model";
export * from "./user.schema";
export * from "./user.repository";
export * from "./user.service";
export * from "./user.controller";
