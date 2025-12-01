import { ExampleModel, ExampleDocument } from "./example.schema";
import { CreateExampleInput, UpdateExampleInput, ExampleDTO } from "./example.dto";

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
    const doc = await ExampleModel.create(input);
    return this.toDTO(doc);
  }

  async findById(id: string): Promise<ExampleDTO | null> {
    const doc = await ExampleModel.findById(id).exec();
    return doc ? this.toDTO(doc) : null;
  }

  async findAll(): Promise<ExampleDTO[]> {
    const docs = await ExampleModel.find().exec();
    return docs.map((doc) => this.toDTO(doc));
  }

  async update(id: string, input: UpdateExampleInput): Promise<ExampleDTO | null> {
    const doc = await ExampleModel.findByIdAndUpdate(id, input, { new: true }).exec();
    return doc ? this.toDTO(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await ExampleModel.findByIdAndDelete(id).exec();
    return Boolean(result);
  }
}

export default ExampleRepository;
