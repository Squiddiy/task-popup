// TaskBuilder.tsx
import React from "react";
import { z } from "zod";
import CollapsibleSection from "../components/atoms/CollapsibleSection";
import type { EnabledModule } from "../composer/TaskCompose";
import { composeMeta } from "../composer/composeMeta"; // your composeMeta that merges module metas
import { defaultRegistry, type Registry } from "./registry";
import type { LayoutConfig, RowConfig } from "./layout";
import type { FieldMeta } from "../schemas/schemaMetas/meta"; // { label, icon, placeholder, kind, options, ... }

type Props<T> = {
  schema: z.ZodType<T>;
  layout: LayoutConfig<T>;
  values: Partial<T>;
  onChange: (patch: Partial<T>) => void;
  errors?: Partial<Record<keyof T, string>>;
  disabled?: boolean;
  registry?: Registry<T>;

  meta?: Record<string, FieldMeta>;
  enabledModules?: readonly EnabledModule[];
};

// --- math helpers ---
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const lcm2 = (a: number, b: number): number => (a === 0 || b === 0 ? 0 : Math.abs(a * b) / gcd(a, b));
const lcmArray = (nums: number[]): number => nums.reduce((acc, n) => lcm2(acc, n), 1);

// --- core: normalize rows to a common grid ---
export function normalizeRows<T>(rows: RowConfig<T>[]): RowConfig<T>[] {
  const numericCols = rows
    .map(r => (Number.isFinite(r.cols) ? (r.cols as number) : 1))
    .filter(n => n > 0);

  if (numericCols.length === 0) return rows.slice();

  const common = lcmArray(numericCols); // e.g. for [3,2,3,...] => 6

  return rows.map(r => {
    const cols = Number.isFinite(r.cols) ? (r.cols as number) : 1;
    const factor = common / cols;

    if (!Number.isFinite(factor) || factor <= 0) return { ...r };

    return {
      ...r,
      cols: cols * factor,        
      colWidth: (r.colWidth ?? 1) * factor,     
    };
  });
}

export function TaskBuilder<T>({
  schema,
  layout,
  values,
  onChange,
  errors,
  disabled,
  registry,
  meta,
  enabledModules, // sensible default; adjust to your app
}: Props<T>) {
  const reg = registry ?? defaultRegistry<T>();

  // composed schema is ZodObject (composeSchema uses merge)
  const shape = (schema as z.ZodObject<any>).shape;

  // Compose meta once (prefer explicit meta prop over composing from modules)
  const metaMap = React.useMemo(
    () => meta ?? composeMeta(enabledModules as EnabledModule[]),
    [meta, enabledModules]
  );

  const set = <K extends keyof T>(key: K, val: T[K] | undefined) =>
    onChange({ [key]: val } as Partial<T>);

  const get = <K extends keyof T>(key: K) => values[key];
  const getError = (key: keyof T) => errors?.[key];

  // Skip entire sections that have no enabled fields in the schema
  function sectionHasAnyVisibleField(
    sec: LayoutConfig<T>["sections"][number]
  ): boolean {
    return sec.rows.some((row) =>
      row.fields.some((f) => shape[f.key as string] !== undefined)
    );
  }



  return (
    <div>
      {layout.sections.map((sec) => {
        if (!sectionHasAnyVisibleField(sec)) return null;
        if (sec.visibleIf && !sec.visibleIf({ values })) return null;

        const normalizedRows = normalizeRows<T>(sec.rows);
        normalizedRows.map(x=>x.cols)

        const maxCols =  normalizedRows.map(x=>x.cols)[0] || 1;

        const childrenClassName = `tw:grid tw:grid-cols-${maxCols}`;
        return (
          <CollapsibleSection
            key={sec.id}
            title={sec.title}
            defaultOpen={sec.defaultOpen ?? true}
            className="tw:border-b-gray-200 tw:border-b-2"
            childrenClassName={childrenClassName}
          >
            {normalizedRows.map((row, ri) => {
              if (row.visibleIf && !row.visibleIf({ values })) return null;
              const space = row.colWidth ?? 1;
              const grid = `tw:col-span-${space}`;

              return (
                <div key={ri} className={grid}>
                  {row.fields.map((f) => {
                    const key = f.key as string;
                    const s = shape[key];
                    if (!s) return null; // field not in schema → skip

                    // Pull meta from composed map, then let overrides win
                    const mm = metaMap[key] ?? ({} as FieldMeta);
                    const label = f.override?.label ?? mm.label ?? key;
                    const icon = f.override?.icon ?? mm.icon; // string token | string | IconType; registry resolves
                    const kind = f.override?.kind ?? mm.kind ?? "text";
                    const options = f.override?.options ?? mm.options;
                    const placeholder =
                      f.override?.placeholder ?? mm.placeholder;

                    // Pick renderer by field or by kind
                    const renderer =
                      reg.byField?.[f.key] ??
                      (kind
                        ? (reg.byKind as Record<string, any>)[kind]
                        : undefined);

                    if (!renderer) return null;

                    // Computed fields become read-only (no onChange)
                    const value =
                      f.compute?.({ values }) ?? (get(f.key) as any);

                    return (
                      <React.Fragment key={String(f.key)}>
                        {renderer({
                          keyName: f.key,
                          label,
                          icon,
                          value,
                          onChange: (v: any) =>
                            f.compute ? undefined : set(f.key, v),
                          disabled:
                            disabled || f.override?.readOnly || !!f.compute,
                          error: getError(f.key),
                          placeholder,
                          options,
                        })}
                      </React.Fragment>
                    );
                  })}
                </div>
              );
            })}
          </CollapsibleSection>
        );
      })}
    </div>
  );
}
