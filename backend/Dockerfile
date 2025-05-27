# ✅ Use official Puppeteer image WITH Chromium preinstalled
FROM ghcr.io/puppeteer/puppeteer:latest

# Set working directory and switch to pptruser (non-root)
USER pptruser
WORKDIR /home/pptruser/app

# Copy package files and install dependencies
COPY --chown=pptruser:pptruser package*.json ./
RUN npm install

# Copy the rest of the code with correct ownership
COPY --chown=pptruser:pptruser . .

# Expose app port
EXPOSE 8080

# Start the app
CMD ["node", "index.js"]
