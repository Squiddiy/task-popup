import { z } from "zod";
import { TaskBaseSchema } from "../schemas/TaskBase";
import { TaskCategoriesSchema } from "../schemas/TaskCategories";
import { TaskRiskSchema } from "../schemas/TaskRisk";

import { TaskBaseMeta } from "../schemas/schemaMetas/TaskBase.meta";
import { TaskCategoriesMeta } from "../schemas/schemaMetas/TaskCategories.meta";
import { TaskRiskMeta } from "../schemas/schemaMetas/TaskRisk.meta";
import { TaskSwitchMeta } from "../schemas/schemaMetas/TaskSwitch.meta";
import { TaskSwitchSchema } from "../schemas/TaskSwitch";

export const MODULES = {
  base:        { schema: TaskBaseSchema,        meta: TaskBaseMeta },
  categories:  { schema: TaskCategoriesSchema,  meta: TaskCategoriesMeta },
  risk:        { schema: TaskRiskSchema,        meta: TaskRiskMeta },
  switch:     { schema: TaskSwitchSchema,      meta: TaskSwitchMeta },
} as const;

export type EnabledModule = keyof typeof MODULES;

type SchemaMap = { [K in EnabledModule]: typeof MODULES[K]["schema"] };
type InputOf<M extends EnabledModule> = z.input<SchemaMap[M]>;
type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type InputsFromEnabled<E extends readonly EnabledModule[]> =
  UnionToIntersection<InputOf<E[number]>> extends never ? {} : UnionToIntersection<InputOf<E[number]>>;

export const ALL_MODULES = Object.keys(MODULES) as readonly EnabledModule[];

// ---- Compose schema from MODULES ----
export function composeSchema<const E extends readonly EnabledModule[]>(
  enabled: E
): z.ZodType<InputsFromEnabled<E>> {
  const parts = enabled
    .map((m) => MODULES[m].schema)
    .filter(Boolean) as unknown as z.ZodObject<any>[];

  const merged =
    parts.length === 0
      ? z.object({})
      : parts.reduce((acc, s) => acc.merge(s), z.object({})).strict();

  return merged as unknown as z.ZodType<InputsFromEnabled<E>>;
}

// Optional: all modules merged
export type AllInputs = UnionToIntersection<InputOf<EnabledModule>>;
export const AllSchema = (function () {
  const parts = ALL_MODULES.map((m) => MODULES[m].schema) as unknown as z.ZodObject<any>[];
  return (parts.length
    ? parts.reduce((acc, s) => acc.merge(s), z.object({})).strict()
    : z.object({})) as unknown as z.ZodType<AllInputs>;
})();
