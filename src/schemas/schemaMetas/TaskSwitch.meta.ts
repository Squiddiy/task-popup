// ui/meta/TaskRisk.meta.ts
import { defineMeta } from "./meta";
import { ICON } from "./IconResolver";
import { TaskSwitchSchema } from "../../schemas/TaskSwitch";

export const TaskSwitchMeta = defineMeta(TaskSwitchSchema, {
    testSwitchNumber: {
    label: "Billable",
    icon: ICON.riskFlag,
    kind: "switch",
    placeholder: "Turns it on/off",
    }
});
