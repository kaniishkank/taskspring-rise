import { i as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { n as cn, t as api } from "./_ssr/api-B2iW_vei.mjs";
import { t as Button } from "./_ssr/button-BYa1xzvG.mjs";
import { t as Input } from "./_ssr/input-D4-41uDG.mjs";
import { g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { R as ChevronRight, z as ChevronLeft } from "./_libs/lucide-react.mjs";
import { t as PageHeader } from "./_ssr/page-header-i5M1fODL.mjs";
import { t as PriorityBadge } from "./_ssr/status-badge-GZfITurg.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./_ssr/dialog-C5thIHA8.mjs";
import { t as Label } from "./_ssr/label-BElbQhCY.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./_ssr/select-DD2sPjjH.mjs";
import { d as startOfWeek, g as addMonths, h as endOfMonth, i as startOfMonth, m as eachDayOfInterval, n as subMonths, o as isSameMonth, p as endOfWeek, s as isSameDay, u as format } from "./_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.calendar-B7USnFL1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var priorityDot = {
	low: "bg-muted-foreground",
	medium: "bg-info",
	high: "bg-warning",
	urgent: "bg-destructive"
};
function CalendarPage() {
	const [cursor, setCursor] = (0, import_react.useState)(/* @__PURE__ */ new Date());
	const [view, setView] = (0, import_react.useState)("month");
	const [tasks, setTasks] = (0, import_react.useState)([]);
	const [users, setUsers] = (0, import_react.useState)([]);
	const [currentUser, setCurrentUser] = (0, import_react.useState)(null);
	const [isAddOpen, setIsAddOpen] = (0, import_react.useState)(false);
	const [selectedDate, setSelectedDate] = (0, import_react.useState)(null);
	const [newTitle, setNewTitle] = (0, import_react.useState)("");
	const [newPriority, setNewPriority] = (0, import_react.useState)("medium");
	const [newAssignedToId, setNewAssignedToId] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const loadData = async () => {
		try {
			const [taskData, userData] = await Promise.all([api.getTasks(), api.getUsers()]);
			setTasks(taskData);
			setUsers(userData);
		} catch {}
	};
	(0, import_react.useEffect)(() => {
		loadData();
		api.getCurrentUser().then((data) => setCurrentUser(data.user)).catch(() => {});
	}, []);
	const days = eachDayOfInterval({
		start: startOfWeek(startOfMonth(cursor)),
		end: endOfWeek(endOfMonth(cursor))
	});
	const tasksByDay = (d) => tasks.filter((t) => currentUser?.role !== "staff" || t.assignedTo === currentUser?.id).filter((t) => isSameDay(new Date(t.dueDate), d));
	const handleDragStart = (e, id) => {
		if (currentUser?.role === "staff") {
			e.preventDefault();
			return;
		}
		e.dataTransfer.setData("text/plain", id);
	};
	const handleDragOver = (e) => {
		e.preventDefault();
	};
	const handleDrop = async (e, d) => {
		e.preventDefault();
		if (currentUser?.role === "staff") return;
		const taskId = e.dataTransfer.getData("text/plain");
		if (!taskId) return;
		setTasks((prev) => prev.map((t) => t.id === taskId ? {
			...t,
			dueDate: d.toISOString()
		} : t));
		try {
			await api.updateTaskDueDate(taskId, d.toISOString());
			toast.success("Task rescheduled successfully");
			loadData();
		} catch {
			toast.error("Failed to reschedule task");
			loadData();
		}
	};
	const handleDayClick = (d) => {
		setSelectedDate(d);
		setNewTitle("");
		setNewPriority("medium");
		setNewAssignedToId("");
		setIsAddOpen(true);
	};
	const handleQuickAdd = async (e) => {
		e.preventDefault();
		if (!newTitle.trim() || !newAssignedToId || !selectedDate) {
			toast.error("Please fill in task title and assignee.");
			return;
		}
		setSaving(true);
		try {
			await api.createTask({
				title: newTitle,
				description: "Created quickly from calendar view.",
				priority: newPriority,
				dueDate: selectedDate.toISOString(),
				assignedToId: newAssignedToId,
				assignedById: currentUser?.id ?? "m1",
				attachments: []
			});
			toast.success("Task created successfully!");
			setIsAddOpen(false);
			loadData();
		} catch {
			toast.error("Failed to create task");
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Calendar",
			description: "Task deadlines and upcoming work. Drag cards to reschedule or double-click a day to add.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1 rounded-md border bg-card p-1 text-xs",
				children: [
					"month",
					"week",
					"day"
				].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setView(v),
					className: cn("rounded px-3 py-1.5 capitalize transition font-medium", view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"),
					children: v
				}, v))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border bg-card shadow-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-semibold",
						children: format(cursor, "MMMM yyyy")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "icon",
								onClick: () => setCursor(subMonths(cursor, 1)),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setCursor(/* @__PURE__ */ new Date()),
								children: "Today"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "icon",
								onClick: () => setCursor(addMonths(cursor, 1)),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-7 border-b text-center text-xs font-medium uppercase tracking-wide text-muted-foreground",
					children: [
						"Sun",
						"Mon",
						"Tue",
						"Wed",
						"Thu",
						"Fri",
						"Sat"
					].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-2",
						children: d
					}, d))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-7",
					children: days.map((d) => {
						const inMonth = isSameMonth(d, cursor);
						const dayTasks = tasksByDay(d);
						const isToday = isSameDay(d, /* @__PURE__ */ new Date());
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onDragOver: handleDragOver,
							onDrop: (e) => void handleDrop(e, d),
							onDoubleClick: () => {
								if (currentUser?.role !== "staff") handleDayClick(d);
							},
							className: cn("min-h-28 border-b border-r p-2 text-xs transition-colors hover:bg-muted/10", !inMonth && "bg-muted/20 text-muted-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium", isToday && "bg-primary text-primary-foreground"),
									children: format(d, "d")
								}), currentUser?.role !== "staff" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => handleDayClick(d),
									className: "h-4 w-4 rounded border text-[9px] flex items-center justify-center hover:bg-accent text-muted-foreground",
									title: "Add task",
									children: "+"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [dayTasks.slice(0, 3).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/tasks/$id",
									params: { id: t.id },
									draggable: currentUser?.role !== "staff",
									onDragStart: (e) => handleDragStart(e, t.id),
									className: "flex items-center gap-1.5 truncate rounded border bg-background px-1.5 py-1 hover:bg-accent cursor-grab active:cursor-grabbing text-[11px] shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-1.5 w-1.5 shrink-0 rounded-full", priorityDot[t.priority]) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: t.title
									})]
								}, t.id)), dayTasks.length > 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "px-1 text-[10px] text-muted-foreground",
									children: [
										"+",
										dayTasks.length - 3,
										" more"
									]
								})]
							})]
						}, d.toISOString());
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 rounded-xl border bg-card p-5 shadow-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-3 text-sm font-semibold",
				children: "Legend"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-4 text-xs",
				children: [
					"low",
					"medium",
					"high",
					"urgent"
				].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-2 w-2 rounded-full", priorityDot[p]) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: p })]
				}, p))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: isAddOpen,
			onOpenChange: setIsAddOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "sm:max-w-[400px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Quick Create Task" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => void handleQuickAdd(e),
					className: "space-y-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Due Date"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold mt-1",
							children: selectedDate ? format(selectedDate, "eeee, MMMM d, yyyy") : ""
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "quick-title",
								children: "Task Title *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "quick-title",
								required: true,
								value: newTitle,
								onChange: (e) => setNewTitle(e.target.value),
								placeholder: "Task description..."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Priority" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: newPriority,
								onValueChange: setNewPriority,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
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
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Assign to *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: newAssignedToId,
								onValueChange: setNewAssignedToId,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose a staff member" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: users.filter((u) => u.role === "staff").map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: u.id,
									children: [
										u.name,
										" · ",
										u.department
									]
								}, u.id)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setIsAddOpen(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: saving,
								children: saving ? "Creating..." : "Create Task"
							})]
						})
					]
				})]
			})
		})
	] });
}
//#endregion
export { CalendarPage as component };
