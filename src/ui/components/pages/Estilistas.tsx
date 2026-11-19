import { useState } from "react";
import { Button } from "@mui/material";
import EstilistasTable from "../tables/EstilistasTable";
import EstilistaModal from "../modals/EstilistaModal";
import { useSnackbar } from "notistack";
import { EstilistasCtxProvider } from "../../contexts/EstilistaContext";
import SearchInput from "../Inputs/SearchInput";
import CrudPageLayout from "./CrudPageLayout";
import PageActionBar from "./PageActionBar";

type Alert = "success" | "error" | "info" | "warning";

const Estilistas = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [searchTerm, setSearchTerm] = useState("");

  const handleAlert = (message: string, alertType: Alert) => {
    enqueueSnackbar(message, {
      variant: alertType,
      anchorOrigin: { vertical: "bottom", horizontal: "center" },
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  return (
    // Data Grid will fill the size of the parent container
    <EstilistasCtxProvider>
      <CrudPageLayout
        actionBar={
          <PageActionBar
            center={
              <SearchInput
                placeholder="Buscar estilista ( Nombre | Telefono)"
                value={searchTerm}
                onChange={handleSearchChange}
                onClear={() => setSearchTerm("")}
              />
            }
            right={
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenModal}
              >
                Agregar Estilista
              </Button>
            }
          />
        }
      >
        <EstilistasTable searchTerm={searchTerm} />
      </CrudPageLayout>
      <EstilistaModal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        handleAlert={handleAlert}
        setIsOpenModal={setIsOpenModal}
      />
    </EstilistasCtxProvider>
  );
};

export default Estilistas;
