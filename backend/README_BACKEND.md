# Backend (Node + Express + PostgreSQL)

Local REST API for the Case Manager mock project.

## Prereqs
- Node.js 18+
- npm
- Docker Desktop (recommended for PostgreSQL)

Check:
```bash
node -v
npm -v
docker --version
```

---

## 1) Start PostgreSQL (Docker)

### Create and run the container (first time)
```bash
docker run --name clm-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=case_manager \
  -p 5432:5432 \
  -d postgres:16
```

### If the container already exists
```bash
docker start clm-postgres
```

Confirm it's running:
```bash
docker ps
```

---

## 2) Install dependencies

From the repo root:
```bash
cd backend
npm install
```

---

## 3) Environment variables

Create `backend/.env`:
```env
PORT=4000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/case_manager
```

---

## 4) Create tables

Open a psql shell inside the container:
```bash
docker exec -it clm-postgres psql -U postgres -d case_manager
```

Paste and run:
```sql
CREATE TABLE IF NOT EXISTS cases (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS document_versions (
  id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  renewal_date DATE NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(document_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_documents_case_id ON documents(case_id);
CREATE INDEX IF NOT EXISTS idx_versions_doc_version ON document_versions(document_id, version_number DESC);
CREATE INDEX IF NOT EXISTS idx_cases_client_status ON cases(client_name, status);
```

Exit:
```sql
\q
```

---

## 5) Run the backend

```bash
npm run dev
```

API should be available at:
- http://localhost:4000

Health check:
```bash
curl http://localhost:4000/health
```

Expected:
```json
{"ok":true,"db":1}
```

Note: On startup, the backend seeds a few sample cases into the database.
