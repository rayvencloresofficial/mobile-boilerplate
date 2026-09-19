---
trigger: always_on
---

# General Project Instructions & Architecture Guidelines

You are an expert AI Full-Stack Software Engineer and System Architect assisting in this repository. Follow these global standards for all planning, architecture, code generation, and debugging tasks.

---

## 1. Project Monorepo Architecture

The repository is architected as a clean, unified full-stack platform consisting of **1 Frontend**, **1 Backend**, and **1 Database**, with native authentication handled directly in the backend.

```
Boilerplate/
├── frontend/         --> Client & Admin SPA (React 19, Joy UI, Vite) [Port 5173]
├── backend/          --> Unified API Server (Express, TypeScript, Kysely) [Port 3000]
├── database/         --> Standalone PostgreSQL package (DDL migrations & seeders)
└── docs/             --> Architecture, manuals, and API specifications
```

### Architectural Principles & Workspace Boundaries:
- **Unified Frontend & Backend**:
  - `frontend` exclusively consumes `backend` (`http://localhost:3000/api/v1`).
  - Native authentication, JWT issuance, password hashing, and token refresh rotation are handled directly in `backend/` without any external microservice.
- **Backend Responsibilities**:
  - Exposes authentication endpoints (`/api/v1/auth`), user management (`/api/v1/users`), role permissions (`/api/v1/roles`), system settings (`/api/v1/settings`), and RBAC testing endpoints (`/api/v1/test-rbac`).
  - Role-based access control (RBAC) via `requireRole` and `requirePermission`.
- **Database Isolation**:
  - **Single Source of Truth**: All PostgreSQL DDL schemas (`migrations/`), data fixtures (`seeders/`), and runner scripts (`src/client.ts`, `src/migrate.ts`, `src/seed.ts`, `src/reset.ts`) reside **exclusively** within `database/`.
  - **Strict Boundary**: **Zero migration or seeder scripts inside backend or frontend**. Backend data access is strictly runtime queries via Kysely query builder.
  - Database commands: `npm run db:migrate`, `npm run db:seed`, `npm run db:reset` from root or within `database/`.

---

## 2. Core Tech Stack Standards

### Frontend (`frontend/`)
- **Framework & Tooling**: Vite + React 19 (TypeScript, ESM).
- **Component Priority Order**:
  1. **Local UI Wrappers** (`src/components/ui/` - `Button`, `Calendar`, `Container`, `Typography`, etc.). Use `Container` instead of `Card`.
  2. **Joy UI (`@mui/joy`)** as the primary design system (semantic colors, `variant`, `sx` tokens).
  3. **MUI (`@mui/material`)** only as fallback when Joy UI lacks the component (e.g. specialized pickers).
- **Fast Refresh Hygiene**: Files exporting React components must **only** export React components (`react-refresh/only-export-components`).
  - Hooks live in `src/hooks/`, constants in `src/constants/`, context types in `src/context/*.ts`, and providers in `src/context/*Provider.tsx`.
- **API Communication**: Components never make raw `fetch` calls. All communication goes through type-safe API client wrappers in `src/services/*.api.ts`.

### Backend (`backend/`)
- **Runtime & Framework**: Node.js, Express.js (strict TypeScript, ESM).
- **3-Tier Layered Architecture**:
  - **Controller** (`src/controllers/`): HTTP transport, query/body parsing, status codes, RFC 7807 problem details.
  - **Service** (`src/services/`): Pure business logic, authorization checks, authentication, token lifecycles, orchestration, transaction management.
  - **Repository** (`src/repositories/`): Isolated data access and type-safe database queries via Kysely.
- **Validation**: Schema-first validation using **Zod** on all incoming requests (`req.body`, `req.query`, `req.params`).

### Database (`database/`)
- **Engine**: PostgreSQL 17+.
- **Execution & Isolation**: Managed strictly within `database/`.
- **Transactional DDL & Seeds**: All migration and seed scripts must run inside atomic transactions (`BEGIN` / `COMMIT` / `ROLLBACK`).

---

## 3. Engineering & Code Quality Rules

1. **Strict TypeScript**:
   - Zero `any` types. Maximize compiler safety, discriminated unions, and strong interface contracts.
2. **Clean Separation of Concerns**:
   - Controllers handle HTTP transport and response shaping.
   - Services handle pure business logic and transaction boundaries.
   - Repositories handle type-safe Kysely database queries.
   - `database/` handles all schema DDL and seeding.
3. **Database Concurrency & Transactions**:
   - Prefer Kysely transaction blocks (`db.transaction().execute(async trx => ...)`) for multi-step mutations.
4. **Environment Isolation**:
   - No hardcoded database credentials, fallback connection strings, or passwords in code. All configuration must be loaded from `.env` files.
5. **Security Best Practices**:
   - Parameterized SQL queries (handled natively by Kysely).
   - Role-based access control (RBAC via `requireRole` and `requirePermission`).
   - Rate limiting, Helmet security headers, CORS restricted to the corresponding frontend client.

---

## 4. Agent Response Protocol

- **Direct & Actionable**: Provide production-ready, runnable code without unnecessary conversational fluff.
- **Workflow Context**:
  - Database: `database/migrations/`, `database/seeders/`
  - Backend: `backend/src/`
  - Frontend: `frontend/src/`
- **Modular Deliverables**: When adding features, specify files clearly by their relative path (e.g., `backend/src/repositories/...`, `frontend/src/components/...`, or `database/migrations/...`).
