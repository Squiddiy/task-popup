import { z } from "zod";

export const TaskRiskSchema = z.object({
  probability: z.number().min(1, "Min 1").max(10, "Max 10"),
  impact: z.number().min(1, "Min 1").max(10, "Max 10"),
  consequence: z.string().optional().default(""),
  rootCause: z.string().optional().default(""),
});

export type TaskRiskInput = z.input<typeof TaskRiskSchema>;
export type TaskRisk = z.infer<typeof TaskRiskSchema>;
export type TaskRiskErrors = Partial<Record<keyof TaskRiskInput, string>>;
