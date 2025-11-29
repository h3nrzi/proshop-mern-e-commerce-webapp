import { z } from "zod";

export interface ExampleDTO {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const createExampleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export type CreateExampleInput = z.infer<typeof createExampleSchema>;

export const updateExampleSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

export type UpdateExampleInput = z.infer<typeof updateExampleSchema>;
