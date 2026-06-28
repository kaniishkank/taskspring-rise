# Mahatma Global Gateway (MGG) Dashboard

This project is a modern SaaS dashboard for school task management, notifications, and submissions, built exclusively for Mahatma Global Gateway. It consists of a React (Vite/TanStack) frontend and an Express/Prisma backend running on PostgreSQL.

## Features Completed & Working

### 1. Authentication & Security
- **JWT-Based Authentication**: Full login flow with secure JWT tokens.
- **Password Encryption**: All passwords are encrypted in the PostgreSQL database using `bcrypt`.
- **Role-Based Access Control (RBAC)**: 
  - **Managers (Admins)**: Have full access to the global metrics dashboard, can create new users, and edit profiles.
  - **Staff**: Safely routed away from the global dashboard into their personalized "My Tasks" view. Cannot access the `User Management` dashboard or hit the admin API routes.

### 2. User Management
- Managers can create new staff accounts via the `Settings > User Management` dashboard.
- A "Temporary Password" field is available to instantly assign login credentials to new staff.
- Strict SSR and hydration routing guards prevent users from manually typing in URLs to bypass their role restrictions.

### 3. Database Migration
- The backend has been completely migrated from the default SQLite instance to a robust **PostgreSQL** database.
- The dummy Lovable data has been completely wiped, leaving a clean slate for production.
- Database seed script updated to generate only the master admin account on fresh installations.

### 4. UI/UX Improvements
- Complete rebranding: All Lovable watermarks and text removed, replaced with Mahatma Global Gateway branding.
- The `Notification` popup (Toast) system now includes an explicit "X" (close) button for instant dismissal.
- The Notification bell dropdown list also includes a hover-based "X" button to permanently dismiss individual alerts.

## Project Structure
- `/frontend`: Contains the Vite + TanStack React application.
- `/backend`: Contains the Express API and Prisma database schema.

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL running locally (default config in `backend/.env`)

### Running the Backend
```bash
cd backend
npm install
npx prisma db push
node --loader ts-node/esm --experimental-specifier-resolution=node src/server.ts
```

### Running the Frontend
```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:8080`.
