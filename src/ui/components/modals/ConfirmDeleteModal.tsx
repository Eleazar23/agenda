import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title: string;
  confirmQuestion?: string;
  itemSummary?: React.ReactNode;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  warningNote?: string;
}

function ConfirmDeleteModal({
  isOpen,
  onClose,
  title,
  confirmQuestion = "¿Estás seguro de que deseas eliminar este elemento?",
  itemSummary,
  onConfirm,
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  warningNote = "Esta acción no se puede deshacer.",
}: ConfirmDeleteModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>{title}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <Typography variant="body1" color="text.secondary">
            {confirmQuestion}
          </Typography>
          {itemSummary && (
            <Box
              sx={{
                p: 2,
                backgroundColor: "grey.100",
                borderRadius: 1,
              }}
            >
              {itemSummary}
            </Box>
          )}
          {warningNote && (
            <Typography variant="caption" color="text.secondary">
              {warningNote}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Button type="button" onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button variant="contained" color="error" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDeleteModal;
