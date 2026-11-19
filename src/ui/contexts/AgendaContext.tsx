import React, { useState, createContext, useContext, useEffect, useRef } from "react";
import {
  getCurrentDate,
  getCurrentTime,
  getTargetDate,
  getOccupiedRows,
  seSobreponeConOtroServicio,
  citaTieneServiciosSobrepuestos,
  celdaEstaBloqueada,
} from "../utils/utils";
import { Cita } from "../types/Cita";
import { Servicio } from "../types/Servicio";
import { useSnackbar } from "notistack";
import { Cliente } from "../types/Cliente";
import { ServicioAgendado } from "../types/ServicioAgendado";
import { ProductoInCita } from "../types/Producto";
import { Estilista } from "../types/Estilista";
import { Bloqueo } from "../types/Bloqueo";
import { useFeriadosCtx } from "./FeriadosCtx";

type Props = {
  children: React.ReactNode;
};

type Alert = "success" | "error" | "info" | "warning";

type AgendaContex = {
  fecha: string;
  setFecha: React.Dispatch<React.SetStateAction<string>>;
  minDuration: number;
  setMinDuration: React.Dispatch<React.SetStateAction<number>>;
  isCitaOpen: boolean;
  setIsCitaOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isBooking: boolean;
  setIsBooking: React.Dispatch<React.SetStateAction<boolean>>;
  citas: [] | Array<Cita>;
  setCitas: React.Dispatch<React.SetStateAction<[] | Array<Cita>>>;
  currentPage: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  cita: Cita;
  setCita: React.Dispatch<React.SetStateAction<Cita>>;
  handleEditCita: (idCita: string, newCitaData: Cita) => Promise<boolean>;
  guardarProductosCita: (
    idCita: string,
    productos: ProductoInCita[],
  ) => Promise<ProductoInCita[] | null>;
  addServiceToCita: (servicio: ServicioAgendado) => void;
  removeServiceFromCita: (servicio: ServicioAgendado) => void;
  updateDuracion: (
    cellID: string,
    horaFin: string,
    newDuracion: number,
  ) => boolean;
  handleCancelarCita: () => void;
  updateService: (cellID: string, updatedService: Servicio) => void;
  guardarCita: () => Promise<void>;
  handleAlert: (message: string, alertType: Alert) => void;
  searchClienteByNombre: (nombre: string) => Promise<Cliente | null>;
  searchClientesByNombre: (nombre: string) => Promise<Cliente[] | null>;
  searchClienteByPhone: (telefono: string) => Promise<Cliente | null>;
  addCliente: (cliente: Cliente) => Promise<Cliente | null>;
  estilistas: Estilista[];
  refetchEstilistas: () => Promise<void>;
  bloqueos: Bloqueo[];
  addBloqueo: (
    estilista: string,
    horaInicio: string,
    horaFin: string,
    motivo: string,
  ) => Promise<void>;
  removeBloqueo: (id: number) => Promise<void>;
};

export const AgendaContext = createContext<AgendaContex | null>(null);

const initialDate = getCurrentDate().formattedDate;

const initialContextData = {
  fecha: initialDate,
  minDuration: 30,
  isCitaOpen: false,
  isBooking: false,
  citas: [],
  cita: {
    id: "",
    clienteId: 0,
    fecha: initialDate,
    nombreCliente: "",
    telefonoCliente: "",
    servicios: [],
    productos: [],
    estado: "sin confirmar",
    metodoDePago: "efectivo",
    notas: "",
  },
  currentPage: "agenda",
};

export const AgendaContextProvider = ({ children }: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [fecha, setFecha] = useState(initialContextData.fecha);
  const [minDuration, setMinDuration] = useState(
    initialContextData.minDuration,
  );
  const [isCitaOpen, setIsCitaOpen] = useState(initialContextData.isCitaOpen);
  const [isBooking, setIsBooking] = useState(initialContextData.isBooking);
  const [citas, setCitas] = useState<Array<Cita>>(initialContextData.citas);
  const [cita, setCita] = useState<Cita>(initialContextData.cita);
  const [currentPage, setCurrentPage] = useState(
    initialContextData.currentPage,
  );
  const [estilistas, setEstilistas] = useState<Estilista[]>([]);
  const [bloqueos, setBloqueos] = useState<Bloqueo[]>([]);
  const { feriados, fetchFeriadosByAnio } = useFeriadosCtx();
  const isGuardandoCitaRef = useRef(false);
  const isEditandoCitaRef = useRef(false);

  const handleAlert = (message: string, alertType: Alert) => {
    enqueueSnackbar(message, {
      variant: alertType,
      anchorOrigin: { vertical: "bottom", horizontal: "center" },
    });
  };

  const getCitasFromDB = async (fecha: string) => {
    try {
      const citasFromDB = await window.api.getCitasByFecha(fecha);
      setCitas(citasFromDB);
    } catch (error) {
      console.error("Error loading citas:", error);
      handleAlert("Error al cargar las citas", "error");
    }
  };

  const getBloqueosFromDB = async (fecha: string) => {
    try {
      const bloqueosFromDB = await window.api.getBloqueosByFecha(fecha);
      setBloqueos(bloqueosFromDB);
    } catch (error) {
      console.error("Error loading bloqueos:", error);
      handleAlert("Error al cargar los descansos", "error");
    }
  };

  const getEstilistasFromDB = async () => {
    try {
      const estilistasFromDB = await window.api.getEstilistas();
      setEstilistas(estilistasFromDB);
    } catch (error) {
      console.error("Error loading estilistas:", error);
    }
  };

  const addBloqueo = async (
    estilista: string,
    horaInicio: string,
    horaFin: string,
    motivo: string,
  ) => {
    try {
      const newBloqueo = await window.api.addBloqueo({
        estilista,
        fecha,
        horaInicio,
        horaFin,
        motivo: motivo || "Comida",
      });
      setBloqueos((prev) => [...prev, newBloqueo]);
      handleAlert("Descanso agregado a la agenda", "success");
    } catch (error) {
      console.error("Error adding bloqueo:", error);
      const message = error instanceof Error && error.message.includes("INVALID_RANGE")
        ? "La hora de fin debe ser posterior a la hora de inicio"
        : error instanceof Error && error.message.includes("OVERLAP")
        ? "Ya existe un descanso para ese estilista que se traslapa con ese horario"
        : "Error al agregar el descanso";
      handleAlert(message, "error");
    }
  };

  const removeBloqueo = async (id: number) => {
    try {
      await window.api.deleteBloqueo(id);
      setBloqueos((prev) => prev.filter((b) => b.id !== id));
      handleAlert("Descanso eliminado", "success");
    } catch (error) {
      console.error("Error deleting bloqueo:", error);
      handleAlert("Error al eliminar el descanso", "error");
    }
  };

  // Ajusta el stock según la diferencia entre los productos que la cita
  // tenía guardados y los que tendrá ahora: lo agregado se descuenta y lo
  // quitado se devuelve (cantidad negativa = incremento).
  const ajustarStockProductos = async (
    productosAntes: ProductoInCita[],
    productosDespues: ProductoInCita[],
  ) => {
    const diferencias = new Map<number, number>();
    productosDespues.forEach((p) =>
      diferencias.set(p.id, (diferencias.get(p.id) || 0) + Number(p.cantidad)),
    );
    productosAntes.forEach((p) =>
      diferencias.set(p.id, (diferencias.get(p.id) || 0) - Number(p.cantidad)),
    );
    for (const [id, cantidad] of diferencias) {
      if (cantidad !== 0) {
        await window.api.decrementProductoStock(id, cantidad);
      }
    }
  };

  const handleEditCita = async (
    idCita: string,
    newCitaData: Cita,
  ): Promise<boolean> => {
    if (isEditandoCitaRef.current) return false;
    isEditandoCitaRef.current = true;
    try {
      // Los productos guardados en BD son la referencia para saber cuánto
      // stock ya se descontó por esta cita.
      const citaGuardada = await window.api.getCitaById(idCita);
      const productosGuardados = citaGuardada?.productos || [];

      if (newCitaData.estado === "cancelado") {
        // Se conserva el registro (no se borra) para no perder el
        // historial del cliente ni los reportes, pero se le asigna un id
        // nuevo porque el id original (fecha-clienteId) es único y debe
        // quedar libre de inmediato para que ese cliente pueda volver a
        // agendar ese mismo día. Las consultas que alimentan la agenda y
        // la detección de solapes (get-citas-by-fecha/by-fecha-clienteid
        // en main.ts) excluyen estado "cancelado", así que la celda queda
        // disponible aunque el documento siga existiendo. Se crea la
        // copia cancelada antes de borrar la original para no perderla si
        // la creación fallara.
        const citaCancelada = {
          ...newCitaData,
          id: `${idCita}-cancelada-${Date.now()}`,
        };
        await window.api.addCita(citaCancelada);
        await window.api.deleteCita(idCita);
        await ajustarStockProductos(productosGuardados, []);
        getCitasFromDB(fecha);
        handleAlert("Cita cancelada", "info");
        return true;
      }

      if (newCitaData.servicios.length === 0) {
        await window.api.deleteCita(idCita);
        await ajustarStockProductos(productosGuardados, []);
        getCitasFromDB(fecha);
        handleAlert("Cita eliminada por no tener servicios", "info");
        return true;
      }

      // El id de una cita es una clave compuesta fecha-clienteId. Si el
      // usuario cambió la fecha desde el modal, el id "correcto" para esos
      // datos ya no es el mismo con el que se guardó originalmente.
      const nuevoId = `${newCitaData.fecha}-${newCitaData.clienteId}`;
      const cambioDeFecha = nuevoId !== idCita;

      // Se consulta la BD por la fecha destino (no el estado de contexto,
      // que solo tiene cargada la fecha que la agenda está mostrando) para
      // detectar solapes incluso cuando la cita se mueve a otro día.
      const otrasCitasEnFecha = await window.api.getCitasByFecha(
        newCitaData.fecha,
      );
      const otrasCitas = otrasCitasEnFecha.filter((c) => c.id !== idCita);

      // Si la cita se mueve a una fecha donde el mismo cliente ya tiene
      // otra cita, no hay que bloquear el movimiento (el cliente puede
      // perfectamente tener dos citas el mismo día con distinto
      // estilista/horario) sino fusionar los servicios en esa cita
      // existente, igual que ya hace guardarCitaExistente al agregar un
      // servicio nuevo a una cita del mismo día.
      const citaDestinoExistente = cambioDeFecha
        ? otrasCitas.find((c) => c.clienteId === newCitaData.clienteId)
        : undefined;

      const otrasCitasParaSolape = citaDestinoExistente
        ? otrasCitas.filter((c) => c.id !== citaDestinoExistente.id)
        : otrasCitas;
      const serviciosDeOtrasCitas = otrasCitasParaSolape.flatMap(
        (c) => c.servicios,
      );
      const serviciosFinales = citaDestinoExistente
        ? [...citaDestinoExistente.servicios, ...newCitaData.servicios]
        : newCitaData.servicios;

      if (
        citaTieneServiciosSobrepuestos([
          ...serviciosDeOtrasCitas,
          ...serviciosFinales,
        ])
      ) {
        handleAlert(
          "Hay servicios que se sobreponen con otra cita ya agendada en esa fecha y horario",
          "error",
        );
        return false;
      }

      if (citaDestinoExistente) {
        // El cliente ya tenía otra cita ese día: se fusiona en vez de
        // duplicar. Se guarda primero el destino fusionado y solo si eso
        // tiene éxito se borra la cita original, para no perderla si la
        // fusión falla.
        await window.api.updateCita({
          ...citaDestinoExistente,
          servicios: serviciosFinales,
          productos: [
            ...(citaDestinoExistente.productos || []),
            ...(newCitaData.productos || []),
          ],
          propinas: [
            ...(citaDestinoExistente.propinas || []),
            ...(newCitaData.propinas || []),
          ],
          estado: newCitaData.estado,
        });
        await window.api.deleteCita(idCita);
      } else if (cambioDeFecha) {
        // El índice unique de "id" no permite mutarlo in place con
        // updateCita, así que se recrea el documento con el id correcto.
        // Se crea primero la cita nueva y solo si se guarda correctamente
        // se borra la original, para no perder la cita si la creación
        // falla (p.ej. por una colisión de id con otra cita existente).
        const citaConNuevoId = { ...newCitaData, id: nuevoId };
        await window.api.addCita(citaConNuevoId);
        await window.api.deleteCita(idCita);
      } else {
        await window.api.updateCita(newCitaData);
      }
      await ajustarStockProductos(
        productosGuardados,
        newCitaData.productos || [],
      );
      getCitasFromDB(fecha);
      handleAlert("Cita actualizada", "success");
      return true;
    } catch (error) {
      console.error("Error updating cita:", error);
      handleAlert("Error al actualizar la cita", "error");
      return false;
    } finally {
      isEditandoCitaRef.current = false;
    }
  };

  // Guarda al instante los productos (venta) de una cita, sin tocar el resto
  // de sus campos, que pueden tener cambios aún sin guardar en el modal.
  // Devuelve los productos guardados o null si no se pudo.
  const guardarProductosCita = async (
    idCita: string,
    productos: ProductoInCita[],
  ): Promise<ProductoInCita[] | null> => {
    if (isEditandoCitaRef.current) return null;
    isEditandoCitaRef.current = true;
    try {
      const citaGuardada = await window.api.getCitaById(idCita);
      if (!citaGuardada) {
        handleAlert("No se encontró la cita para guardar los productos", "error");
        return null;
      }
      const productosAntes = citaGuardada.productos || [];

      // Se valida contra el stock actual en BD, que ya descuenta lo que
      // esta cita tenía guardado: solo cuenta lo que se agrega de más.
      const cantidadDe = (lista: ProductoInCita[], id: number) =>
        lista
          .filter((p) => p.id === id)
          .reduce((acc, p) => acc + Number(p.cantidad), 0);
      const ids = new Set(productos.map((p) => p.id));
      for (const id of ids) {
        const extra = cantidadDe(productos, id) - cantidadDe(productosAntes, id);
        if (extra <= 0) continue;
        const producto = await window.api.getProductoById(id);
        if (!producto || producto.stock < extra) {
          handleAlert("No hay suficiente stock para agregar esa cantidad.", "error");
          return null;
        }
      }

      await window.api.updateCita({ ...citaGuardada, productos });
      await ajustarStockProductos(productosAntes, productos);
      getCitasFromDB(fecha);
      return productos;
    } catch (error) {
      console.error("Error saving productos:", error);
      handleAlert("Error al guardar los productos", "error");
      return null;
    } finally {
      isEditandoCitaRef.current = false;
    }
  };

  const addServiceToCita = (servicio: ServicioAgendado) => {
    setIsBooking(true);
    setCita((prev) => {
      // Protección contra doble clic/doble evento: no duplicar la misma
      // celda si ya está en el draft.
      if (prev.servicios.some((s) => s.cellID === servicio.cellID)) {
        return prev;
      }
      return {
        ...prev,
        fecha,
        servicios: [...prev.servicios, servicio],
      };
    });
  };

  const removeServiceFromCita = (servicio: ServicioAgendado) => {
    setCita((prev) => ({
      ...prev,
      servicios: prev.servicios.filter((s) => s.cellID !== servicio.cellID),
    }));
  };

  const updateServicioAgendado = (
    cellID: string,
    changes: Partial<ServicioAgendado>,
  ) => {
    setCita((prev) => {
      const index = prev.servicios.findIndex((s) => s.cellID === cellID);
      if (index === -1) return prev;

      const updatedServicios = [...prev.servicios];
      updatedServicios[index] = { ...updatedServicios[index], ...changes };
      return { ...prev, fecha, servicios: updatedServicios };
    });
  };

  const updateService = (cellID: string, updatedService: Servicio) => {
    // Nota: aquí no se fusionan bloques contiguos con el mismo servicio.
    // Mientras se arma la cita, cada celda de la agenda debe mantener un
    // cellID estable para poder cancelarse individualmente (ver
    // removeServiceFromCita / EmptyCell). La fusión visual ya la hace
    // customSpanFunc en AgendaTable, y al editar una cita ya guardada
    // mergeContiguousServicios la normaliza en un solo registro.
    updateServicioAgendado(cellID, { servicio: updatedService });
  };

  const updateDuracion = (
    cellID: string,
    horaFin: string,
    newDuracion: number,
  ): boolean => {
    const [rowIndexStr, ...estilistaParts] = cellID.split("-");
    const rowIndex = Number(rowIndexStr);
    const estilista = estilistaParts.join("-");
    const newRowIndexes = getOccupiedRows({ rowIndex, duracion: newDuracion });

    const citasDelDia = citas.filter((c) => c.fecha === fecha);
    const otrosServiciosEnCita = cita.servicios.filter(
      (s) => s.cellID !== cellID,
    );

    if (
      seSobreponeConOtroServicio(
        estilista,
        newRowIndexes,
        citasDelDia,
        otrosServiciosEnCita,
      )
    ) {
      handleAlert(
        "La hora de fin se sobrepone con otro servicio ya agendado",
        "error",
      );
      return false;
    }

    const vacacionesEstilista = estilistas.find((e) => e.name === estilista)
      ?.vacaciones;
    if (
      celdaEstaBloqueada(estilista, newRowIndexes, vacacionesEstilista, fecha, bloqueos)
        .blocked
    ) {
      handleAlert(
        "La hora de fin se sobrepone con un descanso o vacaciones del estilista",
        "error",
      );
      return false;
    }

    updateServicioAgendado(cellID, { duracion: newDuracion, horaFin });
    return true;
  };

  const handleCancelarCita = () => {
    setCita(initialContextData.cita);
    setIsBooking(false);
  };

  const guardarCitaExistente = async (citaExistente: Cita) => {
    // Un mismo cliente puede tener servicios en la misma hora si son con
    // estilistas distintos; solo es duplicado si coincide hora + estilista.
    const slotsExistentes = new Set(
      citaExistente.servicios.map((s) => `${s.horaInicio}-${s.estilista}`),
    );
    const nuevosServicios = cita.servicios.filter(
      (s) => !slotsExistentes.has(`${s.horaInicio}-${s.estilista}`),
    );
    const huboDuplicados = nuevosServicios.length < cita.servicios.length;
    if (huboDuplicados) {
      handleAlert(
        `Servicio ya agendado para cliente: "${citaExistente.nombreCliente}"`,
        "error",
      );
    }
    if (nuevosServicios.length === 0) return;

    const serviciosFinales = [...citaExistente.servicios, ...nuevosServicios];
    if (citaTieneServiciosSobrepuestos(serviciosFinales)) {
      handleAlert(
        "Hay servicios con horarios que se sobreponen. Corrige las horas antes de guardar.",
        "error",
      );
      return;
    }

    await window.api.updateCita({
      ...citaExistente,
      servicios: serviciosFinales,
      estado: cita.estado,
    });
    getCitasFromDB(fecha);
    setCita(initialContextData.cita);
    setIsBooking(false);
    handleAlert("Cita actualizada", "success");
  };

  const guardarCitaNueva = async () => {
    if (citaTieneServiciosSobrepuestos(cita.servicios)) {
      handleAlert(
        "Hay servicios con horarios que se sobreponen. Corrige las horas antes de guardar.",
        "error",
      );
      return;
    }

    const citaToSave = {
      ...cita,
      nombreCliente: cita.nombreCliente.trim(),
      id: `${fecha}-${cita.clienteId}`,
      servicios: cita.servicios,
      fechaCreacion: getCurrentDate().formattedDate,
      horaCreacion: getCurrentTime(),
    };
    const savedCita = await window.api.addCita(citaToSave);
    setCitas((prevCitas) => [...prevCitas, savedCita]);
    setCita(initialContextData.cita);
    setIsBooking(false);
    handleAlert("Cita guardada con éxito", "success");
  };

  const guardarCita = async () => {
    if (isGuardandoCitaRef.current) return;
    isGuardandoCitaRef.current = true;
    try {
      if (feriados.some((f) => f.fecha === fecha)) {
        handleAlert("No se pueden agendar citas en un día feriado", "error");
        return;
      }

      const tieneServicioBloqueado = cita.servicios.some((s) => {
        const vacacionesEstilista = estilistas.find(
          (e) => e.name === s.estilista,
        )?.vacaciones;
        return celdaEstaBloqueada(
          s.estilista,
          getOccupiedRows(s),
          vacacionesEstilista,
          fecha,
          bloqueos,
        ).blocked;
      });
      if (tieneServicioBloqueado) {
        handleAlert(
          "Hay servicios que se sobreponen con un descanso o vacaciones del estilista",
          "error",
        );
        return;
      }

      if (!cita.clienteId) {
        handleAlert(
          "Selecciona un cliente de la lista o guárdalo como nuevo antes de continuar",
          "error",
        );
        return;
      }
      const citaExistente = await window.api.getCitaByFechaClienteId(
        fecha,
        cita.clienteId,
      );
      if (citaExistente) {
        await guardarCitaExistente(citaExistente);
      } else {
        await guardarCitaNueva();
      }
    } catch (error) {
      console.error("Error saving cita:", error);
      handleAlert("Error al guardar la cita", "error");
    } finally {
      isGuardandoCitaRef.current = false;
    }
  };

  const searchClienteByNombre = async (nombre: string) => {
    try {
      const cliente = await window.api.getCliente(nombre);
      return cliente || null;
    } catch (error) {
      console.error("Error searching cliente by nombre:", error);
      return null;
    }
  };

  const searchClientesByNombre = async (nombre: string) => {
    try {
      const cliente = await window.api.getClientesByNombre(nombre);
      return cliente || null;
    } catch (error) {
      console.error("Error searching cliente by nombre:", error);
      return null;
    }
  };

  const searchClienteByPhone = async (telefono: string) => {
    try {
      const clientes = await window.api.getClientes();
      const clienteEncontrado = clientes.find(
        (cliente) => cliente.telefono === telefono,
      );
      return clienteEncontrado || null;
    } catch (error) {
      console.error("Error searching cliente by telefono:", error);
      return null;
    }
  };

  const addCliente = async (cliente: Cliente) => {
    if (!cliente.nombre || !cliente.telefono) {
      handleAlert("Nombre y teléfono son obligatorios", "error");
      return null;
    }

    try {
      const newCliente = await window.api.addCliente({
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        correo: cliente.correo || "",
        lastVisit: cliente.lastVisit || "",
      });
      handleAlert("Cliente agregado con éxito", "success");
      return newCliente;
    } catch (error) {
      console.error("Error adding cliente:", error);
      handleAlert("Error al agregar cliente", "error");
      return null;
    }
  };

  useEffect(() => {
    getEstilistasFromDB();
  }, []);

  useEffect(() => {
    getCitasFromDB(fecha);
    getBloqueosFromDB(fecha);
  }, [fecha]);

  // Solo se vuelve a consultar la BD cuando el año de la fecha seleccionada
  // cambia (no en cada navegación de día), ya que los feriados se traen
  // filtrados por año. fetchFeriadosByAnio cambia de referencia en cada
  // render del contexto de feriados, así que se omite de las deps a
  // propósito (el guard por anioCargadoRef evita fetches repetidos).
  const anioCargadoRef = useRef<number | null>(null);
  useEffect(() => {
    const anio = getTargetDate(fecha).get("year");
    if (anioCargadoRef.current === anio) return;
    anioCargadoRef.current = anio;
    fetchFeriadosByAnio(anio);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fecha]);

  return (
    <AgendaContext.Provider
      value={{
        fecha,
        setFecha,
        minDuration,
        setMinDuration,
        isCitaOpen,
        setIsCitaOpen,
        isBooking,
        setIsBooking,
        citas,
        setCitas,
        currentPage,
        setCurrentPage,
        cita,
        setCita,
        handleEditCita,
        guardarProductosCita,
        addServiceToCita,
        removeServiceFromCita,
        updateDuracion,
        handleCancelarCita,
        updateService,
        guardarCita,
        handleAlert,
        searchClienteByNombre,
        searchClientesByNombre,
        searchClienteByPhone,
        addCliente,
        estilistas,
        refetchEstilistas: getEstilistasFromDB,
        bloqueos,
        addBloqueo,
        removeBloqueo,
      }}
    >
      {children}
    </AgendaContext.Provider>
  );
};

export function useAgendaContext() {
  const context = useContext(AgendaContext);
  if (!context) {
    throw new Error(
      "useAgendaContext must be used within a AgendaContextProvider",
    );
  }
  return context;
}
