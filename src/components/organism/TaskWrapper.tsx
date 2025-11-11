import React from "react";
import { z } from "zod";
import Popup from "./Popup";
import ConfirmButtonSet from "../molecules/ConfirmButtonSet";
import { FaExclamationTriangle } from "react-icons/fa";
import type { TaskType } from "../../App";

export type OnChangeFn<T> = (
  patch: Partial<T> | ((prev: T) => Partial<T>),
  valid: boolean
) => void;

function zodErrorToFieldErrors<T>(
  err: z.ZodError
): Partial<Record<keyof T, string>> {
  const map: Partial<Record<string, string>> = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".");
    map[key] = issue.message;
  }
  return map as Partial<Record<keyof T, string>>;
}

type WrapperProps<T> = {
  initialData: T;
  onSubmit: (data: T) => void;
  onCancel: () => void;
  container: HTMLElement;
  pathNode: React.ReactNode;
  title: string;
  taskType: TaskType;

  schema: z.ZodType<T>;

  render: (args: {
    values: T;
    onChange: OnChangeFn<T>;
    isValid: boolean;
    errors: Partial<Record<keyof T, string>>;
  }) => React.ReactNode;
};

export function TaskWrapper<T>({
  initialData,
  onSubmit,
  onCancel,
  schema,
  title,
  taskType,
  container,
  pathNode,
  render,
}: WrapperProps<T>) {
  const [data, setData] = React.useState<T>(initialData);
  const [isValid, setIsValid] = React.useState(true);
  const [errors, setErrors] = React.useState<Partial<Record<keyof T, string>>>(
    {}
  );

  const validateAll = (formData: T) => {
    console.log(schema);
    const result = schema.safeParse(formData);
    console.log(result);
    if (result.success) {
      setErrors({});
      return { ok: true as const, data: result.data };
    }
    const fieldErrors = zodErrorToFieldErrors<T>(result.error);
    setErrors(fieldErrors);
    return { ok: false as const, errors: fieldErrors };
  };

  const handleChange: OnChangeFn<T> = (patch, _childValid) => {
    setData((prev) => {
      const update = typeof patch === "function" ? patch(prev) : patch;
      const next = { ...prev, ...update };
      const v = schema.safeParse(next);
      setIsValid(v.success);
      if (!v.success) setErrors(zodErrorToFieldErrors<T>(v.error));
      else setErrors({});
      return next;
    });
  };

  const handleSubmit = () => {
    console.log(data);
    const res = validateAll(data);
    if (!res.ok) {
      setIsValid(false);
      return;
    }
    setIsValid(true);
    onSubmit(res.data);
  };

  return (
    <Popup
      isOpen={true}
      onClose={onCancel}
      title={pathNode}
      container={container}
    >
      <Popup.Body>
        <div>
          {taskType === "Risk" && (
            <FaExclamationTriangle
              size={40}
              className="tw:inline-block tw:align-text-bottom tw:mr-4"
            ></FaExclamationTriangle>
          )}
          <h1 className="tw:inline-block tw:text-xl tw:font-bold">{title}</h1>
        </div>

        {render({
          values: data,
          onChange: handleChange,
          isValid,
          errors: errors,
        })}
      </Popup.Body>
      <Popup.Footer>
        <ConfirmButtonSet onOk={handleSubmit} onCancel={onCancel} />
      </Popup.Footer>
    </Popup>
  );
}
