# Mahatma Global Gateway TaskFlow: Project Roadmap & Status

This document tracks the current state of the codebase against the original Project Requirements Document (PRD) and serves as a guide for future development.

---

## 1. Architecture & Tech Stack Decisions

We have officially finalized the technology stack for the Pilot Deployment. We opted for a pragmatic pivot to keep our fast, working frontend while upgrading the backend for production.

| Technology | Target PRD | Finalized Stack | Status |
| :--- | :--- | :--- | :--- |
| **Frontend** | Next.js | React (Vite) + Tanstack Router | **DECIDED:** Retained for speed and existing UI richness. |
| **Backend** | Next.js API Routes | Express.js (Node) | **DECIDED:** Retained for performance and existing SSE/Push integration. |
| **Database** | PostgreSQL (Supabase) | PostgreSQL (Supabase via Prisma) | **COMPLETED:** Successfully migrated from local SQLite to live Supabase cloud. |
| **Auth** | Supabase Auth | Custom JWT (Local) | **DECIDED:** Retaining custom JWT for the pilot to avoid rewrite delays. |
| **Storage** | Supabase Storage | None / Local | **Action Required:** File attachments need Supabase Storage bucket integration. |
| **Notifications** | WhatsApp Cloud API & In-App | Firebase Push & SSE | **Deviation:** In-App and Background Pushes are built. WhatsApp API is pending. |

---

## 2. Feature Completion Checklist

### Module 1: Authentication
- [x] Login / Logout
- [x] Role-Based Access Control (Super Admin, Manager, Staff)
- [ ] Forgot Password / Change Password

### Module 2: Organization Management (Multi-tenant)
- [ ] **PENDING:** Schema needs to be updated with `Organization`, `Department`, and `Team` tables.
- [ ] Ensure Managers can only see/assign users within their specific department.

### Module 3 & 4: Task Management
- [x] Manager: Create/Assign Task
- [x] Staff: View Assigned Tasks / Submit Work
- [x] Workflow: Assigned -> Submitted -> Approved/Rejected -> Completed
- [x] Priority & Due Dates

### Module 5: Notifications
- [x] In-App Notifications (Toast alerts via Real-time SSE)
- [x] Background Notifications (Native Firebase Push)
- [ ] **PENDING:** WhatsApp Cloud API Integration (Meta Developer Account required)
- [ ] **PENDING:** Daily Automated Cron Job (8:00 AM) for overdue/due-today tasks

### Module 6: Calendar
- [x] Export to `.ics` file (Dynamic Calendar Sync tested via Apple/Google Calendar)
- [ ] Internal Calendar Views (Month/Week/Day UI in the dashboard)

### Module 7 & 8: Submission & Approval
- [x] Submit Work (Text notes, links)
- [ ] File Uploads (Image/PDF/Drive via Supabase Storage)
- [x] Manager Review (Approve/Reject with comments)

### Module 9 & 10: Dashboard & Reports
- [x] Basic Manager & Staff Dashboards (Pending, In Progress, Completed counts)
- [ ] Advanced Reporting (Daily/Weekly/Department visual charts)

---

## 3. Immediate Next Steps (Upcoming Days)

1. **Multi-Tenancy Schema:** Upgrade the Prisma database schema to include `Organization` tables so multiple schools can use the app in isolated environments.
2. **WhatsApp API:** Hook into the Meta WhatsApp API to trigger template messages on task assignment.
3. **Daily Cron Job:** Implement `node-cron` in the Express server to scan for overdue tasks at 8:00 AM daily.
