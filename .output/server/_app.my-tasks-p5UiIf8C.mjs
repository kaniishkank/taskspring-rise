import { i as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as api } from "./_ssr/api-B2iW_vei.mjs";
import { g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { E as ListChecks } from "./_libs/lucide-react.mjs";
import { t as PageHeader } from "./_ssr/page-header-i5M1fODL.mjs";
import { n as StatusBadge, t as PriorityBadge } from "./_ssr/status-badge-GZfITurg.mjs";
import { u as format } from "./_libs/date-fns.mjs";
import { t as EmptyState } from "./_ssr/empty-state-CZyZAuuE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.my-tasks-p5UiIf8C.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MyTasks() {
	const [tasks, setTasks] = (0, import_react.useState)([]);
	const [currentUser, setCurrentUser] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		async function load() {
			try {
				const [taskData, userData] = await Promise.all([api.getTasks(), api.getCurrentUser()]);
				setTasks(taskData);
				setCurrentUser(userData.user);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}
		load();
	}, []);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl border bg-card p-8 text-sm text-muted-foreground",
		children: "Loading tasks…"
	});
	const mine = tasks.filter((t) => currentUser && t.assignedTo === currentUser.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "My tasks",
		description: "Tasks assigned to you across all projects."
	}), mine.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		icon: ListChecks,
		title: "No tasks assigned",
		description: "When tasks are assigned to you they will show up here."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3",
		children: mine.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/tasks/$id",
			params: { id: t.id },
			className: "group rounded-xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono",
						children: t.id
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: t.priority })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-2 line-clamp-2 text-base font-semibold group-hover:text-primary",
					children: t.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 line-clamp-2 text-sm text-muted-foreground",
					children: t.description
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: t.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted-foreground",
						children: ["Due ", format(new Date(t.dueDate), "MMM d")]
					})]
				})
			]
		}, t.id))
	})] });
}
//#endregion
export { MyTasks as component };
