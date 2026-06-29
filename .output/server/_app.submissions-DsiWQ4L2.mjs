import { i as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { r as openMockFile, t as api } from "./_ssr/api-B2iW_vei.mjs";
import { t as Button } from "./_ssr/button-BYa1xzvG.mjs";
import { t as UserAvatar } from "./_ssr/user-avatar-B0MFPv2B.mjs";
import { g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { $ as CircleCheck, Q as CircleX, g as Paperclip, y as MessageSquare } from "./_libs/lucide-react.mjs";
import { t as PageHeader } from "./_ssr/page-header-i5M1fODL.mjs";
import { n as StatusBadge } from "./_ssr/status-badge-GZfITurg.mjs";
import { u as format } from "./_libs/date-fns.mjs";
import { t as Textarea } from "./_ssr/textarea-CkreZCoA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.submissions-DsiWQ4L2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SubmissionsPage() {
	const [tasks, setTasks] = (0, import_react.useState)([]);
	const [users, setUsers] = (0, import_react.useState)([]);
	const [currentUser, setCurrentUser] = (0, import_react.useState)(null);
	const [comments, setComments] = (0, import_react.useState)({});
	const [processing, setProcessing] = (0, import_react.useState)({});
	const loadData = async () => {
		try {
			const [taskData, userData] = await Promise.all([api.getTasks(), api.getUsers()]);
			setTasks(taskData);
			setUsers(userData);
		} catch (err) {
			console.error(err);
		}
	};
	(0, import_react.useEffect)(() => {
		loadData();
		api.getCurrentUser().then((data) => setCurrentUser(data.user)).catch(() => {});
	}, []);
	const handleReview = async (taskId, subId, status) => {
		setProcessing((prev) => ({
			...prev,
			[subId]: true
		}));
		try {
			await api.updateSubmissionStatus(taskId, subId, status, comments[subId], currentUser?.id);
			toast.success(`Submission reviewed as ${status.replace("_", " ")}`);
			setComments((prev) => {
				const next = { ...prev };
				delete next[subId];
				return next;
			});
			loadData();
		} catch {
			toast.error("Failed to review submission");
		} finally {
			setProcessing((prev) => ({
				...prev,
				[subId]: false
			}));
		}
	};
	const rows = tasks.flatMap((t) => t.submissions.map((s) => ({
		task: t,
		sub: s,
		user: users.find((u) => u.id === t.assignedTo)
	})));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Submissions",
		description: "Review work submitted by your team and approve or request changes."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-4",
		children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground",
			children: "No submissions to review."
		}) : rows.map(({ task, sub, user }) => {
			const isPending = sub.status === "submitted" || sub.status === "under_review";
			const isSubProcessing = processing[sub.id];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border bg-card p-6 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4 md:flex-row md:items-start md:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserAvatar, {
								name: user?.name,
								avatar: user?.avatar,
								size: 40
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/tasks/$id",
										params: { id: task.id },
										className: "truncate text-base font-semibold hover:underline",
										children: task.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: sub.status })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-0.5 text-xs text-muted-foreground",
									children: [
										user?.name,
										" · submitted ",
										format(new Date(sub.at), "MMM d, yyyy · HH:mm")
									]
								})]
							})]
						}), isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									disabled: isSubProcessing,
									className: "hover:bg-destructive/10 hover:text-destructive",
									onClick: () => void handleReview(task.id, sub.id, "rejected"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "mr-1.5 h-4 w-4" }), "Reject"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									disabled: isSubProcessing,
									className: "hover:bg-warning/10 hover:text-warning-foreground",
									onClick: () => void handleReview(task.id, sub.id, "changes_requested"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "mr-1.5 h-4 w-4" }), "Request changes"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									disabled: isSubProcessing,
									className: "bg-success text-success-foreground hover:bg-success/90",
									onClick: () => void handleReview(task.id, sub.id, "approved"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-1.5 h-4 w-4" }), "Approve"]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm",
						children: sub.notes
					}),
					(sub.files.length > 0 || sub.links.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [sub.files.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => openMockFile(f),
							className: "inline-flex items-center gap-1 rounded-md border bg-primary/10 border-primary/20 hover:bg-primary/25 px-2 py-1 text-xs text-primary transition cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "h-3 w-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: f })]
						}, f)), sub.links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: l,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "inline-flex items-center rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-xs text-primary hover:bg-primary/20",
							children: l
						}, l))]
					}),
					isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						placeholder: "Leave a comment for the staff member...",
						rows: 2,
						className: "mt-4",
						value: comments[sub.id] ?? "",
						onChange: (e) => setComments((prev) => ({
							...prev,
							[sub.id]: e.target.value
						}))
					})
				]
			}, sub.id);
		})
	})] });
}
//#endregion
export { SubmissionsPage as component };
