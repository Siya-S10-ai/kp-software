# KP Enterprise Software

Digital operations and customer management platform for a welding and fabrication business.

## Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB (optional — uses in-memory store when `MONGODB_URI` is not set)

## Quick start

### 1. Backend

```bash
cd kp-backend
cp .env.example .env   # optional — edit JWT_SECRET and MONGODB_URI
npm install
npm run dev            # http://localhost:5000
```

### 2. Frontend

```bash
npm install
npm run dev            # http://localhost:5173 (proxies /api to backend)
```

## Demo accounts

All demo accounts use password: `password123`

| Email | Role |
|-------|------|
| admin@kp.com | Super Admin |
| ops@kp.com | Operations Admin |
| worker@kp.com | Worker |
| customer@kp.com | Customer |

## Portals

| Portal | Path | Purpose |
|--------|------|---------|
| Public site | `/` | Services, portfolio, reviews, enquiry form |
| Admin | `/admin` | Enquiries, projects, workers, review moderation |
| Worker | `/worker` | Assigned jobs, tasks, progress notes, photos |
| Customer | `/customer` | Project tracking, milestones, reviews |

## Workflow

Lead → Enquiry → Project → Worker assignment → Task updates → Customer visibility → Completion → Review

## Tests

```bash
# Frontend (App + enquiry helpers)
npm test

# Backend (API, auth, workflow)
cd kp-backend && npm test

# All tests
npm run test:all
```

## Environment variables

| Variable | Description |
|----------|-------------|
| `PORT` | Backend port (default 5000) |
| `MONGODB_URI` | MongoDB connection string (optional for local dev) |
| `JWT_SECRET` | Secret for signing auth tokens |
| `VITE_API_URL` | Frontend API base URL (default `/api` via proxy) |
