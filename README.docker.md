# Docker Setup for Imlil Atlas Roots

This project includes Docker and Docker Compose configurations for easy deployment and development.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## Quick Start

### Production Mode

Run the application in production mode:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

The application will be available at:
- **Application**: http://localhost:8080
- **MongoDB**: localhost:27017

### Development Mode

Run the application in development mode with hot-reload:

```bash
# Start development services
docker-compose --profile dev up -d

# View logs
docker-compose --profile dev logs -f app-dev

# Stop services
docker-compose --profile dev down
```

The development server will be available at:
- **Application**: http://localhost:5173
- **MongoDB**: localhost:27017

### Database Management with Prisma Studio

Access Prisma Studio to manage your database:

```bash
# Start Prisma Studio
docker-compose --profile studio up -d prisma-studio

# Access at http://localhost:5555
```

## Services

### MongoDB
- **Port**: 27017
- **Username**: admin
- **Password**: admin123
- **Database**: imlil_atlas

### Application (Production)
- **Port**: 8080
- **Build**: Multi-stage optimized build
- **Auto-migrations**: Prisma migrations run on startup

### Application (Development)
- **Port**: 5173
- **Hot-reload**: Enabled
- **Volume mounting**: Source code mounted for live updates

### Prisma Studio
- **Port**: 5555
- **Purpose**: Database management UI

## Useful Commands

```bash
# Build without cache
docker-compose build --no-cache

# View running containers
docker-compose ps

# Execute commands in container
docker-compose exec app bun run db:studio

# View application logs
docker-compose logs -f app

# Restart a service
docker-compose restart app

# Remove all containers and volumes
docker-compose down -v

# Run all profiles (dev + studio)
docker-compose --profile dev --profile studio up -d
```

## Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```env
DATABASE_URL="mongodb://admin:admin123@mongodb:27017/imlil_atlas?authSource=admin"
NODE_ENV=production
PORT=8080
```

## Database Access

### Connect to MongoDB from Host

```bash
mongosh "mongodb://admin:admin123@localhost:27017/imlil_atlas?authSource=admin"
```

### Connect to MongoDB from Container

```bash
docker-compose exec mongodb mongosh -u admin -p admin123
```

## Troubleshooting

### Port Already in Use

If ports 8080, 5173, or 27017 are already in use, modify the ports in `docker-compose.yml`:

```yaml
ports:
  - "8081:8080"  # Change host port
```

### Database Connection Issues

1. Check MongoDB is healthy:
```bash
docker-compose ps
docker-compose logs mongodb
```

2. Verify connection string in `.env` file

### Rebuild After Changes

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Production Deployment

For production deployment:

1. Update environment variables
2. Change MongoDB credentials
3. Use proper secrets management
4. Enable SSL/TLS for MongoDB
5. Configure reverse proxy (nginx/traefik)

```bash
# Production build
docker-compose -f docker-compose.yml up -d --build
```

## Security Notes

⚠️ **Important**: The default MongoDB credentials are for development only. Always use strong passwords in production and consider:

- Using Docker secrets
- Enabling MongoDB authentication
- Restricting network access
- Using environment-specific configurations
- Implementing backup strategies

## Data Persistence

MongoDB data is persisted in Docker volumes:
- `mongodb_data`: Database files
- `mongodb_config`: Configuration files

To backup data:
```bash
docker-compose exec mongodb mongodump --out /backup
```

## Support

For issues or questions, please refer to the main README.md or create an issue in the repository.
