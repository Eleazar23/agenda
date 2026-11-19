import React, { useState } from "react";
import { Box } from "@mui/material";
import EditBtn from "../buttons/EditBtn";
import DeleteBtn from "../buttons/DeleteBtn";

export interface EntityActionsCellProps {
  /** Controlled mode: parent owns the edit flow (e.g. opens its own modal). */
  onEdit?: () => void;
  /** Self-contained mode: cell owns the open/close state and renders the modal itself. */
  renderEditModal?: (isOpen: boolean, onClose: () => void) => React.ReactNode;
  /** Controlled mode: parent owns the delete flow. */
  onDelete?: () => void;
  /** Self-contained mode: cell owns the open/close state and renders the modal itself. */
  renderDeleteModal?: (isOpen: boolean, onClose: () => void) => React.ReactNode;
  /** Extra per-entity buttons (and their own modals), e.g. Bitácora, Vacaciones. */
  extra?: React.ReactNode;
}

function EntityActionsCell({
  onEdit,
  renderEditModal,
  onDelete,
  renderDeleteModal,
  extra,
}: EntityActionsCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditClick = () => {
    if (onEdit) {
      onEdit();
    } else {
      setIsEditing(true);
    }
  };

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete();
    } else {
      setIsDeleting(true);
    }
  };

  return (
    <>
      <Box display="flex" sx={{ width: "100%", height: "100%" }} gap={2}>
        <EditBtn onClick={handleEditClick} />
        <DeleteBtn onClick={handleDeleteClick} />
        {extra}
      </Box>
      {renderEditModal?.(isEditing, () => setIsEditing(false))}
      {renderDeleteModal?.(isDeleting, () => setIsDeleting(false))}
    </>
  );
}

export default EntityActionsCell;
