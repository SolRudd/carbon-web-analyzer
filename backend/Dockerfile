# ✅ Use official Puppeteer image WITH Chromium preinstalled
FROM ghcr.io/puppeteer/puppeteer:latest

# Set working directory
WORKDIR /app

# Copy only the package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the code
COPY . .

# Expose app port
EXPOSE 8080

# Start the app
CMD ["node", "index.js"]
