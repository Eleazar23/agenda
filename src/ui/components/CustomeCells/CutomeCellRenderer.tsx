import React from 'react'
import type { CustomCellRendererProps } from "ag-grid-react";
import EmptyCell from './EmptyCell';
import CitaCell from './CitaCell';
import BlockedCell from './BlockedCell';

function CutomeCellRenderer(params:CustomCellRendererProps) {
  return (
    <>
    {params.value?.blocked ? (
      <BlockedCell {...params} />
    ) : params.value === "" ? (
      <EmptyCell {...params} />
    ) : (
      <CitaCell {...params} />
    )}
    </>
  )
}

export default React.memo(
  CutomeCellRenderer,
  (prevProps, nextProps) => prevProps.value === nextProps.value,
)