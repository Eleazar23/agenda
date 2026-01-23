# MongoDB Quick Start Guide

## Prerequisites
✅ MongoDB Community Server installed and running on `localhost:27017`

## Setup Steps

### 1. Install Dependencies (if needed)
```bash
npm install
```

### 2. Seed the Database
```bash
npm run seed:db
```

**Expected output:**
```
Connected to MongoDB for seeding...
Cleared existing data
Seeded 4 clientes
Seeded 6 servicios
Seeded 5 estilistas
Seeded 5 productos
Database seeded successfully!
```

### 3. Build the Application
```bash
npm run build
```

This compiles both React (Vite) and Electron (TypeScript).

### 4. Launch Desktop App
```bash
npm run dev:electron
```

## Verify MongoDB Data

```bash
mongosh
use agenda
db.clientes.find()
db.servicios.find()
db.estilistas.find()
db.productos.find()
db.citas.find()
```

## Development Workflow

**UI Development (Hot Reload):**
```bash
npm run dev
```
Open http://localhost:5173 - Changes auto-reload

**Full Desktop App Testing:**
```bash
npm run build
npm run dev:electron
```

## Troubleshooting

### MongoDB Not Running (Windows)
```bash
# Start MongoDB service
net start MongoDB

# Or start manually
mongod
```

### "window.api is undefined" Error
1. Rebuild Electron:
   ```bash
   npm run transpile:electron
   npm run dev:electron
   ```

2. Verify `dist-electron/preload.js` exists

### Data Not Persisting
- Check MongoDB is running: `mongosh`
- Check browser console for IPC errors
- Re-seed database: `npm run seed:db`

## Next Steps

1. **Create your first appointment** - Go to Agenda page
2. **Add a client** - Go to Clientes page  
3. **Manage stylists** - Go to Estilistas page
4. **View reports** - Go to Reportes page

All data now persists between app restarts! 🎉

## Documentation
- Full setup: [MONGODB_SETUP.md](MONGODB_SETUP.md)
- Implementation details: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
