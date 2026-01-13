# Production Dockerfile
FROM oven/bun:1 AS builder
WORKDIR /app

# Copy dependency files
COPY package.json bun.lockb* ./
COPY prisma ./prisma

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Generate Prisma client, setup images and build
RUN bun run db:generate
RUN bun run setup-images
RUN bun run build

# Production image
FROM oven/bun:1-slim AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=8080

# Copy necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lockb* ./
COPY server.mjs ./

# Install minimal production dependencies (Prisma client needed for runtime)
RUN bun install --production --ignore-scripts

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD bun --version || exit 1

# Serve the built application using bun
CMD ["bun", "run", "server.mjs"]
