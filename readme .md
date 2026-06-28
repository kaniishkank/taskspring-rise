# Mahatma Global Gateway TaskFlow - Client Delivery Guide

Welcome to the Mahatma Global Gateway school management portal (**TaskFlow**). This guide provides a comprehensive overview of the system architecture, access credentials, and new features implemented for delivery to the client.

---

## 🔑 Portal Access Credentials

All user portal logins default to the password **`123`**. If a user updates their password in the **Settings** panel, that new password will be required for subsequent logins.

### 👔 Manager Portals (3 Accounts)
Managers have administrative control to create/assign tasks, drag/drop tasks to adjust priorities or statuses, review submissions, and view dynamic performance reports.

| Name | Role | Email / Login ID | Password |
| :--- | :--- | :--- | :--- |
| **Dr. R. Kapoor** | Principal | `principal@mgg.edu.in` | `123` *(or custom)* |
| **Anita Sharma** | Academic Administrator | `admin@mgg.edu.in` | `123` *(or custom)* |
| **Vikram Singh** | Academics Coordinator | `vikram@mgg.edu.in` | `123` *(or custom)* |

### 👥 Staff Portals (6 Accounts)
Staff portals are strictly private. Staff members can only view their own assigned tasks, drag cards to *In Progress* or *Submitted*, post comments, and submit proof of work.

| Name | Department | Email / Login ID | Password |
| :--- | :--- | :--- | :--- |
| **Priya Shah** | Design | `priya@mgg.edu.in` | `123` *(or custom)* |
| **Jordan Lee** | Engineering | `jordan@mgg.edu.in` | `123` *(or custom)* |
| **Sam Patel** | Marketing | `sam@mgg.edu.in` | `123` *(or custom)* |
| **Noah Kim** | Sales | `noah@mgg.edu.in` | `123` *(or custom)* |
| **Maya Singh** | Support | `maya@mgg.edu.in` | `123` *(or custom)* |
| **Taylor Brooks** | Academics | `taylor@mgg.edu.in` | `123` *(or custom)* |

---

## 🛠️ Technology Stack & Architecture

TaskFlow is built on a modern, decoupled client-server architecture designed for high performance, ease of hosting, and database integrity.

* **Frontend Framework**: **React 18** with **TanStack Start** (providing high-speed SSR - Server Side Rendering and file-based routing).
* **Styling**: **Tailwind CSS** alongside **Radix UI** primitives and **Lucide React** icons for a fluid, responsive layout.
* **Charts & Visuals**: **Recharts** library for rendering dynamic analytics area/bar charts.
* **Backend Server**: **Node.js** with **Express** and TypeScript.
* **Database ORM**: **Prisma ORM** ensuring strict, type-safe database queries.
* **Database Engine**: **SQLite** (a lightweight, file-based database ideal for school management and quick migration).

---

## ✨ Implemented Features & Polish

### 🔒 Airtight Privacy & Access Control
- **Database-Level Isolation**: Staff members can ONLY query and see tasks, comments, files, and calendar listings assigned directly to them. Mismatched database lookups are blocked at the Express API layer.
- **Route Protections**: Staff accounts attempting to manually enter coordinates like `/reports` or `/tasks/new` are instantly redirected back to the safe main view.
- **Hidden Admin Triggers**: Creating tasks, viewing staff performance metrics, and editing overall dashboard metrics are hidden for staff members.

### 📊 Dynamic Reports Section (Managers Only)
- **Interactive Filtering**: Dropdown selectors recalculate metrics (Tasks Count, Completion Status, Overdues) across 7 Days, 30 Days, 90 Days, and YTD intervals.
- **Multi-Format Exports**: 
  - **CSV / Excel**: Triggers an instant download of structured data tables.
  - **PDF Export**: Print-ready CSS stylesheets optimize the layout to hide sidebar and header elements, providing clean, single-page printouts.

### 🎨 Visual & UI Polish
- **Clean Fallback Avatars**: Replaced placeholder initials with clean, empty circle indicators for a clean, blank look when no avatar photo is set.
- **Polished Login Screen**: Removed busy clocks/helpers and added branding tags for a clean **Mahatma Global Gateway Demo** setup.
- **Closable Clocks**: Navbar clock displays can be toggled closed/hidden by clicking the hover-triggered `X` button.
- **Consolidated Alerting**: Layout warning toasts combine overdue and approaching deadlines into a single, clean prompt.

---

## 🚀 How to Run Locally

1. **Prerequisites**: Ensure Node.js is installed.
2. **Start the Backend**:
   ```bash
   cd backend
   npm run dev
   ```
3. **Start the Frontend**:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to **`http://localhost:8080`**.
