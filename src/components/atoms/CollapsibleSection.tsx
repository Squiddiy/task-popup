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
            ? <FaChevronDown className="tw:pl-2 tw:inline-block tw:align-middle tw:text-gray-900"></FaChevronDown> 
            : <FaChevronRight className="tw:pl-3 tw:inline-block tw:align-middle tw:text-gray-900"></FaChevronRight> }
        </button>
      </div>
      {open && <div className="px-4 pb-3">{children}</div>}
    </section>
  );
}
