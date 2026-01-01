# colectionking

A monolithic web application built with Docker + Laravel + Nginx + MySQL + Vite (React + TypeScript).

## Architecture

- **Single Domain**: Access everything through `http://localhost:8080`
- **No CORS Required**: Frontend and backend run on the same domain
- **SPA Mode**: Laravel serves the React app for all routes, React Router handles navigation
- **API Routes**: Backend API available at `/api/*`

## Technology Stack

- **Backend**: Laravel 11 (PHP 8.3)
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite 6 with HMR (Hot Module Replacement)
- **Database**: MySQL 8.0
- **Web Server**: Nginx
  - Proxies `/` to Laravel (PHP-FPM)
  - Proxies `/@vite` and `/resources` to Vite dev server
- **Containerization**: Docker & Docker Compose

## Prerequisites

- Docker
- Docker Compose

## Setup & Installation

1. Clone the repository:
```bash
git clone https://github.com/Ruu5LP/colectionking.git
cd colectionking
```

2. Copy the Docker environment file (optional - will be created automatically):
```bash
cp .env.docker .env
```

3. Start the Docker containers:
```bash
docker compose up -d
```

**Note**: The application encryption key (APP_KEY) is automatically generated on first startup if missing.

4. Run database migrations (inside Docker):
```bash
docker compose exec app php artisan migrate
```

6. Access the application:
- **Frontend**: http://localhost:8080
- **API**: http://localhost:8080/api/*

## Development

The Vite dev server runs in the background and provides hot module replacement (HMR) for instant updates when you modify React components.

### Useful Commands

```bash
# View logs
docker compose logs -f

# Stop containers
docker compose down

# Restart containers
docker compose restart

# Access PHP container shell
docker compose exec app bash

# Run artisan commands
docker compose exec app php artisan <command>

# Run npm commands (from host or vite container)
npm run dev     # Development mode with HMR
npm run build   # Production build

# TypeScript type checking
npx tsc --noEmit
```

### File Structure

```
.
├── docker/
│   ├── php/
│   │   ├── Dockerfile       # PHP-FPM with extensions
│   │   └── php.ini          # PHP configuration
│   └── nginx/
│       └── default.conf     # Nginx routing configuration
├── resources/
│   ├── css/
│   │   └── app.css
│   ├── js/
│   │   ├── app.tsx          # React entry point
│   │   ├── AppRoot.tsx      # Main React component
│   │   ├── pages/           # React pages
│   │   └── components/      # React components
│   └── views/
│       └── app.blade.php    # Laravel blade template
├── routes/
│   ├── web.php              # Returns React app for all routes
│   └── api.php              # API endpoints
├── docker-compose.yml       # Docker services definition
├── vite.config.ts           # Vite configuration
└── tsconfig.json            # TypeScript configuration
```

## Services

- **app**: PHP-FPM container for Laravel (internal)
- **nginx**: Nginx web server (port 8080)
- **mysql**: MySQL database (port 3306)
- **vite**: Vite dev server for React HMR (port 5173)

## Nginx Routing

The Nginx configuration proxies requests as follows:

- `/` → Laravel (PHP-FPM) - All web routes return the React SPA
- `/@vite/*` → Vite dev server - Vite HMR endpoint
- `/resources/*` → Vite dev server - Asset hot reloading
- `/api/*` → Laravel (PHP-FPM) - API endpoints

This setup ensures:
1. Single domain access (no CORS issues)
2. Hot module replacement works seamlessly
3. Laravel serves the React app for all non-API routes
4. React Router handles client-side navigation

## Production Build

For production deployment:

1. Build the frontend assets:
```bash
npm run build
```

2. Update the docker-compose.yml to remove the Vite service (not needed in production)

3. Ensure `.env` has production settings:
```
APP_ENV=production
APP_DEBUG=false
```

## Troubleshooting

### Port Already in Use
If port 8080 is already in use, edit `docker-compose.yml` and change the nginx ports:
```yaml
ports:
  - "8081:80"  # Change 8080 to 8081 or another available port
```

### Database Connection Issues
Make sure the MySQL service is fully started before running migrations:
```bash
docker compose logs mysql  # Check if MySQL is ready
```

### Vite HMR Not Working
Ensure the Vite service is running:
```bash
docker compose logs vite
```

## License

Open-source software.
