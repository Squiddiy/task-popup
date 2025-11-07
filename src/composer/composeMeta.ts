import type { FieldMeta } from "../schemas/schemaMetas/meta";
import {
  MODULES,
  type EnabledModule,
  ALL_MODULES,
} from "./TaskCompose";

type MetaMap = Partial<Record<string, FieldMeta>>;

/** Compose meta for provided modules (or all). If a module has no meta, it’s skipped. */
export function composeMeta(enabled?: readonly EnabledModule[]): MetaMap {
  const out: MetaMap = {};
  const list = enabled ?? ALL_MODULES;
  for (const m of list) {
    const modMeta = MODULES[m].meta as Record<string, FieldMeta> | undefined;
    if (modMeta) Object.assign(out, modMeta);
  }
  return out;
}

/** (Dev-only) Warn when a schema has no meta file */
export function warnMissingMeta(enabled?: readonly EnabledModule[]) {
  const list = enabled ?? ALL_MODULES;
  for (const m of list) {
    if (!MODULES[m].meta) {
      // eslint-disable-next-line no-console
      console.warn(`[composeMeta] No meta registered for module "${m}".`);
    }
  }
}
