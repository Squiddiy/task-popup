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
        { cols: "auto", fields: [{ key: "taskName" }, { key: "taskManager" }] },
        { cols: "auto", fields: [{ key: "taskStatus" }, { key: "priority" }] },
        { cols: "auto", fields: [{ key: "probability" }, { key: "impact" }] },
        {
          cols: "auto",
          fields: [
            { key: "consequence", override: { kind: "richtext" } },
            { key: "rootCause", override: { kind: "richtext" } },
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
    // {
    //   id: "risk",
    //   title: "Risk",
    //   collapsible: true,
    //   defaultOpen: true,
    //   rows: [
    //     { cols: "auto", fields: [{ key: "probability" }, { key: "impact" }] },
    //     {
    //       cols: 1,
    //       fields: [
    //         { key: "consequence", override: { kind: "richtext" } },
    //         { key: "rootCause", override: { kind: "richtext" } },
    //       ],
    //     },
    //   ],
    // },
    {
      id: "categories",
      title: "Categories",
      collapsible: true,
      defaultOpen: true,
      rows: [{ cols: "auto", fields: [{ key: "area" }, { key: "seclevel" }] }],
    },
    {
      id: "switch",
      title: "switch",
      collapsible: true,
      defaultOpen: true,
      rows: [
        {
          cols: 1,
          fields: [{ key: "testSwitchNumber" }],
        },
      ],
    },
  ],
};
