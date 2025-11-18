// ui/fieldMetaTypes.ts (or wherever your meta types live)
import { z } from "zod";
import type { IconType } from "react-icons";

export type FieldKind =
  | "text"
  | "number"
  | "select"
  | "richtext"
  | "switch"
  | "calculated";

export type InfoIconComputedResult = {
  icon?: string | IconType;
  className?: string;
  title?: string;     // tooltip
};

export type FieldMeta = {
  label: string;
  icon?: string | IconType;
  infoIcon?: string | IconType;    // static icon fallback
  placeholder?: string;
  kind?: FieldKind;
  options?: readonly string[];
  loadOptions?: () => Promise<readonly string[]>;
  readOnly?: boolean;

  // NEW: dynamic info icon generator
  infoIconCompute?: (ctx: {
    value: any;
    values: Partial<any>;
  }) => InfoIconComputedResult | undefined;
};

export type MetaForSchema<S extends z.ZodTypeAny> = {
  [K in keyof z.input<S>]?: FieldMeta & {
    computeValue?: (ctx: { values: Partial<z.input<S>> }) => z.input<S>[K];

    // ✔ single object returned
    infoIconCompute?: (ctx: {
      value: z.input<S>[K] | undefined;
      values: Partial<z.input<S>>;
    }) => InfoIconComputedResult | undefined;
  };
};

export function defineMeta<S extends z.ZodTypeAny>(
  _schema: S,
  meta: MetaForSchema<S>
): MetaForSchema<S> {
  return meta;
}
