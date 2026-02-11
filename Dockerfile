# -----------------------------
# Shared base image
# -----------------------------
ARG PNPM_VERSION=10.14.0

FROM node:20-alpine AS base
ARG PNPM_VERSION
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate


# -----------------------------
# 1) Builder stage
# -----------------------------
FROM base AS builder
RUN apk add --no-cache libc6-compat python3 make g++ git

# Install dependencies with caching
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Generate Prisma Client (schema now specifies linux-musl target)
COPY prisma ./prisma
RUN pnpm prisma generate --schema=prisma/schema.prisma

# Build the TypeScript app
COPY . .
RUN pnpm build

# Strip dev dependencies to leave a prod-only node_modules
RUN pnpm prune --prod


# -----------------------------
# 2) Production stage
# -----------------------------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Ensure Prisma can load native binaries on Alpine
RUN apk add --no-cache libc6-compat

# Copy minimal runtime artifacts
COPY package.json pnpm-lock.yaml* ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/tsconfig.json ./tsconfig.json

EXPOSE 4000

CMD ["node", "-r", "tsconfig-paths/register", "dist/index.js"]            