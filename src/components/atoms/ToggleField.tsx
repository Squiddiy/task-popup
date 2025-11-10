import * as React from "react";
import type { IconType } from "react-icons";
import { Switch } from "@headlessui/react";
import clsx from "clsx";

type Props = {
  icon?: IconType;
  label: string;
  checked: boolean | undefined;
  onChange: (v: boolean | undefined) => void;
  disabled?: boolean;
  error?: string;
  description?: string;
};

export default function ToggleField({
  icon,
  label,
  checked,
  onChange,
  disabled,
  error,
  description,
}: Props) {
  const Icon = icon;

  const value = !!checked; // coerce undefined -> false for UI

  return (
    <>
      <label className="tw:flex tw:flex-col tw:gap-1">
        <div className="tw:flex tw:items-center tw:gap-2">
          {Icon && <Icon className="tw:inline-block" size={16} />}
          <span className="tw:text-sm tw:text-gray-800">{label}</span>
        </div>

        {error && <div className="tw:text-red-600 tw:text-sm">{error}</div>}
      </label>
      <div className="tw:flex tw:items-center tw:gap-3">
        <Switch
          checked={value}
          onChange={(v: boolean) => onChange(v)}
          disabled={disabled}
          className={clsx(
            "tw:relative tw:inline-flex tw:h-6 tw:w-11 tw:flex-shrink-0 tw:cursor-pointer tw:rounded-full tw:border-2 tw:border-transparent tw:transition-colors tw:duration-200 tw:focus:outline-none",
            value ? "tw:bg-emerald-600" : "tw:bg-gray-300",
            disabled && "tw:opacity-50 tw:cursor-not-allowed"
          )}
        >
          <span
            aria-hidden="true"
            className={clsx(
              "tw:pointer-events-none tw:translate-x-0 tw:inline-block tw:h-5 tw:w-5 tw:transform tw:rounded-full tw:bg-white tw:shadow tw:ring-0 tw:transition tw:duration-200",
              value ? "tw:translate-x-5" : "tw:translate-x-0"
            )}
          />
        </Switch>
        {description && (
          <span className="tw:text-xs tw:text-gray-500">{description}</span>
        )}
      </div>
    </>
  );
}
