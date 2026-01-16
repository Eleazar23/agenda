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
| `npm run transpile:electron` | Compile Electron TypeScript only | Fast recompile of `src/electron/` |
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

### IPC Data Flow
React component → `window.api.method()` → Electron main `ipcMain.handle()` → Mongoose model → MongoDB → back to React

Example: `const appointments = await window.api.getAppointments();`

## Critical Patterns

### Date Handling ⚠️
- **Internal:** `DD-MM-YYYY` (e.g., `"24-01-2026"`)
- **HTML input:** `YYYY-MM-DD` (reverse direction)
- **Utilities** in [src/ui/utils/utils.tsx](src/ui/utils/utils.tsx):
  - `formatDateToHTML("24-01-2026")` → `"2026-01-24"` (set input.value)
  - `formatDateFromHTML("2026-01-24")` → `"24-01-2026"` (read input onChange)
- **Library:** dayjs with `objectSupport` + `customParseFormat` plugins

### Contexts (State Management)

| Context | File | Scope | Key Methods |
|---------|------|-------|------------|
| **AgendaContext** | [src/ui/contexts/AgendaContext.tsx](src/ui/contexts/AgendaContext.tsx#L1) | Global | `addCita()`, `addService()`, `updateService()`, `removeService()` |
| **EstilistaContext** | [src/ui/contexts/EstilistaContext.tsx](src/ui/contexts/EstilistaContext.tsx#L1) | Page-level | `addEstilista()`, `editEstilista()`, `removeEstilista()` |
| **ClientesContext** | [src/ui/contexts/ClientesCtx.tsx](src/ui/contexts/ClientesCtx.tsx#L1) | Page-level | Client CRUD operations |
| **SideBarContext** | [src/ui/contexts/SideBarContext.tsx](src/ui/contexts/SideBarContext.tsx#L1) | Global | Sidebar open/close state |

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

### Adding a New Feature
1. **Model:** Create Mongoose schema in `src/models/YourModel.tsx`
2. **IPC:** Register handlers in [src/electron/main.ts](src/electron/main.ts#L17) and expose via `contextBridge.exposeInMainWorld()`
3. **Context:** Create provider in `src/ui/contexts/YourContext.tsx` if cross-component state needed
4. **UI:** Build in `src/ui/components/{pages,forms,tables,modals}/`
5. **Routes:** Add to [src/ui/components/pages/Home.tsx](src/ui/components/pages/Home.tsx#L1) and link in `SideBar.tsx`
6. **Verify:** `npm run build` → `npm run dev:electron` (MongoDB running)

### TypeScript Conventions
- **Strict mode:** `noImplicitAny: true`, `strictNullChecks: true` – explicit types required
- **Naming:** PascalCase components (`ClienteCard.tsx`), camelCase utilities (`utils.tsx`)
- **Domain terms:** Keep Spanish (Cita, Estilista, Servicio, Cliente)
- **JSX mode:** `react-jsx` (no React import needed)

## Current State (Jan 2026)
- ✅ Appointments (Cita) – MongoDB-backed CRUD
- ⚠️ Estilistas, Clientes, Servicios, Productos – UI/contexts exist but mock data only; not yet persisted

## Quick Troubleshooting

| Issue | Root Cause | Fix |
|-------|-----------|-----|
| Electron won't launch | Missing build or MongoDB offline | `npm run build` first; verify `mongod` on localhost:27017 |
| React HMR not working | Wrong dev command | Use `npm run dev` (not dev:electron) |
| Date displays wrong in tables | Format mismatch (DD-MM-YYYY vs YYYY-MM-DD) | Use `formatDateToHTML()`/`formatDateFromHTML()` at boundaries |
| Context hook throws error | Component outside provider wrapper | Check provider nesting in App.tsx |
| ag-grid cells render empty | Missing renderer | Verify component exists in CustomeCells/; cellRendererSelector returns component or null |
| Notification doesn't appear | Missing SnackbarProvider | Ensure component wrapped by SnackbarProvider (in App.tsx) |
