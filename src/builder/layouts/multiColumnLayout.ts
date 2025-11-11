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
          fields: [
            { key: "taskName" },
            { key: "taskManager" },
            { key: "taskStatus" },
            { key: "priority" },
          ],
        },
        {
          fields: [
            { key: "area" },
            { key: "seclevel" },
            { key: "testSwitchNumber" },
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
          fields: [{ key: "description", override: { kind: "richtext" } }],
        },
      ],
    },
    {
      id: "rootCause",
      title: "rootCause",
      collapsible: true,
      defaultOpen: true,
      rows: [
        {
          fields: [{ key: "rootCause", override: { kind: "richtext" } }],
        },
      ],
    },
    {
      id: "consequence",
      title: "consequence",
      collapsible: true,
      defaultOpen: true,
      rows: [
        {
          fields: [{ key: "consequence", override: { kind: "richtext" } }],
        },
      ],
    },
    {
      id: "categories",
      title: "Categories",
      collapsible: true,
      defaultOpen: true,
      rows: [{ fields: [{ key: "area" }, { key: "seclevel" }] }],
    },
  ],
};
