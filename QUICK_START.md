# 🚀 Quick Start Guide

## One-Command Setup

```bash
# 1. Copy environment file (optional - will be created automatically if missing)
cp .env.docker .env

# 2. Start all services (APP_KEY will be generated automatically)
docker compose up -d

# 3. Run database migrations
docker compose exec app php artisan migrate

# 4. Seed the database with initial data
docker compose exec app php artisan db:seed
# Creates: 10 leaders, 30 cards (20 normal + 10 special), 3 sample decks

# 5. Open your browser
open http://localhost:8080
```

## What You'll See

After starting the services, you'll have:

- **Frontend**: React SPA at http://localhost:8080
- **API**: RESTful endpoints at http://localhost:8080/api/*
- **Database**: MySQL running on port 3306
- **Hot Reload**: Automatic page updates when editing React files

**Note**: The application encryption key (APP_KEY) is automatically generated on first startup if missing.

## Testing the Setup

### 1. Test Frontend
```bash
# Should show React Home page
curl http://localhost:8080
```

### 2. Test API
```bash
# Should return JSON
curl http://localhost:8080/api/status
curl http://localhost:8080/api/user
```

### 3. Test Hot Reload
1. Open http://localhost:8080 in browser
2. Edit `resources/js/pages/Home.tsx`
3. Save the file
4. Browser should update automatically (no refresh needed)

## View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f app
docker compose logs -f nginx
docker compose logs -f vite
docker compose logs -f mysql
```

## Stopping

```bash
docker compose down
```

## Troubleshooting

### Port 8080 Already in Use
Edit `docker-compose.yml`:
```yaml
nginx:
  ports:
    - "8081:80"  # Change 8080 to any available port
```

### MySQL Not Ready
Wait a few seconds for MySQL to fully start:
```bash
docker compose logs mysql | grep "ready for connections"
```

### Vite Not Running
Check Vite logs:
```bash
docker compose logs vite
```

## File Locations

- **Frontend Code**: `resources/js/`
- **API Routes**: `routes/api.php`
- **Web Routes**: `routes/web.php`
- **Blade Template**: `resources/views/app.blade.php`
- **Docker Config**: `docker-compose.yml`
- **Nginx Config**: `docker/nginx/default.conf`

## Development Workflow

1. **Frontend Changes**: Edit files in `resources/js/` - changes appear immediately
2. **Backend Changes**: Edit Laravel files - may need to restart container
3. **Route Changes**: Edit `routes/` files - restart container
4. **Config Changes**: Edit `.env` - restart container

```bash
# Restart specific service
docker compose restart app
docker compose restart vite
```

## Production Build

```bash
# Build optimized assets
npm run build

# Update docker-compose.yml to remove vite service
# Assets will be served from public/build/
```

## Health Checks

```bash
# Laravel health endpoint
curl http://localhost:8080/up

# Check all containers
docker compose ps

# Expected output: All services "Up"
```

## Need Help?

1. Check [README.md](README.md) for detailed documentation
2. Check [ARCHITECTURE.md](ARCHITECTURE.md) for system design
3. Check [SETUP_VERIFICATION.md](SETUP_VERIFICATION.md) for troubleshooting
4. Check container logs: `docker compose logs -f`

---

**That's it!** You now have a fully functional monolithic web application. 🎉
