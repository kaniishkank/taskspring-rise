import { i as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as api } from "./_ssr/api-B2iW_vei.mjs";
import { t as Button } from "./_ssr/button-BYa1xzvG.mjs";
import { t as UserAvatar } from "./_ssr/user-avatar-B0MFPv2B.mjs";
import { g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { $ as CircleCheck, E as ListChecks, F as Clock, K as Activity, c as Timer, m as Plus, q as TriangleAlert } from "./_libs/lucide-react.mjs";
import { t as PageHeader } from "./_ssr/page-header-i5M1fODL.mjs";
import { n as StatusBadge, t as PriorityBadge } from "./_ssr/status-badge-GZfITurg.mjs";
import { a as isToday, c as isBefore, l as formatDistanceToNow, u as format } from "./_libs/date-fns.mjs";
import { t as StatCard } from "./_ssr/stat-card-CHro2gP3.mjs";
import { a as YAxis, c as Line, d as Pie, f as Cell, i as LineChart, l as CartesianGrid, m as Tooltip, n as PieChart, o as XAxis, p as ResponsiveContainer, r as BarChart, u as Bar } from "./_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.index-6ftURNVn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const [tasks, setTasks] = (0, import_react.useState)([]);
	const [notifications, setNotifications] = (0, import_react.useState)([]);
	const [users, setUsers] = (0, import_react.useState)([]);
	const [currentUser, setCurrentUser] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		async function load() {
			try {
				const [taskData, notificationData, userData, currentData] = await Promise.all([
					api.getTasks(),
					api.getNotifications(),
					api.getUsers(),
					api.getCurrentUser()
				]);
				setTasks(taskData);
				setNotifications(notificationData);
				setUsers(userData);
				setCurrentUser(currentData.user);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		}
		load();
	}, []);
	const total = tasks.length;
	const active = tasks.filter((t) => ["assigned", "in_progress"].includes(t.status)).length;
	const pending = tasks.filter((t) => ["submitted", "under_review"].includes(t.status)).length;
	const overdue = tasks.filter((t) => !["completed", "approved"].includes(t.status) && isBefore(new Date(t.dueDate), /* @__PURE__ */ new Date())).length;
	const completed = tasks.filter((t) => ["completed", "approved"].includes(t.status)).length;
	const statusData = [
		{
			name: "Assigned",
			value: tasks.filter((t) => t.status === "assigned").length,
			color: "var(--muted-foreground)"
		},
		{
			name: "In Progress",
			value: tasks.filter((t) => t.status === "in_progress").length,
			color: "var(--info)"
		},
		{
			name: "Review",
			value: pending,
			color: "var(--warning)"
		},
		{
			name: "Completed",
			value: completed,
			color: "var(--success)"
		},
		{
			name: "Rejected",
			value: tasks.filter((t) => t.status === "rejected").length,
			color: "var(--destructive)"
		}
	];
	const monthly = (0, import_react.useMemo)(() => {
		const months = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec"
		];
		const now = /* @__PURE__ */ new Date();
		const dataMap = {};
		for (let i = 5; i >= 0; i--) {
			const mLabel = months[new Date(now.getFullYear(), now.getMonth() - i, 1).getMonth()];
			dataMap[mLabel] = {
				month: mLabel,
				completed: 0,
				assigned: 0
			};
		}
		tasks.forEach((t) => {
			const mLabel = months[new Date(t.createdAt).getMonth()];
			if (dataMap[mLabel]) {
				dataMap[mLabel].assigned++;
				if (["completed", "approved"].includes(t.status)) dataMap[mLabel].completed++;
			}
		});
		return Object.values(dataMap);
	}, [tasks]);
	const team = (0, import_react.useMemo)(() => {
		return users.slice(0, 5).map((user) => ({
			name: user.name.split(" ")[0],
			tasks: tasks.filter((task) => task.assignedTo === user.id).length,
			completed: tasks.filter((task) => task.assignedTo === user.id && ["completed", "approved"].includes(task.status)).length
		}));
	}, [tasks, users]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl border bg-card p-8 text-sm text-muted-foreground",
		children: "Loading dashboard…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: currentUser?.role === "staff" ? "My dashboard" : "Manager dashboard",
			description: currentUser?.role === "staff" ? `Overview of ${currentUser?.name ?? "your"}'s tasks and upcoming deadlines.` : "Overview of tasks across your team this week.",
			actions: currentUser?.role !== "staff" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/tasks/new",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 h-4 w-4" }), "New task"]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total tasks",
					value: total,
					icon: ListChecks,
					tone: "primary"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Active",
					value: active,
					icon: Activity,
					tone: "info"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Pending review",
					value: pending,
					icon: Timer,
					tone: "warning"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Overdue",
					value: overdue,
					icon: TriangleAlert,
					tone: "danger"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Completed",
					value: completed,
					icon: CircleCheck,
					tone: "success"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border bg-card p-5 shadow-sm lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-between",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-semibold",
						children: "Monthly completion"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Tasks assigned vs completed"
					})] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 h-72",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
							data: monthly,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									stroke: "var(--border)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "month",
									stroke: "var(--muted-foreground)",
									fontSize: 12
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									stroke: "var(--muted-foreground)",
									fontSize: 12
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									background: "var(--popover)",
									border: "1px solid var(--border)",
									borderRadius: 8,
									color: "var(--popover-foreground)"
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "assigned",
									stroke: "var(--muted-foreground)",
									strokeWidth: 2,
									dot: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "completed",
									stroke: "var(--primary)",
									strokeWidth: 2.5,
									dot: { r: 3 }
								})
							]
						})
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border bg-card p-5 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-semibold",
						children: "Status distribution"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Current tasks by status"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 h-56",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: statusData,
								dataKey: "value",
								innerRadius: 50,
								outerRadius: 80,
								paddingAngle: 2,
								children: statusData.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: d.color }, i))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "var(--popover)",
								border: "1px solid var(--border)",
								borderRadius: 8,
								color: "var(--popover-foreground)"
							} })] })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 space-y-1.5 text-xs",
						children: statusData.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-2 w-2 rounded-full",
									style: { background: d.color }
								}), d.name]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: d.value
							})]
						}, d.name))
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3",
			children: currentUser?.role !== "staff" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border bg-card p-5 shadow-sm lg:col-span-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-semibold",
						children: "Team performance"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Assigned vs completed by team member"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: team,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										stroke: "var(--border)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "name",
										stroke: "var(--muted-foreground)",
										fontSize: 12
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										stroke: "var(--muted-foreground)",
										fontSize: 12
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										background: "var(--popover)",
										border: "1px solid var(--border)",
										borderRadius: 8
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "tasks",
										fill: "var(--muted-foreground)",
										radius: [
											4,
											4,
											0,
											0
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "completed",
										fill: "var(--primary)",
										radius: [
											4,
											4,
											0,
											0
										]
									})
								]
							})
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border bg-card p-5 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-semibold",
					children: "Recent activity"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-4",
					children: notifications.filter((n) => currentUser?.role !== "staff" || n.userId === currentUser?.id).slice(0, 5).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/12 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-sm font-medium",
									children: n.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "line-clamp-2 text-xs text-muted-foreground",
									children: n.message
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 text-[11px] text-muted-foreground",
									children: formatDistanceToNow(new Date(n.at), { addSuffix: true })
								})
							]
						})]
					}, n.id))
				})]
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border bg-card p-5 shadow-sm lg:col-span-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-semibold",
					children: "Recent activity"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-4",
					children: notifications.filter((n) => currentUser?.role !== "staff" || n.userId === currentUser?.id).slice(0, 5).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/12 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-sm font-medium",
									children: n.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "line-clamp-2 text-xs text-muted-foreground",
									children: n.message
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 text-[11px] text-muted-foreground",
									children: formatDistanceToNow(new Date(n.at), { addSuffix: true })
								})
							]
						})]
					}, n.id))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 rounded-xl border bg-card shadow-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-semibold",
					children: "Upcoming deadlines"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Tasks due in the next 7 days"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/tasks",
						children: "View all"
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y",
				children: tasks.filter((t) => !["completed", "approved"].includes(t.status)).filter((t) => currentUser?.role !== "staff" || t.assignedTo === currentUser?.id).slice(0, 5).map((t) => {
					const u = users.find((user) => user.id === t.assignedTo);
					const due = new Date(t.dueDate);
					const overdueTask = isBefore(due, /* @__PURE__ */ new Date()) && !isToday(due);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/tasks/$id",
						params: { id: t.id },
						className: "flex items-center gap-4 p-4 transition hover:bg-accent/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex min-w-0 flex-1 items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: `h-4 w-4 ${overdueTask ? "text-destructive" : "text-muted-foreground"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate text-sm font-medium",
										children: t.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: [
											t.id,
											" · Due ",
											format(due, "MMM d"),
											" ",
											overdueTask && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-destructive",
												children: "· overdue"
											})
										]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: t.priority }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: t.status }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden items-center gap-2 md:flex",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserAvatar, {
									name: u?.name,
									avatar: u?.avatar,
									size: 28
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm",
									children: u?.name
								})]
							})
						]
					}) }, t.id);
				})
			})]
		})
	] });
}
//#endregion
export { Dashboard as component };
