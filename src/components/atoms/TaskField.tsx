import React from "react";
import type { IconType } from "react-icons";

type Option = { value: string; label: string };

type CommonProps = {
  id?: string;
  icon?: IconType;
  label: string;
  value: string | number | undefined;
  onChange: (v: string | number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  readOnly?: boolean;
  /** Shown in the far-right column, aligned with other rows (e.g., your “1”). */
};

type Props =
  | ({
    type: "text" | "number";
    options?: never;
  } & CommonProps)
  | ({
    type: "select";
    options: Option[];
  } & CommonProps);


export default function TaskField(props: Props) {
  const {
    id, icon: Icon, label, value, onChange, type, options,
    min, max, step, placeholder, disabled, error, readOnly,
  } = props;

  const baseInput =
    "tw:bg-transparent tw:outline-none tw:border-none focus:tw:ring-0 tw:text-gray-900 placeholder:tw:text-gray-400";
  const numberAlign = "tw:text-right tw:tabular-nums";

  return (
    <div className="tw:py-2">
      {/* Field = two columns: [label+input][end] */}
      <div className="tw:grid tw:items-center tw:gap-x-3 tw:grid-cols-[1fr_auto]">
        {/* Label + Input inline */}
        <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-3">
          <label
            htmlFor={id}
            className="tw:flex tw:items-center tw:gap-2 tw:min-w-28 tw:whitespace-nowrap tw:text-gray-700"
          >
            {Icon && React.createElement(Icon as React.ComponentType<any>, { size: 18 })}
            <span className="tw:font-medium">{label}</span>
          </label>

          {type === "select" ? (
            <select
              id={id}
              value={String(value ?? "")}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className={`${baseInput} ${numberAlign} tw:appearance-none tw:min-w-[8rem] tw:flex-1 tw:border-b tw:border-gray-200 focus:tw:border-gray-400`}
            >
              {options!.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          ) : readOnly ? (
            <span className={`${numberAlign} tw:min-w-[8rem] tw:flex-1 tw:font-medium`}>{value}</span>
          ) : (
            <input
              id={id}
              type={type}
              value={value ?? ""}
              onChange={(e) => {
                if (type === "number") {
                  const raw = e.target.value;
                  onChange(raw === "" ? "" : Number(raw));
                } else onChange(e.target.value);
              }}
              min={min} max={max} step={step} placeholder={placeholder} disabled={disabled}
              className={`${baseInput} ${numberAlign} tw:min-w-[8rem] tw:flex-1 tw:border-b tw:border-gray-200 focus:tw:border-gray-400`}
            />
          )}
        </div>

        {/* Right-aligned trailing number */}
      </div>

      {error && <div className="tw:mt-1 tw:text-xs tw:text-rose-600">{error}</div>}
    </div>
  );
}
