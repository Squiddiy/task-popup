import { z } from "zod";

export const TASKSTATUS = ["Active", "Not Active"] as const; 

export const TaskBaseSchema = z.object({
  taskName: z.string().min(1, "Krävs"),
  taskManager: z.string().min(1, "Krävs"),
  taskStatus: z.enum(TASKSTATUS),
  description: z.string().optional().default(""),
  priority: z.number().int().optional(),
});

export type TaskBaseInput = z.input<typeof TaskBaseSchema>;
export type TaskBase = z.infer<typeof TaskBaseSchema>;
export type TaskBaseErrors = Partial<Record<keyof TaskBaseInput, string>>;
