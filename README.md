GreenTracer

A lightweight, open-source web carbon footprint estimator. Enter any public URL and get an instant estimate of its carbon emissions, grade, and percentile compared to other websites.

🚀 Features

Client & Server: React/Vue front-end + Node.js backend.

Carbon Calculation: Uses Puppeteer to measure page weight and compute estimated emissions.

Green Hosting Check: Integrates with The Green Web Foundation API to adjust calculations.

Caching & History: Stores results in SQLite with a simple REST API.

Containerized: Docker & Docker Compose for easy setup and consistent environments.

📋 Contents

Prerequisites

Local Setup

Back-end

Front-end

Using Docker

Deployment

Environment Variables

Contributing

License

⚙️ Prerequisites

Node.js ≥ v18.x

npm or yarn

Docker & Docker Compose (optional, but recommended)

A terminal/command line

🏗️ Local Setup

Clone the repository and install dependencies for both back-end and front-end.

# Clone the repo

git clone https://github.com/SolRudd/carbon-web-analyzer.git
cmp carbon-web-analyzer

Back-end

cd backend
npm install # or `yarn`

Copy the example env:

cp .env.example .env

Edit .env and set your values (see Environment Variables).

Run the server:

npm start

Verify:

curl http://localhost:8080/healthz # returns OK

Front-end

cd ../frontend
npm install # or `yarn`

Copy and edit:

cp .env.example .env.local

Start dev server:

npm run dev # Vite starts on http://localhost:3000

Open in browser and start checking URLs!

📦 Using Docker

We provide Dockerfiles and Compose for easy one‑command setup.

Docker Compose

At the project root:

docker compose up --build

This will start:

backend on http://localhost:8080

frontend on http://localhost:3000 (if configured)

To stop:

docker compose down

Single Container

# Build backend image

docker build -t greentracer-backend ./backend

# Run backend

docker run --rm -p 8080:8080 greentracer-backend

🚀 Deployment

Backend (Render)

Connect your GitHub repo in Render.

Set the Start Command to:

npm start

Add Custom Domain: api.greentracer.org and configure your DNS CNAME to point at carbon-web-analyzer.onrender.com.

Add Environment Variables (see next section).

Deploy!

Front-end (Vercel)

Import your project in Vercel (framework auto‑detected as Vite).

Set Build Command to vite build and Output Directory to dist.

Add Environment Variable: VITE_API_URL = https://api.greentracer.org.

Deploy and visit https://www.greentracer.org.

🔑 Environment Variables

Key

Description

Example

CORS_ORIGIN

Comma‑separated front-end URLs

https://www.greentracer.org

PORT

Back-end listening port

8080

VITE_API_URL

Front-end API base URL (prod)

https://api.greentracer.org

Back-end .env.example:

CORS_ORIGIN=https://www.greentracer.org
PORT=8080

Front-end .env.example:

VITE_API_URL=http://localhost:8080

🤝 Contributing

Fork the repo

Create a feature branch: git checkout -b feature/YourFeature

Commit changes: git commit -m "feat: add YourFeature"

Push: git push origin feature/YourFeature

Open a Pull Request! 🎉

Please follow the Code of Conduct and use descriptive commit messages.

📄 License

This project is licensed under the MIT License. See LICENSE for details.

Happy tracing! 🌿
