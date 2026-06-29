import { i as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { n as cn, t as api } from "./_ssr/api-B2iW_vei.mjs";
import { t as Button } from "./_ssr/button-BYa1xzvG.mjs";
import { t as Input } from "./_ssr/input-D4-41uDG.mjs";
import { t as UserAvatar } from "./_ssr/user-avatar-B0MFPv2B.mjs";
import { g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { D as LayoutGrid, P as Download, T as List, Z as Funnel, f as Search, m as Plus } from "./_libs/lucide-react.mjs";
import { t as PageHeader } from "./_ssr/page-header-i5M1fODL.mjs";
import { n as StatusBadge, t as PriorityBadge } from "./_ssr/status-badge-GZfITurg.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./_ssr/select-DD2sPjjH.mjs";
import { u as format } from "./_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.tasks.index-tHLVwFP3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLUMNS = [
	{
		value: "assigned",
		label: "Assigned",
		tone: "border-t-2 border-t-muted-foreground/50 bg-muted/5"
	},
	{
		value: "in_progress",
		label: "In Progress",
		tone: "border-t-2 border-t-blue-500 bg-blue-500/5"
	},
	{
		value: "submitted",
		label: "Submitted",
		tone: "border-t-2 border-t-amber-500 bg-amber-500/5"
	},
	{
		value: "under_review",
		label: "Under Review",
		tone: "border-t-2 border-t-purple-500 bg-purple-500/5"
	},
	{
		value: "approved",
		label: "Approved",
		tone: "border-t-2 border-t-emerald-500 bg-emerald-500/5"
	},
	{
		value: "rejected",
		label: "Rejected",
		tone: "border-t-2 border-t-destructive bg-destructive/5"
	}
];
function TasksPage() {
	const [tasks, setTasks] = (0, import_react.useState)([]);
	const [users, setUsers] = (0, import_react.useState)([]);
	const [currentUser, setCurrentUser] = (0, import_react.useState)(null);
	const [q, setQ] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [priority, setPriority] = (0, import_react.useState)("all");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [viewMode, setViewMode] = (0, import_react.useState)("list");
	const [page, setPage] = (0, import_react.useState)(0);
	const PAGE_SIZE = 10;
	const loadData = async () => {
		try {
			const [taskData, userData, currentData] = await Promise.all([
				api.getTasks(),
				api.getUsers(),
				api.getCurrentUser()
			]);
			setTasks(taskData);
			setUsers(userData);
			setCurrentUser(currentData.user);
		} catch (err) {
			console.error(err);
			toast.error("Failed to load tasks");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadData();
	}, []);
	(0, import_react.useEffect)(() => {
		setPage(0);
	}, [
		q,
		status,
		priority
	]);
	const filtered = (0, import_react.useMemo)(() => tasks.filter((t) => (status === "all" || t.status === status) && (priority === "all" || t.priority === priority) && (q === "" || t.title.toLowerCase().includes(q.toLowerCase()) || t.id.toLowerCase().includes(q.toLowerCase()))), [
		tasks,
		q,
		status,
		priority
	]);
	const paginated = (0, import_react.useMemo)(() => {
		return filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
	}, [filtered, page]);
	const handleExport = () => {
		if (filtered.length === 0) {
			toast.error("No tasks to export.");
			return;
		}
		const headers = [
			"Task ID",
			"Title",
			"Description",
			"Priority",
			"Status",
			"Assigned To",
			"Assigned By",
			"Due Date",
			"Created Date",
			"Attachments",
			"Comments",
			"Submissions"
		];
		const formatCell = (val) => {
			if (val === null || val === void 0) return `"-"`;
			const trimmed = val.trim();
			if (trimmed === "") return `"-"`;
			return `"${trimmed.replace(/"/g, "\"\"")}"`;
		};
		const rows = filtered.map((t) => {
			const assignee = users.find((u) => u.id === t.assignedTo)?.name || t.assignedTo;
			const creator = users.find((u) => u.id === t.assignedBy)?.name || t.assignedBy;
			const attachmentsList = (t.attachments || []).map((att) => att.name).join("; ");
			const commentsList = (t.comments || []).map((c) => {
				return `[${users.find((u) => u.id === c.userId)?.name || c.userId}]: ${c.text}`;
			}).join("; ");
			const submissionsList = (t.submissions || []).map((s) => {
				return `Notes: ${s.notes} (Status: ${s.status})`;
			}).join("; ");
			return [
				formatCell(t.id),
				formatCell(t.title),
				formatCell(t.description),
				formatCell(t.priority),
				formatCell(t.status),
				formatCell(assignee),
				formatCell(creator),
				formatCell(t.dueDate ? format(new Date(t.dueDate), "yyyy-MM-dd") : ""),
				formatCell(t.createdAt ? format(new Date(t.createdAt), "yyyy-MM-dd") : ""),
				formatCell(attachmentsList),
				formatCell(commentsList),
				formatCell(submissionsList)
			];
		});
		const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute("download", `mgg_tasks_export_${format(/* @__PURE__ */ new Date(), "yyyyMMdd_HHmmss")}.csv`);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toast.success("Tasks exported successfully as CSV!");
	};
	const handleDragStart = (e, taskId) => {
		e.dataTransfer.setData("text/plain", taskId);
	};
	const handleDragOver = (e) => {
		e.preventDefault();
	};
	const handleDrop = async (e, newStatus) => {
		e.preventDefault();
		const taskId = e.dataTransfer.getData("text/plain");
		if (!taskId) return;
		const task = tasks.find((t) => t.id === taskId);
		if (!task) return;
		if (task.status === newStatus) return;
		setTasks((prev) => prev.map((t) => t.id === taskId ? {
			...t,
			status: newStatus
		} : t));
		try {
			await api.updateTaskStatus(taskId, newStatus);
			toast.success(`Task status updated to ${newStatus.replace("_", " ")}`);
		} catch (err) {
			console.error(err);
			toast.error("Failed to update status");
			loadData();
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl border bg-card p-8 text-sm text-muted-foreground",
		children: "Loading tasks…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Tasks",
			description: "Track and manage every task across your team.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex rounded-md border bg-card p-1 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setViewMode("list"),
							className: cn("flex items-center gap-1.5 rounded px-3 py-1.5 transition", viewMode === "list" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:text-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "h-3.5 w-3.5" }), "List"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setViewMode("board"),
							className: cn("flex items-center gap-1.5 rounded px-3 py-1.5 transition", viewMode === "board" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:text-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "h-3.5 w-3.5" }), "Board"]
						})]
					}),
					"             ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: handleExport,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1.5 h-4 w-4" }), "Export"]
					}),
					currentUser?.role !== "staff" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/tasks/new",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 h-4 w-4" }), "Create task"]
						})
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-col gap-3 md:flex-row md:items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Search by title or ID...",
					className: "pl-9",
					value: q,
					onChange: (e) => setQ(e.target.value)
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-4 w-4 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: status,
						onValueChange: (v) => setStatus(v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-[160px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Status" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All statuses"
						}), COLUMNS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: c.value,
							children: c.label
						}, c.value))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: priority,
						onValueChange: (v) => setPriority(v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-[140px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Priority" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "All priorities"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "low",
								children: "Low"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "medium",
								children: "Medium"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "high",
								children: "High"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "urgent",
								children: "Urgent"
							})
						] })]
					})
				]
			})]
		}),
		viewMode === "list" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border bg-card shadow-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b text-left text-xs uppercase tracking-wide text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Task ID"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Title"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Priority"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Assigned to"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Due date"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Status"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [paginated.map((t) => {
						const u = users.find((user) => user.id === t.assignedTo);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b last:border-0 hover:bg-accent/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-mono text-xs text-muted-foreground",
									children: t.id
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/tasks/$id",
										params: { id: t.id },
										className: "font-medium hover:underline",
										children: t.title
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: t.priority })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserAvatar, {
											name: u?.name,
											avatar: u?.avatar,
											size: 26
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: u?.name
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: format(new Date(t.dueDate), "MMM d, yyyy")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: t.status })
								})
							]
						}, t.id);
					}), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 6,
						className: "px-4 py-10 text-center text-sm text-muted-foreground",
						children: "No tasks match your filters."
					}) })] })]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-t p-3 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"Showing ",
					filtered.length > 0 ? page * PAGE_SIZE + 1 : 0,
					" - ",
					Math.min((page + 1) * PAGE_SIZE, filtered.length),
					" of ",
					filtered.length,
					" tasks"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => setPage((p) => Math.max(p - 1, 0)),
						disabled: page === 0,
						children: "Previous"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => setPage((p) => p + 1),
						disabled: (page + 1) * PAGE_SIZE >= filtered.length,
						children: "Next"
					})]
				})]
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-4 overflow-x-auto pb-6 snap-x min-h-[500px]",
			children: COLUMNS.map((col) => {
				const colTasks = filtered.filter((t) => t.status === col.value);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					onDragOver: handleDragOver,
					onDrop: (e) => void handleDrop(e, col.value),
					className: cn("flex w-72 shrink-0 flex-col rounded-xl border p-3 transition snap-start", col.tone),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-sm font-semibold",
							children: col.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded bg-background px-2 py-0.5 text-xs font-semibold text-muted-foreground border",
							children: colTasks.length
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-1 flex-col gap-2 overflow-y-auto max-h-[600px] min-h-[250px]",
						children: [colTasks.map((t) => {
							const u = users.find((user) => user.id === t.assignedTo);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								draggable: true,
								onDragStart: (e) => handleDragStart(e, t.id),
								className: "group relative flex cursor-grab flex-col rounded-lg border bg-card p-4 shadow-sm hover:shadow-md transition active:cursor-grabbing hover:-translate-y-0.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-[11px] text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono",
											children: t.id
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: t.priority })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
										className: "mt-2 text-sm font-semibold text-foreground group-hover:text-primary leading-snug",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/tasks/$id",
											params: { id: t.id },
											className: "hover:underline",
											children: t.title
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 line-clamp-2 text-xs text-muted-foreground leading-normal",
										children: t.description
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 flex items-center justify-between pt-2 border-t",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserAvatar, {
												name: u?.name,
												avatar: u?.avatar,
												size: 20
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "max-w-[100px] truncate text-[11px] text-muted-foreground",
												children: u?.name
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-medium text-muted-foreground",
											children: format(new Date(t.dueDate), "MMM d")
										})]
									})
								]
							}, t.id);
						}), colTasks.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-1 flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted/50 p-6 text-center text-xs text-muted-foreground",
							children: "Drag tasks here"
						})]
					})]
				}, col.value);
			})
		})
	] });
}
//#endregion
export { TasksPage as component };
