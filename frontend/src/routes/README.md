# Frontend Routes Documentation

The routing in this application uses **TanStack Router** file-based routing.

## Route Access Matrix

Route access is strictly enforced inside the respective `beforeLoad` hooks using a `mgg_user` localStorage JSON token validation block.

| Route File | Path Name | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `_app.tsx` | App Layout | **All (Logged In)** | Root layout file; rejects unauthenticated users entirely, boots sidebar & navbar. |
| `_app.index.tsx` | `/` | **All** | Dashboard page. Displays full stats for managers, or personal metrics for staff. |
| `_app.tasks.index.tsx` | `/tasks` | **Managers** | Task list & Kanban board containing all school tasks. |
| `_app.tasks.$id.tsx` | `/tasks/:id` | **Assignee / Managers** | Detail page for a specific task. Access blocked on API level if a staff member requests an unauthorized task ID. |
| `_app.tasks.new.tsx` | `/tasks/new` | **Managers** | Form to create a new task assignment. |
| `_app.my-tasks.tsx` | `/my-tasks` | **All** | Simplified grid view containing only tasks assigned directly to the current user. |
| `_app.submissions.tsx` | `/submissions` | **Managers** | Pending review queue for managers to approve or reject staff proofs of work. Staff members will be redirected away. |
| `_app.calendar.tsx` | `/calendar` | **All** | Monthly calendar view highlighting upcoming deadlines. |
| `_app.reports.tsx` | `/reports` | **Managers** | Complex charting & data export tools. Staff members will be redirected away. |
| `_app.users.tsx` | `/users` | **Managers** | CRUD tables for creating and modifying school staff accounts. Staff members will be redirected away. |
| `_app.settings.tsx` | `/settings` | **All** | Preference panel for users to update profile images, notification settings, and password logic. |
| `_app.notifications.tsx` | `/notifications` | **All** | System event feed. |

---

## TanStack Routing Concepts
* Files prefixed with `_` (e.g. `_app`) are layout wrappers.
* Files containing `.` (e.g. `_app.settings.tsx`) are nested routes (rendered in the outlet of `_app`).
* Variables starting with `$` (e.g. `_app.tasks.$id.tsx`) are dynamic URL parameters.
