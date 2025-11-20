import type { TextProps } from "./TaskFieldTypes";

export function TextInput({
  id,
  value,
  onChange,
  placeholder,
  disabled,
  className,
  fieldInputClasses
}: Pick<
  TextProps,
  "id" | "value" | "onChange" | "placeholder" | "disabled" | "className" | "fieldInputClasses"
>) {
  console.log(value);
  console.log(className);
  return (
    <input
      id={id}
      type="text"
      title={value}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={fieldInputClasses + " " + className}
    />
  );
}