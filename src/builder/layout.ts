// builder/layout.ts
export type ConditionFn<T> = (ctx: { values: Partial<T> }) => boolean;
export type ComputeFn<T, K extends keyof T> = (ctx: { values: Partial<T> }) => T[K];

export type FieldRef<T, K extends keyof T = keyof T> = {
  key: K;
  override?: {
    label?: string;
    placeholder?: string;
    icon?: string;
    kind?: "text" | "number" | "select" | "richtext" | "date" | "checkbox";
    options?: readonly string[];
    readOnly?: boolean;
  };
  visibleIf?: ConditionFn<T>;
  disabledIf?: ConditionFn<T>;
  compute?: ComputeFn<T, K>;      // for computed read-only values (e.g., riskValue)
};

export type RowConfig<T> = {
  cols?: number; //Number of columns
  colWidth?: number; //How much space the columns takes up     
  gap?: number;                    
  fields: FieldRef<T>[];
  visibleIf?: ConditionFn<T>;
};

export type SectionConfig<T> = {
  id: string;
  title: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  rows: RowConfig<T>[];
  visibleIf?: ConditionFn<T>;
};

export type LayoutConfig<T> = {
  sections: SectionConfig<T>[];
};
