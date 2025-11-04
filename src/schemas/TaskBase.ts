import { z } from "zod";

export const AKTIVITETSSTATUS = ["Active", "Not Active"] as const; 

export const TaskBaseSchema = z.object({
  aktivitetsnamn: z.string().min(1, "Krävs"),
  aktivitetsansvarig: z.string().min(1, "Krävs"),
  sannolikhet: z.number().min(1, "Min 1").max(10, "Max 10"),
  påverkan: z.number().min(1, "Min 1").max(10, "Max 10"),
  aktivitetsstatus: z.enum(AKTIVITETSSTATUS),
  prioritet: z.number().int().optional(),
  beskrivning: z.string().optional().default(""),
  konsekvens: z.string().optional().default(""),
  grundorsak: z.string().optional().default(""),
});

export type TaskBaseInput = z.input<typeof TaskBaseSchema>;
export type TaskBase = z.infer<typeof TaskBaseSchema>;
export type TaskBaseErrors = Partial<Record<keyof TaskBaseInput, string>>;
