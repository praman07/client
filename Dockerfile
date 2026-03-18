# client/Dockerfile
FROM node:22-alpine AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source and build
# VITE_ vars are baked into the bundle at build time — must be passed as ARGs
COPY . .
ARG VITE_SERVER_URL
ARG VITE_WS_URL
ARG VITE_CLERK_PUBLISHABLE_KEY
# Clear Vite cache + build — prevents stale cached hashes causing CSS mismatch
RUN node_modules/.bin/vite build --force

# ── Production stage ──────────────────────────────────────────
# Nitro (.output/) is self-contained — only needs node, not pnpm
FROM node:22-alpine AS runner
WORKDIR /app

COPY --from=builder /app/.output ./.output

RUN apk add --no-cache curl

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=15s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

CMD ["node", ".output/server/index.mjs"]
