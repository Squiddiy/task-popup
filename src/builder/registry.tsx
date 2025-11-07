import * as Fa from "react-icons/fa6";
import * as Md from "react-icons/md";
import * as Tb from "react-icons/tb";
import * as Io from "react-icons/io5";
import TaskField from "../components/atoms/TaskField";
import QuillField from "../components/atoms/QuillField";
import type { IconType } from "react-icons";
import type { JSX } from "react";

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
  icon?: string | IconType;             // 👈 allow string or component
  value: T[K] | undefined;
  onChange: (v: T[K] | undefined) => void;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  options?: readonly string[];
};

export type Renderer<T> = <K extends keyof T>(p: RendererProps<T, K>) => JSX.Element;

export type Registry<T> = {
  byKind: Partial<Record<"text" | "number" | "select" | "richtext", Renderer<T>>>;
  byField?: Partial<Record<keyof T, Renderer<T>>>;
  iconFor?: (key?: string) => IconType | undefined;
};

export function defaultRegistry<T>(): Registry<T> {
  return {
    byKind: {
      text: ({ label, value, onChange, disabled, error, placeholder, icon }) => (
        <TaskField
          icon={resolveIcon(icon)}           // 👈 resolve here
          label={label}
          type="text"
          value={value as unknown as string | undefined}
          onChange={(v) => onChange((v ?? undefined) as any)}
          placeholder={placeholder}
          disabled={disabled}
          error={error}
        />
      ),
      number: ({ label, value, onChange, disabled, error, placeholder, icon }) => (
        <TaskField
          icon={resolveIcon(icon)}           // 👈 resolve here
          label={label}
          type="number"
          value={value as unknown as number | undefined}
          onChange={(v) => onChange((v ?? undefined) as any)}
          step={1}
          disabled={disabled}
          error={error}
          placeholder={placeholder}
        />
      ),
      select: ({ label, value, onChange, disabled, error, options, icon }) => (
        <TaskField
          icon={resolveIcon(icon)}           // 👈 resolve here
          label={label}
          type="select"
          value={value as unknown as string | undefined}
          onChange={(v) => onChange(v as any)}
          options={(options ?? []).map((s) => ({ value: s, label: s }))}
          disabled={disabled}
          error={error}
        />
      ),
      richtext: ({ label, value, onChange, disabled, error }) => (
        <div className="space-y-1">
          <div className="tw:text-sm tw:text-gray-700">{label}</div>
          <QuillField
            value={(value as unknown as string | undefined) ?? ""}
            onChange={(html) => onChange((html ?? undefined) as any)}
            readOnly={disabled}
          />
          {error && <div className="tw:text-red-600 tw:text-sm">{error}</div>}
        </div>
      ),
    },
  };
}
