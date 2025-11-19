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
import { multiColumnLayout } from "./builder/layouts/multiColumnLayout";
import { BreadcrumbPath } from "./components/atoms/HeaderPath";

import type { PathItem } from "./components/atoms/HeaderPath";
import type { OnChangeFn } from "./components/organism/TaskWrapper";

import { TASKSTATUS, type TaskStatus } from "./schemas/TaskBase";

import { TaskBuilder } from "./builder/taskbuilder";
import type { LayoutConfig } from "./builder/layout";
import { useQueryClient } from "@tanstack/react-query";
import {
  getRiskById,
  getUserNames,
  saveRisk,
  type RiskObj,
  type ValueTextObj,
} from "./services/api/apiService";

/**
 * Plain DOM mount (no ShadowRoot).
 * Make sure your Tailwind stylesheet is loaded globally (e.g., in main.tsx or index.html).
 */
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

function openTask<
  const E extends readonly EnabledModule[] = readonly ["base"],
  const S extends z.ZodTypeAny | undefined = undefined
>(opts: {
  title?: string;
  taskType?: TaskType;
  enabled?: E;
  layout?: LayoutConfig<AllInputs>;
  initialData?: Partial<
    S extends z.ZodTypeAny ? z.input<S> : InputsFromEnabled<E>
  >;
  render?: (args: {
    values: S extends z.ZodTypeAny ? z.input<S> : InputsFromEnabled<E>;
    onChange: OnChangeFn<
      S extends z.ZodTypeAny ? z.input<S> : InputsFromEnabled<E>
    >;
    isValid: boolean;
    errors: Partial<
      Record<
        keyof (S extends z.ZodTypeAny ? z.input<S> : InputsFromEnabled<E>),
        string
      >
    >;
  }) => React.ReactNode;
  titlePath?: PathItem[];
}): Promise<
  (S extends z.ZodTypeAny ? z.output<S> : InputsFromEnabled<E>) | null
> {
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
  type TValues = S extends z.ZodTypeAny ? z.input<S> : InputsFromEnabled<E>;

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
    // ⬇️ Use normal DOM node instead of ShadowRoot
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
        parsed as unknown as S extends z.ZodTypeAny
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

type TaskFormResult = {
  taskName: string;
  rootCause: string;
  taskManager: string;
  taskStatus: TaskStatus;
  description?: string;
  impact: number;
  probability: number;
  priority?: number;
  testSwitchNumber?: boolean; // if you don't use it for backend, just ignore
};

function mapFormToRisk(
  old: RiskObj,
  form: TaskFormResult,
  names: ValueTextObj[]
): RiskObj {
  const taskManagerId =
    names.find((n) => n.Text === form.taskManager)?.Value ?? old.TaskManager;

  const statusIndex = TASKSTATUS.indexOf(form.taskStatus);
  const status = statusIndex >= 0 ? statusIndex + 1 : old.Status;

  return {
    ...old,
    Name: form.taskName ?? old.Name,
    Action: form.rootCause ?? old.Action,
    DescriptionFormat: form.description ?? old.DescriptionFormat,
    Impact: form.impact ?? old.Impact,
    Probability: form.probability ?? old.Probability,
    Priority: form.priority ?? old.Priority,
    TaskManager: taskManagerId,
    Status: status,
    // ID, Name, ProjectId, ParentId, Categories etc. stay from `old`
  };
}

function App() {
  const queryClient = useQueryClient();

  const handleOpen = async () => {
    const riskId = 545939;

    const cachedRisk = queryClient.getQueryData<RiskObj>(["riskById", riskId]);
    const risk: RiskObj =
      cachedRisk ??
      (await queryClient.fetchQuery({
        queryKey: ["riskById", riskId],
        queryFn: () => getRiskById(riskId),
      }));
    const names: ValueTextObj[] = await queryClient.fetchQuery({
      queryKey: ["getNames"],
      queryFn: () => getUserNames(),
    });

    console.log(risk);
    console.log(names);

    openTask({
      title: risk.Name,
      taskType: "Task",
      enabled: ["base", "risk", "switch"],
      layout: multiColumnLayout,
      initialData: {
        taskName: risk.Name,
        rootCause: risk.Action,
        taskManager: names.find((x) => x.Value == risk.TaskManager)?.Text ?? "",
        taskStatus: TASKSTATUS[risk.Status - 1],
        description: risk.DescriptionFormat,
        impact: risk.Impact,
        priority: risk.Priority,
        probability: risk.Probability,
        testSwitchNumber: true,
      },
      titlePath: [
        { name: "Projekt X", onClick: () => console.log("Clicked Projekt X") },
        {
          name: "Riskhantering",
          onClick: () => console.log("Clicked Riskhantering"),
        },
      ],
    }).then(async (result) => {
      if (result) {
        console.log(result);
        const payload = mapFormToRisk(risk, result as TaskFormResult, names);

        try {
          const saved = await saveRisk(payload);

          console.log(saved);
          queryClient.setQueryData<RiskObj>(["riskById", saved.ID], saved);

          console.log("✅ Risk saved to API:", saved);
        } catch (err) {
          console.error("❌ Failed to save risk:", err);
          // TODO: show toast / UI error
        }
      } else {
        console.log("❌ Task cancelled");
      }
    });
  };

  return (
    <div className="p-6 tw:italic tw:text-9xl">
      <button
        onClick={handleOpen}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Open Task Popup
      </button>
    </div>
  );
}

export default App;
