import type { Notification, Task, User } from "./types";

const API_BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:4000/api").replace(/\/$/, "");

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    ...init,
  });

  const text = await response.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "error" in data && typeof data.error === "string"
        ? data.error
        : "Request failed";
    throw new Error(message);
  }

  return data as T;
}

type CreateTaskPayload = Partial<
  Omit<Task, "id" | "createdAt" | "comments" | "submissions" | "assignedTo" | "assignedBy">
> & {
  assignedToId?: string;
  assignedById?: string;
  dueDate?: string;
  attachments?: Array<{ name: string; size: string }>;
};

export const api = {
  async login(loginId: string, password: string) {
    return request<{ user: User; token: string }>('/auth/login', {
      method: "POST",
      body: JSON.stringify({ loginId, password }),
    });
  },

  async getCurrentUser() {
    return request<{ user: User | null }>('/auth/me');
  },

  async getTasks() {
    return request<Task[]>('/tasks');
  },

  async getTask(id: string) {
    return request<Task>(`/tasks/${id}`);
  },

  async createTask(payload: CreateTaskPayload) {
    return request<Task>('/tasks', {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getUsers() {
    return request<User[]>('/users');
  },

  async getNotifications() {
    return request<Notification[]>('/notifications');
  },

  async markNotificationRead(id: string) {
    return request<Notification>(`/notifications/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ read: true }),
    });
  },

  async markAllNotificationsRead() {
    return request<{ success: boolean }>('/notifications/read-all', {
      method: "PATCH",
    });
  },
};
