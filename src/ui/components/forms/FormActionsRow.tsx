import { Button } from "@mui/material";
import type { ReactNode } from "react";
import type { ButtonProps } from "@mui/material/Button";

export interface FormActionsRowProps {
  onCancel?: () => void;
  cancelLabel?: ReactNode;
  cancelVariant?: ButtonProps["variant"];
  cancelColor?: ButtonProps["color"];
  onConfirm?: () => void;
  confirmLabel: ReactNode;
  confirmType?: "button" | "submit";
  confirmVariant?: ButtonProps["variant"];
  confirmColor?: ButtonProps["color"];
  confirmDisabled?: boolean;
  autoFocusConfirm?: boolean;
}

function FormActionsRow({
  onCancel,
  cancelLabel = "Cancelar",
  cancelVariant = "text",
  cancelColor,
  onConfirm,
  confirmLabel,
  confirmType = "button",
  confirmVariant = "contained",
  confirmColor = "primary",
  confirmDisabled = false,
  autoFocusConfirm = false,
}: FormActionsRowProps) {
  return (
    <>
      <Button
        type="button"
        variant={cancelVariant}
        color={cancelColor}
        onClick={onCancel}
      >
        {cancelLabel}
      </Button>
      <Button
        type={confirmType}
        variant={confirmVariant}
        color={confirmColor}
        onClick={onConfirm}
        disabled={confirmDisabled}
        autoFocus={autoFocusConfirm}
      >
        {confirmLabel}
      </Button>
    </>
  );
}

export default FormActionsRow;
