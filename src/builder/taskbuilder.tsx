// TaskBuilder.tsx
import React from "react";
import { z } from "zod";
import CollapsibleSection from "../components/atoms/CollapsibleSection";
import type { EnabledModule } from "../composer/TaskCompose";
import { composeMeta } from "../composer/composeMeta"; // your composeMeta that merges module metas
import { defaultRegistry, type Registry, type Renderer } from "./registry";
import type { LayoutConfig } from "./layout";
import type { FieldMeta } from "../schemas/schemaMetas/meta"; // { label, icon, placeholder, kind, options, ... }

type Props<T> = {
  schema: z.ZodType<T>;
  layout: LayoutConfig<T>;
  values: Partial<T>;
  onChange: (patch: Partial<T>) => void;
  errors?: Partial<Record<keyof T, string>>;
  disabled?: boolean;
  registry?: Registry<T>;

  /** EITHER pass a pre-built meta map… */
  meta?: Record<string, FieldMeta>;

  /** …or let TaskBuilder compose it from your modules */
  enabledModules?: readonly EnabledModule[];
};

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
  const shape = (schema as z.ZodObject<z.ZodRawShape>).shape;

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

        const childrenClassName = `tw:flex tw:flex-row tw:flex-wrap`;
        return (
          <CollapsibleSection
            key={sec.id}
            title={sec.title}
            defaultOpen={sec.defaultOpen ?? true}
            className="tw:border-b-gray-200 tw:border-b-2"
            childrenClassName={childrenClassName}
          >
            {sec.rows.map((row, ri) => {
              if (row.visibleIf && !row.visibleIf({ values })) return null;
              const grid = `tw:flex tw:flex-col tw:flex-auto`;

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
