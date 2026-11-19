import { useCallback, useState } from "react";
import { Button } from "@mui/material";
import ClientsTables from "../tables/ClientsTable";
import { ClientesCtxProvider } from "../../contexts/ClientesCtx";
import { ClientesModal } from "../modals/clientes/ClientesModal";
import SearchInput from "../Inputs/SearchInput";
import CrudPageLayout from "./CrudPageLayout";
import PageActionBar from "./PageActionBar";

const Clientes = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenModal = useCallback(() => {
    setIsOpenModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsOpenModal(false);
  }, []);

  return (
    <ClientesCtxProvider>
      <CrudPageLayout
        actionBar={
          <PageActionBar
            center={
              <SearchInput
                placeholder="Buscar cliente (nombre, teléfono, correo)"
                onChange={handleSearchChange}
                value={searchTerm}
                onClear={() => setSearchTerm("")}
              />
            }
            right={
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenModal}
              >
                Agregar Cliente
              </Button>
            }
          />
        }
      >
        <ClientsTables searchTerm={searchTerm} />
      </CrudPageLayout>
      <ClientesModal isOpen={isOpenModal} onClose={handleCloseModal} />
    </ClientesCtxProvider>
  );
};

export default Clientes;
