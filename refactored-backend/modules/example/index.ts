import { DependencyContainer } from "tsyringe";
import { ExampleRepository } from "./example.repository";
import { ExampleService } from "./example.service";
import { ExampleController } from "./example.controller";

export function registerExampleModule(container: DependencyContainer): void {
  container.registerSingleton(ExampleRepository, ExampleRepository);
  container.registerSingleton(ExampleService, ExampleService);
  container.registerSingleton(ExampleController, ExampleController);
}

export * from "./example.dto";
export * from "./example.schema";
export * from "./example.repository";
export * from "./example.service";
export * from "./example.controller";
