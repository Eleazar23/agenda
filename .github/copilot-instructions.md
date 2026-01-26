# Copilot Instructions for Agenda Repository

## Project Overview
**Status Salon Agenda** is a desktop salon management app built with Electron + React/TypeScript.  
Manages appointments (citas), clients, stylists (estilistas), services, and products.

**Current State:** Full-stack implementation with MongoDB persistence via IPC. React UI communicates with Electron main process through `window.api.*()` → `ipcMain.handle()` → Mongoose models. Legacy `globalData` mock exists but is **no longer used**.

**Key Constraint:** All internal date strings are `DD-MM-YYYY`; HTML `<input type="date">` requires `YYYY-MM-DD` format conversion via `formatDateToHTML()` / `formatDateFromHTML()`.

## Build & Development Workflow

| Command | Purpose | Notes |
|---------|---------|--------|
| `npm run dev` | Vite dev server (React only) | HMR at port 5173; fast iteration without Electron |
| `npm run build` | Full production compile | TypeScript + Vite build; outputs `dist-react/` + `dist-electron/` |
| `npm run transpile:electron` | Compile Electron TypeScript only | Fast recompile of `src/electron/` after main.ts changes |
| `npm run dev:electron` | Launch desktop app | Requires `npm run build` first |
| `npm run lint` | Check TypeScript + ESLint | Fails on unused `// eslint-disable` directives |
| `npm run seed:db` | Seed MongoDB with test data | Compiles Electron + runs seed.ts script |

**Development Workflow:** `npm run dev` for UI iteration → `npm run build` + `npm run dev:electron` to test desktop app

**MongoDB Setup:** Requires local MongoDB at `mongodb://localhost:27017/agenda`. See [MONGODB_SETUP.md](MONGODB_SETUP.md) for installation. Seed initial data with `npm run seed:db`.

## Architecture

### Three-Layer Stack (Current)
1. **React UI** (`src/ui/`) – HashRouter pages (Agenda, Clientes, Estilistas, Servicios, Productos, Reportes)
2. **Electron IPC Bridge** (`src/electron/preload.ts`) – contextBridge exposing `window.api.*()` methods
3. **Electron Main + MongoDB** (`src/electron/main.ts`) – ipcMain handlers + Mongoose models in `src/electron/models/`

**Data Flow:** React component → Context → `window.api.addCliente(data)` → `ipcMain.handle('add-cliente')` → Mongoose `Cliente.save()` → MongoDB

**IPC API Surface** ([preload.ts](src/electron/preload.ts)):
```typescript
window.api = {
  // Each entity (clientes, estilistas, servicios, productos, citas)
  get{Entity}s: () => Promise<Entity[]>
  add{Entity}: (data) => Promise<Entity>
  update{Entity}: (data) => Promise<Entity>
  delete{Entity}: (id: number) => Promise<void>
  // Special: getCitasByFecha(fecha: "DD-MM-YYYY")
}
```

**Mongoose Models:** `src/electron/models/{Cliente,Estilista,Servicio,Producto,Cita}.ts` – use numeric `id` field (not MongoDB `_id`) for primary keys

### Provider Nesting Order (App.tsx)
```
HashRouter
  └─ SnackbarProvider (notistack; maxSnack=3, 3s auto-hide)
      └─ SideBarContextProvider (sidebar expand/collapse)
          └─ AgendaContextProvider (appointments, dates, booking)
              └─ Page components (Agenda.tsx, Clientes.tsx, etc.)
```

## Critical Patterns

### Date Handling ⚠️
- **Internal:** `DD-MM-YYYY` (e.g., `"24-01-2026"`)
- **HTML input:** `YYYY-MM-DD` (reverse direction)
- **Utilities** in [src/ui/utils/utils.tsx](src/ui/utils/utils.tsx):
  - `formatDateToHTML("24-01-2026")` → `"2026-01-24"` (set input.value)
  - `formatDateFromHTML("2026-01-24")` → `"24-01-2026"` (read input onChange)
  - `getCurrentDate()` → `{dateObj, formattedDate: "DD-MM-YYYY", day, month, year}`
  - `getTargetDate(dateString)` → dayjs object from "DD-MM-YYYY" string
- **Library:** dayjs with `objectSupport` + `customParseFormat` plugins

### Contexts (State Management)

| Context | File | Scope | Key Methods |
|---------|------|-------|------------|
| **AgendaContext** | [src/ui/contexts/AgendaContext.tsx](src/ui/contexts/AgendaContext.tsx) | Global | `addCita()`, `addService()`, `updateService()`, `removeService()`, `updateDuracion()` |
| **EstilistaContext** | [src/ui/contexts/EstilistaContext.tsx](src/ui/contexts/EstilistaContext.tsx) | Page-level | `addEstilista()`, `editEstilista()`, `removeEstilista()`, `handleAlert()` |
| **ClientesContext** | [src/ui/contexts/ClientesCtx.tsx](src/ui/contexts/ClientesCtx.tsx) | Page-level | `addCliente()`, `editCliente()`, `removeCliente()`, `handleAlert()` |
| **SideBarContext** | [src/ui/contexts/SideBarContext.tsx](src/ui/contexts/SideBarContext.tsx) | Global | Sidebar open/close state |

**Pattern:** Contexts use `notistack`'s `enqueueSnackbar()` for user feedback (success/error/info/warning). Call `handleAlert(message, alertType)` for consistent notifications.

**Data Mutation:** All CRUD operations are async IPC calls via `window.api.*()`. Contexts load data from MongoDB on mount and update local state after successful mutations (e.g., `await window.api.addCliente(data)` → `setDataTable([...newData])`)

### Component File Structure
```
src/ui/components/
  ├─ pages/           → Route containers (Agenda.tsx, Clientes.tsx, etc.)
  ├─ containers/      → Business logic wrappers (NuevaCitaContainer.tsx)
  ├─ tables/          → ag-grid tables (AgendaTable.tsx, ClientsTable.tsx)
  ├─ forms/           → Input forms (ClienteForm.tsx, ServiciosForm.tsx)
  ├─ modals/          → Dialog modals (CitaModal.tsx, EditCliente.tsx)
  ├─ Inputs/          → Reusable inputs (FechaInput.tsx, PhoneInput.tsx)
  ├─ CustomeCells/    → ag-grid renderers (CitaCell.tsx, CutomeCellRenderer.tsx)
  ├─ cards/           → Card components (ClienteCard.tsx)
  └─ buttons/         → Button components (DeleteBtn.tsx, EditBtn.tsx)
```
**Note:** ag-grid cell renderers live in `CustomeCells/` (note spelling: "Cutome" not "Custom")

### ag-grid Patterns (AgendaTable.tsx)
- **Dynamic columns:** Generated from `globalData.estilistas` array
- **Cell spanning:** Uses `spanRows: customSpanFunc` to merge cells with same `cellID` and `servicio`
- **Custom rendering:** `cellRenderer: CutomeCellRenderer` → routes to `CitaCell`, `EmptyCell`, etc.
- **Cell data structure:** Expects `{nombreCliente, telefonoCliente, servicio: {servicio, duracion, cellID, ...}}`

### Adding a New Feature
1. **Mongoose Model:** Create schema in `src/electron/models/YourModel.ts` (use numeric `id` field, not `_id`)
2. **IPC Handlers:** Add CRUD handlers in `src/electron/main.ts`:
   ```typescript
   ipcMain.handle('get-entities', async () => await YourModel.find().lean());
   ipcMain.handle('add-entity', async (_event, data) => { /* auto-increment id */ });
   ```
3. **Preload Bridge:** Expose in `src/electron/preload.ts`:
   ```typescript
   contextBridge.exposeInMainWorld('api', {
     getEntities: () => ipcRenderer.invoke('get-entities'),
     // ...
   });
   ```
4. **TypeScript Types:** Add interface in `src/ui/types/YourType.tsx`, extend `window.api` in `src/ui/electron.d.ts`
5. **Context:** Create provider in `src/ui/contexts/YourContext.tsx` using async `window.api.*()` calls
6. **UI:** Build components in `src/ui/components/{pages,forms,tables,modals}/`
7. **Routes:** Add to [src/ui/components/pages/Home.tsx](src/ui/components/pages/Home.tsx) and link in `SideBar.tsx`
8. **Verify:** `npm run dev` for UI → `npm run build` + `npm run dev:electron` for desktop app

**ID Generation Pattern:** All Mongoose models use `id: Number` (not MongoDB `_id`). IPC handlers auto-increment via `findOne().sort('-id')` + 1

### TypeScript Conventions
- **Strict mode:** `noImplicitAny: true`, `strictNullChecks: true` – explicit types required
- **Naming:** PascalCase components (`ClienteCard.tsx`), camelCase utilities (`utils.tsx`)
- **Domain terms:** Keep Spanish (Cita, Estilista, Servicio, Cliente)
- **JSX mode:** `react-jsx` (no React import needed)
- **Type definitions:** Centralized in `src/ui/types/` (Cita.tsx, Estilista.tsx, Producto.tsx, Servicio.tsx)

## Current State (Jan 2026)
- ✅ **MongoDB Persistence:** Fully implemented via IPC bridge
  - All CRUD operations async: `await window.api.addCliente(data)` → Mongoose → MongoDB
  - Contexts: AgendaContext, EstilistaContext, ClientesCtx, ProductosCtx, ServiciosContext
  - IPC handlers in `main.ts` + contextBridge in `preload.ts`
  - Mongoose models in `src/electron/models/` with numeric `id` field
- ⚠️ **Legacy Code:** `globalData` mock still exists in `src/ui/mock/` but is **not used** by current implementation

## Quick Troubleshooting

| Issue | Root Cause | Fix |
|-------|-----------|-----|
| Electron won't launch | Missing build | `npm run build` first |
| React HMR not working | Wrong dev command | Use `npm run dev` (not dev:electron) |
| Date displays wrong in tables | Format mismatch (DD-MM-YYYY vs YYYY-MM-DD) | Use `formatDateToHTML()`/`formatDateFromHTML()` at boundaries |
| Context hook throws error | Component outside provider wrapper | Check provider nesting in [App.tsx](src/ui/App.tsx) |
| ag-grid cells render empty | Missing renderer or bad data | Verify component exists in CustomeCells/; check cell data structure |
| Notification doesn't appear | Missing SnackbarProvider | Ensure component wrapped by SnackbarProvider (in [App.tsx](src/ui/App.tsx)) |
