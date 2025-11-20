import type { NumberProps } from "./TaskFieldTypes";

export function NumberInput({
  id,
  value,
  onChange,
  min,
  max,
  step,
  placeholder,
  disabled,
  className,
  infoIconComputed,
  fieldInputClasses
}: Pick<
  NumberProps,
  | "id"
  | "value"
  | "onChange"
  | "min"
  | "max"
  | "step"
  | "placeholder"
  | "disabled"
  | "className"
  | "infoIconComputed"
  | "fieldInputClasses"
>) {
  const InfoIcon = infoIconComputed?.icon; // Capitalize for JSX

  return (
    <div
      className={`tw:flex tw:flex-wrap tw:items-center tw:gap-1 ${
        InfoIcon ? "tw:-ml-5.5" : ""
      }`}
    >
      {InfoIcon && (
        <InfoIcon
          size={18}
          className={infoIconComputed?.className}
          title={infoIconComputed?.title}
        />
      )}

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
        className={fieldInputClasses + " " + className}
      />
    </div>
  );
}