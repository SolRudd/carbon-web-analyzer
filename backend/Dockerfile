# ✅ Use official Puppeteer image with Chromium already inside
FROM ghcr.io/puppeteer/puppeteer:latest

USER pptruser
WORKDIR /home/pptruser/app

# Copy package.json and install
COPY --chown=pptruser:pptruser package*.json ./
RUN npm install

# Copy remaining files
COPY --chown=pptruser:pptruser . .

# Expose port
EXPOSE 8080

# Start app
CMD ["node", "index.js"]
