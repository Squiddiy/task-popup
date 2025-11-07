// ui/meta/TaskCategories.meta.ts
import { defineMeta } from "./meta";
import { ICON } from "./IconResolver";
import {
  TaskCategoriesSchema,
  AREA,
  SECLEVEL,
} from "../../schemas/TaskCategories";

export const TaskCategoriesMeta = defineMeta(TaskCategoriesSchema, {
  area: {
    label: "Area",
    icon: ICON.tags,
    kind: "select",
    options: AREA,                 // reuses your const array
    placeholder: "Select area…",
  },
  seclevel: {
    label: "Security Level",
    icon: ICON.tags,
    kind: "select",
    options: SECLEVEL,             // reuses your const array
    placeholder: "Select level…",
  },
});
