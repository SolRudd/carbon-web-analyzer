# Use full Puppeteer image with Chrome pre-installed
FROM ghcr.io/puppeteer/puppeteer:latest

# Set working dir
WORKDIR /app

# Set to root to install dependencies
USER root

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy remaining backend code
COPY . .

# Revert to the default non-root user for safety
USER pptruser

# Expose port 8080
EXPOSE 8080

# Start app
CMD ["node", "index.js"]
