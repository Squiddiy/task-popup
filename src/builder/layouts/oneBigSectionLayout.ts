import { type LayoutConfig } from "../layout";
import { type AllInputs } from "../../composer/TaskCompose";

export const oneBigSectionLayout: LayoutConfig<AllInputs> = {
  sections: [
    {
      id: "all",
      title: "Task",
      collapsible: true,
      defaultOpen: true,
      rows: [
        { cols: "auto", fields: [{ key: "taskName" }, { key: "taskManager" }] },
        { cols: "auto", fields: [{ key: "taskStatus" }, { key: "priority" }] },
        {
          cols: 1,
          fields: [{ key: "description", override: { kind: "richtext" } }],
        },
        {
          cols: "auto",
          visibleIf: ({ values }) =>
            values.probability != null || values.impact != null,
          fields: [
            { key: "probability" },
            { key: "impact" },
            {
              key: "riskValue" as any, // virtual field
              override: { label: "Risk value", kind: "number" },
              compute: ({ values }) =>
                (Number(values.probability ?? 0) || 0) *
                (Number(values.impact ?? 0) || 0),
            },
          ],
        },
        {
          cols: "auto",
          fields: [{ key: "area" }, { key: "seclevel" }],
        },
      ],
    },
  ],
};
