import { useCallback, useState } from "react";
import { Button } from "@mui/material";
import ClientsTables from "../tables/ClientsTable";
import { ClientesCtxProvider } from "../../contexts/ClientesCtx";
import { ClientesModal } from "../modals/clientes/ClientesModal";
import SearchInput from "../Inputs/SearchInput";
import CrudPageLayout from "./CrudPageLayout";
import PageActionBar from "./PageActionBar";

type Cliente = {
  nombre: string;
  telefono: string;
  correo: string;
  lastVisit: string;
};

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

  const handleSaveClient = useCallback(
    (client: { nombre: string; telefono: string; correo?: string }) => {
      const today = new Date();
      const lastVisit = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;

      const newClient: Cliente = {
        nombre: client.nombre,
        telefono: client.telefono,
        correo: client.correo || "",
        lastVisit,
      };
      console.log("Cliente guardado:", newClient);
      setIsOpenModal(false);
    },
    [],
  );

  // useEffect(() => {
  //   setClientesData(globalData.clientes);
  // }, []);

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
      <ClientesModal
        isOpen={isOpenModal}
        onClose={handleCloseModal}
        onSave={handleSaveClient}
      />
    </ClientesCtxProvider>
  );
};

export default Clientes;
