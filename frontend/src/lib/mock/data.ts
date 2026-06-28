import type { Notification, Task, User } from "@/lib/types";

export const currentUser: User = {
  id: "u1",
  name: "Alex Morgan",
  email: "alex@acme.co",
  role: "manager",
  department: "Operations",
  active: true,
};

export const users: User[] = [
  currentUser,
  { id: "u2", name: "Priya Shah", email: "priya@acme.co", role: "staff", department: "Design", active: true },
  { id: "u3", name: "Jordan Lee", email: "jordan@acme.co", role: "staff", department: "Engineering", active: true },
  { id: "u4", name: "Sam Patel", email: "sam@acme.co", role: "staff", department: "Marketing", active: false },
  { id: "u5", name: "Riley Chen", email: "riley@acme.co", role: "manager", department: "Engineering", active: true },
  { id: "u6", name: "Taylor Brooks", email: "taylor@acme.co", role: "super_admin", department: "Executive", active: true },
  { id: "u7", name: "Noah Kim", email: "noah@acme.co", role: "staff", department: "Sales", active: true },
  { id: "u8", name: "Maya Singh", email: "maya@acme.co", role: "staff", department: "Support", active: true },
];

const today = new Date();
const day = (offset: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offset);
  return d.toISOString();
};

export const tasks: Task[] = [
  {
    id: "TSK-1042",
    title: "Q4 product launch landing page",
    description: "Design and ship the new landing page for the Q4 launch, including hero, features, and pricing.",
    priority: "high",
    status: "in_progress",
    assignedTo: "u2",
    assignedBy: "u1",
    createdAt: day(-5),
    dueDate: day(2),
    attachments: [{ name: "brief.pdf", size: "2.1 MB" }, { name: "wires.fig", size: "880 KB" }],
    comments: [
      { id: "c1", userId: "u1", text: "Please align the hero copy with the new tagline.", at: day(-2) },
      { id: "c2", userId: "u2", text: "On it — sharing v1 by EOD.", at: day(-1) },
    ],
    submissions: [],
  },
  {
    id: "TSK-1043",
    title: "Migrate auth to new identity provider",
    description: "Cut over from legacy auth to the new IdP with zero downtime.",
    priority: "urgent",
    status: "under_review",
    assignedTo: "u3",
    assignedBy: "u5",
    createdAt: day(-9),
    dueDate: day(-1),
    attachments: [{ name: "migration-plan.pdf", size: "1.4 MB" }],
    comments: [],
    submissions: [
      { id: "s1", at: day(-1), notes: "Staging cutover complete, awaiting review.", files: ["report.pdf"], links: ["https://staging.acme.co"], status: "under_review" },
    ],
  },
  {
    id: "TSK-1044",
    title: "Weekly social content calendar",
    description: "Plan and schedule social posts across LinkedIn, X, and Instagram for the next week.",
    priority: "medium",
    status: "approved",
    assignedTo: "u4",
    assignedBy: "u1",
    createdAt: day(-12),
    dueDate: day(-2),
    attachments: [],
    comments: [],
    submissions: [{ id: "s2", at: day(-3), notes: "Calendar finalized.", files: ["calendar.xlsx"], links: [], status: "approved" }],
  },
  {
    id: "TSK-1045",
    title: "Customer onboarding email sequence",
    description: "Write a 5-email onboarding sequence with metrics tracking.",
    priority: "low",
    status: "assigned",
    assignedTo: "u7",
    assignedBy: "u1",
    createdAt: day(-1),
    dueDate: day(7),
    attachments: [],
    comments: [],
    submissions: [],
  },
  {
    id: "TSK-1046",
    title: "Refactor dashboard charts for performance",
    description: "Reduce TTI on the analytics dashboard from 4.2s to under 2s.",
    priority: "high",
    status: "submitted",
    assignedTo: "u3",
    assignedBy: "u5",
    createdAt: day(-7),
    dueDate: day(1),
    attachments: [{ name: "perf-audit.pdf", size: "3.2 MB" }],
    comments: [],
    submissions: [{ id: "s3", at: day(0), notes: "Achieved 1.7s TTI. PR linked.", files: [], links: ["https://github.com/acme/app/pull/482"], status: "submitted" }],
  },
  {
    id: "TSK-1047",
    title: "Quarterly compliance audit",
    description: "Run through SOC2 controls and document remediation items.",
    priority: "urgent",
    status: "rejected",
    assignedTo: "u8",
    assignedBy: "u6",
    createdAt: day(-15),
    dueDate: day(-3),
    attachments: [{ name: "soc2-checklist.pdf", size: "1.1 MB" }],
    comments: [{ id: "c3", userId: "u6", text: "Missing evidence for AC-3, please resubmit.", at: day(-2) }],
    submissions: [{ id: "s4", at: day(-4), notes: "First pass complete.", files: ["audit.pdf"], links: [], status: "rejected" }],
  },
  {
    id: "TSK-1048",
    title: "Sales deck v3 polish",
    description: "Update the enterprise sales deck with new logos and case studies.",
    priority: "medium",
    status: "completed",
    assignedTo: "u7",
    assignedBy: "u1",
    createdAt: day(-20),
    dueDate: day(-10),
    attachments: [],
    comments: [],
    submissions: [{ id: "s5", at: day(-11), notes: "Final deck delivered.", files: ["deck.pdf"], links: [], status: "completed" }],
  },
  {
    id: "TSK-1049",
    title: "Support macros review",
    description: "Audit and consolidate Zendesk macros for the support team.",
    priority: "low",
    status: "in_progress",
    assignedTo: "u8",
    assignedBy: "u1",
    createdAt: day(-3),
    dueDate: day(5),
    attachments: [],
    comments: [],
    submissions: [],
  },
];

export const notifications: Notification[] = [
  { id: "n1", title: "New task assigned", message: "Alex assigned you 'Q4 product launch landing page'", category: "assignment", read: false, at: day(-1) },
  { id: "n2", title: "Approaching deadline", message: "'Migrate auth' is due tomorrow", category: "reminder", read: false, at: day(-1) },
  { id: "n3", title: "Submission approved", message: "Your submission for 'Social calendar' was approved", category: "approval", read: true, at: day(-3) },
  { id: "n4", title: "Changes requested", message: "Compliance audit submission was rejected — see comments", category: "rejection", read: false, at: day(-2) },
  { id: "n5", title: "Reminder", message: "Weekly status report due Friday", category: "reminder", read: true, at: day(-4) },
];

export function userById(id: string) {
  return users.find((u) => u.id === id);
}