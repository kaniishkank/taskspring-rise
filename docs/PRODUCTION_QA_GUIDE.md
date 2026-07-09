# Production Readiness & QA Guide

This guide contains the official test credentials loaded into the database, alongside a step-by-step guide to testing all features end-to-end, simulating load, and preparing for final production deployment.

## 🔐 System Test Credentials

All accounts listed below share the same default password:
> **Password for all accounts:** `Admin@2026`

### Manager Accounts (Can Create/Assign Tasks & Review Submissions)
| Name | Email | Department |
| :--- | :--- | :--- |
| Dr. R. Kapoor | `principal@mgg.edu.in` | Executive |
| Principal S. Ramanathan | `principal.ramanathan@mggschool.edu` | Administration |
| Vice Principal M. Thillaivanan | `viceprincipal.t@mggschool.edu` | Administration |
| Academic Coordinator S. Meenakshi | `coordinator.m@mggschool.edu` | Academics |

### Staff Accounts (Can Receive Tasks, Comment, & Submit Proof)
| Name | Email | Department |
| :--- | :--- | :--- |
| K. Rajesh | `rajesh.math@mggschool.edu` | Mathematics |
| A. Lakshmi | `lakshmi.phys@mggschool.edu` | Physics |
| P. Kumar | `kumar.chem@mggschool.edu` | Chemistry |
| S. Divya | `divya.cs@mggschool.edu` | Computer Science |
| V. Anand | `anand.eng@mggschool.edu` | English |
| R. Priya | `priya.social@mggschool.edu` | Social Sciences |

---

## 🧪 End-to-End Testing Guide

To verify the system is working perfectly, run through this flow using two different browsers (or one browser and one incognito window).

### Step 1: The Manager Flow (Window A)
1. Log in as `principal.ramanathan@mggschool.edu` (`Admin@2026`).
2. Go to **Settings** and ensure you allow Browser Notification permissions if prompted.
3. Go to **Tasks** and click **Create task**.
4. Create a task titled "Final QA Test", select **High** priority, and assign it to *S. Divya*.
5. You should instantly see a success toast. Stay on this screen.

### Step 2: The Staff Flow (Window B)
1. Open an Incognito Window and log in as `divya.cs@mggschool.edu` (`Admin@2026`).
2. **WhatsApp Test:** Go to Settings -> Profile and enter your real WhatsApp number. Save it.
3. *If the manager creates another "High" priority task for S. Divya now, you will instantly receive a WhatsApp message on that phone.*
4. **SSE / Real-time Test:** In the Task Dashboard, click on the task "Final QA Test".
5. Leave a comment: *"I have received the task and am working on it."*
6. In **Window A (Manager)**, verify that the comment appears instantly without refreshing the page!

### Step 3: Calendar Synchronization
1. As the staff member (Window B), go to the Dashboard overview.
2. Click **Sync Calendar**.
3. Copy the URL provided and paste it into Google Calendar (Add by URL), Apple Calendar, or Outlook.
4. Verify the tasks appear on your calendar.

---

## 🚀 Overload & Load Testing Guidelines

If you want to test how the system handles heavy traffic (overload) before production:

1. **Database Connections (Supabase):**
   - We are currently using a direct connection string for Prisma.
   - *Production Move:* Ensure you use the Supabase **Connection Pooler** URI (port 6543) in your `backend/.env` for `DATABASE_URL` instead of the direct one (5432) to prevent connection limits when hundreds of teachers log in simultaneously.

2. **Server-Sent Events (SSE) Limits:**
   - SSE keeps an open HTTP connection for every active user tab.
   - If deploying to a platform like Vercel or Heroku, ensure your load balancer allows long-lived connections and doesn't aggressively time out `/api/notifications/stream`.
   - *Test:* Open 20 tabs of the dashboard simultaneously. Create a task and verify all 20 tabs update instantly without crashing the Node.js server.

3. **WhatsApp Meta API Rate Limits:**
   - Meta limits messages depending on your business verification tier (Tier 1 is usually 1,000 conversations/day).
   - The cron job is configured to run efficiently once a day. Ensure your server time zone is correctly configured to IST so the 8:00 AM cron runs at the correct local time.

## 🚢 Production Deployment Checklist

To push this exact system to a production environment (like AWS, Render, or Railway):

- [ ] **Environment Variables:** Migrate all `.env` variables from local to your hosting provider's secret manager.
- [ ] **Node.js Environment:** Ensure `NODE_ENV=production` is set so Express disables verbose debug logging and optimizes performance.
- [ ] **Frontend Build:** Run `npm run build` in the `frontend` folder and serve the `dist` folder through a CDN (like Netlify/Vercel) for maximum speed.
- [ ] **Database Setup:** Run `npx prisma db push` on your production database instance.
- [ ] **Change Passwords:** Force all users to change their `Admin@2026` passwords upon first login.
