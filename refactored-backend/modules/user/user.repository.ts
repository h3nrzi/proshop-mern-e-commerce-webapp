import mongoose from "mongoose";
import { UserModel, UserDocument, UserAttrs } from "./user.schema";
import { RegisterUserInput, UpdateUserInput, UserDTO } from "./user.model";
import { DatabaseError } from "../../core/errors";

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
    try {
      const doc = await UserModel.create(input as UserAttrs);
      return this.toDTO(doc);
    } catch (error) {
      throw this.wrapError(error);
    }
  }

  async findByEmail(email: string): Promise<UserDTO | null> {
    try {
      const doc = await UserModel.findOne({ email }).exec();
      return doc ? this.toDTO(doc) : null;
    } catch (error) {
      throw this.wrapError(error);
    }
  }

  async findById(id: string): Promise<UserDTO | null> {
    try {
      const doc = await UserModel.findById(id).exec();
      return doc ? this.toDTO(doc) : null;
    } catch (error) {
      throw this.wrapError(error);
    }
  }

  async findAll(): Promise<UserDTO[]> {
    try {
      const docs = await UserModel.find().exec();
      return docs.map((doc) => this.toDTO(doc));
    } catch (error) {
      throw this.wrapError(error);
    }
  }

  async update(id: string, input: UpdateUserInput): Promise<UserDTO | null> {
    try {
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
    } catch (error) {
      throw this.wrapError(error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await UserModel.findByIdAndDelete(id).exec();
      return Boolean(result);
    } catch (error) {
      throw this.wrapError(error);
    }
  }

  async findAuthByEmail(email: string): Promise<UserDocument | null> {
    try {
      const doc = await UserModel.findOne({ email }).exec();
      return doc;
    } catch (error) {
      throw this.wrapError(error);
    }
  }

  private wrapError(error: unknown): DatabaseError {
    if (error instanceof DatabaseError) {
      return error;
    }

    if (error instanceof mongoose.Error) {
      return new DatabaseError("Database operation failed", error, error);
    }

    return new DatabaseError("Unexpected database error", error as Error);
  }
}

export default UserRepository;
