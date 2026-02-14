# Frontend (React + TypeScript + Vite)

Local UI for the Case Manager mock project.

## Prereqs
- Node.js 18+
- npm
- Backend running at http://localhost:4000

---

## 1) Install dependencies

From the repo root:
```bash
cd frontend
npm install
```

---

## 2) Run the frontend

```bash
npm run dev
```

App runs at:
- http://localhost:5173

---

## 3) Backend connection

This project uses a Vite dev-server proxy so the frontend can call:
- `/health`
- `/api/...`

Make sure `frontend/vite.config.ts` proxies to:
- `http://localhost:4000`

If you see network errors, confirm the backend is running and the proxy is configured.
