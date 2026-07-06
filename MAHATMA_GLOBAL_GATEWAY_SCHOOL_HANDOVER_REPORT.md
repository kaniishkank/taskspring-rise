# Mahatma Global Gateway School - Project Handover & Architecture Report

This document serves as the comprehensive client handover report detailing the delivery, architecture, and verification of the centralized TaskFlow administrative portal designed and built for Mahatma Global Gateway School.

---

## 1. Executive Summary
Mahatma Global Gateway School has successfully transitioned from scattered, unstructured channels (e.g., WhatsApp threads, email notifications) into a secure, centralized Web Portal & TaskFlow Management system. The platform streamlines administrative task dispatches, submission controls, and real-time manager notification routing. 

Every action is backed by secure role-based access privileges, encrypted database schemas, and background synchronization feeds that allow supervisors to track staff progress in real time while staff manage their duties from their personal device calendar applications.

---

## 2. Requirements Implementation Matrix

| Requirement ID | Requirement Description | Technical Delivery Details |
| :--- | :--- | :--- |
| **REQ-003** | **Universal Calendar Streaming & Sync** | Built a secure, tokenized Webcal feed endpoint (`GET /api/calendar/feed/:feedToken`) that exports live iCalendar (`.ics`) schedules. Integrated native `webcal://` sync protocols and dynamic Google Calendar intent hooks. |
| **REQ-007** | **3-Tier Organizational Privileges** | Structured all database schemas, routes, and layout tables around three strict organizational tiers: **`OPERATION`** (Central admin team), **`MANAGER`** (School leaders/principals), and **`STAFF`** (Teachers/executors). |
| **REQ-008** | **Real-Time Notification Middleware** | Implemented change-detection triggers on the backend. Any time a `STAFF` member edits a task status or leaves comments, the middleware automatically resolves the task creator (`assignedById`) and dispatches a live real-time notification to their SSE queue. |

---

## 3. Deep-Dive Architecture Highlights

### Centralized UX Subscription Dialog
To provide a premium and clean user interface, the redundant settings tab has been removed, consolidating all calendar configuration into a single **Sync to Device** dialog modal directly inside the main Calendar view.
* Users can view their subscription URLs.
* One-click native button binds directly to the operating system's calendar provider (e.g., Outlook, Apple Calendar, iOS calendar) using the `webcal://` scheme handler.
* The secondary button links to Google Calendar for instant web-client subscriptions.

### Dual-Mode Google Calendar Integration
To support both seamless cloud synchronization in staging/production and instantaneous local manual verification on development machines, the Google Calendar quick-action link uses a dual-mode engine:
1. **Localhost Fallback Engine**: If the browser hostname is detected as `localhost`, clicking the button resolves a Google Calendar Event Template Intent (`https://calendar.google.com/calendar/render?action=TEMPLATE&...`). This immediately opens Google Calendar in the browser and pre-fills the mock presentation task details dynamically, bypassing cloud sync issues on local loops.
2. **Production/Staging Behavior**: On public domain deployments, it dynamically falls back to standard background subscriptions using: `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(httpUrl)}`.

### Strict Tenant Data Isolation
Security is enforced at the database layer to prevent unauthorized cross-tenant scheduling leaks:
* **Tokenized Feed Credentials**: Every user record features a unique, auto-generated `calendarToken` defined in [schema.prisma](file:///C:/Users/Kaushikan/.gemini/antigravity/scratch/taskspring-rise/backend/prisma/schema.prisma) with a default cryptographic hash:
  ```prisma
  calendarToken String @unique @default(cuid())
  ```
* **Scope Isolation Rules**: When the calendar endpoint is hit, the controller locates the user record using the token.
  * If the resolved profile is a **`STAFF`** user, the backend enforces a strict filter where only tasks explicitly assigned to them (`assignedToId = user.id`) are streamed.
  * If the resolved profile is a **`MANAGER`** or **`OPERATION`** user, the feed streams all tasks which they oversee.

---

## 4. Audited Settings & Background Workers

The TaskFlow notification engine runs on persistent user-defined preference switches backed by automated background schedules:

### Active Notification Settings
* **Deadline Reminders**: When active, sends automated alerts to users regarding tasks due within 48 hours or items that are overdue.
* **Submission Approvals**: Dispatches immediate real-time SSE notifications directly to managers when staff members submit tasks or add comments.
* **Weekly Digest**: Sends consolidated reports summarizing pending school deliverables every Monday.

### Onboarding & Sync Lifecycle
* **Automatic Provisioning**: Every newly registered user automatically receives a unique `calendarToken` CUID, requiring zero manual database administration.
* **Background Sync**: External OS calendar background applications subscribe to the dynamically streamed `.ics` files and poll the server securely (typically every 1–4 hours depending on the client app) to keep tasks synchronized in the background without user intervention.
