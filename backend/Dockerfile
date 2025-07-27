# ── Stage 1: install node_modules ──
FROM node:20-slim AS builder

WORKDIR /app
COPY package*.json ./

# install npm deps
RUN npm ci

# ── Stage 2: runtime image ──
FROM node:20-slim

WORKDIR /app

# Copy in your built modules + app code
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY . .

# Only environment you really need:
ENV NODE_ENV=production \
    PORT=8080

EXPOSE 8080

# Start your backend
CMD ["npm", "start"]
