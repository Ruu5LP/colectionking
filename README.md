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

2. Start the Docker containers:
```bash
docker-compose up -d
```

3. Access the application:
- **Frontend**: http://localhost:8080
- **API**: http://localhost:8080/api/*

## Development

The Vite dev server runs in the background and provides hot module replacement (HMR) for instant updates when you modify React components.

### File Structure

```
.
├── docker/
│   ├── php/
│   │   ├── Dockerfile
│   │   └── php.ini
│   └── nginx/
│       └── default.conf
├── resources/
│   ├── css/
│   │   └── app.css
│   ├── js/
│   │   ├── app.tsx          # React entry point
│   │   ├── App.tsx          # Main React component
│   │   ├── pages/           # React pages
│   │   └── components/      # React components
│   └── views/
│       └── app.blade.php    # Laravel blade template
├── routes/
│   ├── web.php              # Returns React app for all routes
│   └── api.php              # API endpoints
└── docker-compose.yml
```

## Services

- **app**: PHP-FPM container for Laravel
- **nginx**: Nginx web server (port 8080)
- **mysql**: MySQL database (port 3306)
- **vite**: Vite dev server for React HMR (port 5173)

## Stopping the Application

```bash
docker-compose down
```

## License

Open-source software.
