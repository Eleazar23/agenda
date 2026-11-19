import { useState } from "react";
import { Button } from "@mui/material";
import ProductosTable from "../tables/ProductsTable";
import { ProductosCtxProvider } from "../../contexts/ProductosCtx";
import AddProductoModal from "../modals/productos/AddProductoModal";
import SearchInput from "../Inputs/SearchInput";
import CrudPageLayout from "./CrudPageLayout";
import PageActionBar from "./PageActionBar";

const Productos = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <ProductosCtxProvider>
      <CrudPageLayout
        actionBar={
          <PageActionBar
            center={
              <SearchInput
                placeholder="Buscar producto (Nombre | Marca)"
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
                Agregar Producto
              </Button>
            }
          />
        }
      >
        <ProductosTable searchTerm={searchTerm} />
      </CrudPageLayout>
      <AddProductoModal isOpen={isAdding} onClose={() => setIsAdding(false)} />
    </ProductosCtxProvider>
  );
};

export default Productos;
