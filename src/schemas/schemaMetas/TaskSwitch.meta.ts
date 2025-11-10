// ui/meta/TaskRisk.meta.ts
import { defineMeta } from "./meta";
import { ICON } from "./IconResolver";
import { TaskSwitchSchema } from "../../schemas/TaskSwitch";

export const TaskSwitchMeta = defineMeta(TaskSwitchSchema, {
    testSwitchNumber: {
    label: "Test Switch Number",
    icon: ICON.riskFlag,
    kind: "number",
    placeholder: "Turns it on/off",
    }
});
