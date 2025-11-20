import type { IconType } from "react-icons";

export type taskFieldSelectOption = { value: string; label: string };

export type CommonBase = {
  id?: string;
  icon?: IconType;
  iconSize: number;
  infoIconComputed?: {
    icon?: IconType;
    className?: string;
    title?: string;
  };
  label?: string;
  disabled?: boolean;
  error?: string;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  fieldInputClasses?: string;
};

export type TextProps = CommonBase & {
  type: "text";
  value: string | undefined;
  onChange: (v: string) => void;
  options?: never;
};

export type NumberProps = CommonBase & {
  type: "number";
  value: number | "" | undefined;
  onChange: (v: number | "") => void;
  options?: never;
  min?: number;
  max?: number;
  step?: number;
};

export type SelectProps = CommonBase & {
  type: "select";
  value: string | number | undefined;
  onChange: (v: string | number) => void;
  options: taskFieldSelectOption[];
};

export type SwitchProps = CommonBase & {
  type: "switch";
  value: boolean | undefined;
  onChange: (v: boolean) => void;
  options?: never;
};

export type Props = TextProps | NumberProps | SelectProps | SwitchProps;