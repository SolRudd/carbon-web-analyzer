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
- [Auth Dashboard Setup](docs/auth-dashboard-local-setup.md)
- [Stripe Test-Mode Sign-Off](docs/stripe-test-mode-signoff.md)
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

Run a scan, open the saved public result page, and copy the free badge code from that report. `/badge` can also find the latest saved report for a domain and generate the same public badge code.

Carbon Tested and Green Hosting are free public badges. They do not require login or a licence, but they must be backed by public report data. GreenTracer Verified is the licensed supporter badge and should be generated from the dashboard after account/licence setup.

### GreenTracer Verified Badge (paid/supporter)

```html
<div
  class="greentrace-badge"
  data-public-token="gtb_xxxxx"
  data-domain="yourdomain.com"
  data-badge-type="greentracer_verified"
></div>
<script src="https://api.greentracer.org/greentrace-badge.js" async></script>
```

### Carbon Tested Badge (free/report)

```html
<div
  class="greentrace-badge"
  data-result-slug="example-com-20260425"
  data-domain="yourdomain.com"
  data-badge-type="carbon_tested"
></div>
<script src="https://api.greentracer.org/greentrace-badge.js" async></script>
```

### Green Hosting Badge (free/report)

```html
<div
  class="greentrace-badge"
  data-result-slug="example-com-20260425"
  data-domain="yourdomain.com"
  data-badge-type="green_hosting"
></div>
<script src="https://api.greentracer.org/greentrace-badge.js" async></script>
```

Legacy snippets remain supported. The loader accepts `data-url`, `data-site`, `data-domain`, `data-token`, `data-result-slug`, and legacy type aliases such as `carbon`, `hosting`, `verified`, and `member`. If a public badge has no result slug, the loader resolves the latest saved public result for the declared domain.

### Custom Colors

```html
<div
  class="greentrace-badge"
  data-public-token="gtb_xxxxx"
  data-domain="yourdomain.com"
  data-badge-type="greentracer_verified"
  data-bg-color="#07111f"
  data-accent-color="#22c55e"
></div>
<script src="https://api.greentracer.org/greentrace-badge.js" async></script>
```

The loader validates color contrast and falls back to a restrained default if a color would make the badge hard to read.

### Static Verified SVG Badge

```html
<a
  href="https://www.greentracer.org/verified/yourdomain.com"
  target="_blank"
  rel="noopener noreferrer"
>
  <img
    src="https://api.greentracer.org/api/badge/gtb_xxxxx"
    alt="GreenTracer verification badge"
    width="240"
    height="44"
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
