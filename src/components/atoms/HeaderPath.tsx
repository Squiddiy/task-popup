import React from "react";
import * as FaIcons from "react-icons/fa6";
import * as MdIcons from "react-icons/md";
const ICONS: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = { ...FaIcons, ...MdIcons };

export type PathItem = {
    name: string;
    Icon?: string;
    colorClass?: string;
    onClick?: () => void;
};

export function BreadcrumbPath({ items }: { items: PathItem[] }) {
    return (
        <div className="flex items-center gap-1 text-sm whitespace-nowrap">
            {items.map((item, i) => {
                const isLast = i === items.length - 1;
                const IconComponent = item.Icon ? ICONS[item.Icon] : undefined;

                return (
                    <React.Fragment key={i}>
                        <span
                            className={[
                                // apply to the child svg: inline-block + align-middle
                                "inline-flex items-center gap-1 whitespace-nowrap [&>svg]:inline-block [&>svg]:align-middle",
                                isLast ? "font-semibold text-gray-900" : "text-gray-700",
                                item.colorClass ?? "",
                                item.onClick && !isLast ? "cursor-pointer hover:underline" : "",
                            ].join(" ")}
                            onClick={item.onClick}
                        >
                            {IconComponent && <IconComponent size={14} style={{ display: "inline-block", verticalAlign: "inherit" }} />}
                            <span className="inline-block align-middle">{item.name}</span>
                        </span>
                        {!isLast && <span className="text-gray-400">/</span>}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
