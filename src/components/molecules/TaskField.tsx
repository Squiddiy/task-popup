// TaskField.tsx
import { LabelBlock } from "../atoms/LabelBlock";
import { ErrorText } from "../atoms/ErrorText";
import { FieldRow } from "../atoms/FieldRow";
import { ReadOnlyText } from "../atoms/ReadOnlyText";
import { SelectInput } from "../atoms/SelectInput";
import type { Props, taskFieldSelectOption } from "../atoms/TaskFieldTypes";
import { TextInput } from "../atoms/TextInput";
import { NumberInput } from "../atoms/NumberInput";
import { SwitchInput } from "../atoms/SwitchInput";

/* ---------------- Utils ---------------- */

const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

const baseInput =
  "tw:bg-transparent tw:outline-none tw:border-none focus:tw:ring-0 tw:text-gray-400 tw:focus:text-gray-900 placeholder:tw:text-gray-200";
const numberAlign = "tw:text-left tw:tabular-nums";
const fieldInputClasses = cx(
  baseInput,
  numberAlign,
  "tw:min-w-[8rem] tw:flex-1 tw:border-b tw:border-gray-200 focus:tw:border-gray-400"
);

const getSelectLabel = (
  val: string | number | undefined,
  options: taskFieldSelectOption[]
) => {
  if (val == null) return "";
  const s = String(val);
  return options.find((o) => o.value === s)?.label ?? s;
};

export default function TaskField(props: Props) {
  const {
    id,
    icon,
    iconSize,
    infoIconComputed,
    label,
    disabled,
    error,
    readOnly,
    className,
  } = props;

  console.log(iconSize);
  // Left: label; Right: control. Keep layout consistent.
  return (
    <FieldRow>
      <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-3">
        <LabelBlock
          id={id}
          icon={icon}
          iconSize={iconSize}
          label={label ?? ""}
        />

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
              fieldInputClasses={cx(fieldInputClasses, "tw:appearance-none")}
            />
          )
        ) : props.type === "switch" ? (
          <SwitchInput
            id={id}
            label={label ?? ""}
            value={!!props.value}
            onChange={props.onChange}
            disabled={disabled}
          />
        ) : props.type === "number" ? (
          <NumberInput
            id={id}
            value={props.value ?? ""}
            onChange={props.onChange}
            min={props.min}
            max={props.max}
            step={props.step}
            placeholder={props.placeholder}
            disabled={disabled}
            className={className}
            infoIconComputed={infoIconComputed}
            fieldInputClasses={fieldInputClasses}
          />
        ) : (
          // type === "text"
          <TextInput
            id={id}
            value={props.value ?? ""}
            onChange={props.onChange}
            placeholder={props.placeholder}
            disabled={disabled}
            className={className}
            fieldInputClasses={fieldInputClasses}
          />
        )}
      </div>

      {/* (Reserved trailing column) */}
      <div />

      <ErrorText error={error} />
    </FieldRow>
  );
}
