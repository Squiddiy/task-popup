// ui/meta/TaskBase.meta.ts
import { defineMeta } from "./meta";
import { ICON } from "./IconResolver";
import { TaskBaseSchema } from "../../schemas/TaskBase"; // your pure zod schema

export const TaskBaseMeta = defineMeta(TaskBaseSchema, {
  taskName: {
    label: "Name",
    icon: ICON.title,
    kind: "text",
    placeholder: "Enter task name…",
  },
  taskManager: { label: "Owner", icon: ICON.owner, kind: "text", placeholder: "Enter owner…" },
  taskStatus: {
    label: "Status",
    icon: ICON.status,
    kind: "select",
    options: ["Not Started", "Active", "Blocked", "Done"],
  },
  priority: {
    label: "Priority",
    icon: ICON.priority,
    kind: "select",
    options: ["Low", "Medium", "High"],
  },
  description: {
    label: "Description",
    icon: ICON.description,
    kind: "richtext",
  },
});
