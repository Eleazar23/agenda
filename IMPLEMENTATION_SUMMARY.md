# MongoDB Implementation Summary

## What Was Changed

Successfully migrated the **Status Salon Agenda** application from in-memory `globalData` to persistent MongoDB storage. All CRUD operations now go through IPC (Inter-Process Communication) from React renderer to Electron main process.

## Files Created

### Electron Backend (src/electron/)
- **models/Cliente.ts** - Mongoose schema for clients
- **models/Estilista.ts** - Mongoose schema for stylists  
- **models/Servicio.ts** - Mongoose schema for services
- **models/Producto.ts** - Mongoose schema for products
- **models/Cita.ts** - Mongoose schema for appointments
- **preload.ts** - contextBridge to expose IPC API to renderer
- **seed.ts** - Database seeding script with initial data

### React UI (src/ui/)
- **electron.d.ts** - TypeScript definitions for window.api

### Documentation
- **MONGODB_SETUP.md** - Complete setup and usage guide

## Files Modified

### Electron Main Process
- **src/electron/main.ts**
  - Added IPC handlers for all CRUD operations
  - Configured preload script in BrowserWindow
  - Imports for all Mongoose models

### React Contexts (All updated to async IPC)
- **src/ui/contexts/AgendaContext.tsx**
  - `guardarCita()` → async, saves to MongoDB via IPC
  - `handleEditCita()` → async, updates/deletes via IPC
  - `searchClienteByNombre()` → async, queries MongoDB
  - `searchClienteByPhone()` → async, queries MongoDB
  - `useEffect` → loads citas from MongoDB on fecha change

- **src/ui/contexts/ClientesCtx.tsx**
  - `getClientes()` → async, loads from MongoDB
  - `addCliente()` → async, saves via IPC
  - `editCliente()` → async, updates via IPC
  - `removeCliente()` → async, deletes via IPC

- **src/ui/contexts/EstilistaContext.tsx**
  - `getEstilistasData()` → async, loads from MongoDB
  - `addEstilista()` → async, saves via IPC
  - `editEstilista()` → async, updates via IPC
  - `removeEstilista()` → async, deletes via IPC

- **src/ui/contexts/ServiciosContext.tsx**
  - `getServicios()` → async, loads from MongoDB
  - `addServicio()` → async, saves via IPC
  - `editServicio()` → async, updates via IPC
  - `removeServicio()` → async, deletes via IPC

- **src/ui/contexts/ProductosCtx.tsx**
  - `getProductosData()` → async, loads from MongoDB
  - `addProducto()` → async, saves via IPC
  - `editProducto()` → async, updates via IPC
  - `removeProducto()` → async, deletes via IPC

### Components
- **src/ui/components/tables/AgendaTable.tsx**
  - Loads estilistas from MongoDB via `window.api.getEstilistas()`
  - Dynamically generates columns based on loaded estilistas

- **src/ui/components/Inputs/ServiciosInput.tsx**
  - Loads servicios from MongoDB via `window.api.getServicios()`

- **src/ui/components/pages/Reportes.tsx**
  - Loads all citas from MongoDB via `window.api.getCitas()`

- **src/ui/components/tables/EstilistasTable.tsx**
  - Removed `globalData` import (commented code only)

- **src/ui/components/tables/ClientsTable.tsx**
  - Removed `globalData` import (commented code only)

- **src/ui/components/CustomeCells/EstilistasActionsCell.tsx**
  - Removed `globalData` import (commented code only)

### Configuration
- **package.json**
  - Added `"seed:db"` script for database seeding

## Breaking Changes

### All CRUD Methods Now Async
Components calling context methods must handle promises:

**Before:**
```typescript
addCliente(newCliente);
```

**After:**
```typescript
await addCliente(newCliente);
// OR
addCliente(newCliente).then(() => {
  // success handling
});
```

### Updated Function Signatures
- `addCliente` / `addEstilista` / `addServicio` / `addProducto` → returns `Promise<void>`
- `editCliente` / `editEstilista` / `editServicio` / `editProducto` → returns `Promise<void>`
- `removeCliente` / `removeEstilista` / `removeServicio` / `removeProducto` → returns `Promise<void>`
- `guardarCita` → returns `Promise<void>`
- `handleEditCita` → returns `Promise<void>`
- `searchClienteByNombre` / `searchClienteByPhone` → returns `Promise<Cliente | null>`

## IPC API Methods

All available via `window.api.*` in renderer process:

### Clientes
```typescript
window.api.getClientes() → Promise<Cliente[]>
window.api.addCliente(cliente) → Promise<Cliente>
window.api.updateCliente(cliente) → Promise<Cliente>
window.api.deleteCliente(id) → Promise<void>
```

### Estilistas
```typescript
window.api.getEstilistas() → Promise<Estilista[]>
window.api.addEstilista(estilista) → Promise<Estilista>
window.api.updateEstilista(estilista) → Promise<Estilista>
window.api.deleteEstilista(id) → Promise<void>
```

### Servicios
```typescript
window.api.getServicios() → Promise<Servicio[]>
window.api.addServicio(servicio) → Promise<Servicio>
window.api.updateServicio(servicio) → Promise<Servicio>
window.api.deleteServicio(id) → Promise<void>
```

### Productos
```typescript
window.api.getProductos() → Promise<Producto[]>
window.api.addProducto(producto) → Promise<Producto>
window.api.updateProducto(producto) → Promise<Producto>
window.api.deleteProducto(id) → Promise<void>
```

### Citas
```typescript
window.api.getCitas() → Promise<Cita[]>
window.api.getCitasByFecha(fecha) → Promise<Cita[]>
window.api.addCita(cita) → Promise<Cita>
window.api.updateCita(cita) → Promise<Cita>
window.api.deleteCita(id) → Promise<void>
```

## Setup Instructions

### 1. Install MongoDB
Download and install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)

### 2. Seed Database
```bash
npm run seed:db
```

This creates the `agenda` database and populates it with sample data.

### 3. Build & Run
```bash
npm run build
npm run dev:electron
```

## Data Flow Architecture

```
┌─────────────────┐
│ React Component │
└────────┬────────┘
         │ window.api.addCliente(...)
         ▼
┌─────────────────┐
│  Preload.ts     │ contextBridge.exposeInMainWorld('api', {...})
│ (contextBridge) │
└────────┬────────┘
         │ ipcRenderer.invoke('add-cliente', ...)
         ▼
┌─────────────────┐
│   Main.ts       │ ipcMain.handle('add-cliente', async (_event, cliente) => {...})
│ (IPC Handlers)  │
└────────┬────────┘
         │ await Cliente.create(...)
         ▼
┌─────────────────┐
│  MongoDB        │ {id: 5, nombre: "...", ...}
│  (Database)     │
└─────────────────┘
```

## Error Handling

All IPC calls are wrapped in try/catch blocks with user notifications:

```typescript
try {
  await window.api.addCliente(newCliente);
  handleAlert("Cliente agregado con éxito", "success");
} catch (error) {
  console.error("Error adding cliente:", error);
  handleAlert("Error al agregar cliente", "error");
}
```

## Notes

- **MongoDB Connection:** `mongodb://localhost:27017/agenda`
- **Auto-increment IDs:** Handled by finding max ID + 1 in IPC handlers
- **Date Format:** Remains `DD-MM-YYYY` internally
- **globalData:** No longer used; can be removed in future cleanup
- **Build Output:** Preload script compiled to `dist-electron/preload.js`

## Future Improvements

- Add data validation in Mongoose schemas
- Implement MongoDB indexes for better query performance
- Add data migration scripts for schema changes
- Consider using MongoDB ObjectId instead of manual integer IDs
- Add backup/restore functionality
