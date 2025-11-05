// src/components/molecules/TaskFields.tsx
import React from "react";
import { FaTasks, FaBullseye } from "react-icons/fa";
import { IoPricetag } from "react-icons/io5";
import { TbFlag3 } from "react-icons/tb";
import { AiOutlineUser } from "react-icons/ai";

import CollapsibleSection from "../atoms/CollapsibleSection";
import QuillField from "../atoms/QuillField";
import TaskField from "../atoms/TaskField";

import { AKTIVITETSSTATUS } from "../../schemas/TaskBase"; // icons/options only
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
    Number(get("sannolikhet") ?? 0) * Number(get("påverkan") ?? 0) || 0;

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
              label="Aktivitetsnamn"
              type="text"
              value={get("aktivitetsnamn")}
              onChange={(v) => set("aktivitetsnamn", v as string)}
              placeholder="Namn på aktiviteten"
              disabled={disabled}
              error={err("aktivitetsnamn")}
            />
            <TaskField
              label="Responsible"
              type="text"
              value={get("aktivitetsansvarig")}
              onChange={(v) => set("aktivitetsansvarig", v as string)}
              placeholder="Vem ansvarar?"
              disabled={disabled}
              error={err("aktivitetsansvarig")}
            />
          </div>

          <div className="tw:grid tw:grid-cols-[repeat(auto-fit,minmax(22rem,1fr))] tw:gap-0 [&:has(> *:nth-child(2))]:tw:gap-4">
            <TaskField
              label="Status"
              type="select"
              value={get("aktivitetsstatus") ?? AKTIVITETSSTATUS[0]}
              onChange={(v) =>
                set("aktivitetsstatus", v as AllInputs["aktivitetsstatus"])
              }
              disabled={disabled}
              options={AKTIVITETSSTATUS.map((s) => ({ value: s, label: s }))}
              error={err("aktivitetsstatus")}
            />
            <TaskField
              label="Priority"
              type="number"
              value={get("prioritet") as number | undefined}
              onChange={(v) =>
                set("prioritet", (v ?? undefined) as number | undefined)
              }
              step={1}
              disabled={disabled}
              error={err("prioritet")}
            />
          </div>

          <div className="tw:grid tw:grid-cols-[repeat(auto-fit,minmax(22rem,1fr))] tw:gap-0 [&:has(> *:nth-child(2))]:tw:gap-4">
            <TaskField
              label="Probability"
              type="number"
              value={get("sannolikhet") as number | undefined}
              onChange={(v) => set("sannolikhet", v as number)}
              min={1}
              max={10}
              step={1}
              disabled={disabled}
              error={err("sannolikhet")}
            />
            <TaskField
              label="Impact"
              type="number"
              value={get("påverkan") as number | undefined}
              onChange={(v) => set("påverkan", v as number)}
              min={1}
              max={10}
              step={1}
              disabled={disabled}
              error={err("påverkan")}
            />
          </div>
          <div className="py-2">
            <span className="tw:inline-flex tw:items-center tw:rounded-full tw:px-2.5 tw:py-1 tw:text-sm tw:bg-yellow-50 tw:text-yellow-900">
              Risk value: {riskValue}
            </span>
          </div>
        </CollapsibleSection>
      )}

      {showBase && (
        <>
          <CollapsibleSection title="Description" defaultOpen>
            <QuillField
              value={(get("beskrivning") as string | undefined) ?? ""}
              onChange={(html) => set("beskrivning", html)}
              placeholder="Write a description"
              readOnly={disabled}
            />
          </CollapsibleSection>

          <CollapsibleSection title="Konsekvens" defaultOpen>
            <QuillField
              value={(get("konsekvens") as string | undefined) ?? ""}
              onChange={(html) => set("konsekvens", html)}
              placeholder="Write a consequence…"
              readOnly={disabled}
            />
          </CollapsibleSection>

          <CollapsibleSection title="Grundorsak" defaultOpen>
            <QuillField
              value={(get("grundorsak") as string | undefined) ?? ""}
              onChange={(html) => set("grundorsak", html)}
              placeholder="Write a reason"
              readOnly={disabled}
            />
          </CollapsibleSection>
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
              label="Area"
              type="select"
              value={get("area") as string | undefined}
              onChange={(v) => set("area", v as AllInputs["area"])}
              options={AREA.map((s) => ({ value: s, label: s }))}
              disabled={disabled}
              error={err("area")}
            />
            <TaskField
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
