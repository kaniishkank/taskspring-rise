import { i as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { n as cn, t as api } from "./_ssr/api-B2iW_vei.mjs";
import { t as Button } from "./_ssr/button-BYa1xzvG.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { $ as CircleCheck, F as Clock, H as CheckCheck, W as Bell, b as MessageSquareWarning, i as UserPlus, s as Trash2 } from "./_libs/lucide-react.mjs";
import { t as PageHeader } from "./_ssr/page-header-i5M1fODL.mjs";
import { l as formatDistanceToNow } from "./_libs/date-fns.mjs";
import { t as EmptyState } from "./_ssr/empty-state-CZyZAuuE.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./_ssr/tabs-Dn910njg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.notifications-K4ZGZBaJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var iconMap = {
	assignment: UserPlus,
	reminder: Clock,
	approval: CircleCheck,
	rejection: MessageSquareWarning
};
var toneMap = {
	assignment: "bg-info/15 text-info",
	reminder: "bg-warning/20 text-warning-foreground dark:text-warning",
	approval: "bg-success/15 text-success",
	rejection: "bg-destructive/15 text-destructive"
};
function NotificationsPage() {
	const [items, setItems] = (0, import_react.useState)([]);
	const [currentUser, setCurrentUser] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		api.getCurrentUser().then((data) => setCurrentUser(data.user)).catch(() => {});
		api.getNotifications().then(setItems).catch(() => {});
	}, []);
	const markAll = async () => {
		try {
			await api.markAllNotificationsRead();
			setItems((p) => p.map((n) => ({
				...n,
				read: true
			})));
			toast.success("All notifications marked as read");
		} catch {
			toast.error("Failed to mark notifications read");
		}
	};
	const mark = async (id) => {
		try {
			await api.markNotificationRead(id);
			setItems((p) => p.map((n) => n.id === id ? {
				...n,
				read: true
			} : n));
		} catch {}
	};
	const handleDelete = async (e, id) => {
		e.stopPropagation();
		try {
			await api.deleteNotification(id);
			setItems((p) => p.filter((n) => n.id !== id));
			toast.success("Notification deleted");
		} catch {
			toast.error("Failed to delete notification");
		}
	};
	const tabs = [
		{
			value: "all",
			label: "All",
			filter: () => true
		},
		{
			value: "assignment",
			label: "Assignments",
			filter: (n) => n.category === "assignment"
		},
		{
			value: "reminder",
			label: "Reminders",
			filter: (n) => n.category === "reminder"
		},
		{
			value: "approval",
			label: "Approvals",
			filter: (n) => n.category === "approval"
		},
		{
			value: "rejection",
			label: "Rejections",
			filter: (n) => n.category === "rejection"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Notifications",
		description: "Stay on top of every assignment, reminder, and review.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "outline",
			onClick: () => void markAll(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "mr-1.5 h-4 w-4" }), "Mark all as read"]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
		defaultValue: "all",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList, { children: tabs.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
			value: t.value,
			children: t.label
		}, t.value)) }), tabs.map((t) => {
			const list = items.filter((n) => currentUser?.role !== "staff" || n.userId === currentUser?.id).filter(t.filter);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: t.value,
				children: list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					icon: Bell,
					title: "You're all caught up",
					description: "No notifications in this category."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "overflow-hidden rounded-xl border bg-card shadow-sm",
					children: list.map((n) => {
						const Icon = iconMap[n.category];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							onClick: () => void mark(n.id),
							className: cn("group flex cursor-pointer items-start gap-4 border-b p-4 transition last:border-0 hover:bg-accent/40", !n.read && "bg-primary/5"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("grid h-10 w-10 shrink-0 place-items-center rounded-full", toneMap[n.category]),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-baseline justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "truncate text-sm font-semibold",
											children: n.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "shrink-0 text-xs text-muted-foreground",
											children: formatDistanceToNow(new Date(n.at), { addSuffix: true })
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-sm text-muted-foreground",
										children: n.message
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [!n.read && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 shrink-0 rounded-full bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: (e) => void handleDelete(e, n.id),
										className: "opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-destructive transition shrink-0",
										title: "Delete notification",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
									})]
								})
							]
						}, n.id);
					})
				})
			}, t.value);
		})]
	})] });
}
//#endregion
export { NotificationsPage as component };
