# -----------------------------
# 1) Builder stage
# -----------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# Copy dependency files first (cache-friendly)
COPY package.json pnpm-lock.yaml* ./

# Install all deps (dev + prod)
RUN pnpm install --frozen-lockfile

# Copy Prisma schema separately (better caching)
COPY prisma ./prisma

# Generate Prisma Client
RUN pnpm prisma generate

# Copy remaining source code
COPY . .

# Build TypeScript
RUN pnpm build


# -----------------------------
# 2) Production stage
# -----------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# Copy dependency files
COPY package.json pnpm-lock.yaml* ./

ENV HUSKY=0

# Install ONLY production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy compiled app
COPY --from=builder /app/dist ./dist

# Copy Prisma schema (required at runtime)
COPY --from=builder /app/prisma ./prisma

# Copy tsconfig for runtime path resolution
COPY --from=builder /app/tsconfig.json ./tsconfig.json

EXPOSE 4000

CMD ["node", "-r", "tsconfig-paths/register", "dist/index.js"]
