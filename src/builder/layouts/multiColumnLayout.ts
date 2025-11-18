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
            { key: "taskManager" },
            { key: "taskStatus" },
            { key: "priority" },
          ],
        },
        {
          fields: [
            { key: "impact" },
            { key: "probability" },
            { key: "riskValue" },
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
          fields: [{ key: "description" }],
        },
      ],
    },
    {
      id: "measure",
      title: "Measure",
      collapsible: true,
      defaultOpen: true,
      rows: [
        {
          fields: [{ key: "rootCause" }],
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
          fields: [{ key: "consequence" }],
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
