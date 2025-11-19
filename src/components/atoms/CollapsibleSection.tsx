import React from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

type Props = {
  title: string;
  defaultOpen?: boolean;
  collapsible?: boolean;
  children: React.ReactNode;
  className?: string;
  childrenClassName?: string;
};

export default function CollapsibleSection({
  title,
  defaultOpen = true,
  collapsible = true,
  children,
  className = "",
  childrenClassName = "",
}: Props) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <section>
      <div className={className}>
        {collapsible && (
          <button type="button" onClick={() => setOpen((s) => !s)} className="">
            <span className="tw:text-sm tw:font-semibold tw:text-gray-900">
              {title}
            </span>
            {open ? (
              <FaChevronDown className="tw:pl-2 tw:inline-block tw:align-middle tw:text-gray-900"></FaChevronDown>
            ) : (
              <FaChevronRight className="tw:pl-3 tw:inline-block tw:align-middle tw:text-gray-900"></FaChevronRight>
            )}
          </button>
        )}
      </div>
      {open && <div className={childrenClassName}>{children}</div>}
    </section>
  );
}
