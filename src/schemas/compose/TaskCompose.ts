import { z } from "zod";
import { TaskBaseSchema } from "../TaskBase";
import { TaskCategoriesSchema } from "../TaskCategories";
import { TaskRiskSchema } from "../TaskRisk";

export type EnabledModule = "base" | "categories" | "risk";

/** Map module -> its Zod schema */
type SchemaMap = {
  base: typeof TaskBaseSchema;
  categories: typeof TaskCategoriesSchema;
  risk: typeof TaskRiskSchema;
};

/** Make a union into an intersection */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

/** Input type from a single module key */
type InputOf<M extends EnabledModule> = z.input<SchemaMap[M]>;

/** Input type from a list of enabled modules (intersection of their inputs) */
export type InputsFromEnabled<E extends readonly EnabledModule[]> =
  UnionToIntersection<InputOf<E[number]>> extends never
    ? {}
    : UnionToIntersection<InputOf<E[number]>>;

export function composeSchema<const E extends readonly EnabledModule[]>(
  enabled: E
): z.ZodType<InputsFromEnabled<E>> {
  // Collect only ZodObject parts
  const parts: z.ZodObject[] = [];
  if (enabled.includes("base")) parts.push(TaskBaseSchema as z.ZodObject);
  if (enabled.includes("categories")) parts.push(TaskCategoriesSchema as z.ZodObject);
  if (enabled.includes("risk")) parts.push(TaskRiskSchema as z.ZodObject);

  // Merge objects so the result stays a ZodObject, then make it strict
  const merged =
    parts.length === 0
      ? z.object({}) // empty object when nothing enabled
      : parts
          .reduce(
            (acc, s) => acc.merge(s),
            z.object({} as Record<string, never>)
          )
          .strict();

  return merged as unknown as z.ZodType<InputsFromEnabled<E>>;
}

export type AllInputs = UnionToIntersection<InputOf<EnabledModule>>;
