# Copilot Instructions for Agenda Repository

## Project Overview
**Status Salon Agenda** is a desktop salon management app: Electron (desktop) + React/TypeScript (UI) + MongoDB (persistence).  
Manages appointments (citas), clients, stylists (estilistas), services, and products.

**Key Constraint:** All internal date strings are `DD-MM-YYYY`; HTML `<input type="date">` requires `YYYY-MM-DD` format conversion via `formatDateToHTML()` / `formatDateFromHTML()`.

## Build & Development Workflow

| Command | Purpose | Notes |
|---------|---------|--------|
| `npm run dev` | Vite dev server (React only) | HMR at port 5173; fast iteration without Electron |
| `npm run build` | Full production compile | TypeScript + Vite build; outputs `dist-react/` + `dist-electron/` |
| `npm run transpile:electron` | Compile Electron TypeScript only | Fast recompile of `src/electron/` after main.ts changes |
| `npm run dev:electron` | Launch desktop app | Requires `npm run build` first; MongoDB running on localhost:27017 |
| `npm run lint` | Check TypeScript + ESLint | Fails on unused `// eslint-disable` directives |

**Pre-Electron Launch:** `npm run build` → verify `mongod` running → `npm run dev:electron`

## Architecture

### Three-Layer Stack
1. **React UI** (`src/ui/`) – HashRouter pages (Agenda, Clientes, Estilistas, Servicios, Productos, Reportes)
2. **Electron Main** (`src/electron/main.ts`) – IPC handlers, context bridge, window management
3. **MongoDB** (`mongodb://localhost:27017/statusdb`) – Persistence via Mongoose models

### Provider Nesting Order (App.tsx)
```
HashRouter
  └─ SnackbarProvider (notistack; maxSnack=3, 3s auto-hide)
      └─ SideBarContextProvider (sidebar expand/collapse)
          └─ AgendaContextProvider (appointments, dates, booking)
              └─ Page components (Agenda.tsx, Clientes.tsx, etc.)
```

### IPC Data Flow (Electron Bridge)
React component → `window.api.method()` → Electron main `ipcMain.handle()` → Mongoose model → MongoDB → back to React

**Example:** `const appointments = await window.api.getAppointments();`

**CRITICAL:** IPC handlers are registered in [src/electron/main.ts](src/electron/main.ts) and exposed via `contextBridge.exposeInMainWorld()` in the same file. Both must be updated together.

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
1. **Model:** Create Mongoose schema in `src/models/YourModel.tsx` (see `CitaModel.tsx` for reference)
2. **Database:** Import model in [src/electron/main.ts](src/electron/main.ts) after `import '../database'`
3. **IPC:** Register handlers in `ipcMain.handle()` AND expose via `contextBridge.exposeInMainWorld()` in same file
4. **Context:** Create provider in `src/ui/contexts/YourContext.tsx` if cross-component state needed
5. **UI:** Build in `src/ui/components/{pages,forms,tables,modals}/`
6. **Routes:** Add to [src/ui/components/pages/Home.tsx](src/ui/components/pages/Home.tsx) and link in `SideBar.tsx`
7. **Verify:** `npm run build` → `npm run dev:electron` (MongoDB running)

### TypeScript Conventions
- **Strict mode:** `noImplicitAny: true`, `strictNullChecks: true` – explicit types required
- **Naming:** PascalCase components (`ClienteCard.tsx`), camelCase utilities (`utils.tsx`)
- **Domain terms:** Keep Spanish (Cita, Estilista, Servicio, Cliente)
- **JSX mode:** `react-jsx` (no React import needed)
- **Type definitions:** Centralized in `src/ui/types/` (Cita.tsx, Estilista.tsx, Producto.tsx, Servicio.tsx)

## Current State (Jan 2026)
- ✅ **Appointments (Cita):** MongoDB-backed CRUD via IPC (`createAppointment`, `getAppointments`, `deleteAppointment`)
- ⚠️ **Estilistas, Clientes, Servicios, Productos:** UI/contexts exist with `globalData` mock; **not yet persisted to MongoDB**
  - These modules mutate `globalData` object directly (in-memory only)
  - Implement IPC handlers + Mongoose models to persist these entities

## Quick Troubleshooting

| Issue | Root Cause | Fix |
|-------|-----------|-----|
| Electron won't launch | Missing build or MongoDB offline | `npm run build` first; verify `mongod` on localhost:27017 |
| React HMR not working | Wrong dev command | Use `npm run dev` (not dev:electron) |
| Date displays wrong in tables | Format mismatch (DD-MM-YYYY vs YYYY-MM-DD) | Use `formatDateToHTML()`/`formatDateFromHTML()` at boundaries |
| Context hook throws error | Component outside provider wrapper | Check provider nesting in [App.tsx](src/ui/App.tsx) |
| ag-grid cells render empty | Missing renderer or bad data | Verify component exists in CustomeCells/; check cell data structure |
| Notification doesn't appear | Missing SnackbarProvider | Ensure component wrapped by SnackbarProvider (in [App.tsx](src/ui/App.tsx)) |
| IPC method not found | Missing contextBridge exposure | Update both `ipcMain.handle()` AND `contextBridge.exposeInMainWorld()` in [main.ts](src/electron/main.ts) |
