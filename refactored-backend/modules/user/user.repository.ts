import { UserModel, UserDocument, UserAttrs } from "./user.schema";
import { RegisterUserInput, UpdateUserInput, UserDTO } from "./user.dto";

export class UserRepository {
  toDTO(doc: UserDocument): UserDTO {
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      isAdmin: Boolean(doc.isAdmin),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async create(input: RegisterUserInput): Promise<UserDTO> {
    const doc = await UserModel.create(input as UserAttrs);
    return this.toDTO(doc);
  }

  async findByEmail(email: string): Promise<UserDTO | null> {
    const doc = await UserModel.findOne({ email }).exec();
    return doc ? this.toDTO(doc) : null;
  }

  async findById(id: string): Promise<UserDTO | null> {
    const doc = await UserModel.findById(id).exec();
    return doc ? this.toDTO(doc) : null;
  }

  async findAll(): Promise<UserDTO[]> {
    const docs = await UserModel.find().exec();
    return docs.map((doc) => this.toDTO(doc));
  }

  async update(id: string, input: UpdateUserInput): Promise<UserDTO | null> {
    const doc = await UserModel.findById(id).exec();
    if (!doc) {
      return null;
    }

    if (input.name !== undefined) doc.name = input.name;
    if (input.email !== undefined) doc.email = input.email;
    if (input.password !== undefined) doc.password = input.password;
    if (input.isAdmin !== undefined) doc.isAdmin = input.isAdmin;

    await doc.save();
    return this.toDTO(doc);
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id).exec();
    return Boolean(result);
  }

  async findAuthByEmail(email: string): Promise<UserDocument | null> {
    const doc = await UserModel.findOne({ email }).exec();
    return doc;
  }
}

export default UserRepository;
