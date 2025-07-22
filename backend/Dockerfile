# ── Stage 1: install node_modules ──
FROM node:20-slim AS builder

WORKDIR /app
COPY package*.json ./

# install npm deps (this will run your postinstall if you still have one)
RUN npm ci

# ── Stage 2: runtime image ──
FROM node:20-slim

# Install a real Chromium that Puppeteer can launch
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    ca-certificates \
    fonts-liberation \
    libgbm1 \
    libnss3 \
    libxss1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy in your built modules + app code
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY . .

# Point Puppeteer at the system Chromium, and skip any download
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    PUPPETEER_SKIP_DOWNLOAD=true \
    NODE_ENV=production \
    PORT=8080

EXPOSE 8080
CMD ["npm", "start"]
