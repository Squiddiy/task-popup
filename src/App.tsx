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

import tailwindCss from "./index.css?inline";
import { TaskBuilder } from "./builder/taskbuilder";
import type { LayoutConfig } from "./builder/layout";
export function createShadowRootWithTailwind(): {
  rootEl: HTMLElement;
  cleanup: () => void;
} {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const shadowRoot = container.attachShadow({ mode: "open" });
  const rootEl = document.createElement("div");
  shadowRoot.appendChild(rootEl);

  // ✅ Inject Tailwind CSS into shadow DOM
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(tailwindCss);
  shadowRoot.adoptedStyleSheets = [sheet];

  // Optional fallback tweaks
  const fallbackStyle = document.createElement("style");
  fallbackStyle.textContent = `
    :host, *, ::before, ::after {
      --tw-border-style: solid;
    }
  `;
  shadowRoot.appendChild(fallbackStyle);

  return {
    rootEl,
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
    enabled, // ✅ default only base
    layout,
    initialData,
    render,
    titlePath = [],
  } = opts;

  const enabledModules = (enabled ?? (["base"] as const)) as E;
  // Build/choose schema (strict merged object from your composeSchema)
  const Schema = composeSchema(
    enabledModules,
    layout ?? undefined
  ) as S extends z.ZodTypeAny ? S : z.ZodType<InputsFromEnabled<E>>;

  console.log(Schema);

  // Default renderer (unchanged)
  type TValues = S extends z.ZodTypeAny ? z.input<S> : InputsFromEnabled<E>;

  //If no fields are enabled, provide an empty layout to avoid errors
  const emptyLayout: LayoutConfig<AllInputs> = {
    sections: [],
  };

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
      schema={Schema} // composed schema that is built of enables & layout
      layout={layout ?? emptyLayout}
      values={values as Partial<TValues>}
      onChange={(patch) => onChange(patch, true)}
      errors={errors}
      disabled={false}
      // registry={customRegistry} // optional
    />
  );

  return new Promise((resolve) => {
    const { rootEl, cleanup } = createShadowRootWithTailwind();
    const root = createRoot(rootEl);

    const close = () => {
      root.unmount();
      cleanup();
    };

    const handleSubmit = (data: TValues) => {
      const parsed = (Schema as z.ZodType<TValues>).parse(data); // strict at runtime
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

function App() {
  const handleOpen = () => {
    openTask({
      title: "Create New Task",
      taskType: "Task",
      enabled: ["categories", "base", "risk", "switch"],
      layout: multiColumnLayout,
      initialData: {
        area: "Cool Area",
        seclevel: "High",

        // taskName: "Ny aktivitet",
        // probability: 3,
        // impact: 2,
        // taskManager: "Oliver",
        // taskStatus: "Active",
        // priority: 100,
      },
      titlePath: [
        { name: "Projekt X", onClick: () => console.log("Clicked Projekt X") },
        {
          name: "Riskhantering",
          onClick: () => console.log("Clicked Riskhantering"),
        },
      ],
    }).then((result) => {
      if (result) {
        console.log("✅ Task saved:", result);
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
