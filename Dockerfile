# Production Dockerfile
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lockb* ./
COPY prisma ./prisma
RUN bun install

# Build application
FROM base AS builder
COPY package.json bun.lockb* ./
COPY prisma ./prisma
RUN bun install
COPY . .

# Run setup scripts and build
RUN bun run setup-images
RUN bun run build

# Production image
FROM oven/bun:1-slim AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=8080

# Copy necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=deps /app/node_modules ./node_modules

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD bun --version || exit 1

# Start the application
CMD ["bun", "run", "start"]
