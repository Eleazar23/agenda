# Copilot Instructions for Agenda Repository

<!-- Kept in sync with CLAUDE.md at the repo root. Update both together. -->

## Project Overview

**Status Salon Agenda** is a desktop salon management app built with Electron + React/TypeScript. It manages appointments (citas, including tips/propinas), clients, stylists (estilistas, including vacaciones), services (servicios), products (productos), expenses (gastos), agenda notes (notas), holidays (feriados), and stylist time blocks (bloqueos).

React UI communicates with the Electron main process through `window.api.*()` → `ipcMain.handle()` → Mongoose models → MongoDB. A legacy `globalData` mock exists in `src/ui/mock/` but is **no longer used**.

## Commands

| Command | Purpose | Notes |
|---------|---------|--------|
| `npm run dev` | Vite dev server (React only) | HMR at port 5173; fast iteration without Electron |
| `npm run build` | Full production compile | `tsc` + Vite build → outputs `dist-react/` + `dist-electron/` |
| `npm run transpile:electron` | Compile Electron TypeScript only | Fast recompile of `src/electron/` after main.ts changes |
| `npm run dev:electron` | Launch desktop app | Runs `npm run build` first, then `electron .` |
| `npm run lint` | ESLint (`ts,tsx`) | Fails on unused `// eslint-disable` directives, `--max-warnings 0` |
| `npm run seed:db` | Seed MongoDB with test data | Compiles Electron + runs `dist-electron/seed.js` |
| `npm run seed:reportes` | Seed data for the Reportes page | Runs `dist-electron/seedReportes.js` |
| `npm run migrate:clienteid` / `migrate:citaids` | One-off data migrations | Scripts in `src/electron/migrate*.ts`; run against existing production DBs when upgrading |
| `npm run dist:win` | Build Windows installer | `electron-builder --win --x64` |

No test runner is configured in this repo.

**Typical workflow:** `npm run dev` for UI iteration → `npm run build` + `npm run dev:electron` to verify inside the desktop app.

**MongoDB:** Requires a local instance at `mongodb://localhost:27017/agenda` (override with the `MONGODB_URI` env var) (see [MONGODB_SETUP.md](MONGODB_SETUP.md)). Seed with `npm run seed:db`.

## Architecture

### Three-layer stack
1. **React UI** (`src/ui/`) – HashRouter pages (Agenda, Clientes, Estilistas, Servicios, Productos, Gastos, Reportes)
2. **Electron IPC bridge** ([src/electron/preload.ts](src/electron/preload.ts)) – `contextBridge` exposing `window.api.*()` methods
3. **Electron main + MongoDB** ([src/electron/main.ts](src/electron/main.ts)) – `ipcMain.handle()` handlers + Mongoose models in `src/electron/models/`

**Data flow:** React component → Context → `window.api.addCliente(data)` → `ipcMain.handle('add-cliente')` → `Cliente.save()` → MongoDB. Contexts load data from MongoDB on mount and update local state after successful mutations (e.g. `await window.api.addCliente(data)` → `setDataTable([...newData])`).

**Mongoose models:** `src/electron/models/{Cliente,Estilista,Servicio,Producto,Cita,Gasto,Nota,Feriado,Bloqueo}.ts` use a numeric `id` field (not MongoDB `_id`) as the primary key. IPC handlers auto-increment it via `findOne().sort('-id')` + 1. `update-*` handlers strip `_id`/`__v` (via `sinCamposMongo`) before writing back. Sub-documents worth knowing: `Cita.propinas[]`, `Estilista.vacaciones[]` (`{inicio, fin}` in DD-MM-YYYY); `Bloqueo` is a separate collection keyed by `estilista` + `fecha` + `horaInicio`/`horaFin` (HH:mm). (Note: `Cita copy.ts` in that directory is a stray/unused duplicate — don't confuse it with `Cita.ts`.)

**IPC API surface** ([preload.ts](src/electron/preload.ts)): each entity generally follows `get{Entity}s`, `add{Entity}`, `update{Entity}`, `delete{Entity}(id)`, plus entity-specific queries (e.g. `getCitasByFecha(fecha)`, `getCitasByFechaClienteId(fecha, clienteId)`, `getGastosByCategoria(categoria)`, `getGastosTotals()`, `getProductoById(id)`, `decrementProductoStock(id, cantidad)`, `getNotasByFecha(fecha)`, `getFeriadosByAnio(anio)`, `getBloqueosByFecha(fecha)`). Clients are linked to citas by numeric `clienteId`, not by name.

### Provider nesting order ([App.tsx](src/ui/App.tsx))
```
ThemeProvider (src/ui/theme/theme)
  └─ HashRouter
      └─ SnackbarProvider (notistack; maxSnack=3, 3s auto-hide)
          └─ SideBarContextProvider (sidebar expand/collapse)
              └─ FeriadosCtxProvider (holidays)
                  └─ AgendaContextProvider (appointments, dates, booking, estilistas, bloqueos)
                      └─ NotasCtxProvider (agenda notes panel)
                          └─ MenuAppBar, SideBar, Home (routes → pages)
```

### Contexts (state management)

| Context | File | Scope |
|---------|------|-------|
| **AgendaContext** | [src/ui/contexts/AgendaContext.tsx](src/ui/contexts/AgendaContext.tsx) | Global — current `fecha`, `citas`, in-progress `cita`; `addServiceToCita()`, `removeServiceFromCita()`, `updateService()`, `updateDuracion()`, `guardarCita()`, `handleEditCita()`, `guardarProductosCita()`, `addBloqueo()`/`removeBloqueo()`, `estilistas` |
| **FeriadosCtx** | [src/ui/contexts/FeriadosCtx.tsx](src/ui/contexts/FeriadosCtx.tsx) | Global — holidays by year |
| **NotasCtx** | [src/ui/contexts/NotasCtx.tsx](src/ui/contexts/NotasCtx.tsx) | Global — agenda notes; `isNotasOpen` toggles `panels/NotasPanel` beside the Agenda table |
| **EstilistaContext** | [src/ui/contexts/EstilistaContext.tsx](src/ui/contexts/EstilistaContext.tsx) | Page-level — `addEstilista()`, `editEstilista()`, `removeEstilista()`, `handleAlert()` |
| **ClientesContext** | [src/ui/contexts/ClientesCtx.tsx](src/ui/contexts/ClientesCtx.tsx) | Page-level — `addCliente()`, `editCliente()`, `removeCliente()`, `handleAlert()` |
| **ProductosCtx** | [src/ui/contexts/ProductosCtx.tsx](src/ui/contexts/ProductosCtx.tsx) | Page-level — product CRUD + stock |
| **ServiciosContext** | [src/ui/contexts/ServiciosContext.tsx](src/ui/contexts/ServiciosContext.tsx) | Page-level — service CRUD |
| **GastosCtx** | [src/ui/contexts/GastosCtx.tsx](src/ui/contexts/GastosCtx.tsx) | Page-level — expense CRUD + totals |
| **SideBarContext** | [src/ui/contexts/SideBarContext.tsx](src/ui/contexts/SideBarContext.tsx) | Global — sidebar open/close state |

**Pattern:** Contexts use notistack's `enqueueSnackbar()` for user feedback. Call `handleAlert(message, alertType)` for consistent success/error/info/warning notifications.

### Scheduling rules
Overlap/availability logic lives in [src/ui/utils/utils.tsx](src/ui/utils/utils.tsx) and is used by AgendaContext: `getOccupiedRows()`, `seSobreponeConOtroServicio()`, `citaTieneServiciosSobrepuestos()`, `estaDeVacaciones()`, `getBloqueoOccupiedRows()`, `celdaEstaBloqueada()`. Reuse these rather than re-implementing time-slot math; grid rows map to fixed time slots from `getHrs()`/`getOfficeHours()`.

### Date handling ⚠️
- **Internal format:** `DD-MM-YYYY` (e.g. `"24-01-2026"`)
- **HTML `<input type="date">`:** requires `YYYY-MM-DD` — convert at the boundary
- **Utilities** in [src/ui/utils/utils.tsx](src/ui/utils/utils.tsx):
  - `formatDateToHTML("24-01-2026")` → `"2026-01-24"` (set input.value)
  - `formatDateFromHTML("2026-01-24")` → `"24-01-2026"` (read input onChange)
  - `getCurrentDate()` → `{dateObj, formattedDate: "DD-MM-YYYY", day, month, year}`
  - `getTargetDate(dateString)` → dayjs object from a `"DD-MM-YYYY"` string
- **Library:** dayjs with `objectSupport` + `customParseFormat` plugins

### Component file structure
```
src/ui/components/
  ├─ pages/           → Route containers (Agenda.tsx, Clientes.tsx, etc.)
  ├─ containers/      → Business logic wrappers (NuevaCitaContainer.tsx)
  ├─ tables/          → ag-grid tables (AgendaTable.tsx, ClientsTable.tsx)
  ├─ forms/           → Input forms (ClienteForm.tsx, ServiciosForm.tsx)
  ├─ modals/           → Dialog modals, grouped by domain (cita/, clientes/, gastos/, productos/, servicios/)
  ├─ Inputs/          → Reusable inputs (FechaInput.tsx, PhoneInput.tsx)
  ├─ CustomeCells/    → ag-grid renderers (CitaCell.tsx, CutomeCellRenderer.tsx)
  ├─ panels/          → Side panels (NotasPanel.tsx)
  ├─ cards/           → Card components (ClienteCard.tsx)
  └─ buttons/         → Button components (DeleteBtn.tsx, EditBtn.tsx)
```
**Note:** ag-grid cell renderers live in `CustomeCells/` (note the spelling: "Custome"/"Cutome", not "Custom").

### ag-grid patterns (AgendaTable.tsx)
- **Dynamic columns:** generated from the estilistas list
- **Cell spanning:** `spanRows: customSpanFunc` merges cells sharing the same `cellID` and `servicio`
- **Custom rendering:** `cellRenderer: CutomeCellRenderer` routes to `CitaCell`, `EmptyCell`, etc.
- **Cell data shape:** `{nombreCliente, telefonoCliente, servicio: {servicio, duracion, cellID, ...}}`

### Adding a new feature (entity CRUD)
1. **Mongoose model:** create schema in `src/electron/models/YourModel.ts` (numeric `id` field, not `_id`)
2. **IPC handlers:** add CRUD handlers in `src/electron/main.ts`:
   ```typescript
   ipcMain.handle('get-entities', async () => await YourModel.find().lean());
   ipcMain.handle('add-entity', async (_event, data) => { /* auto-increment id */ });
   ```
3. **Preload bridge:** expose in `src/electron/preload.ts`:
   ```typescript
   contextBridge.exposeInMainWorld('api', {
     getEntities: () => ipcRenderer.invoke('get-entities'),
     // ...
   });
   ```
4. **TypeScript types:** add interface in `src/ui/types/YourType.tsx`, extend `window.api` in `src/ui/electron.d.ts`
5. **Context:** create provider in `src/ui/contexts/YourContext.tsx` using async `window.api.*()` calls
6. **UI:** build components in `src/ui/components/{pages,forms,tables,modals}/`
7. **Routes:** add to [src/ui/components/pages/Home.tsx](src/ui/components/pages/Home.tsx) and link in `SideBar.tsx`
8. **Verify:** `npm run dev` for UI, then `npm run build` + `npm run dev:electron` for the desktop app

### TypeScript conventions
- **Strict mode:** `strict: true`, `noImplicitAny: true`, `strictNullChecks: true` — explicit types required. (`noUnusedLocals`/`noUnusedParameters` are off.)
- **Naming:** PascalCase components (`ClienteCard.tsx`), camelCase utilities (`utils.tsx`)
- **Domain terms:** kept in Spanish (Cita, Estilista, Servicio, Cliente, Gasto, Producto, Nota, Feriado, Bloqueo, Propina, Vacacion) — match this in new code
- **JSX mode:** `react-jsx` (no React import needed)
- **Type definitions:** centralized in `src/ui/types/` (Cita.tsx, Estilista.tsx, Producto.tsx, Servicio.tsx, ...)
- `src/electron/` has its own [tsconfig.json](src/electron/tsconfig.json) and is excluded from the root `tsconfig.json` (`src` only, `src/electron` excluded)

## Quick troubleshooting

| Issue | Root cause | Fix |
|-------|-----------|-----|
| Electron won't launch | Missing build | Run `npm run build` first |
| React HMR not working | Wrong dev command | Use `npm run dev` (not `dev:electron`) |
| Date displays wrong in tables | Format mismatch (DD-MM-YYYY vs YYYY-MM-DD) | Use `formatDateToHTML()`/`formatDateFromHTML()` at boundaries |
| Context hook throws error | Component outside provider wrapper | Check provider nesting in [App.tsx](src/ui/App.tsx) |
| ag-grid cells render empty | Missing renderer or bad data | Verify component exists in `CustomeCells/`; check cell data structure |
| Notification doesn't appear | Missing SnackbarProvider | Ensure component is wrapped by `SnackbarProvider` (in [App.tsx](src/ui/App.tsx)) |
