// ui/meta/TaskRisk.meta.ts
import { defineMeta } from "./meta";
import { ICON } from "./IconResolver";
import { TaskRiskSchema } from "../../schemas/TaskRisk";

export const TaskRiskMeta = defineMeta(TaskRiskSchema, {
  probability: {
    label: "Probability",
    icon: ICON.riskFlag,
    kind: "number",
    placeholder: "0–5",
  },
  impact: {
    label: "Impact",
    icon: ICON.riskFlag,
    kind: "number",
    placeholder: "0–5",
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
    computeValue: ({ values }) => {
      const impactValue = Number(values.impact ?? 0);
      const probabilityValue = Number(values.probability ?? 0);
      return impactValue * probabilityValue;
    },
    infoIconCompute: ({ value }) => {
      const v = Number(value ?? 0);

      let className = "";
      let title = "";

      switch (true) {
        case v >= 16:
          className = "tw:text-red-500";
          title = "High risk";
          break;

        case v >= 9:
          className = "tw:text-amber-500";
          title = "Medium risk";
          break;

        case v > 0:
          className = "tw:text-emerald-500";
          title = "Low risk";
          break;

        default:
          className = "tw:text-gray-400";
          title = "No risk value yet";
          break;
      }

      return {
        icon: ICON.warning,
        className,
        title,
      };
    },
  },
});
