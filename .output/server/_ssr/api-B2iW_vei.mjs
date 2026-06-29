import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-B2iW_vei.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var openMockFile = (filename) => {
	if (!filename) return;
	const trimmed = filename.trim();
	if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
		window.open(trimmed, "_blank");
		return;
	}
	const fileType = trimmed.split(".").pop()?.toLowerCase();
	let content = "";
	let mime = "text/plain";
	if (fileType === "pdf") {
		content = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 150 >>\nstream\nBT\n/F1 24 Tf\n100 700 Td\n(Mahatma Global Gateway TaskFlow) Tj\n/F1 14 Tf\n0 -50 Td\n(Mock Document Preview: ${trimmed}) Tj\n0 -30 Td\n(This is a verified proof of work attachment download.) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000062 00000 n\n0000000122 00000 n\n0000000215 00000 n\ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n386\n%%EOF`;
		mime = "application/pdf";
	} else if ([
		"png",
		"jpg",
		"jpeg",
		"gif",
		"svg"
	].includes(fileType || "")) {
		content = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <rect width="600" height="400" fill="#f8fafc"/>
      <circle cx="300" cy="180" r="50" fill="#cbd5e1"/>
      <path d="M260 260 L340 260 L300 200 Z" fill="#94a3b8"/>
      <text x="300" y="270" font-family="sans-serif" font-size="16" font-weight="bold" fill="#475569" text-anchor="middle">
        Mock Image Proof: ${trimmed}
      </text>
      <text x="300" y="300" font-family="sans-serif" font-size="12" fill="#64748b" text-anchor="middle">
        Verified Proof of Work Attachment Preview
      </text>
    </svg>`;
		mime = "image/svg+xml";
	} else {
		content = `Mahatma Global Gateway TaskFlow\n\nMock Document Preview: ${trimmed}\n---------------------------------------\nThis is a verified mock attachment download for TaskFlow submissions.\n`;
		mime = "text/plain";
	}
	const blob = new Blob([content], { type: mime });
	const url = URL.createObjectURL(blob);
	window.open(url, "_blank");
};
var API_BASE = "http://localhost:4000/api".replace(/\/$/, "");
var getCache = /* @__PURE__ */ new Map();
var CACHE_TTL = 3e3;
function clearApiCache() {
	getCache.clear();
}
async function request(path, init = {}) {
	const method = init.method ?? "GET";
	if (method === "GET") {
		const cached = getCache.get(path);
		if (cached && Date.now() - cached.timestamp < CACHE_TTL) return cached.promise;
	} else clearApiCache();
	const headers = {
		"Content-Type": "application/json",
		...init.headers ?? {}
	};
	if (typeof window !== "undefined") {
		const userStr = window.sessionStorage.getItem("mgg_user");
		if (userStr) try {
			const user = JSON.parse(userStr);
			if (user) {
				if (user.id) headers["x-user-id"] = user.id;
				if (user.email) headers["x-user-email"] = user.email;
			}
		} catch (err) {
			console.error("Error parsing user from sessionStorage", err);
		}
	}
	const fetchPromise = (async () => {
		const response = await fetch(`${API_BASE}${path}`, {
			...init,
			headers
		});
		const text = await response.text();
		let data = null;
		if (text) try {
			data = JSON.parse(text);
		} catch {
			data = text;
		}
		if (!response.ok) {
			const message = typeof data === "object" && data !== null && "error" in data && typeof data.error === "string" ? data.error : "Request failed";
			throw new Error(message);
		}
		return data;
	})();
	if (method === "GET") getCache.set(path, {
		promise: fetchPromise,
		timestamp: Date.now()
	});
	return fetchPromise;
}
var api = {
	async login(loginId, password) {
		return request("/auth/login", {
			method: "POST",
			body: JSON.stringify({
				loginId,
				password
			})
		});
	},
	async getCurrentUser() {
		return request("/auth/me");
	},
	async getTasks() {
		return request("/tasks");
	},
	async getTask(id) {
		return request(`/tasks/${id}`);
	},
	async createTask(payload) {
		return request("/tasks", {
			method: "POST",
			body: JSON.stringify(payload)
		});
	},
	async updateTaskStatus(id, status) {
		return request(`/tasks/${id}/status`, {
			method: "PATCH",
			body: JSON.stringify({ status })
		});
	},
	async updateTaskDueDate(id, dueDate) {
		return request(`/tasks/${id}`, {
			method: "PUT",
			body: JSON.stringify({ dueDate })
		});
	},
	async addComment(taskId, userId, text) {
		return request(`/tasks/${taskId}/comments`, {
			method: "POST",
			body: JSON.stringify({
				userId,
				text
			})
		});
	},
	async createSubmission(taskId, payload) {
		return request(`/tasks/${taskId}/submissions`, {
			method: "POST",
			body: JSON.stringify(payload)
		});
	},
	async updateSubmissionStatus(taskId, submissionId, status, commentText, managerId) {
		return request(`/tasks/${taskId}/submissions/${submissionId}`, {
			method: "PATCH",
			body: JSON.stringify({
				status,
				commentText,
				managerId
			})
		});
	},
	async getUsers() {
		return request("/users");
	},
	async createUser(payload) {
		return request("/users", {
			method: "POST",
			body: JSON.stringify(payload)
		});
	},
	async updateUser(id, payload) {
		return request(`/users/${id}`, {
			method: "PUT",
			body: JSON.stringify(payload)
		});
	},
	async getNotifications() {
		return request("/notifications");
	},
	async markNotificationRead(id) {
		return request(`/notifications/${id}`, {
			method: "PATCH",
			body: JSON.stringify({ read: true })
		});
	},
	async markAllNotificationsRead() {
		return request("/notifications/read-all", { method: "PATCH" });
	},
	async deleteNotification(id) {
		return request(`/notifications/${id}`, { method: "DELETE" });
	}
};
//#endregion
export { cn as n, openMockFile as r, api as t };
