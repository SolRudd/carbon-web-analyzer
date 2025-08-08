# GreenTracer

A lightweight, open-source web carbon footprint estimator. Enter any public URL and get an instant estimate of its carbon emissions, grade, and percentile compared to other websites.

## 🚀 Features

- **Client & Server**: React front-end + Node.js/Express backend
- **Carbon Calculation**:

  - Uses Google PageSpeed Insights API (with HTML-only fallback) to measure page weight and compute estimated emissions
  - No longer depends on headless Chrome—lightweight and fast

- **Green Hosting Check**: Integrates with The Green Web Foundation API to apply an 8% reduction if the host is certified green (binary flag)
- **Caching & TTL**: Results are cached in Supabase for 24 hours (configurable via `DEBUG_TTL_ZERO`)
- **Static Badge**: Provides both a JS-based responsive badge and a pure SVG endpoint (`/api/badge.svg?theme=...&url=...`)
- **Security & Rate Limiting**: Helmet, CORS, rate-limiters, and Supabase Row-Level Security
- **Containerized**: Docker & Docker Compose for easy setup and consistent environments
- **Health Check**: `/healthz` endpoint returns `OK` for uptime monitoring

## 📋 Contents

- [Prerequisites](#-prerequisites)
- [Local Setup](#-local-setup)

  - [Back-end](#-back-end)
  - [Front-end](#-front-end)

- [Using Docker](#-using-docker)
- [Deployment](#-deployment)
- [Environment Variables](#-environment-variables)
- [Badge Integration](#-badge-integration)
- [Contributing](#-contributing)
- [License](#-license)

## ⚙️ Prerequisites

- Node.js ≥ v18.x
- npm or yarn
- Docker & Docker Compose (optional, but recommended)

## 🏗️ Local Setup

### Clone the repo

```bash
git clone https://github.com/SolRudd/carbon-web-analyzer.git
cd carbon-web-analyzer
```

### Back-end

```bash
cd backend
npm install # or yarn install
cp .env.example .env
# Edit .env to set your Supabase URL & Service Key
npm start
# Verify
curl http://localhost:8080/healthz  # returns OK
```

### Front-end

```bash
cd ../frontend
npm install # or yarn install
cp .env.example .env.local
# Set VITE_API_URL=http://localhost:8080
npm run dev
# Visit http://localhost:3000
```

## 📦 Using Docker

### Docker Compose

At project root:

```bash
docker compose up --build
```

This will start:

- Backend on [http://localhost:8080](http://localhost:8080)
- Frontend on [http://localhost:3000](http://localhost:3000)

To stop:

```bash
docker compose down
```

### Single Container (Backend)

```bash
cd backend
docker build -t greentracer-backend .
docker run --rm -p 8080:8080 greentracer-backend
```

## 🚀 Deployment

### Backend (Render)

1. Connect your GitHub repo in Render
2. Set Start Command to `npm start`
3. Add Custom Domain: `api.greentracer.org` (CNAME to Render URL)
4. Add environment variables (see below) and deploy

### Front-end (Vercel)

1. Import your project in Vercel
2. Build Command: `npm run build` (Vite)
3. Output Directory: `dist`
4. Environment Variable: `VITE_API_URL=https://api.greentracer.org`
5. Deploy to [https://www.greentracer.org](https://www.greentracer.org)

## 🔑 Environment Variables

### Backend `.env.example`

```
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_KEY=eyJhb...
DEBUG_TTL_ZERO=false    # set true for no cache during testing
PORT=8080
```

### Front-end `.env.example`

```
VITE_API_URL=http://localhost:8080
```

## 🛠 Badge Integration

### Auto Badge (Responsive)

```html
<div
  class="greentrace-badge"
  data-url="https://yourdomain.com"
  data-theme="auto"
></div>
<script src="https://api.greentracer.org/greentrace-badge.js" defer></script>
```

### Static SVG Badge (Light)

```html
<a
  href="https://www.greentracer.org?ref=badge"
  target="_blank"
  rel="noopener noreferrer"
>
  <img
    src="https://api.greentracer.org/api/badge.svg?theme=light&url=https://yourdomain.com"
    alt="GreenTracer Badge (Light)"
    width="160"
  />
</a>
```

### Static SVG Badge (Dark)

```html
<a
  href="https://www.greentracer.org?ref=badge"
  target="_blank"
  rel="noopener noreferrer"
>
  <img
    src="https://api.greentracer.org/api/badge.svg?theme=dark&url=https://yourdomain.com"
    alt="GreenTracer Badge (Dark)"
    width="160"
  />
</a>
```

> **Note:** The Green Web Foundation check is a binary flag—if your host is certified green you get an 8% reduction; otherwise no reduction.

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m "feat: add YourFeature"`
4. Push: `git push origin feature/YourFeature`
5. Open a Pull Request! 🎉

Please follow the Code of Conduct and use descriptive commit messages.
