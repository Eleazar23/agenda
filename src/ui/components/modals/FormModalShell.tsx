import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import type { Breakpoint } from "@mui/material/styles";

export interface FormModalShellProps {
  isOpen: boolean;
  onClose?: () => void;
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  maxWidth?: Breakpoint | false;
  fullWidth?: boolean;
  dividers?: boolean;
}

function FormModalShell({
  isOpen,
  onClose,
  title,
  onSubmit,
  children,
  submitLabel = "Guardar",
  cancelLabel = "Cancelar",
  maxWidth,
  fullWidth = false,
  dividers = true,
}: FormModalShellProps) {
  return (
    <Dialog onClose={onClose} open={isOpen} maxWidth={maxWidth} fullWidth={fullWidth}>
      <DialogTitle sx={{ m: 0, p: 2 }}>{title}</DialogTitle>
      <DialogContent dividers={dividers}>
        <Box
          component="form"
          onSubmit={onSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          {children}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Button type="button" onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button type="submit" variant="contained" onClick={onSubmit}>
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default FormModalShell;
