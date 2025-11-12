import { z } from "zod";

export const TaskRiskSchema = z.object({
  probability: z.number().min(1, "Min 1").max(5, "Max 5"),
  impact: z.number().min(1, "Min 1").max(5, "Max 5"),
  consequence: z.string().optional().default(""),
  rootCause: z.string().optional().default(""),
  riskValue: z.number().optional().default(0),
});

export type TaskRiskInput = z.input<typeof TaskRiskSchema>;
export type TaskRisk = z.infer<typeof TaskRiskSchema>;
export type TaskRiskErrors = Partial<Record<keyof TaskRiskInput, string>>;
