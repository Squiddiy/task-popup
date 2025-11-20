import type { CommonBase, taskFieldSelectOption } from "./TaskFieldTypes";

export type SelectProps = CommonBase & {
  type: "select";
  value: string | number | undefined;
  onChange: (v: string | number) => void;
  options: taskFieldSelectOption[];
};

export function SelectInput({
  id,
  value,
  onChange,
  options,
  disabled,
  fieldInputClasses,
}: Pick<SelectProps, "id" | "value" | "onChange" | "options" | "disabled" | "fieldInputClasses">) {
  return (
    <select
      id={id}
      value={String(value ?? "")}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={fieldInputClasses}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

//cx(fieldInputClasses, "tw:appearance-none")