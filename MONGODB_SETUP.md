# MongoDB Implementation Guide

## Overview
The application now uses MongoDB for persistent data storage instead of in-memory `globalData`. All CRUD operations go through IPC (Inter-Process Communication) from the React renderer to the Electron main process.

## Prerequisites

### 1. Install MongoDB
**Windows:**
- Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
- Run the installer and follow the setup wizard
- MongoDB will run as a Windows service by default on `localhost:27017`

**Verify Installation:**
```bash
# Check if MongoDB is running
mongosh
# You should see a MongoDB shell prompt
```

## Database Setup

### 1. Seed Initial Data
After installing MongoDB, populate the database with initial data:

```bash
npm run seed:db
```

This creates the `agenda` database and populates it with:
- 4 sample clients (clientes)
- 6 services (servicios)
- 5 stylists (estilistas)
- 5 products (productos)

### 2. Verify Data
```bash
mongosh
use agenda
db.clientes.find()
db.servicios.find()
db.estilistas.find()
db.productos.find()
```

## Architecture

### Data Flow
```
React Component
  ↓ (window.api.*)
Preload Script (contextBridge)
  ↓ (ipcRenderer.invoke)
Main Process (ipcMain.handle)
  ↓ (Mongoose)
MongoDB
```

### Key Files

**Electron Main Process:**
- `src/electron/main.ts` - IPC handlers for all CRUD operations
- `src/electron/preload.ts` - Exposes IPC API to renderer via contextBridge
- `src/electron/models/` - Mongoose schemas for all entities
- `src/electron/seed.ts` - Database seeding script

**React UI:**
- `src/ui/electron.d.ts` - TypeScript definitions for window.api
- `src/ui/contexts/*Context.tsx` - Updated to use async IPC calls

## Available API Methods

All methods are accessed via `window.api.*` in the renderer process:

### Clientes
- `getClientes()` → `Promise<Cliente[]>`
- `addCliente(cliente)` → `Promise<Cliente>`
- `updateCliente(cliente)` → `Promise<Cliente>`
- `deleteCliente(id)` → `Promise<void>`

### Estilistas
- `getEstilistas()` → `Promise<Estilista[]>`
- `addEstilista(estilista)` → `Promise<Estilista>`
- `updateEstilista(estilista)` → `Promise<Estilista>`
- `deleteEstilista(id)` → `Promise<void>`

### Servicios
- `getServicios()` → `Promise<Servicio[]>`
- `addServicio(servicio)` → `Promise<Servicio>`
- `updateServicio(servicio)` → `Promise<Servicio>`
- `deleteServicio(id)` → `Promise<void>`

### Productos
- `getProductos()` → `Promise<Producto[]>`
- `addProducto(producto)` → `Promise<Producto>`
- `updateProducto(producto)` → `Promise<Producto>`
- `deleteProducto(id)` → `Promise<void>`

### Citas
- `getCitas()` → `Promise<Cita[]>`
- `getCitasByFecha(fecha)` → `Promise<Cita[]>`
- `addCita(cita)` → `Promise<Cita>`
- `updateCita(cita)` → `Promise<Cita>`
- `deleteCita(id)` → `Promise<void>`

## Development Workflow

1. **Start MongoDB** (if not running as service):
   ```bash
   mongod
   ```

2. **Development Mode** (React only):
   ```bash
   npm run dev
   ```

3. **Build & Run Desktop App**:
   ```bash
   npm run build
   npm run dev:electron
   ```

4. **Re-seed Database** (clears existing data):
   ```bash
   npm run seed:db
   ```

## Troubleshooting

### MongoDB Connection Failed
**Error:** `Failed to connect to MongoDB`

**Solutions:**
1. Verify MongoDB is running:
   ```bash
   # Windows
   net start MongoDB
   
   # Check status
   mongosh
   ```

2. Check connection string in `main.ts`:
   ```typescript
   mongoose.connect('mongodb://localhost:27017/agenda')
   ```

### Preload Script Not Loading
**Error:** `window.api is undefined`

**Solutions:**
1. Rebuild Electron code:
   ```bash
   npm run transpile:electron
   ```

2. Verify `main.ts` has preload configuration:
   ```typescript
   webPreferences: {
     preload: path.join(__dirname, 'preload.js'),
     contextIsolation: true,
     nodeIntegration: false,
   }
   ```

### Data Not Persisting
- Ensure MongoDB service is running
- Check browser console for IPC errors
- Verify `dist-electron/preload.js` exists after build

## Migration from globalData

All contexts have been updated:
- ✅ `AgendaContext` - Citas CRUD + client search
- ✅ `ClientesContext` - Clientes CRUD
- ✅ `EstilistaContext` - Estilistas CRUD
- ✅ `ServiciosContext` - Servicios CRUD
- ✅ `ProductosContext` - Productos CRUD

**Breaking Changes:**
- All CRUD methods are now `async` (return `Promise`)
- Components calling these methods must use `await` or `.then()`
- `searchClienteByNombre` and `searchClienteByPhone` now return `Promise<Cliente | null>`

## Database Schema

### Cliente
```typescript
{
  id: number;
  nombre: string;
  telefono: string;
  correo: string;
  lastVisit: string; // DD-MM-YYYY
}
```

### Estilista
```typescript
{
  id: number;
  name: string;
  telefono: string;
  displayName?: string;
}
```

### Servicio
```typescript
{
  id: number;
  nombre: string;
  precio: string;
}
```

### Producto
```typescript
{
  id: number;
  nombre: string;
  marca: string;
  precio: string;
  descripcion?: string;
  stock?: number;
}
```

### Cita
```typescript
{
  id: number;
  rowIndex: number;
  fecha: string; // DD-MM-YYYY
  estilista: string;
  nombreCliente: string;
  telefonoCliente: string;
  servicio: {
    id: number;
    nombre: string;
    precio: string;
  };
  horaInicio: string;
  horaFin: string;
  duracion: number;
  estado: string;
  metodoDePago: string;
  notas: string;
}
```

## Notes

- **Auto-increment IDs:** Handled in IPC handlers by finding max ID + 1
- **Date Format:** Internal dates remain `DD-MM-YYYY` format
- **Error Handling:** All IPC calls wrapped in try/catch with user notifications
- **MongoDB Database:** Named `agenda` (created automatically on first connection)
