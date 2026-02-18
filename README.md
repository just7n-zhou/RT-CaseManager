# RT Case Manager – Full Stack Mock Project

This is a full-stack local mock project that simulates two real-world engineering challenges inspired by enterprise contract lifecycle management systems.

The project contains:

- `/backend` – GraphQL API with PostgreSQL
- `/frontend` – React application (Problem + Solution architecture branches)

The goal of this project is to demonstrate:

1. Backend data normalization + GraphQL performance optimization
2. Frontend scalable state management for large, complex forms

---

# Tech Stack

## Backend
- Node.js
- TypeScript
- Apollo Server (GraphQL)
- PostgreSQL (Docker)
- DataLoader (batching)
- Keyset pagination

## Frontend
- React 19
- TypeScript
- Redux Toolkit
- React-Redux
- Reselect
- Custom Redux middleware (autosave)
- Vite

---

# Backend Overview

The backend exposes a GraphQL API at:

http://localhost:4001/graphql

## Core Entities

- Case
- Contract
- ContractVersion

### Example Query

```graphql
query {
  cases {
    id
    client_name
    contracts {
      id
      external_ref
      status
      source_system
    }
  }
}
```

---

# How To Run

## 1️⃣ Start PostgreSQL

```bash
docker run --name clm-postgres   -e POSTGRES_PASSWORD=postgres   -e POSTGRES_USER=postgres   -e POSTGRES_DB=case_manager   -p 5432:5432   -d postgres:16
```

If already created:

```bash
docker start clm-postgres
```

## 2️⃣ Start Backend

```bash
cd backend
npm install
npm run dev
```

GraphQL runs at:

http://localhost:4001/graphql

## 3️⃣ Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

http://localhost:5173

---

# Challenge 1 – Backend Normalization & Performance

## Problem

The system originally pulled contracts from multiple internal systems:

- Different naming conventions (AgreementID vs ContractRef)
- Inconsistent schemas
- Raw data exposed directly via GraphQL
- N+1 resolver pattern
- Slower timeline queries at scale

### Reproduce

1. Checkout backend problem branch
2. Query:

```graphql
query {
  cases {
    sourceAContracts { AgreementID StatusText }
    sourceBContracts { ContractRef State }
  }
}
```
In terminal, run: 
curl -s http://localhost:4001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query{ cases{ id client_name sourceAContracts{AgreementID StatusText} sourceBContracts{ContractRef State} } }"}' | jq


Observe inconsistent fields and resolver behavior.

---

## Solution

- Designed normalized `contracts` table
- Unified GraphQL schema
- Implemented DataLoader batching
- Added keyset pagination for versions
- Created stable abstraction layer

Impact:

- Reduced redundant queries
- Improved dashboard performance
- Clean and scalable schema

For solution branch output, in terminal run:
curl -s http://localhost:4001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query{ cases{ id client_name contracts{ id external_ref status source_system versions(limit:2){ items{version_number status created_at} } } } }"}' | jq


---

# Challenge 2 – Scalable Frontend State Management

## Problem

Original frontend used localized state and Context.

As clauses scaled to thousands:

- Every keystroke re-rendered the entire tree
- Input lag appeared
- UI froze under heavy loads
- Hard to scale safely

### Reproduce

1. Checkout frontend problem branch
2. Select 1500–3000 clauses
3. Type in any clause

Observe noticeable lag.

---

## Solution

- Migrated to Redux Toolkit
- Normalized state (byId + allIds)
- Separated UI state from entity state
- Built memoized selectors (Reselect)
- Used React.memo for row isolation
- Implemented autosave middleware (async, non-blocking)

Impact:

- Only edited clause re-renders
- Eliminated input lag
- Predictable and scalable state architecture

---

# Summary

This project demonstrates:

- Backend schema normalization
- GraphQL performance optimization
- Eliminating N+1 patterns
- Keyset pagination
- High-performance frontend state modeling
- Middleware-based side effects
- Architectural scalability thinking

Fully local. No cloud deployment required.
