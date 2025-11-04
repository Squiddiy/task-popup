import React from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

type Props = {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
};

export default function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
  className = "",
}: Props) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <section>
      <div className={className}>
        <button
          type="button"
          onClick={() => setOpen((s) => !s)}
          className="w-full flex items-center gap-2 px-4 py-2 text-left"
        >
          <span className="tw:text-sm tw:font-semibold tw:text-gray-900">
            {title}
          </span>
          {open
            ? React.createElement(FaChevronDown as React.ComponentType<any>, {
                size: 8,
                style: {
                  paddingLeft: "2px",
                  display: "inline-block",
                  verticalAlign: "middle",
                  color: "#6B7280",
                },
              })
            : React.createElement(FaChevronRight as React.ComponentType<any>, {
                size: 6,
                style: {
                  paddingLeft: "2px",
                  display: "inline-block",
                  verticalAlign: "middle",
                  color: "#6B7280",
                },
              })}
        </button>
      </div>
      {open && <div className="px-4 pb-3">{children}</div>}
    </section>
  );
}
