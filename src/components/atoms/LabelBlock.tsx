import type { IconType } from "react-icons";

export function LabelBlock({
  id,
  icon: Icon,
  iconSize,
  label,
}: {
  id?: string;
  icon?: IconType;
  iconSize: number;
  label: string;
}) {
  return (
    <label
      htmlFor={id}
      className={`tw:flex tw:items-center ${
        label != "" ? "tw:gap-2 tw:w-32" : ""
      } tw:whitespace-nowrap tw:text-gray-700`}
    >
      {Icon && <Icon size={iconSize} />}

      {label != "" && (
        <span
          className="tw:font-medium tw:min-w-1/2 tw:overflow-hidden tw:text-ellipsis"
          title={label}
        >
          {label}
        </span>
      )}
    </label>
  );
}
