// ui/meta/TaskRisk.meta.ts
import { defineMeta } from "./meta";
import { ICON } from "./IconResolver";
import { TaskRiskSchema } from "../../schemas/TaskRisk";

export const TaskRiskMeta = defineMeta(TaskRiskSchema, {
  probability: {
    label: "Probability",
    icon: ICON.riskFlag,
    kind: "number",
    placeholder: "1–5",
  },
  impact: {
    label: "Impact",
    icon: ICON.riskFlag,
    kind: "number",
    placeholder: "1–5",
  },
  consequence: {
    label: "Konsekvens",
    icon: ICON.riskFlag,
    kind: "richtext",
    placeholder: "Write a consequence…",
  },
  rootCause: {
    label: "Grundorsak",
    icon: ICON.riskFlag,
    kind: "richtext",
    placeholder: "Write a reason…",
  },
  riskValue: {
    label: "Risk Value",
    icon: ICON.riskFlag,
    kind: "calculated",
    placeholder: "",
  }
});
