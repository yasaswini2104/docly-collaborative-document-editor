# DocEditor

A shared document editor built on a modern full-stack TypeScript monorepo.

## Stack

| Layer      | Technology                |
|------------|---------------------------|
| Frontend   | React 19 + Vite 7 + TypeScript 5.9 |
| Styling    | Tailwind CSS v4 (CSS-first) |
| Routing    | React Router v7           |
| Editor     | TipTap v3                 |
| Data       | TanStack Query v5 + Axios |
| Backend    | Express 5 + TypeScript    |
| Database   | MySQL via Prisma 6        |
| Auth       | JWT (in-memory only)      |
| Upload     | Multer 2 (txt/md, 2 MB)   |
| Validation | Zod 4                     |
| Testing    | Vitest + Supertest        |

## Project Structure

```
/
├── apps/
│   ├── client/     # Vite + React 19 SPA
│   └── server/     # Express 5 API + Prisma
├── .env.example    # Committed — copy to .env
├── package.json    # npm workspaces root
└── README.md
```

## Getting Started

### Prerequisites

- Node.js ≥ 22
- MySQL 8 running locally (or update `DATABASE_URL`)

### Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd doceditor

# 2. Copy env file and fill in your values
cp .env.example .env

# 3. Install all workspace dependencies
npm install

# 4. Push database schema
cd apps/server
npx prisma db push

# 5. Start dev servers (frontend + backend concurrently)
cd ../..
npm run dev
```

### Running Tests

```bash
# All workspaces
npm run test

# Frontend only
npm run test:client

# Backend only
npm run test:server
```

### Linting & Formatting

```bash
npm run lint
npm run format
```

## Environment Variables

See [`.env.example`](.env.example) for all required variables.

## Architecture Notes

- JWT is stored **only in React Context memory** — never `localStorage` or `sessionStorage`.
- All API requests use `Authorization: Bearer <token>`.
- TipTap document content is stored as JSON in MySQL.
- File uploads are limited to `.txt` / `.md`, max 2 MB, and converted to TipTap JSON on the backend.
