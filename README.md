# GreenTracer

A tool to measure the carbon footprint of any website.

## Features

- Measures page size in MB via headless Chromium
- Checks green hosting status via The Green Web Foundation API
- Calculates estimated CO₂ emissions, grade (A+…F), and percentile
- Caches results in SQLite
- Fully containerized (Docker + Render)

## Quickstart (Docker)

```bash
# From the project root:
docker compose up --build
```
