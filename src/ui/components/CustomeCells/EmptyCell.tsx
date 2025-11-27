import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useAgendaContext } from "../../contexts/AgendaContext";
import type { CustomCellRendererProps } from "ag-grid-react";

// type Params = {
//   rowIndex: number;
//   estilista: string;
//   hr: string;
//   column: object<T>
// };

// type Service = {
//   rowIndex: number, estilista:string, hora: string 
// }

const EmptyCell = ({params}: any) => {
  const estilista = params.column.colId;
  const hr = params.data.hour;
  const rowIndex = params.node.rowIndex;
  const [isSelected, setIsSelected] = useState(false);
  const cellID = `${rowIndex}-${estilista}`
  const [cellData, setCellData] = useState({cellID, rowIndex, estilista, hora: hr.label24});
  const { agendaData, addService, removeService } = useAgendaContext();
  // console.log('Empty Cell Params:', params)

  const handleClick = async () => {
    if (!isSelected) {
      addService(cellData);
      setIsSelected(true);
      return
    }
    removeService(cellData);
    setIsSelected(false);
  };

  return (
    <>
      <Button
      color="secondary"
        sx={{ width: "100%" }}
        variant={isSelected ? "contained" : "text"}
        onClick={handleClick}
      >
        {" "}
        {params.value === "" ? "-" : params.value}{" "}
      </Button>
    </>
  );
};

export default EmptyCell;
