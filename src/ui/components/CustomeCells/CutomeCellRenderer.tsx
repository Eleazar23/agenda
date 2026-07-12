import React from 'react'
import type { CustomCellRendererProps } from "ag-grid-react";
import EmptyCell from './EmptyCell';
import CitaCell from './CitaCell';

function CutomeCellRenderer(params:CustomCellRendererProps) {
  return (
    <>
    {params.value === "" ? <EmptyCell {...params} /> : <CitaCell {...params}/>}
    </>
  )
}

export default React.memo(
  CutomeCellRenderer,
  (prevProps, nextProps) => prevProps.value === nextProps.value,
)