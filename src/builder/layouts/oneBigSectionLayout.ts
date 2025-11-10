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
        { cols: 1, fields: [{ key: "taskName" }, { key: "taskManager" }] },
        { cols: 1, fields: [{ key: "taskStatus" }, { key: "priority" }] },
        {
          cols: 1,
          fields: [{ key: "description", override: { kind: "richtext" } }],
        },
        {
          cols: 1,
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
          cols: 1,
          fields: [{ key: "area" }, { key: "seclevel" }],
        },
      ],
    },
  ],
};
