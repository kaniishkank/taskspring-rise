# Mahatma Global Gateway TaskFlow: PRD vs Current Codebase (Gap Analysis)

This document serves as a guide for future development by comparing the target Project Requirements Document (PRD) with the current state of the codebase. It highlights what has been built, what differs in the architecture, and what needs to be developed next.

---

## 1. Architecture & Tech Stack Deviations

| Technology | Target PRD | Current Codebase | Status / Action Required |
| :--- | :--- | :--- | :--- |
| **Frontend** | Next.js | React (Vite) + Tanstack Router | **Major Deviation.** The team must decide whether to migrate the frontend to Next.js or update the PRD to accept React/Vite. |
| **Backend** | Next.js API Routes | Express.js (Node) | **Major Deviation.** Currently using a separate Express server. |
| **Database** | PostgreSQL (Supabase) | SQLite (Prisma) | **Action Required.** Update Prisma schema to use `provider = "postgresql"` and connect to Supabase. |
| **Auth** | Supabase Auth | Custom JWT (Local) | **Action Required.** Current auth is homegrown. Needs migration to `@supabase/supabase-js` auth. |
| **Storage** | Supabase Storage | None / Local | **Action Required.** File attachments are currently stubbed. Needs Supabase Storage integration. |
| **Notifications** | WhatsApp Cloud API & In-App | Firebase Push & SSE | **Deviation.** We built Firebase Push and SSE. WhatsApp API integration is completely missing and needs to be built. |

---

## 2. Feature Completion Checklist

### Module 1: Authentication
- [x] Login / Logout
- [ ] Forgot Password / Change Password
- [x] Role-Based Access Control (Basic)
- [ ] Supabase Auth Integration

### Module 2: Organization Management (Multi-tenant)
- [ ] **MISSING:** The current database does not support `organizations`, `departments`, or `teams` entities. It only has a flat `users` structure with a string `department` field.
- [ ] Create/Manage Organizations and Hierarchies.

### Module 3 & 4: Task Management
- [x] Manager: Create/Assign Task
- [x] Staff: View Assigned Tasks / Submit Work
- [x] Workflow: Assigned -> Submitted -> Approved/Rejected -> Completed
- [x] Priority & Due Dates

### Module 5: Notifications
- [x] In-App Notifications (Toast alerts via SSE)
- [x] Background Notifications (Firebase Push)
- [ ] **MISSING:** WhatsApp Cloud API Integration
- [ ] **MISSING:** Daily Automated Cron Job (8:00 AM) for overdue/due-today tasks.

### Module 6: Calendar
- [x] Export to `.ics` file (Dynamic Calendar Sync)
- [ ] Internal Calendar Views (Month/Week/Day UI in the dashboard)

### Module 7 & 8: Submission & Approval
- [x] Submit Work (Text notes, links)
- [ ] File Uploads (Image/PDF/Drive via Supabase Storage)
- [x] Manager Review (Approve/Reject with comments)

### Module 9 & 10: Dashboard & Reports
- [x] Basic Manager & Staff Dashboards
- [ ] Advanced Reporting (Daily/Weekly/Department reports)

---

## 3. Next Steps for the Development Team

1. **Resolve the Stack Discrepancy:** The most critical decision is whether to rewrite the app in **Next.js** (as per the PRD) or stick with the current **React/Express** stack and update the PRD.
2. **Database Migration:** Swap Prisma from SQLite to PostgreSQL and deploy a Supabase instance.
3. **Multi-Tenancy:** Rewrite the database schema to include `Organization` and `Department` tables to support unlimited schools/branches.
4. **WhatsApp API:** Integrate the Meta WhatsApp Cloud API for the required message triggers.
