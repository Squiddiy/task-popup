// ui/icons.tokens.ts
import type { IconType } from "react-icons";
import * as Fa from "react-icons/fa6";
import * as Md from "react-icons/md";
import * as Tb from "react-icons/tb";
import * as Io from "react-icons/io5";

/** Direct access to every icon */
export const ICON_PACK = { ...Fa, ...Md, ...Tb, ...Io } as Record<
  string,
  IconType
>;

/** Tokens now hold the REAL ICON COMPONENTS – not strings */
export const ICON = {
  riskFlag: Tb.TbFlag3,
  status: Fa.FaBullseye,
  priority: Tb.TbFlag3,
  title: Md.MdTitle,
  owner: Fa.FaUser,
  description: Md.MdDescription,
  tags: Io.IoPricetag,
} as const satisfies Record<string, IconType>;

export type IconToken = keyof typeof ICON;

/** Resolve IconToken | IconType to IconType */
export function resolveIcon(icon?: IconToken | IconType): IconType | undefined {
  if (!icon) return undefined;
  return typeof icon === "string" ? ICON[icon] : icon;
}
