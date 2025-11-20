import { Switch } from "@headlessui/react";

const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

export function SwitchInput({
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
        // container
        "tw:relative tw:inline-flex tw:h-3 tw:w-6 tw:items-center tw:rounded-full tw:transition-colors",
        value ? "tw:bg-emerald-500" : "tw:bg-gray-300",
        disabled ? "tw:opacity-50 tw:cursor-not-allowed" : "tw:cursor-pointer"
      )}
    >
      <span className="tw:sr-only">{label}</span>
      <span
        className={cx(
          // thumb
          "tw:inline-block tw:h-2.5 tw:w-2.5 tw:transform tw:rounded-full tw:bg-white tw:transition-transform",
          value ? "tw:translate-x-3" : "tw:translate-x-0.5"
        )}
      />
    </Switch>
  );
}