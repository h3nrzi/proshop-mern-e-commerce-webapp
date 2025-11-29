import mongoose, { Schema, Document, Model } from "mongoose";

export interface ExampleDocument extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExampleSchema = new Schema<ExampleDocument>(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const ExampleModel: Model<ExampleDocument> =
  mongoose.models.Example || mongoose.model<ExampleDocument>("Example", ExampleSchema);
