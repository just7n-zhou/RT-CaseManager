# Backend Setup (Node + Express + PostgreSQL)

This backend runs locally and exposes REST APIs for:
- Cases
- Documents (per case)
- Document Versions (lifecycle timeline)

## 0) Prereqs
- Node.js 18+
- npm
- PostgreSQL (local install) OR Docker (recommended)

---

## 1) Create the backend project

From repo root:

```bash
mkdir backend
cd backend
npm init -y
