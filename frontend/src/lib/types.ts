export type Priority = "low" | "medium" | "high" | "urgent";
export type TaskStatus =
  | "assigned"
  | "in_progress"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "completed";
export type Role = "OPERATION" | "MANAGER" | "STAFF";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  password?: string;
  department?: string;
  active: boolean;
  notifyAssignments?: boolean;
  notifyDeadlines?: boolean;
  notifyApprovals?: boolean;
  notifyWeekly?: boolean;
  calendarToken?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  assignedTo: string; // user id
  assignedBy: string;
  assignedToId: string;
  assignedById: string;
  createdAt: string;
  dueDate: string;
  attachments: { name: string; size: string }[];
  comments: { id: string; userId: string; text: string; at: string }[];
  submissions: {
    id: string;
    at: string;
    notes: string;
    files: string[];
    links: string[];
    status: TaskStatus;
  }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  category: "assignment" | "reminder" | "approval" | "rejection" | "update";
  read: boolean;
  at: string;
  taskId?: string;
  task?: Task & { assignedBy?: User, assignedTo?: User };
}