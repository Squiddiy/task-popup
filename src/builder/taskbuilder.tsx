// TaskBuilder.tsx
import React from "react";
import { z } from "zod";
import CollapsibleSection from "../components/atoms/CollapsibleSection";
import type { EnabledModule } from "../composer/TaskCompose";
import { composeMeta } from "../composer/composeMeta";
import { defaultRegistry, type Registry, type Renderer } from "./registry";
import type { LayoutConfig } from "./layout";
import type {
  FieldMeta,
  InfoIconComputedResult,
} from "../schemas/schemaMetas/meta";
import type { IconType } from "react-icons";

// ---- FieldRenderer ----

type FieldRendererProps<T, K extends keyof T> = {
  renderer: Renderer<T>;
  keyName: K;
  label: string;
  icon?: any;
  infoIconComputed?: {
    icon?: any;
    className?: string;
    title?: string;
  };
  value: T[K] | undefined;
  onChange: (v: T[K] | undefined) => void;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  options?: readonly string[];
  optionsLoader?: () => Promise<readonly string[]>;
};

function FieldRenderer<T, K extends keyof T>({
  renderer,
  keyName,
  label,
  icon,
  infoIconComputed,
  value,
  onChange,
  disabled,
  error,
  placeholder,
  options,
  optionsLoader,
}: FieldRendererProps<T, K>) {
  const [resolvedOptions, setResolvedOptions] = React.useState<
    readonly string[] | undefined
  >(options);

  React.useEffect(() => {
    let cancelled = false;

    if (options && options.length > 0) {
      setResolvedOptions(options);
      return;
    }
    if (!optionsLoader) return;

    optionsLoader()
      .then((opts) => {
        if (!cancelled) setResolvedOptions(opts);
      })
      .catch((err) => {
        console.error("Failed to load options for field", label, err);
      });

    return () => {
      cancelled = true;
    };
  }, [options, optionsLoader, label]);

  return renderer({
    keyName,
    label,
    icon,
    infoIconComputed,
    value,
    onChange,
    disabled,
    error,
    placeholder,
    options: resolvedOptions,
  } as any);
}

// ---- TaskBuilder ----

type Props<T> = {
  schema: z.ZodType<T>;
  layout: LayoutConfig<T>;
  values: Partial<T>;
  onChange: (patch: Partial<T>) => void;
  errors?: Partial<Record<keyof T, string>>;
  disabled?: boolean;
  registry?: Registry<T>;

  meta?: Record<
    string,
    FieldMeta & {
      compute?: (ctx: { values: Partial<T> }) => any;
      infoIconCompute?: (ctx: {
        value: any;
        values: Partial<T>;
      }) => InfoIconComputedResult;
    }
  >;
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
  enabledModules,
}: Props<T>) {
  const reg = registry ?? defaultRegistry<T>();
  const shape = (schema as z.ZodObject<z.ZodRawShape>).shape;

  const metaMap = React.useMemo(
    () =>
      (meta ?? composeMeta(enabledModules as EnabledModule[])) as Record<
        string,
        FieldMeta & {
          computeValue?: (ctx: { values: Partial<T> }) => any;
          infoIconCompute?: (ctx: {
            value: any;
            values: Partial<T>;
          }) => InfoIconComputedResult;
        }
      >,
    [meta, enabledModules]
  );

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [minWidth, setMinWidth] = React.useState<string>();

  React.useLayoutEffect(() => {
    const el = containerRef.current;
    if (el) {
      const width = el.scrollWidth;
      setMinWidth(`${width}px`);
    }
  }, [layout, values]);

  const set = <K extends keyof T>(key: K, val: T[K] | undefined) =>
    onChange({ [key]: val } as Partial<T>);
  const get = <K extends keyof T>(key: K) => values[key];
  const getError = (key: keyof T) => errors?.[key];

  function sectionHasAnyVisibleField(
    sec: LayoutConfig<T>["sections"][number]
  ): boolean {
    return sec.rows.some((row) =>
      row.fields.some((f) => shape[f.key as string] !== undefined)
    );
  }

  return (
    <div
      ref={containerRef}
      style={minWidth ? { minWidth } : undefined}
      className="tw:w-fit tw:max-w-full"
    >
      {layout.sections.map((sec) => {
        if (!sectionHasAnyVisibleField(sec)) return null;
        if (sec.visibleIf && !sec.visibleIf({ values })) return null;

        const childrenClassName = "tw:flex tw:flex-row tw:flex-wrap";

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
              const grid = "tw:flex tw:flex-col tw:flex-auto";

              return (
                <div key={ri} className={grid}>
                  {row.fields.map((f) => {
                    const key = f.key as string;
                    const s = shape[key];
                    if (!s) return null;

                    const mm =
                      metaMap[key] ??
                      ({
                        label: key,
                      } as FieldMeta & {
                        compute?: (ctx: { values: Partial<T> }) => any;
                        infoIconCompute?: (ctx: {
                          value: any;
                          values: Partial<T>;
                        }) => InfoIconComputedResult;
                      });

                    const label = f.override?.label ?? mm.label ?? key;
                    const icon = f.override?.icon ?? mm.icon;
                    const kind = f.override?.kind ?? mm.kind ?? "text";
                    const options = f.override?.options ?? mm.options;
                    const optionsLoader = mm.loadOptions;
                    const placeholder =
                      f.override?.placeholder ?? mm.placeholder;

                    const renderer =
                      reg.byField?.[f.key] ??
                      (kind
                        ? (reg.byKind as Record<string, any>)[kind]
                        : undefined);
                    if (!renderer) return null;

                    // value (using meta-level compute)
                    const computeFn = mm.computeValue;
                    const isComputed = typeof computeFn === "function";

                    const value = isComputed
                      ? (computeFn!({ values }) as any)
                      : (get(f.key) as any);

                    const isReadOnly =
                      f.override?.readOnly ||
                      mm.readOnly ||
                      isComputed ||
                      kind === "calculated";

                    const computedInfoIconObj =
                      mm.infoIconCompute?.({ value, values }) ?? undefined;

                    const unifiedInfoIcon = computedInfoIconObj ?? {
                      icon: mm.infoIcon,
                      className: undefined,
                      title: undefined,
                    };

                    return (
                      <React.Fragment key={String(f.key)}>
                        <FieldRenderer
                          renderer={renderer as Renderer<T>}
                          keyName={f.key as keyof T}
                          label={label}
                          icon={icon}
                          infoIconComputed={unifiedInfoIcon}
                          value={value}
                          onChange={(v: any) => {
                            if (isComputed) return;
                            set(f.key, v);
                          }}
                          disabled={disabled || isReadOnly}
                          error={getError(f.key)}
                          placeholder={placeholder}
                          options={options}
                          optionsLoader={optionsLoader}
                        />
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
