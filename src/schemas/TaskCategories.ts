import { z } from "zod";

export const AREA = ["TBD", "Normal Area", "Cool Area"] as const;
export const SECLEVEL = [
  "Very low",
  "Low",
  "Medium",
  "High",
  "Super High",
] as const;

export const TaskCategoriesSchema = z.object({
  area: z.enum(AREA).default("TBD"),
  seclevel: z.enum(SECLEVEL).default("Medium"),
});

export type TaskCategoriesInput = z.input<typeof TaskCategoriesSchema>;
export type TaskCategories = z.infer<typeof TaskCategoriesSchema>;
export type TaskCategoriesErrors = Partial<
  Record<keyof TaskCategoriesInput, string>
>;
