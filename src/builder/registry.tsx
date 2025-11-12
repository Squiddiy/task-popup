import * as Fa from "react-icons/fa6";
import * as Md from "react-icons/md";
import * as Tb from "react-icons/tb";
import * as Io from "react-icons/io5";
import TaskField from "../components/atoms/TaskField";
import type { IconType } from "react-icons";
import type { JSX } from "react";
import type { FieldKind } from "../schemas/schemaMetas/meta";
import QuillWrapper from "../components/atoms/QuillWrapper";

const ICON_MAP = { ...Fa, ...Md, ...Tb, ...Io } as Record<string, IconType>;

// 🔧 helper: turn string | IconType into IconType
function resolveIcon(icon?: string | IconType): IconType | undefined {
  if (!icon) return undefined;
  if (typeof icon === "string") return ICON_MAP[icon];
  return icon;
}

export type RendererProps<T, K extends keyof T> = {
  keyName: K;
  label: string;
  icon?: string | IconType; // 👈 allow string or component
  infoIcon?: string | IconType;
  value: T[K] | undefined;
  onChange: (v: T[K] | undefined) => void;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  options?: readonly string[];
};

export type Renderer<T> = <K extends keyof T>(
  p: RendererProps<T, K>
) => JSX.Element;

export type Registry<T> = {
  byKind: Partial<Record<FieldKind, Renderer<T>>>;
  byField?: Partial<Record<keyof T, Renderer<T>>>;
  iconFor?: (key?: string) => IconType | undefined;
};

export function defaultRegistry<T>(): Registry<T> {
  return {
    byKind: {
      text: <K extends keyof T>(p: RendererProps<T, K>) => {
        const { label, value, onChange, disabled, error, placeholder, icon } =
          p;
        return (
          <TaskField
            icon={resolveIcon(icon)}
            label={label}
            type="text"
            value={value as unknown as string | undefined}
            onChange={(v: string) => onChange(v as unknown as T[K] | undefined)}
            placeholder={placeholder}
            disabled={disabled}
            error={error}
          />
        );
      },
      number: <K extends keyof T>(p: RendererProps<T, K>) => {
        const { label, value, onChange, disabled, error, placeholder, icon } =
          p;
        return (
          <TaskField
            icon={resolveIcon(icon)}
            label={label}
            type="number"
            value={value as unknown as number | undefined}
            onChange={(v: number | "") =>
              onChange(v as unknown as T[K] | undefined)
            }
            step={1}
            disabled={disabled}
            error={error}
            placeholder={placeholder}
          />
        );
      },
      select: <K extends keyof T>(p: RendererProps<T, K>) => {
        const { label, value, onChange, disabled, error, options, icon } = p;
        return (
          <TaskField
            icon={resolveIcon(icon)}
            label={label}
            type="select"
            value={value as unknown as string | number | undefined}
            onChange={(v: string | number) =>
              onChange(v as unknown as T[K] | undefined)
            }
            options={(options ?? []).map((s) => ({ value: s, label: s }))}
            disabled={disabled}
            error={error}
          />
        );
      },
      richtext: <K extends keyof T>(p: RendererProps<T, K>) => {
        const { label, value, onChange, disabled, error } = p;
        return (
          <div>
            <QuillWrapper
              value={value as unknown as string}
              onChange={(v: string) =>
                onChange(v as unknown as T[K] | undefined)
              }
              readOnly={disabled}
            />
            {error && <div className="tw:text-red-600 tw:text-sm">{error}</div>}
          </div>
        );
      },
      switch: <K extends keyof T>(p: RendererProps<T, K>) => {
        const { label, value, onChange, disabled, error, icon } = p;
        return (
          <TaskField
            icon={resolveIcon(icon)}
            label={label}
            type="switch"
            value={value as unknown as boolean}
            onChange={(v: boolean) =>
              onChange(v as unknown as T[K] | undefined)
            }
            disabled={disabled}
            error={error}
          />
        );
      },
      calculated: <K extends keyof T>(p: RendererProps<T, K>) => {
        const { label, value, icon, error, placeholder } = p;
        return (
          <TaskField
            icon={resolveIcon(icon)}
            label={label}
            type="number"
            value={(value as unknown as number) ?? ""} // show empty when NaN/undefined
            onChange={() => {
              /* no-op: read-only */
            }}
            readOnly={true}
            disabled={true}
            error={error}
            placeholder={placeholder}
            step={1}
          />
        );
      },
    },
  };
}
