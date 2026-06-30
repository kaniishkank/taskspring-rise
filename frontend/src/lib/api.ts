import type { Notification, Task, User } from "./types";

export const API_BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:4000/api").replace(/\/$/, "");

interface CacheEntry {
  promise: Promise<any>;
  timestamp: number;
}

const getCache = new Map<string, CacheEntry>();
const CACHE_TTL = 3000; // 3 seconds TTL for requests caching

/**
 * Clears the active request cache. Called automatically on mutations (POST/PUT/PATCH/DELETE).
 */
export function clearApiCache() {
  getCache.clear();
}

/**
 * Core request function wrapping `fetch`.
 * Implements a simple GET cache and automatically injects authentication headers
 * based on localStorage.
 */
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const method = init.method ?? "GET";

  if (method === "GET") {
    const cached = getCache.get(path);
    const now = Date.now();
    if (cached && now - cached.timestamp < CACHE_TTL) {
      return cached.promise;
    }
  } else {
    // Invalidate full cache on mutations (POST, PUT, PATCH, DELETE) to load fresh state
    clearApiCache();
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> ?? {}),
  };

  if (typeof window !== "undefined") {
    const userStr = window.sessionStorage.getItem("mgg_user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user?.token) {
          headers["Authorization"] = `Bearer ${user.token}`;
        }
      } catch (err) {
        console.error("Error parsing user from sessionStorage", err);
      }
    }
  }

  const fetchPromise = (async () => {
    const response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers,
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

    return data;
  })();

  if (method === "GET") {
    getCache.set(path, {
      promise: fetchPromise,
      timestamp: Date.now(),
    });
  }

  return fetchPromise as Promise<T>;
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

  async updateTaskStatus(id: string, status: string) {
    return request<Task>(`/tasks/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  async updateTaskDueDate(id: string, dueDate: string) {
    return request<Task>(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify({ dueDate }),
    });
  },

  async addComment(taskId: string, userId: string, text: string) {
    return request<any>(`/tasks/${taskId}/comments`, {
      method: "POST",
      body: JSON.stringify({ userId, text }),
    });
  },

  async createSubmission(taskId: string, payload: { userId: string; notes: string; files: string[]; links: string[]; status: string }) {
    return request<any>(`/tasks/${taskId}/submissions`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateSubmissionStatus(taskId: string, submissionId: string, status: string, commentText?: string, managerId?: string) {
    return request<any>(`/tasks/${taskId}/submissions/${submissionId}`, {
      method: "PATCH",
      body: JSON.stringify({ status, commentText, managerId }),
    });
  },

  async getUsers() {
    return request<User[]>('/users');
  },

  async createUser(payload: Partial<User> & { password?: string }) {
    return request<User>('/users', {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateUser(id: string, payload: Partial<User>) {
    return request<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
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

  async deleteNotification(id: string) {
    return request<{ success: boolean }>(`/notifications/${id}`, {
      method: "DELETE",
    });
  },

  async subscribeToPush(fcmToken: string) {
    return request<{ success: boolean }>('/notifications/subscribe', {
      method: "POST",
      body: JSON.stringify({ fcmToken }),
    });
  },


};
