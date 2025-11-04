import React from "react";
import { z } from "zod";
import Popup from "./Popup";
import ConfirmButtonSet from "../molecules/ConfirmButtonSet";
import { FaExclamationTriangle } from "react-icons/fa";

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
          {React.createElement(
            FaExclamationTriangle as React.ComponentType<any>,
            {
              size: 40,
              style: {
                display: "inline-block",
                verticalAlign: "text-bottom",
                marginRight: "4px",
                color: "#374151",
              },
            }
          )}
          <h1
            style={{
              display: "inline-block",
              fontSize: "x-large",
              fontWeight: "bolder",
            }}
          >
            {title}
          </h1>
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
