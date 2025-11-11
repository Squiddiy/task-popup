// Popup.tsx
import { clsx } from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { MdDriveFileMoveOutline } from "react-icons/md";
import ReactDOM from "react-dom";
import Draggable from "react-draggable";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  /** Use document.body by default. Note: true modal requires being in the document tree. */
  container?: HTMLElement | ShadowRoot;
  headerColor?: boolean;
}

const Popup = ({
  isOpen,
  onClose,
  title,
  children,
  container = document.body,
  headerColor = false,
}: Props) => {
  const childArray = React.Children.toArray(children);
  const body = childArray.find(
    (child) => React.isValidElement(child) && child.type === Popup.Body
  );
  const footer = childArray.find(
    (child) => React.isValidElement(child) && child.type === Popup.Footer
  );

  const [isBodyOverflowing, setIsBodyOverflowing] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useRef(`popup-title-${Math.random().toString(36).slice(2)}`);

  // Open/close the native dialog in sync with React state
  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;

    const handleCancel = (e: Event) => {
      // ESC closes
      e.preventDefault();
      onClose();
    };

    dlg.addEventListener("cancel", handleCancel);

    // If the dialog is in a ShadowRoot, showModal() is not allowed.
    // Fallback to non-modal .show() in that case.
    const isInShadowRoot = container instanceof ShadowRoot;

    if (isOpen) {
      if (!dlg.open) {
        try {
          isInShadowRoot ? dlg.show() : dlg.showModal();
        } catch {
          // If showModal throws (e.g., not in document), fall back
          dlg.show();
        }
      }
      // Optional: prevent background scroll for non-modal .show()
      document.documentElement.style.overflow = "hidden";
      if (bodyRef.current) {
        setIsBodyOverflowing(
          bodyRef.current.scrollHeight > bodyRef.current.clientHeight
        );
      }
    } else {
      if (dlg.open) dlg.close();
      document.documentElement.style.overflow = "";
    }

    return () => {
      dlg.removeEventListener("cancel", handleCancel);
      document.documentElement.style.overflow = "";
    };
  }, [isOpen, onClose, container]);

  if (!isOpen) return null;

  const node = (
    <Draggable
      handle="#prompt-header"
      //bounds={{ left: 0, top: 0, right: 0, bottom: 0 }}
      nodeRef={dialogRef}
    >
      <dialog
        ref={dialogRef}
        aria-labelledby={title ? titleId.current : undefined}
        className={clsx(
          "tw-popup tw:w-fit tw:p-0 tw:w-[min(900px,95vw)] tw:max-h-[90vh] tw:rounded-xl tw:overflow-hidden",
          "tw:bg-white tw:shadow-2xl",
          // 👇 New positioning rules
          "tw:left-1/3 tw:top-[5%] -tw:translate-x-1/2 tw:m-0",
          "tw:flex tw:flex-col" // ✅ vertical layout
        )}
        style={{ transformOrigin: "top center" }}
      >
        {/* Header */}
        <div
          className={clsx(
            "tw:flex tw:justify-between tw:items-center tw:px-4 tw:py-2",
            headerColor
              ? "tw:bg-toj-blue tw:text-white"
              : "tw:border-b tw:border-gray-200"
          )}
          id="prompt-header"
          data-testid="prompt-header"
        >
          <div className="tw:flex tw:items-center tw:gap-4">
            <h2
              id={titleId.current}
              className="tw:font-medium tw:text-2xl tw:select-none"
            >
              {title}
            </h2>

            <div className="tw:flex tw:items-center tw:text-gray-500 tw:gap-1">
              <MdDriveFileMoveOutline className="tw:align-middle" />
              <span>Flytta Risk</span>
            </div>
          </div>

          <button
            className={clsx(
              "tw:cursor-pointer tw:text-3xl tw:leading-none",
              headerColor
                ? "tw:text-white tw:hover:text-gray-300"
                : "tw:hover:text-gray-500"
            )}
            onClick={onClose}
            aria-label="Close dialog"
          >
            &times;
          </button>
        </div>

        {/* Scrollable Body */}
        <div
          ref={bodyRef}
          className="tw:flex-1 tw:overflow-auto tw:px-8 tw:py-6"
          // onScroll={() =>
          //     setIsBodyOverflowing(
          //         bodyRef.current!.scrollHeight > bodyRef.current!.clientHeight
          //     )
          //}
          data-testid="prompt-body"
        >
          {body}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className={clsx(
              "tw:flex tw:justify-end tw:items-center tw:p-4",
              isBodyOverflowing && "tw:border-t tw:border-gray-200"
            )}
            data-testid="prompt-footer"
          >
            {footer}
          </div>
        )}
      </dialog>
    </Draggable>
  );

  return ReactDOM.createPortal(node, container);
};

// Composable parts
Popup.Body = ({ children }: { children: React.ReactNode }) => <>{children}</>;
Popup.Footer = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export default Popup;
