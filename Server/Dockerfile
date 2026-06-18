# ─────────────────────────────────────────────────────
#  Huellas Server — Multi-stage Docker build
# ─────────────────────────────────────────────────────
#  Build context must be the monorepo root so that
#  the @huellas/shared workspace is available.
# ─────────────────────────────────────────────────────

# ─── Stage 1: Build ─────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Dummy DATABASE_URL for prisma generate (not used at runtime)
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# Copy root package files and workspace configs
COPY package.json package-lock.json ./
COPY Server/package.json ./Server/
COPY Shared/package.json ./Shared/

# Install ALL dependencies (including devDependencies for build)
RUN npm ci --workspaces

# Copy source code
COPY Shared/ ./Shared/
COPY Server/ ./Server/

# Build the shared package first (Server depends on it)
RUN npm --workspace @huellas/shared run build

# Generate Prisma client BEFORE TypeScript compilation
# (the generated client is needed for type imports)
RUN cd Server && npx prisma generate

# Build the server
RUN npm --workspace @huellas/server run build

# ─── Stage 2: Production ────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Dummy DATABASE_URL for prisma generate (overridden at runtime)
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# Install OpenSSL (needed by Prisma) and Prisma CLI for migrations
RUN apk add --no-cache openssl

# Copy root package files
COPY package.json package-lock.json ./
COPY Server/package.json ./Server/
COPY Shared/package.json ./Shared/

# Install production dependencies only
RUN npm ci --workspaces --omit=dev

# Copy built artifacts
COPY --from=builder /app/Shared/dist ./Shared/dist
COPY --from=builder /app/Server/dist ./Server/dist
COPY --from=builder /app/Server/prisma ./Server/prisma
COPY --from=builder /app/Server/prisma.config.ts ./Server/prisma.config.ts

# Generate Prisma client in production image
RUN cd Server && npx prisma generate

# Expose the server port
EXPOSE 3000

# Set working directory to server
WORKDIR /app/Server

# Start script: run migrations then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]