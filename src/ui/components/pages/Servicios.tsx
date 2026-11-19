import { useState } from "react";
import { Button } from "@mui/material";
import ServiciosTable from "../tables/ServiciosTable";
import { ServiciosCtxProvider } from "../../contexts/ServiciosContext";
import AddServicioModal from "../modals/servicios/AddServicioModal";
import SearchInput from "../Inputs/SearchInput";
import CrudPageLayout from "./CrudPageLayout";
import PageActionBar from "./PageActionBar";

export default function Servicios() {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <ServiciosCtxProvider>
      <CrudPageLayout
        actionBar={
          <PageActionBar
            center={
              <SearchInput
                placeholder="Buscar servicio (Nombre)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClear={() => setSearchTerm("")}
              />
            }
            right={
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsAdding(true)}
              >
                Agregar Servicio
              </Button>
            }
          />
        }
      >
        <ServiciosTable searchTerm={searchTerm} />
      </CrudPageLayout>
      <AddServicioModal isOpen={isAdding} onClose={() => setIsAdding(false)} />
    </ServiciosCtxProvider>
  );
}
