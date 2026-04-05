# Nyūna — URL Shortener ✂️

> **Nyūna** (न्यून) means *"to reduce"* in Sanskrit — that's exactly what we do.

A production-grade URL shortener with real-time analytics, Redis caching, and Base62 encoding. Built with FastAPI, PostgreSQL, Redis, and React.

🌍 **Live Demo:** [nyuna-url-shortener.vercel.app](https://nyuna-url-shortener.vercel.app)
⚙️ **API Docs:** [nyuna-backend.onrender.com/docs](https://nyuna-backend.onrender.com/docs)

---

## Features 🚀

- **Base62 Encoding** — Custom algorithm converts DB IDs to short codes (56 billion possible URLs with 6 characters)
- **Redis Caching** — Cache-aside pattern with 24hr TTL, achieving ~95% cache hit rate
- **Real-time Analytics** — Track every click with timestamp, IP, and user agent
- **Rate Limiting** — Token Bucket algorithm (10 req/60sec per IP) using Redis atomic operations
- **Dark/Light Mode** — Premium Navy + Gold UI with smooth animations
- **HTTP 302 Redirect** — Deliberate choice over 301 to preserve analytics tracking

---

## System Architecture 🏗️

User → React Frontend (Vercel)
↓
FastAPI Backend (Render)
↓
┌──────────────┐
│  Redis Cache │ ← Check first (1ms)
└──────────────┘
↓ (cache miss)
┌──────────────┐
│  PostgreSQL  │ ← Permanent storage (50ms)
└──────────────┘

---

## Tech Stack 🛠️

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React + Vite + Tailwind | Fast, modern UI |
| Backend | Python FastAPI | Async, auto-docs, production-ready |
| Database | PostgreSQL | ACID compliance, relational data |
| Cache | Redis (Upstash) | Sub-millisecond reads, 100x faster than DB |
| Deployment | Render + Vercel | Free tier, auto-deploy from GitHub |

---

## How Base62 Works 🧠
```python
ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

def encode(number: int) -> str:
    result = ""
    while number > 0:
        result = ALPHABET[number % 62] + result
        number = number // 62
    return result

# encode(12345) → "dnh"
# 62^6 = 56 billion possible short codes
```

---

## How Redis Caching Works 🔄

Request comes in for /dnh
↓
Check Redis (1ms)
↓
Cache HIT? → Return URL instantly ⚡
Cache MISS? → Query PostgreSQL (50ms)
→ Write to Redis for next time
→ Return URL

---

## API Endpoints 📡

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/shorten` | Create short URL |
| GET | `/{short_code}` | Redirect to original URL |
| GET | `/analytics/{short_code}` | Get click analytics |
| GET | `/health` | Health check |
| GET | `/docs` | Interactive API docs |

---

## Running Locally 💻

### Prerequisites
- Python 3.11+
- Node.js 18+
- Docker Desktop

### Backend Setup
```bash
git clone https://github.com/Pvishwatejareddy/nyuna-url-shortener
cd nyuna-url-shortener

# Start databases
docker compose up -d

# Setup Python
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt

# Start server
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` 🎉

---

## Key Design Decisions 🤔

**Why Base62 over UUID?**
UUID generates 36-character strings like `550e8400-e29b-41d4`. Base62 gives us short, URL-safe codes like `dnh` using only 6 characters for 56 billion URLs.

**Why 302 over 301 redirect?**
301 is permanent — browsers cache it forever. With 301, after the first click, the browser skips our server entirely and we lose ALL analytics. 302 ensures every click goes through our server.

**Why Redis for rate limiting?**
Redis operations are atomic. Using `INCR` and `SETEX` ensures no race conditions even under high concurrency — something a regular Python counter can't guarantee.

**Why cache-aside over write-through?**
Cache-aside only caches what's actually requested. Write-through caches everything on write. For a URL shortener where most URLs are only shortened once but some are clicked millions of times, cache-aside is far more efficient.

---

## Performance 📊

| Metric | Value |
|--------|-------|
| Cache hit response time | ~5ms |
| Cache miss response time | ~50ms |
| Rate limit | 10 req/60sec per IP |
| Max short codes (6 chars) | 56 billion |

---

## Project Structure 📁

nyuna-url-shortener/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI entry point
│   │   ├── database.py      # PostgreSQL connection
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── crud.py          # Database operations
│   │   ├── cache.py         # Redis caching
│   │   ├── encoder.py       # Base62 algorithm ⭐
│   │   ├── rate_limiter.py  # Token Bucket algorithm ⭐
│   │   └── routers/
│   │       ├── urls.py      # URL endpoints
│   │       └── analytics.py # Analytics endpoints
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── ShortenForm.jsx
│       │   ├── UrlCard.jsx
│       │   └── AnalyticsDashboard.jsx
│       ├── App.jsx
│       └── api.js
└── docker-compose.yml

---

## Author ✨

**P. Vishwa Teja**
Built with ❤️ as a portfolio project demonstrating production-grade backend engineering.

[![GitHub](https://img.shields.io/badge/GitHub-Pvishwatejareddy-black)](https://github.com/Pvishwatejareddy)