# Copilot Instructions for Agenda Repository

## Project Overview
**Status Salon Agenda** is a desktop salon management app: Electron (desktop) + React/TypeScript (UI) + MongoDB (persistence). Manages appointments (citas), clients, stylists (estilistas), services, and products. Key constraint: all date strings are `DD-MM-YYYY` internally; HTML inputs expect `YYYY-MM-DD`.

**Critical Path:** Edit React code in `src/ui/`, Electron in `src/electron/`, models in `src/models/`. Always compile before running Electron: `npm run build`.

## Build & Development Workflow

| Command | Purpose | Output |
|---------|---------|--------|
| `npm run dev` | Vite dev server (React only, HMR at port 5173) | Rebuilds React on save |
| `npm run dev:electron` | Launch desktop app | Requires `dist-react/` + `dist-electron/` compiled |
| `npm run transpile:electron` | Compile Electron TypeScript only (fast) | `dist-electron/` |
| `npm run build` | Full production build | `dist-react/` + `dist-electron/` (both compiled) |
| `npm run lint` | Check TypeScript + ESLint | Fails on unused disable directives |

**Pre-Electron Checklist:** `npm run build` must succeed. MongoDB must be running on `localhost:27017`.

## Architecture: Three Layers

### React UI Layer (`src/ui/`)
**Router-based pages:** Agenda, Clientes, Estilistas, Servicios, Productos, Reportes (defined in `Home.tsx`, uses HashRouter with `basename="/"`).

**Component structure:**
- `pages/` – Route-level containers
- `containers/` – Business logic wrappers (NuevaCitaContainer, etc.)
- `components/{tables,forms,modals,Inputs,cards}/` – Reusable UI pieces
- `CustomeCells/` – ag-grid cell renderers (note: typo "Cutome" in codebase)

**Styling:** Material-UI (MUI Grid, Paper, Box) + emotion + local CSS. Notifications via notistack (3s auto-hide).

### State Management: React Context
**Global providers** (wrap app in `App.tsx`):
1. **AgendaContext** ([src/ui/contexts/AgendaContext.tsx](src/ui/contexts/AgendaContext.tsx)) – Appointments, current date, booking mode
   - Hook: `useAgendaContext()` (throws if used outside provider)
   - Types: `Cita` (appointment), `Servicio` (service line-item), `Cliente` (name + phone)
   - Data flow: Mock data in development from `globalData.tsx`; migrations to DB pending
2. **SideBarContext** – Navigation sidebar state

**Page-level providers:**
- **EstilistaContext** ([src/ui/contexts/EstilistaContext.tsx](src/ui/contexts/EstilistaContext.tsx)) – Wrapped in Estilistas.tsx page only; manages stylists CRUD
  - Hook: `useEstilistasCtx()` (note: export typo, called `useEstilistasCtx` but context is `ClientesContext`)
- **ClientesCtx** – Wrapped inside Clientes/Estilistas pages; manages client editing state
  - Provider: `ClientexCtxProvider` (note spelling typo in codebase)

**Pattern:** Dispatch updates via context setters (e.g., `setAgendaData()`, `addCita()`) → re-renders subscribers.

### Electron + Database Layer
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

### Date Handling (Critical)
- **Internal format:** All date strings are `DD-MM-YYYY` (e.g., `"24-01-2026"`)
- **HTML input format:** HTML `<input type="date">` expects `YYYY-MM-DD` (reverse)
- **Utility functions** ([src/ui/utils/utils.tsx](src/ui/utils/utils.tsx)):
  - `formatDateToHTML(ddmmyyyy)` → `YYYY-MM-DD` (for input value)
  - `formatDateFromHTML(yyyymmdd)` → `DD-MM-YYYY` (from input)
  - `getCurrentDate()` → `{ formattedDate: 'DD-MM-YYYY', ... }`
- **Library:** dayjs with `objectSupport` + `customParseFormat` plugins
- **Gotcha:** ag-grid agenda display uses `getHrs()` utility; mixing date formats causes silent failures

### Component Patterns
| Task | Template |
|------|----------|
| **New context hook** | Wrap `useContext()` + throw if null (see `useAgendaContext()`) |
| **Input field** | Extend [src/ui/components/Inputs/FechaInput.tsx](src/ui/components/Inputs/FechaInput.tsx) pattern |
| **ag-grid cell renderer** | Extend [src/ui/components/CustomeCells/CutomeCellRenderer.tsx](src/ui/components/CustomeCells/CutomeCellRenderer.tsx) (receives rowData + params) |
| **Form submission** | Use context dispatcher + `window.api.method()` call, then update context on response |
| **New page** | Add `.tsx` to `pages/`, define route in `Home.tsx` router, add sidebar link in `SideBar.tsx` |

### TypeScript & Linting
- **Strict mode enabled** – explicit types required; `noImplicitAny: true`, `strictNullChecks: true`
- **File naming:** PascalCase for components (`ClienteCard.tsx`), camelCase for utilities (`utils.tsx`)
- **Spanish naming:** Domain terms (Cita, Estilista, Servicio) stay in Spanish; maintain consistency
- **JSX:** `react-jsx` mode (no React import needed)

## Adding a New Feature (Workflow)

1. **DB Model:** Add Mongoose schema in `src/models/` (or extend CitaModel)
2. **IPC Handler:** Register `ipcMain.handle('db:newFeature')` in [src/electron/main.ts](src/electron/main.ts) + expose in contextBridge
3. **Context:** Create provider in `src/ui/contexts/` if cross-component state needed
4. **UI Components:** Build in `src/ui/components/{pages,containers,forms,tables}/`
5. **Route:** Add to router in `Home.tsx`, sidebar link in `SideBar.tsx`
6. **Test:** `npm run build` → `npm run dev:electron`

## Quick Development Tips

- **React-only iteration:** Use `npm run dev` to iterate on React UI without recompiling Electron (HMR on port 5173)
- **Fast Electron recompile:** `npm run transpile:electron` rebuilds only TypeScript in `src/electron/`, skip full build
- **Check what changed:** Git-aware developers can use `git diff` to verify only intended files modified
- **Inspect IPC calls:** Browser DevTools (Ctrl+Shift+I in Electron window) → Console shows `window.api` method calls and responses
- **Notification debugging:** If notifications don't show, ensure component is inside `<SnackbarProvider>` (it's in App.tsx, so should always work)
- **ag-grid debugging:** Inspect ag-grid columnDefs in React DevTools; check CustomeCells component rendering with getHighlightTemplate

## Integration Points

| Dependency | Notes |
|------------|-------|
| **MongoDB** | Must run on `localhost:27017` before electron launch; auto-connects via [src/database.tsx](src/database.tsx) |
| **AG Grid** | Complex table rendering (AgendaTable with dynamic columns per estilista); custom spanRows logic merges cells |
| **Notistack** | Notification display; configured for maxSnack=3, 3s auto-hide in App.tsx |
| **React Router** | HashRouter with basename="/"; hash-based routing for Electron compatibility |
| **Dayjs** | All date manipulation; plugins required (objectSupport, customParseFormat) |

## Troubleshooting Common Issues

| Problem | Solution |
|---------|----------|
| **Electron won't launch** | Run `npm run build` first. Verify MongoDB is running on `localhost:27017`. Check dist-react/ and dist-electron/ exist. |
| **React HMR not working** | Use `npm run dev` for Vite dev server (port 5173), not `npm run dev:electron`. Changes to React auto-rebuild. |
| **Appointment data missing** | Ensure MongoDB is running. Check browser DevTools → Network tab for failed IPC calls. Verify Appointment model is imported in main.ts. |
| **Date displays wrong in ag-grid** | Likely date format mismatch. All internal dates must be `DD-MM-YYYY`. Use `formatDateToHTML()` when setting HTML input values. |
| **Context hook throws "must be used within provider"** | Check that component is wrapped by the correct provider. Global contexts wrap in App.tsx; EstilistaContext/ClientesCtx wrap page components. |
| **ag-grid cells not rendering** | Check CustomeCells directory. Ensure cellRendererSelector returns a valid component or null (empty cells render as EmptyCell). |
| **Lint fails with unused directives** | Run `npm run lint` to see which disable comments are unnecessary. ESLint strict mode rejects unused `// eslint-disable` lines. |

## Known Limitations & Migration Tasks

- **Mock data:** Estilistas, Servicios, Productos still use `globalData.tsx` arrays; not yet backed by MongoDB
- **Appointment model:** Only Cita type has DB persistence; Cliente/Servicio need schema expansion
- **Context complexity:** AgendaContext manages many concerns; future refactor could split (e.g., ServiceContext, BookingContext)