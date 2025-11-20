// useOpenRiskTask.ts
import { useQueryClient } from "@tanstack/react-query";
import { multiColumnLayout } from "./builder/layouts/multiColumnLayout";
import React from "react";
import { TASKSTATUS, type TaskStatus } from "./schemas/TaskBase";
import { getRiskById, getUserNames, saveRisk, type RiskObj, type ValueTextObj } from "./services/api/apiService";
import { openTask } from "./openTask";

type TaskFormResult = {
  taskName: string;
  rootCause: string;
  taskManager: string;
  taskStatus: TaskStatus;
  description?: string;
  impact: number;
  probability: number;
  priority?: number;
  testSwitchNumber?: boolean;
};

function mapFormToRisk(
  old: RiskObj,
  form: TaskFormResult,
  names: ValueTextObj[]
): RiskObj {
  const taskManagerId =
    names.find((n) => n.Text === form.taskManager)?.Value ?? old.TaskManager;

  const statusIndex = TASKSTATUS.indexOf(form.taskStatus);
  const status = statusIndex >= 0 ? statusIndex + 1 : old.Status;

  return {
    ...old,
    Name: form.taskName ?? old.Name,
    Action: form.rootCause ?? old.Action,
    DescriptionFormat: form.description ?? old.DescriptionFormat,
    Impact: form.impact ?? old.Impact,
    Probability: form.probability ?? old.Probability,
    Priority: form.priority ?? old.Priority,
    TaskManager: taskManagerId,
    Status: status,
  };
}

export function useOpenRiskTask(riskId: number) {
  const queryClient = useQueryClient();

  const handleOpen = React.useCallback(async () => {
    const risk = await queryClient.ensureQueryData<RiskObj>({
      queryKey: ["riskById", riskId],
      queryFn: () => getRiskById(riskId),
    });

    const names = await queryClient.ensureQueryData<ValueTextObj[]>({
      queryKey: ["getNames"],
      queryFn: () => getUserNames(),
    });

    const result = await openTask({
      title: risk.Name,
      taskType: "Task",
      enabled: ["base", "risk", "switch"],
      layout: multiColumnLayout,
      initialData: {
        taskName: risk.Name,
        rootCause: risk.Action,
        taskManager:
          names.find((x) => x.Value === risk.TaskManager)?.Text ?? "",
        taskStatus: TASKSTATUS[risk.Status - 1],
        description: risk.DescriptionFormat,
        impact: risk.Impact,      
        priority: risk.Priority,
        probability: risk.Probability,
        testSwitchNumber: true,
      },
      titlePath: [
        { name: "Projekt X", onClick: () => console.log("Clicked Projekt X") },
        {
          name: "Riskhantering",
          onClick: () => console.log("Clicked Riskhantering"),
        },
      ],
    });

    if (!result) {
      console.log("❌ Task cancelled");
      return null;
    }

    console.log("✅ Task saved (form):", result);

    const form = result as TaskFormResult;

    const payload = mapFormToRisk(risk, form, names);
    const saved = await saveRisk(payload);
    queryClient.setQueryData<RiskObj>(["riskById", saved.ID], saved);

    return saved;
  }, [queryClient, riskId]);

  return handleOpen;
}

