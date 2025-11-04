import React from "react";
import Button from "../atoms/Button";
import clsx from "clsx";

interface Props {
  onOk: () => void;
  onCancel: () => void;
}

const ConfirmButtonSet = ({ onOk, onCancel }: Props) => {
  return (
    <div className={clsx("tw:flex tw:justify-end tw:gap-2 tw:cursor-pointer")}>
      <Button onClick={onOk} color="lime" dataTestId="prompt-ok-button">
        OK
      </Button>
      <Button onClick={onCancel} color="blue" dataTestId="prompt-cancel-button">
        Avbryt
      </Button>
    </div>
  );
};

export default ConfirmButtonSet;
