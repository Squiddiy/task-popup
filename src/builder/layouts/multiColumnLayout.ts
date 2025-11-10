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
        { cols: 3, fields: [{ key: "taskName"}, { key: "taskManager" }, {key: "taskStatus"}, {key: "priority"}, ] },
        { cols: 3, fields: [{ key: "probability" }] },
        { cols: 3, fields: [{ key: "area" }, {key: "seclevel"}] },
        {
          cols: 1,
          fields: [
            { key: "consequence",override: { kind: "richtext" } },
            { key: "rootCause",override: { kind: "richtext" } },
            { key: "impact" },
          ],
        },
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
          fields: [{ key: "description", override: { kind: "richtext" } }],
        },
      ],
    },
    {
      id: "categories",
      title: "Categories",
      collapsible: true,
      defaultOpen: true,
      rows: [{ cols: 1, fields: [{ key: "area" }, { key: "seclevel" }] }],
    },
    // {
    //   id: "switch",
    //   title: "switch",
    //   collapsible: true,
    //   defaultOpen: true,
    //   rows: [
    //     {
    //       cols: 1,
    //       fields: [{ key: "testSwitchNumber" }],
    //     },
    //   ],
    // },
  ],
};
