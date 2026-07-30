# ─────────────────────────────────────────────────────
#  Huellas Server — Multi-stage Docker build

# ─── Stage 1: Build ─────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

COPY package.json package-lock.json ./
COPY Server/package.json ./Server/
COPY Shared/package.json ./Shared/

RUN npm ci --workspaces

COPY Shared/ ./Shared/
COPY Server/ ./Server/

RUN npm --workspace @huellas/shared run build

RUN cd Server && npx prisma generate

RUN npm --workspace @huellas/server run build

# ─── Stage 2: Production ────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
COPY Server/package.json ./Server/
COPY Shared/package.json ./Shared/

RUN npm ci --workspaces --omit=dev

COPY --from=builder /app/Shared/dist ./Shared/dist
COPY --from=builder /app/Server/dist ./Server/dist
COPY --from=builder /app/Server/prisma ./Server/prisma
COPY --from=builder /app/Server/prisma.config.ts ./Server/prisma.config.ts

RUN cd Server && npx prisma generate

EXPOSE 3000

WORKDIR /app/Server

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]