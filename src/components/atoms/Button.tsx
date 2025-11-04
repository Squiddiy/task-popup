import clsx from "clsx";
import React from "react";

type DefinedColors = "lime" | "blue";

type Props = {
  children: React.ReactNode;
  onClick: () => void;
  color: DefinedColors;
  disabled?: boolean;
  className?: string;
  dataTestId: string;
};

const Button = ({
  children,
  onClick,
  color,
  disabled = false,
  className = "",
  dataTestId,
}: Props) => {
  const getColor = (color: DefinedColors): string => {
    switch (color) {
      case "lime":
        return "tw:bg-[#cff00b] tw:hover:bg-[#bddf0a] tw:text-white";
      case "blue":
        return "tw:bg-sky-400 tw:hover:bg-sky-500 tw:text-white";
      default:
        return "";
    }
  };

  return (
    <button
      className={clsx(
        "tw:px-4 tw:py-2 tw:rounded",
        getColor(color),
        className,
        disabled ? "tw:cursor-not-allowed tw:opacity-50" : "tw:cursor-pointer"
      )}
      onClick={onClick}
      disabled={disabled}
      data-testid={dataTestId}
    >
      {children}
    </button>
  );
};

export default Button;
