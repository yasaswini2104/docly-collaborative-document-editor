# Docly — Collaborative Document Editor

## Project Overview
Docly is a lightweight, SaaS-style collaborative document editor designed for fast, focused writing and seamless team sharing. Built with a modern aesthetic, it provides users with a clean interface to create rich-text documents, manage permissions, and share them securely with collaborators. 

Key features include:
- Secure user authentication (Signup, Login)
- Rich-text editing with a clean writing surface
- Document management (Create, Read, Update, Delete)
- File import (txt, md)
- Role-based document sharing (Viewer, Editor)
- Persistent document storage
- Light and Dark mode support

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, React Router v7
- **Backend**: Node.js, Express, TypeScript
- **Database**: MySQL, Prisma ORM
- **Authentication**: JWT (JSON Web Tokens), bcrypt for password hashing
- **Editor**: TipTap (headless rich-text editor framework)
- **Testing**: Vitest, React Testing Library
- **Deployment**: Localhost (development-ready)

## Project Structure
The repository is structured as a monorepo containing two main applications:
- `/apps/client`: The React frontend application.
- `/apps/server`: The Node.js/Express backend API.

## Prerequisites
- Node.js (v18+)
- npm or pnpm
- MySQL database instance

## Installation
1. Clone the repository.
2. Install dependencies for both client and server:
   ```bash
   cd apps/server && npm install
   cd ../client && npm install
   ```

## Environment Variables
Create a `.env` file in `apps/server` with the following variables:
- `DATABASE_URL`: Connection string for the MySQL database (e.g., `mysql://user:password@localhost:3306/docly`).
- `JWT_SECRET`: A secure, random string used to sign JSON Web Tokens.
- `PORT`: The port on which the backend server will run (default: 4000).

## Database Setup
1. Navigate to the server directory: `cd apps/server`
2. Run Prisma migrations to create the schema:
   ```bash
   npx prisma migrate dev
   ```
3. Seed the database with initial users:
   ```bash
   npm run db:seed
   ```

## Running the Application
### Backend
From `apps/server`:
```bash
npm run dev
```
Runs the Express API on `http://localhost:4000`.

### Frontend (Development Mode)
From `apps/client`:
```bash
npm run dev
```
Runs the Vite development server on `http://localhost:3000`. API requests are proxied to the backend.

### Production Build
To build the frontend for production:
```bash
npm run build
```

## Running Tests
Tests are located in both the client and server applications. To run them:
```bash
# Frontend
cd apps/client
npm test

# Backend
cd apps/server
npm test
```

## Deployment
For production deployment:
1. **Database**: Provision a managed MySQL database and update `DATABASE_URL`.
2. **Backend**: Host the Express app on a service like Render, Heroku, or AWS, ensuring `NODE_ENV=production` and `JWT_SECRET` are set.
3. **Frontend**: Build the static assets via `npm run build` and deploy the `/dist` folder to Vercel, Netlify, or AWS S3/CloudFront. Update the Vite proxy or API base URL to point to the production backend.

## Demo Credentials
The database seed script provides two default users for testing:
- **Alice**: `alice@example.com` / `alice-password-123`
- **Bob**: `bob@example.com` / `bob-password-123`

## Assumptions
- The application assumes a single-tenant environment for now.
- File imports (.txt, .md) are relatively small and processed entirely on the client before being sent as TipTap JSON to the server.
- The MySQL database is reliably accessible from the Node backend.

## Future Improvements
- Real-time collaboration via WebSockets (e.g., Yjs or Hocuspocus).
- Optimistic UI updates for a snappier experience.
- Automated token refresh mechanisms and CSRF protection.
- Enhanced file upload support (images/attachments) backed by object storage (S3).
