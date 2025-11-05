// src/components/molecules/TaskFields.tsx
import React from "react";
import { FaTasks, FaBullseye } from "react-icons/fa";
import { IoPricetag } from "react-icons/io5";
import { TbFlag3 } from "react-icons/tb";
import { AiOutlineUser } from "react-icons/ai";

import CollapsibleSection from "../atoms/CollapsibleSection";
import QuillField from "../atoms/QuillField";
import TaskField from "../atoms/TaskField";

import { TASKSTATUS } from "../../schemas/TaskBase"; // icons/options only
import { AREA, SECLEVEL } from "../../schemas/TaskCategories"; // icons/options only

import {
  type EnabledModule,
  type AllInputs,
  type InputsFromEnabled,
} from "../../schemas/compose/TaskCompose";

type Props = {
  enabled: readonly EnabledModule[];
  value: Partial<AllInputs>; // 👈 global shape
  onChange: (patch: Partial<AllInputs>) => void; // 👈 global shape
  errors?: Partial<Record<keyof AllInputs, string>>;
  disabled?: boolean;
};

export default function TaskFields({
  enabled,
  value,
  onChange,
  errors,
  disabled,
}: Props) {
  const showBase = enabled.includes("base");
  const showCategories = enabled.includes("categories");
  const showRisk = enabled.includes("risk");

  // --- helpers that give AUTOCOMPLETE for string keys ---
  type KAll = keyof AllInputs;

  type PatchOf<K extends KAll> = Partial<AllInputs> & {
    [P in K]: AllInputs[P];
  };
  const set = <K extends KAll>(key: K, val: AllInputs[K]) => {
    const patch = { [key]: val } as PatchOf<K>;
    onChange(patch);
  };
  const get = <K extends KAll>(key: K) =>
    value[key] as AllInputs[K] | undefined;
  const err = <K extends KAll>(key: K) =>
    (errors?.[key] as string | undefined) ?? undefined;

  // Example computed (keys may be absent at runtime if module disabled)
  const riskValue =
    Number(get("probability") ?? 0) * Number(get("impact") ?? 0) || 0;

  return (
    <div className="space-y-4">
      {showBase && (
        <CollapsibleSection
          title="Main"
          defaultOpen
          className="tw:border-b-gray-200 tw:border-b-2"
        >
          <div className="tw:grid tw:grid-cols-[repeat(auto-fit,minmax(22rem,1fr))] tw:gap-0 [&:has(> *:nth-child(2))]:tw:gap-4">
            <TaskField
              icon={TbFlag3}
              label="Aktivitetsnamn"
              type="text"
              value={get("taskName")}
              onChange={(v) => set("taskName", v as string)}
              placeholder="Namn på aktiviteten"
              disabled={disabled}
              error={err("taskName")}
            />
            <TaskField
              icon={AiOutlineUser}
              label="Responsible"
              type="text"
              value={get("taskManager")}
              onChange={(v) => set("taskManager", v as string)}
              placeholder="Vem ansvarar?"
              disabled={disabled}
              error={err("taskManager")}
            />
          </div>

          <div className="tw:grid tw:grid-cols-[repeat(auto-fit,minmax(22rem,1fr))] tw:gap-0 [&:has(> *:nth-child(2))]:tw:gap-4">
            <TaskField
              icon={FaBullseye}
              label="Status"
              type="select"
              value={get("taskStatus") ?? TASKSTATUS[0]}
              onChange={(v) => set("taskStatus", v as AllInputs["taskStatus"])}
              disabled={disabled}
              options={TASKSTATUS.map((s) => ({ value: s, label: s }))}
              error={err("taskStatus")}
            />
            <TaskField
              icon={TbFlag3}
              label="Priority"
              type="number"
              value={get("priority") as number | undefined}
              onChange={(v) =>
                set("priority", (v ?? undefined) as number | undefined)
              }
              step={1}
              disabled={disabled}
              error={err("priority")}
            />
          </div>

          {showRisk && (
            <>
              <div className="tw:grid tw:grid-cols-[repeat(auto-fit,minmax(22rem,1fr))] tw:gap-0 [&:has(> *:nth-child(2))]:tw:gap-4">
                <TaskField
                  icon={TbFlag3}
                  label="Probability"
                  type="number"
                  value={get("probability") as number | undefined}
                  onChange={(v) => set("probability", v as number)}
                  min={1}
                  max={10}
                  step={1}
                  disabled={disabled}
                  error={err("probability")}
                />
                <TaskField
                  icon={TbFlag3}
                  label="Impact"
                  type="number"
                  value={get("impact") as number | undefined}
                  onChange={(v) => set("impact", v as number)}
                  min={1}
                  max={10}
                  step={1}
                  disabled={disabled}
                  error={err("impact")}
                />
              </div>
              {/* <div className="py-2">
                <span className="tw:inline-flex tw:items-center tw:rounded-full tw:px-2.5 tw:py-1 tw:text-sm tw:bg-yellow-50 tw:text-yellow-900">
                  Risk value: {riskValue}
                </span>
              </div> */}
            </>
          )}
        </CollapsibleSection>
      )}

      {showBase && (
        <>
          <CollapsibleSection title="Description" defaultOpen>
            <QuillField
              value={(get("description") as string | undefined) ?? ""}
              onChange={(html) => set("description", html)}
              placeholder="Write a description"
              readOnly={disabled}
            />
          </CollapsibleSection>

          {showRisk && (
            <>
              <CollapsibleSection title="Konsekvens" defaultOpen>
                <QuillField
                  value={(get("consequence") as string | undefined) ?? ""}
                  onChange={(html) => set("consequence", html)}
                  placeholder="Write a consequence…"
                  readOnly={disabled}
                />
              </CollapsibleSection>
              <CollapsibleSection title="Grundorsak" defaultOpen>
                <QuillField
                  value={(get("rootCause") as string | undefined) ?? ""}
                  onChange={(html) => set("rootCause", html)}
                  placeholder="Write a reason"
                  readOnly={disabled}
                />
              </CollapsibleSection>
            </>
          )}
        </>
      )}

      {showCategories && (
        <CollapsibleSection
          title="Categories"
          defaultOpen
          className="tw:border-b-gray-200 tw:border-b-2"
        >
          <div className="tw:grid tw:grid-cols-[repeat(auto-fit,minmax(22rem,1fr))] tw:gap-0 [&:has(> *:nth-child(2))]:tw:gap-4">
            <TaskField
              icon={IoPricetag}
              label="Area"
              type="select"
              value={get("area") as string | undefined}
              onChange={(v) => set("area", v as AllInputs["area"])}
              options={AREA.map((s) => ({ value: s, label: s }))}
              disabled={disabled}
              error={err("area")}
            />
            <TaskField
              icon={IoPricetag}
              label="Sec Level"
              type="select"
              value={get("seclevel") as string | undefined}
              onChange={(v) => set("seclevel", v as AllInputs["seclevel"])}
              options={SECLEVEL.map((s) => ({ value: s, label: s }))}
              disabled={disabled}
              error={err("seclevel")}
            />
          </div>
        </CollapsibleSection>
      )}
    </div>
  );
}
