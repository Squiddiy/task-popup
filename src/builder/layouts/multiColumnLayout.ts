import { type LayoutConfig } from "../layout";
import { type AllInputs } from "../../composer/TaskCompose";

export const multiColumnLayout: LayoutConfig<AllInputs> = {
  sections: [
    {
      id: "main",
      title: "Main",
      collapsible: true,
      defaultOpen: true,
      rows: [
        {
          cols: 3,
          colWidth: 1,
          fields: [
            { key: "taskName" },
            { key: "taskManager" },
            { key: "taskStatus" },
            { key: "priority" },
          ],
        },
        { cols: 3, colWidth: 1, fields: [{ key: "probability" }] },
        {
          cols: 3,
          colWidth: 1,
          fields: [
            { key: "area" },
            { key: "seclevel" },
            { key: "testSwitchNumber" },
          ],
        },

        { cols: 3, colWidth: 2, fields: [{ key: "rootCause" }] },
        { cols: 3, colWidth: 1, fields: [{ key: "consequence" }] },

        { cols: 2, colWidth: 1, fields: [{ key: "impact" }] },
        { cols: 2, colWidth: 1, fields: [{ key: "probability" }] },
      ],
    },
    {
      id: "desc",
      title: "Description",
      collapsible: true,
      defaultOpen: true,
      rows: [
        {
          cols: 1,
          colWidth: 1,
          fields: [{ key: "description", override: { kind: "richtext" } }],
        },
      ],
    },
    {
      id: "categories",
      title: "Categories",
      collapsible: true,
      defaultOpen: true,
      rows: [
        {
          cols: 1,
          colWidth: 1,
          fields: [{ key: "area" }, { key: "seclevel" }],
        },
      ],
    },
  ],
};
