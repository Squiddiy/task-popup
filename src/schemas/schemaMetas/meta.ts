// ui/fieldMetaTypes.ts
import { z } from "zod";
import type { IconType } from "react-icons";

export type FieldKind = "text" | "number" | "select" | "richtext" | "switch";

export type FieldMeta = {
  label: string;
  icon?: string | IconType; // string resolved via ICON_MAP
  placeholder?: string;
  kind?: FieldKind;
  options?: readonly string[]; // for selects
  readOnly?: boolean;
};

// A module-level meta object: keys must match the schema’s keys
export type ModuleFieldMeta<TKeys extends string> = {
  [K in TKeys]?: FieldMeta;
};

// Meta mapped to a schema's input keys (partial: you don't need every key)
export type MetaForSchema<S extends z.ZodTypeAny> = Partial<
  Record<keyof z.input<S>, FieldMeta>
>;

// Accept a schema and a meta map; get full key safety + autocomplete
export function defineMeta<S extends z.ZodTypeAny>(
  _schema: S,
  meta: MetaForSchema<S>
): MetaForSchema<S> {
  return meta;
}
