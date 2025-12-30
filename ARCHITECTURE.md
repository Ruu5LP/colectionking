# Architecture Overview

## Request Flow

```
Browser (http://localhost:8080)
    |
    v
Nginx Container (Port 8080)
    |
    |-- Path: /                    --> PHP-FPM (Laravel) --> Returns app.blade.php (React SPA)
    |-- Path: /api/*               --> PHP-FPM (Laravel) --> Returns JSON
    |-- Path: /@vite/*             --> Vite Dev Server   --> HMR WebSocket
    |-- Path: /resources/*         --> Vite Dev Server   --> Hot Module Replacement
    |
    v
Response to Browser
```

## Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (localhost:8080)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         React SPA (TypeScript + React Router)         │   │
│  │  - Client-side routing                                │   │
│  │  - Fetches data from /api/*                          │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     │ HTTP Requests
                     │
┌────────────────────┼─────────────────────────────────────────┐
│                    │        Nginx (Port 80 → 8080)           │
│  ┌─────────────────┼──────────────────────┐                 │
│  │  Routing Logic  │                      │                 │
│  │  • /          → │ PHP-FPM              │                 │
│  │  • /api/*     → │ PHP-FPM              │                 │
│  │  • /@vite     → │ Vite (Port 5173)     │                 │
│  │  • /resources → │ Vite (Port 5173)     │                 │
│  └─────────────────┼──────────────────────┘                 │
└────────────────────┼─────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        v                         v
┌───────────────────┐    ┌───────────────────┐
│  PHP-FPM (app)    │    │  Vite Dev Server  │
│  Port: 9000       │    │  Port: 5173       │
│  ┌─────────────┐  │    │  ┌─────────────┐  │
│  │  Laravel 11 │  │    │  │ HMR/WS      │  │
│  │  - Routes   │  │    │  │ React Build │  │
│  │  - API      │  │    │  └─────────────┘  │
│  │  - SPA View │  │    └───────────────────┘
│  └─────────────┘  │
│         │         │
└─────────┼─────────┘
          │
          v
┌─────────────────────┐
│  MySQL (mysql)      │
│  Port: 3306         │
│  Database:          │
│  colectionking      │
└─────────────────────┘
```

## Key Features

### 1. Single Domain Architecture
- Everything accessible through `http://localhost:8080`
- No CORS configuration needed
- Frontend and backend share the same origin

### 2. SPA (Single Page Application) Mode
- Laravel serves `app.blade.php` for all non-API routes
- React Router handles all navigation client-side
- No page reloads on navigation

### 3. API Integration
- API routes defined in `routes/api.php`
- Accessible at `/api/*`
- Same domain as frontend (no CORS)

### 4. Development Workflow
- Vite dev server provides Hot Module Replacement (HMR)
- Changes to React components reload instantly
- Nginx proxies Vite HMR endpoints to enable hot reload
- Laravel routes and API changes require container restart

### 5. Vite Integration
- Nginx proxies these paths to Vite:
  - `/@vite/*` - Vite's internal HMR protocol
  - `/resources/*` - Asset hot reloading
- In production, built assets are served directly from `public/build/`

## Production vs Development

### Development Mode
- Vite container runs `npm run dev`
- Nginx proxies Vite requests to port 5173
- Hot Module Replacement enabled
- Source maps available

### Production Mode
- Run `npm run build` to compile assets
- Assets placed in `public/build/`
- Remove Vite service from docker-compose.yml
- Nginx serves static assets directly
- No HMR, smaller bundle size

## File Locations

### Docker Configuration
- `docker-compose.yml` - Services definition
- `docker/php/Dockerfile` - PHP-FPM image
- `docker/nginx/default.conf` - Nginx routing

### Laravel Backend
- `routes/web.php` - SPA catch-all route
- `routes/api.php` - API endpoints
- `resources/views/app.blade.php` - HTML template

### React Frontend
- `resources/js/app.tsx` - React entry point
- `resources/js/AppRoot.tsx` - Main app component
- `resources/js/pages/` - Page components
- `resources/js/components/` - Reusable components

### Build Configuration
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration

## Environment Variables

### Docker Environment
- `DB_HOST=mysql` - Points to MySQL container
- `DB_DATABASE=colectionking`
- `DB_USERNAME=colectionking`
- `DB_PASSWORD=password`
- `APP_URL=http://localhost:8080`

### Vite Environment
- Automatically picks up `APP_NAME` from `.env`
- Can access env vars prefixed with `VITE_`
