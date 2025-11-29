import { injectable } from "tsyringe";
import { AuthPayload, UserDTO } from "./user.dto";
import { UserService } from "./user.service";

@injectable()
export class UserController {
  constructor(private readonly service: UserService) {}

  register(payload: unknown): Promise<UserDTO> {
    return this.service.register(payload);
  }

  login(payload: unknown): Promise<AuthPayload> {
    return this.service.login(payload);
  }

  getAll(): Promise<UserDTO[]> {
    return this.service.findAll();
  }

  getById(id: string): Promise<UserDTO> {
    return this.service.findById(id);
  }

  update(id: string, payload: unknown): Promise<UserDTO> {
    return this.service.update(id, payload);
  }

  delete(id: string): Promise<boolean> {
    return this.service.delete(id);
  }
}

export default UserController;
