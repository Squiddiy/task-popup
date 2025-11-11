// TaskField.tsx (refactored, modular)
import React from "react";
import type { IconType } from "react-icons";
import { Switch } from "@headlessui/react";

/* ---------------- Types ---------------- */

type Option = { value: string; label: string };

type CommonBase = {
  id?: string;
  icon?: IconType;
  label: string;
  disabled?: boolean;
  error?: string;
  readOnly?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
};

type TextProps = CommonBase & {
  type: "text";
  value: string | undefined;
  onChange: (v: string) => void;
  options?: never;
};

type NumberProps = CommonBase & {
  type: "number";
  value: number | "" | undefined;
  onChange: (v: number | "") => void;
  options?: never;
};

type SelectProps = CommonBase & {
  type: "select";
  value: string | number | undefined;
  onChange: (v: string | number) => void;
  options: Option[];
};

type SwitchProps = CommonBase & {
  type: "switch";
  value: boolean | undefined;
  onChange: (v: boolean) => void;
  options?: never;
};

type Props = TextProps | NumberProps | SelectProps | SwitchProps;

/* ---------------- Utils ---------------- */

const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");

const baseInput =
  "tw:bg-transparent tw:outline-none tw:border-none focus:tw:ring-0 tw:text-gray-900 placeholder:tw:text-gray-400";
const numberAlign = "tw:text-right tw:tabular-nums";
const fieldInputClasses = cx(
  baseInput,
  numberAlign,
  "tw:min-w-[8rem] tw:flex-1 tw:border-b tw:border-gray-200 focus:tw:border-gray-400"
);

const getSelectLabel = (val: string | number | undefined, options: Option[]) => {
  if (val == null) return "";
  const s = String(val);
  return options.find(o => o.value === s)?.label ?? s;
};

/* ---------------- Small, focused pieces ---------------- */

function FieldRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="tw:py-2">
      <div className="tw:grid tw:items-center tw:gap-x-3 tw:grid-cols-[1fr_auto]">{children}</div>
    </div>
  );
}

function LabelBlock({ id, icon: Icon, label }: { id?: string; icon?: IconType; label: string }) {
  return (
    <label
      htmlFor={id}
      className="tw:flex tw:items-center tw:gap-2 tw:min-w-28 tw:whitespace-nowrap tw:text-gray-700"
    >
      {Icon && <Icon size={18} />}
      <span className="tw:font-medium">{label}</span>
    </label>
  );
}

function ReadOnlyText({ value }: { value: React.ReactNode }) {
  return <span className="tw:min-w-[8rem] tw:flex-1 tw:font-medium">{value}</span>;
}

function ErrorText({ error }: { error?: string }) {
  if (!error) return null;
  return <div className="tw:mt-1 tw:text-xs tw:text-rose-600">{error}</div>;
}

/* ---- Inputs ---- */

function TextInput({
  id,
  value,
  onChange,
  placeholder,
  disabled,
}: Pick<TextProps, "id" | "value" | "onChange" | "placeholder" | "disabled">) {
  return (
    <input
      id={id}
      type="text"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={fieldInputClasses}
    />
  );
}

function NumberInput({
  id,
  value,
  onChange,
  min,
  max,
  step,
  placeholder,
  disabled,
}: Pick<NumberProps, "id" | "value" | "onChange" | "min" | "max" | "step" | "placeholder" | "disabled">) {
  return (
    <input
      id={id}
      type="number"
      value={value ?? ""}
      onChange={(e) => {
        const raw = e.target.value;
        onChange(raw === "" ? "" : Number(raw));
      }}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      disabled={disabled}
      className={fieldInputClasses}
    />
  );
}

function SelectInput({
  id,
  value,
  onChange,
  options,
  disabled,
}: Pick<SelectProps, "id" | "value" | "onChange" | "options" | "disabled">) {
  return (
    <select
      id={id}
      value={String(value ?? "")}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={cx(fieldInputClasses, "tw:appearance-none")}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/* ---- Switch (Headless UI) ---- */

function SwitchReadOnly({ checked }: { checked: boolean }) {
  return (
    <span
      className={cx(
        "tw:inline-flex tw:items-center tw:px-2 tw:py-0.5 tw:text-sm tw:rounded-full",
        checked ? "tw:bg-emerald-100 tw:text-emerald-700" : "tw:bg-gray-100 tw:text-gray-600"
      )}
      aria-readonly="true"
    >
      {checked ? "On" : "Off"}
    </span>
  );
}

function SwitchControl({
  id,
  label,
  value,
  onChange,
  disabled,
}: {
  id?: string;
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <Switch
      id={id}
      checked={value}
      onChange={onChange}
      disabled={disabled}
      className={cx(
        "tw:relative tw:inline-flex tw:h-6 tw:w-11 tw:items-center tw:rounded-full tw:transition-colors",
        value ? "tw:bg-emerald-500" : "tw:bg-gray-300",
        disabled ? "tw:opacity-50 tw:cursor-not-allowed" : "tw:cursor-pointer"
      )}
    >
      <span className="tw:sr-only">{label}</span>
      <span
        className={cx(
          "tw:inline-block tw:h-5 tw:w-5 tw:transform tw:rounded-full tw:bg-white tw:transition-transform",
          value ? "tw:translate-x-5" : "tw:translate-x-1"
        )}
      />
    </Switch>
  );
}

/* ---------------- Main Component ---------------- */

export default function TaskField(props: Props) {
  const { id, icon, label, disabled, error, readOnly } = props;

  // Left: label; Right: control. Keep layout consistent.
  return (
    <FieldRow>
      <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-3">
        <LabelBlock id={id} icon={icon} label={label} />

        {/* Control area */}
        {props.type === "select" ? (
          readOnly ? (
            <ReadOnlyText value={getSelectLabel(props.value, props.options)} />
          ) : (
            <SelectInput
              id={id}
              value={props.value}
              onChange={props.onChange}
              options={props.options}
              disabled={disabled}
            />
          )
        ) : props.type === "switch" ? (
          readOnly ? (
            <SwitchReadOnly checked={!!props.value} />
          ) : (
            <SwitchControl
              id={id}
              label={label}
              value={!!props.value}
              onChange={props.onChange}
              disabled={disabled}
            />
          )
        ) : props.type === "number" ? (
          readOnly ? (
            <ReadOnlyText value={props.value ?? ""} />
          ) : (
            <NumberInput
              id={id}
              value={props.value ?? ""}
              onChange={props.onChange}
              min={props.min}
              max={props.max}
              step={props.step}
              placeholder={props.placeholder}
              disabled={disabled}
            />
          )
        ) : (
          // type === "text"
          readOnly ? (
            <ReadOnlyText value={props.value ?? ""} />
          ) : (
            <TextInput
              id={id}
              value={props.value ?? ""}
              onChange={props.onChange}
              placeholder={props.placeholder}
              disabled={disabled}
            />
          )
        )}
      </div>

      {/* (Reserved trailing column) */}
      <div />

      <ErrorText error={error} />
    </FieldRow>
  );
}
