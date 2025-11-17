// ui/fieldMetaTypes.ts
import { z } from "zod";
import type { IconType } from "react-icons";

export type FieldKind =
  | "text"
  | "number"
  | "select"
  | "richtext"
  | "switch"
  | "calculated";

export type FieldMeta = {
  label: string;
  icon?: string | IconType; // string resolved via ICON_MAP
  infoIcon?: string | IconType;
  placeholder?: string;
  kind?: FieldKind;
  options?: readonly string[]; // for selects
  loadOptions?: () => Promise<readonly string[]>;
  readOnly?: boolean;
};

// --- NEW helper type for compute, per schema+field ---

type ComputeForSchemaField<
  S extends z.ZodTypeAny,
  K extends keyof z.input<S>
> = (ctx: { values: Partial<z.input<S>> }) => z.input<S>[K];

// Meta mapped to a schema's input keys (partial: you don't need every key)
export type MetaForSchema<S extends z.ZodTypeAny> = {
  [K in keyof z.input<S>]?: FieldMeta & {
    // optional compute for this *specific* field
    compute?: ComputeForSchemaField<S, K>;
  };
};

// Accept a schema and a meta map; get full key safety + autocomplete
export function defineMeta<S extends z.ZodTypeAny>(
  _schema: S,
  meta: MetaForSchema<S>
): MetaForSchema<S> {
  return meta;
}
