import mongoose from "mongoose";
import { ExampleModel, ExampleDocument } from "./example.schema";
import { CreateExampleInput, UpdateExampleInput, ExampleDTO } from "./example.model";
import { DatabaseError } from "../../core/errors";

export class ExampleRepository {
  private toDTO(doc: ExampleDocument): ExampleDTO {
    return {
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async create(input: CreateExampleInput): Promise<ExampleDTO> {
    try {
      const doc = await ExampleModel.create(input);
      return this.toDTO(doc);
    } catch (error) {
      throw this.wrapError(error);
    }
  }

  async findById(id: string): Promise<ExampleDTO | null> {
    try {
      const doc = await ExampleModel.findById(id).exec();
      return doc ? this.toDTO(doc) : null;
    } catch (error) {
      throw this.wrapError(error);
    }
  }

  async findAll(): Promise<ExampleDTO[]> {
    try {
      const docs = await ExampleModel.find().exec();
      return docs.map((doc) => this.toDTO(doc));
    } catch (error) {
      throw this.wrapError(error);
    }
  }

  async update(id: string, input: UpdateExampleInput): Promise<ExampleDTO | null> {
    try {
      const doc = await ExampleModel.findByIdAndUpdate(id, input, { new: true }).exec();
      return doc ? this.toDTO(doc) : null;
    } catch (error) {
      throw this.wrapError(error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await ExampleModel.findByIdAndDelete(id).exec();
      return Boolean(result);
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

export default ExampleRepository;
