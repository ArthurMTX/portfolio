# ---- deps (cache-friendly) ----
FROM node:20 AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --include=optional && \
    npm install --no-save @tailwindcss/oxide-linux-arm64-gnu lightningcss-linux-arm64-gnu

# ---- build ----
FROM node:20 AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- runtime ----
FROM node:20-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]