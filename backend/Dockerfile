# backend/Dockerfile

# ── Stage 1: install node_modules ──
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ── Stage 2: runtime image ──
FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY . .
ENV NODE_ENV=production PORT=8080
EXPOSE 8080
CMD ["npm", "start"]
