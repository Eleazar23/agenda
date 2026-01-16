# Copilot Instructions for Agenda Repository

## Project Overview
**Status Salon Agenda** is a desktop salon management app: Electron (desktop) + React/TypeScript (UI) + MongoDB (persistence). Manages appointments (citas), clients, stylists (estilistas), services, and products. 

**Key Constraint:** All internal date strings are `DD-MM-YYYY`; HTML `<input type="date">` requires `YYYY-MM-DD` format conversion via `formatDateToHTML()` / `formatDateFromHTML()`.

**Critical Path:** 
- React UI code: `src/ui/` 
- Electron main process: `src/electron/main.ts` (IPC handlers, context bridge)
- Data models: `src/models/` (Mongoose schemas)
- Contexts: `src/ui/contexts/` (global state management)
- **Must run `npm run build` before launching Electron**

## Build & Development Workflow

| Command | Purpose | Notes |
|---------|---------|--------|
| `npm run dev` | Vite dev server (React only) | HMR at port 5173; fast iteration without Electron |
| `npm run build` | Full production compile | TypeScript + Vite build; outputs `dist-react/` + `dist-electron/` |
| `npm run transpile:electron` | Compile Electron TypeScript only | Fast recompile of `src/electron/` → `dist-electron/` |
| `npm run dev:electron` | Launch desktop app | Requires `npm run build` first; MongoDB must be running on `localhost:27017` |
| `npm run lint` | Check TypeScript + ESLint | Fails on unused `// eslint-disable` directives |

**Pre-Electron Launch Checklist:**
1. Run `npm run build` (full compile)
2. Verify MongoDB running: `mongod` on `localhost:27017`
3. Run `npm run dev:electron`

## Architecture: Three Layers

### React UI Layer (`src/ui/`)
**Router-based pages** (defined in [Home.tsx](Home.tsx), uses HashRouter with `basename="/"`):
- Agenda, Clientes, Estilistas, Servicios, Productos, Reportes
- Each wrapped in page-level context providers as needed

**Component tree structure:**
- `pages/` – Route containers (Agenda.tsx, Clientes.tsx, etc.)
- `containers/` – Business logic wrappers (NuevaCitaContainer, ClienteContainer)
- `components/{tables,forms,modals,Inputs,cards}/` – Reusable UI pieces
- `CustomeCells/` – ag-grid cell renderers (codebase spelling: "Cutome" instead of "Custom")

**Styling:** MUI (Grid, Paper, Box) + emotion CSS-in-JS + local `.css` files. **Notifications:** notistack with auto-hide 3s; components must be wrapped in `<SnackbarProvider>` (configured in [App.tsx](App.tsx)).
ping order in [App.tsx](App.tsx)):
```
<Router>
  <SnackbarProvider>
    <SideBarContextProvider>
      <AgendaContextProvider>
        <App /> ← all child pages access AgendaContext + SideBarContext
```

**Key Contexts:**
1. **AgendaContext** ([src/ui/contexts/AgendaContext.tsx](src/ui/contexts/AgendaContext.tsx#L57)) – Appointments, date, booking mode
   - Hook: `useAgendaContext()` (throws if outside provider)
   - Types: `Cita`, `Servicio`, `Cliente`, `Modal`, `AgendaData`
   - Dispatchers: `setAgendaData()`, `addCita()`, `addService()`, `removeService()`, `updateService()`, `updateDuracion()`
   - Data source: `globalData.citas` (mock) – **TODO:** migrate to MongoDB

2. **SideBarContext** – Controls navigation sidebar expand/collapse

3.Main entry:** [src/electron/main.ts](src/electron/main.ts)
- **IPC handlers** (defined via `ipcMain.handle()`):
  - `db:createAppointment(payload)` → `Appointment.create()`
  - `db:getAppointments()` → `Appointment.find().lean()`
  - `db:deleteAppointment(id)` → `Appointment.findByIdAndDelete()`
- **Context bridge:** Exposes `window.api.*` methods for secure React→Electron communication
- **Database setup:** [src/database.tsx](src/database.tsx) – Connects to `mongodb://localhost:27017/statusdb`
- **Models:** [src/models/](src/models/) – Mongoose schemas (only Appointment currently; Cliente/Servicio mock data)

**React → DB data flow:**
```typescript
// React component calls:
const result = await window.api.getAppointments();

// Under the hood:
// 1. React calls ipcRenderer.invoke('db:getAppointments')
// 2. Electron main receives IPC, calls Appointment.find().lean()
// 3. Returns data back to React
**File:** [src/electron/main.ts](src/electron/main.ts)
- **IPC handlers:** `db:createAppointment`, `db:getAppointments`, `db:deleteAppointment` → Mongoose Appointment model
- **Context bridge:** Exposes `window.api.createAppointment()`, etc. for React to call
- **Database:** [src/database.tsx](src/database.tsx) – MongoDB at `mongodb://localhost:27017/statusdb`
- **Models:** [src/models/CitaModel.tsx](src/models/CitaModel.tsx) defines Mongoose Appointment schema

**React → DB flow:**
```typescript
// In React component:
const result = await window.api.getAppointments();
// Internally: React invokes IPC → Electron main process → Mongoose → returns data
```

## Project-Specific Conventions

### Date Handling (Critical!)
- **Internal format:** `DD-MM-YYYY` (e.g., `"24-01-2026"`)
- **HTML input format:** `<input type="date">` requires `YYYY-MM-DD` (reverse)
- **Utility functions** in [src/ui/utils/utils.tsx](src/ui/utils/utils.tsx):
  - `formatDateToHTML("24-01-2026")` → `"2026-01-24"` (for setting input.value)
  - `formatDateFromHTML("2026-01-24")` → `"24-01-2026"` (from input onChange)
  - `getCurrentDate()` → `{ formattedDate: "DD-MM-YYYY", ... }`
- **Library:** dayjs with `objectSupport` + `customParseFormat` plugins
- **Watch out:** Mixing formats causes silent data loss in ag-grid; always convert at boundaries

### Component Patterns

| Task | File Template | Key Pattern |
|------|---------------|------------|
| **Create context hook** | [AgendaContext.tsx](src/ui/contexts/AgendaContext.tsx#L57) | Wrap `useContext()` + throw if null; export hook |
| **Date input field** | [FechaInput.tsx](src/ui/components/Inputs/FechaInput.tsx) | Use `formatDateToHTML()` for value, `formatDateFromHTML()` on change |
| **ag-grid cell renderer** | [CutomeCellRenderer.tsx](src/ui/components/CustomeCells/CutomeCellRenderer.tsx) | Receives `rowData` + `params`; return JSX or null |
| **Form submission** | [ClienteForm.tsx](src/ui/components/forms/ClienteForm.tsx) | Dispatch context → call `window.api.method()` → update context |
| **New page/route** | [Agenda.tsx](src/ui/components/pages/Agenda.tsx) | Add `.tsx` to `pages/`, add route in `Home.tsx`, add link in `SideBar.tsx` |

### TypeScript & Linting
- **Strict mode:** `noImplicitAny: true`, `strictNullChecks: true` – explicit types required
- **File naming:** PascalCase components (`ClienteCard.tsx`), camelCase utilities (`utils.tsx`)
- **Spanish naming:** Keep domain terms Spanish (Cita, Estilista, Servicio)
- **JSX:** `react-jsx` mode (no React import in files)
- **Unused disable directives:** `npm run lint` rejects `// eslint-disable` comments that aren't needed
## Adding a New Feature (Workflow)
Mongoose Model** – Add schema in `src/models/YourModel.tsx`
2. **IPC Handler** – Register `ipcMain.handle('db:yourFeature')` in [src/electron/main.ts](src/electron/main.ts#L17-L29), expose in `contextBridge.exposeInMainWorld()`
3. **React Context** (if cross-component state) – Create provider in `src/ui/contexts/YourContext.tsx`
4. **UI Components** – Build in `src/ui/components/{pages,containers,forms,tables}/`
5. **Route** – Add route to `Home.tsx`, sidebar link to `SideBar.tsx`
6. **Test:** `npm run build` → verify no errors → `npm run dev:electron`

**Example:** Adding a new table in Servicios page:
- Create `src/models/Servicio.tsx` (Mongoose schema)
- Add `ipcMain.handle('db:getServicios')` in `main.ts`
| Scenario | Solution |
|----------|----------|
| **React iteration only** | Use `npm run dev` (Vite + HMR on port 5173); no Electron recompile needed |
| **Fast Electron recompile** | `npm run transpile:electron` rebuilds only `src/electron/` → `dist-electron/` |
| **Verify what changed** | `git status` or `git diff` to catch unintended file edits |
| **Debug IPC calls** | Open DevTools in Electron window (Ctrl+Shift+I) → Console shows `window.api.*` calls |
| **Notification not showing** | Ensure component is inside `<SnackbarProvider>` (in App.tsx) and using notistack hook |
| **ag-grid cells empty** | Check [CustomeCells/](src/ui/components/CustomeCells/) for renderer; verify cellRendererSelector returns component or null |
| **TypeScript errors after edits** | Run `npm run lint` to check unused disable directives; may need `npm run build` |
Component | Purpose | Notes |
|-----------|---------|-------|
| **MongoDB** | Persistence | Must run on `localhost:27017` before Electron launch. Auto-connects via [src/database.tsx](src/database.tsx) |
| **ag-grid** | Table rendering | Advanced: dynamic columns per estilista, custom spanRows for merged cells |
| **notistack** | Notifications | maxSnack=3, auto-hide 3s. Must be wrapped in `<SnackbarProvider>` in [App.tsx](src/ui/App.tsx#L10) |
| **React Router** | Navigation | HashRouter with basename="/"; hash-based for Electron compatibility |
| **Dayjs** | Date utilities | All date math; requires objectSupport + customParseFormat plugins |
| **MUI** | UI components | Grid, Paper, Box for layout; emotion for styled componentss component rendering with getHighlightTemplate

## Integration Points

| Dependency | Notes |
|------------|-------|
| **MongoDB** | Must run on `localhost:27017` before electron launch; auto-connects via [src/database.tsx](src/database.tsx) |
| **AG Grid** | Complex table rendering (AgendaTable with dynamic columns per estilista); custom spanRows logic merges cells |
| **Notistack** | Notification display; configured for maxSnack=3, 3s auto-hide in App.tsx |
| **React Router** | HashRouter with basename="/"; hash-based routing for Electron compatibility |
| **Dayjs** Root Cause | Solution |
|---------|-----------|----------|
| **Electron won't launch** | Missing/stale build or MongoDB offline | Run `npm run build` first. Verify MongoDB running: `mongod` on localhost:27017 |
| **React HMR not working** | Running wrong dev command | Use `npm run dev` (not dev:electron) for Vite dev server |
| **Appointment data missing** | Database offline or IPC handler broken | Check MongoDB connection string in [database.tsx](src/database.tsx). Verify IPC handlers registered in [main.ts](src/electron/main.ts#L17-L29) |
| **Dates display wrong in ag-grid** | Internal format `DD-MM-YYYY` vs `YYYY-MM-DD` mismatch | Always convert at boundaries using `formatDateToHTML()` / `formatDateFromHTML()` |
| **Context hook throws "must be used within provider"** | Component outside provider wrapper | Check provider wrapping order in [App.tsx](src/ui/App.tsx#L12-L19); page-level contexts wrap at page level, not globally |
| **ag-grid cells render empty** | Missing or broken renderer | Verify [CustomeCells/](src/ui/components/CustomeCells/) component exists; cellRendererSelector must return component or `null` |
| **Lint fails with unused directives** | Stale `// eslint-disable` comments | Run `npm run lint --fix` or manually remove unused disable comments|
| **Date displays wrong in ag-grid** | Likely date format mismatch. All internal dates must be `DD-MM-YYYY`. Use `formatDateToHTML()` when setting HTML input values. |
| **Context hook throws "must be used within provider"** | Check that component is wrapped by the correct provider. Global contexts wrap in App.tsx; EstilistaContext/ClientesCtx wrap page components. |
| **ag-grid cells not rendering** | Check CustomeCells directory. Ensure cellRendererSelector returns a valid component or null (empty cells render as EmptyCell). |
**Current State (as of Jan 2026):**
- ✅ Appointments (Cita) – Full CRUD in MongoDB via IPC
- ⚠️ Stylists (Estilistas) – Mock data in [globalData.tsx](src/ui/mock/globalData.tsx); CRUD UI exists but not persisted
- ⚠️ Clients (Clientes) – Mock data; needs MongoDB schema + IPC handlers
- ⚠️ Services (Servicios) – Mock data; needs MongoDB schema + IPC handlers
- ⚠️ Products (Productos) – Mock data; needs MongoDB schema + IPC handlers

**TODO (Priority Order):**
1. Migrate Estilistas, Clientes, Servicios, Productos to MongoDB (create models in `src/models/`)
2. Add IPC handlers for each entity in `src/electron/main.ts`
3. Refactor AgendaContext – currently handles too many concerns; consider splitting into ServiceContext, BookingContext
4. Add input validation on client-side + server-side (Mongoose schema validation)
5. Add error handling for IPC failures (currently no try-catch in most handlers

- **Mock data:** Estilistas, Servicios, Productos still use `globalData.tsx` arrays; not yet backed by MongoDB
- **Appointment model:** Only Cita type has DB persistence; Cliente/Servicio need schema expansion
- **Context complexity:** AgendaContext manages many concerns; future refactor could split (e.g., ServiceContext, BookingContext)