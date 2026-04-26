# ── Build stage ──────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG NUXT_PUBLIC_POCKETBASE_URL=http://localhost:8090
ENV NUXT_PUBLIC_POCKETBASE_URL=$NUXT_PUBLIC_POCKETBASE_URL

RUN npm run build

# ── Production stage ─────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built output only
COPY --from=builder /app/.output ./.output

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
