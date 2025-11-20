import type { FieldKind } from "../schemas/schemaMetas/meta";

// builder/layout.ts
export type ConditionFn<T> = (ctx: { values: Partial<T> }) => boolean;
export type ComputeFn<T, K extends keyof T> = (ctx: {
  values: Partial<T>;
}) => T[K];

export type FieldRef<T, K extends keyof T = keyof T> = {
  key: K;
  override?: {
    label?: string;
    placeholder?: string;
    icon?: string;
    infoIcon?: string; // NEW: right-side info icon
    kind?: FieldKind;
    options?: readonly string[];
    readOnly?: boolean;
  };
  visibleIf?: ConditionFn<T>;
  disabledIf?: ConditionFn<T>;
};

export type RowConfig<T> = {
  fields: FieldRef<T>[];
  visibleIf?: ConditionFn<T>;
};

export type SectionConfig<T> = {
  id: string;
  title?: string;
  className?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  rows: RowConfig<T>[];
  visibleIf?: ConditionFn<T>;
};

export type LayoutConfig<T> = {
  sections: SectionConfig<T>[];
};
