import React, { useEffect, useState } from 'react'
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

export default CutomeCellRenderer