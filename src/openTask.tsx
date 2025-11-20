// openTask.ts
import React from "react";
import { createRoot } from "react-dom/client";
import { z } from "zod";

import {
  composeSchema,
  type AllInputs,
  type EnabledModule,
  type InputsFromEnabled,
} from "./composer/TaskCompose";

import { TaskWrapper } from "./components/organism/TaskWrapper";
import { BreadcrumbPath } from "./components/atoms/HeaderPath";

import type { PathItem } from "./components/atoms/HeaderPath";
import type { OnChangeFn } from "./components/organism/TaskWrapper";

import { TaskBuilder } from "./builder/taskbuilder";
import type { LayoutConfig } from "./builder/layout";

function createMountNode(): { rootEl: HTMLElement; cleanup: () => void } {
  const container = document.createElement("div");
  container.id = `task-popup-${Date.now()}`;
  document.body.appendChild(container);
  return {
    rootEl: container,
    cleanup: () => container.remove(),
  };
}

export type TaskType = "Task" | "Risk" | "Gate" | "Milestone";

export function openTask<
  const E extends readonly EnabledModule[] = readonly ["base"],
  const S extends z.ZodType | undefined = undefined
>(opts: {
  title?: string;
  taskType?: TaskType;
  enabled?: E;
  layout?: LayoutConfig<AllInputs>;
  initialData?: Partial<
    S extends z.ZodType ? z.input<S> : InputsFromEnabled<E>
  >;
  render?: (args: {
    values: S extends z.ZodType ? z.input<S> : InputsFromEnabled<E>;
    onChange: OnChangeFn<
      S extends z.ZodType ? z.input<S> : InputsFromEnabled<E>
    >;
    isValid: boolean;
    errors: Partial<
      Record<
        keyof (S extends z.ZodType ? z.input<S> : InputsFromEnabled<E>),
        string
      >
    >;
  }) => React.ReactNode;
  titlePath?: PathItem[];
}): Promise<(S extends z.ZodType ? z.output<S> : InputsFromEnabled<E>) | null> {
  const {
    title = "",
    taskType = "Task",
    enabled,
    layout,
    initialData,
    render,
    titlePath = [],
  } = opts;

  const enabledModules = (enabled ?? (["base"] as const)) as E;
  type TValues = S extends z.ZodType ? z.input<S> : InputsFromEnabled<E>;

  const Schema: z.ZodType<TValues> = composeSchema(
    enabledModules,
    layout ?? undefined
  ) as z.ZodType<TValues>;

  const emptyLayout: LayoutConfig<TValues> = { sections: [] };

  const defaultRender = ({
    values,
    onChange,
    errors,
  }: {
    values: TValues;
    onChange: OnChangeFn<TValues>;
    isValid: boolean;
    errors: Partial<Record<keyof TValues, string>>;
  }) => (
    <TaskBuilder
      schema={Schema}
      layout={layout ?? emptyLayout}
      values={values as Partial<TValues>}
      onChange={(patch) => onChange(patch, true)}
      errors={errors}
      disabled={false}
    />
  );

  return new Promise((resolve) => {
    const { rootEl, cleanup } = createMountNode();
    const root = createRoot(rootEl);

    const close = () => {
      root.unmount();
      cleanup();
    };

    const handleSubmit = (data: TValues) => {
      const parsed = (Schema as z.ZodType<TValues>).parse(data);
      close();
      resolve(
        parsed as unknown as S extends z.ZodType
          ? z.output<S>
          : InputsFromEnabled<E>
      );
    };

    const handleCancel = () => {
      close();
      resolve(null);
    };

    const pathNode = (
      <div className="tw:flex tw:flex-col tw:gap-1">
        {titlePath?.length > 0 && <BreadcrumbPath items={titlePath} />}
      </div>
    );

    root.render(
      <TaskWrapper<TValues>
        title={title}
        taskType={taskType}
        pathNode={pathNode as React.ReactNode}
        container={rootEl}
        schema={Schema as z.ZodType<TValues>}
        initialData={(initialData ?? {}) as TValues}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        render={
          (render ?? defaultRender) as (args: {
            values: TValues;
            onChange: OnChangeFn<TValues>;
            isValid: boolean;
            errors: Partial<Record<keyof TValues, string>>;
          }) => React.ReactNode
        }
      />
    );
  });
}
