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
import type { LayoutConfig } from "../builder/layout";

export function composeSchema<const E extends readonly EnabledModule[]>(
  enabled: E,
  layout?: LayoutConfig<any>
): z.ZodType<InputsFromEnabled<E>> {
  // Collect modules' full schemas
  const parts = enabled
    .map((m) => MODULES[m].schema)
    .filter(Boolean) as unknown as z.ZodObject<z.ZodRawShape>[];

  // Helper: extract string keys used in a layout
  const keysFromLayout = (l?: LayoutConfig<any>): Set<string> => {
    const keys = new Set<string>();
    if (!l) return keys;
    for (const sec of l.sections ?? []) {
      for (const row of sec.rows ?? []) {
        for (const f of row.fields ?? []) {
          // field.key may be typed as keyof T; stringify for runtime
          keys.add(String(f.key));
        }
      }
    }
    return keys;
  };

  // If a layout is provided, only keep schema fields referenced by the layout
  let partsToMerge: z.ZodObject<z.ZodRawShape>[] = parts;
  if (layout) {
    const usedKeys = keysFromLayout(layout);

    // gather all keys available from the enabled schemas to detect mismatches
    const availableKeys = new Set<string>();
    for (const s of parts) Object.keys(s.shape).forEach((k) => availableKeys.add(k));

    // warn if layout contains keys not available in any enabled schema
    for (const k of usedKeys) {
      if (!availableKeys.has(k)) {
        // keep behavior permissive but notify developer
        // eslint-disable-next-line no-console
        console.warn(`Layout key '${k}' not found in any enabled schema modules.`);
      }
    }

    // For each module schema, pick only the fields that are used by the layout
    partsToMerge = parts
      .map((s) => {
        const filteredShape: z.ZodRawShape = Object.fromEntries(
          Object.entries(s.shape).filter(([k]) => usedKeys.has(k))
        );
        // If module has no used keys, skip it (will be filtered out)
        return Object.keys(filteredShape).length ? z.object(filteredShape) : null;
      })
      .filter(Boolean) as z.ZodObject<z.ZodRawShape>[];
  }

  const merged =
    partsToMerge.length === 0
      ? z.object({})
      : partsToMerge.reduce((acc, s) => acc.merge(s), z.object({})).strict();

  return merged as unknown as z.ZodType<InputsFromEnabled<E>>;
}

// Optional: all modules merged
export type AllInputs = UnionToIntersection<InputOf<EnabledModule>>;
export const AllSchema = (function () {
  const parts = ALL_MODULES.map((m) => MODULES[m].schema) as unknown as z.ZodObject<z.ZodRawShape>[];
  return (parts.length
    ? parts.reduce((acc, s) => acc.merge(s), z.object({})).strict()
    : z.object({})) as unknown as z.ZodType<AllInputs>;
})();
