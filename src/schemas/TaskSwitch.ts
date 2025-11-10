import { z } from "zod";

export const TaskSwitchSchema = z.object({
  testSwitchNumber: z.boolean().default(false),
});

export type TaskRiskInput = z.input<typeof TaskSwitchSchema>;
export type TaskRisk = z.infer<typeof TaskSwitchSchema>;
export type TaskRiskErrors = Partial<Record<keyof TaskRiskInput, string>>;
