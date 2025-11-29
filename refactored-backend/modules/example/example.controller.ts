import { injectable } from "tsyringe";
import { ExampleService } from "./example.service";
import { ExampleDTO } from "./example.model";

@injectable()
export class ExampleController {
  constructor(private readonly service: ExampleService) {}

  create(payload: unknown): Promise<ExampleDTO> {
    return this.service.create(payload);
  }

  getAll(): Promise<ExampleDTO[]> {
    return this.service.findAll();
  }

  getById(id: string): Promise<ExampleDTO> {
    return this.service.findById(id);
  }

  update(id: string, payload: unknown): Promise<ExampleDTO> {
    return this.service.update(id, payload);
  }

  delete(id: string): Promise<boolean> {
    return this.service.delete(id);
  }
}

export default ExampleController;
