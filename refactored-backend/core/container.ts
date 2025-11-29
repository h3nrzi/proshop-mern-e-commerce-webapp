import "reflect-metadata";
import { container, DependencyContainer } from "tsyringe";
import { CacheService, ConfigService, Logger, ValidationService } from "./services";
import { registerExampleModule } from "../modules/example";
import { registerUserModule } from "../modules/user";

export function registerCoreServices(c: DependencyContainer = container): void {
  c.registerSingleton(Logger, Logger);
  c.registerSingleton(CacheService, CacheService);
  c.registerSingleton(ConfigService, ConfigService);
  c.registerSingleton(ValidationService, ValidationService);
}

export function registerModules(c: DependencyContainer = container): void {
  registerExampleModule(c);
  registerUserModule(c);
}

registerCoreServices();
registerModules();

export { container };
