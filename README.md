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

5. Seed the database with initial data:
```bash
docker compose exec app php artisan db:seed
```

This will create:
- A test user (email: test@example.com, password: password)
- 10 cards with element attributes from cards.json

6. Grant all cards to the test user:
```bash
docker compose exec app php artisan cards:grant-all --email=test@example.com
```

7. Access the application:
- **Frontend**: http://localhost:8080
- **API**: http://localhost:8080/api/*

## Card Management

### Adding New Cards

Cards are managed through JSON configuration in `database/seed_data/cards.json`. To add new cards:

1. Edit `database/seed_data/cards.json` and add your card data:

```json
{
  "id": "C011",
  "name": "新しいカード",
  "hp": 1300,
  "atk": 310,
  "def": 210,
  "rarity": 4,
  "description": "カードの説明",
  "image_url": null,
  "elements": [
    {"element":"fire","base":15,"cap":70},
    {"element":"water","base":5,"cap":40},
    {"element":"wind","base":8,"cap":50},
    {"element":"earth","base":0,"cap":20},
    {"element":"mech","base":0,"cap":30}
  ]
}
```

Card properties:
- `id`: Unique card ID (e.g., "C001", "C002", etc.)
- `name`: Card name
- `hp`, `atk`, `def`: Card stats
- `rarity`: 1-6 (displayed as stars ★)
- `description`: Optional card description
- `image_url`: Optional image URL
- `elements`: Array of 5 elements (fire/water/wind/earth/mech) with:
  - `base`: Initial value (0-100)
  - `cap`: Maximum value (0-100)

2. Run the seeder to update the database:

```bash
docker compose exec app php artisan db:seed --class=CardsJsonSeeder
```

The seeder uses `updateOrCreate`, so you can safely run it multiple times. Existing cards will be updated, and new cards will be added.

3. Grant new cards to test users:

```bash
docker compose exec app php artisan cards:grant-all --email=test@example.com
```


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
