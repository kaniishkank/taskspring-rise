# Mahatma Global Gateway - TaskFlow Developer Onboarding

Welcome to the **Mahatma Global Gateway TaskFlow** project! This document serves as the comprehensive onboarding guide for any developer joining the project. It outlines the architecture, current feature set, future roadmap, and provides all necessary credentials so you can start contributing immediately.

---

## 1. Project Overview
**Goal:** Build a School Task Management & Reminder System to reduce manual follow-up, task tracking, and report collection for schools.
**Architecture:** Monorepo with a distinct Frontend and Backend.
*   **Frontend:** React (Vite) + Tailwind CSS + shadcn/ui + TypeScript + `@tanstack/react-router`.
*   **Backend:** Node.js + Express.js + Prisma ORM + TypeScript.
*   **Database:** Supabase PostgreSQL.
*   **Real-time Notifications:** Server-Sent Events (SSE) + Firebase Cloud Messaging (FCM).

---

## 2. Credentials & Environment Variables
To ensure zero friction during setup, use the following credentials.

### Backend Setup (`backend/.env`)
Copy these values exactly into `backend/.env`.

```env
# Supabase PostgreSQL Connection Strings
# The standard pooler for the application runtime:
DATABASE_URL="postgresql://postgres.rnoiimdtowlrzhlzijpp:bangban4120D@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# The direct connection for running Prisma Migrations (`npx prisma migrate dev`):
DIRECT_URL="postgresql://postgres.rnoiimdtowlrzhlzijpp:bangban4120D@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres"

# Authentication Secret
JWT_SECRET="your-super-secret-key-change-in-production"

# Port
PORT=4000
```

### Firebase Service Account
The project relies on Firebase for Push Notifications. The service account JSON file is already committed in the backend at `backend/firebase-service-account.json`. **Do not delete or rotate this file** as it is properly linked with the `mgg-dashboard` Google Cloud project with the necessary IAM roles (`Firebase Cloud Messaging API Admin`) enabled.

---

## 3. Local Development Setup

1. **Install Dependencies**
   Run the following from the root of the project to install all dependencies for both frontend and backend.
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

2. **Database Sync**
   Ensure your Prisma schema matches the Supabase database.
   ```bash
   cd backend
   npx prisma generate
   ```
   *(Note: The database is already deployed remotely to Supabase. You do not need to run migrations unless you are modifying the schema.)*

3. **Start the Servers**
   Open two terminal windows:
   
   **Terminal 1 (Backend):**
   ```bash
   cd backend
   npm run dev
   ```

   **Terminal 2 (Frontend):**
   ```bash
   cd frontend
   npm run dev
   ```
   The application will be running on `http://localhost:8080`.

---

## 4. Current Features (Completed)

The following modules are **100% complete, tested, and in production-ready state**:

*   **Authentication:** JWT-based login for Staff, Managers, and Super Admins.
*   **Task Management Core:** Creating, assigning, and viewing tasks with due dates.
*   **Kanban Board:** Full drag-and-drop Kanban view for organizing task statuses.
*   **Real-Time Dashboard UI:** Instant UI updates when tasks are created or moved using Server-Sent Events (SSE).
*   **Push Notifications (Firebase):** Reliable desktop/device push notifications when a new task is assigned, utilizing FCM HTTP v1 API.
*   **Supabase Migration:** Transitioned entirely from local SQLite to cloud Supabase PostgreSQL for multi-user scaling.
*   **Performance Analytics:** Dashboard charts and task completion metrics.

---

## 5. Future Features & Roadmap (To-Do)

The following outlines the immediate next steps to align the current codebase with the final Product Requirements Document (PRD).

### Phase 1: Multi-Tenancy (Organizations & Departments)
Currently, users exist in a single global pool. We must implement proper multi-tenancy.
*   **Schema Update:** Add `Organization`, `Department`, and `Team` models to `schema.prisma`.
*   **Relations:** Link every `User` and `Task` to a specific `Organization` and `Department`.
*   **Admin Dashboard:** Build UI screens for Super Admins to create Organizations and onboard Principals/Management.

### Phase 2: WhatsApp API Integration
Schools rely heavily on WhatsApp. We need to integrate WhatsApp notifications as a fallback or primary alert system.
*   **Provider Selection:** Integrate Twilio or Meta's official WhatsApp Business API.
*   **Triggers:** Fire a WhatsApp message when a task becomes overdue or is assigned with high priority.

### Phase 3: Daily Summary Cron Jobs
Managers need daily reports without manually checking the dashboard.
*   **Implementation:** Set up a `node-cron` job running every morning at 8:00 AM.
*   **Logic:** Query Prisma for all tasks due today, and overdue tasks.
*   **Delivery:** Send the summary via Email (Nodemailer) and WhatsApp.

### Phase 4: Task Attachments & Comments
*   **Storage:** Integrate Supabase Storage buckets.
*   **Features:** Allow staff to upload PDF reports or images as proof of task completion. Add comment threads to tasks for manager feedback.
