import { i as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as api } from "./_ssr/api-B2iW_vei.mjs";
import { t as Button } from "./_ssr/button-BYa1xzvG.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { $ as CircleCheck, A as FileText, E as ListChecks, F as Clock, j as FileSpreadsheet, q as TriangleAlert } from "./_libs/lucide-react.mjs";
import { t as PageHeader } from "./_ssr/page-header-i5M1fODL.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./_ssr/select-DD2sPjjH.mjs";
import { f as startOfYear, r as subDays, s as isSameDay, t as subWeeks, u as format } from "./_libs/date-fns.mjs";
import { t as StatCard } from "./_ssr/stat-card-CHro2gP3.mjs";
import { a as YAxis, h as Legend, l as CartesianGrid, m as Tooltip, o as XAxis, p as ResponsiveContainer, r as BarChart, s as Area, t as AreaChart, u as Bar } from "./_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.reports-C1Hw-MGD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReportsPage() {
	const [tasks, setTasks] = (0, import_react.useState)([]);
	const [users, setUsers] = (0, import_react.useState)([]);
	const [period, setPeriod] = (0, import_react.useState)("30d");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const loadData = async () => {
		try {
			const [taskData, userData] = await Promise.all([api.getTasks(), api.getUsers()]);
			setTasks(taskData);
			setUsers(userData);
		} catch {
			toast.error("Failed to load reports data");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadData();
	}, []);
	const filteredTasks = (0, import_react.useMemo)(() => {
		const now = /* @__PURE__ */ new Date();
		return tasks.filter((t) => {
			const created = new Date(t.createdAt);
			if (period === "7d") return created >= /* @__PURE__ */ new Date(Date.now() - 10080 * 60 * 1e3);
			if (period === "30d") return created >= /* @__PURE__ */ new Date(Date.now() - 720 * 60 * 60 * 1e3);
			if (period === "90d") return created >= /* @__PURE__ */ new Date(Date.now() - 2160 * 60 * 60 * 1e3);
			if (period === "ytd") return created >= startOfYear(now);
			return true;
		});
	}, [tasks, period]);
	const totalTasks = filteredTasks.length;
	const completedTasks = filteredTasks.filter((t) => ["completed", "approved"].includes(t.status)).length;
	const pendingTasks = filteredTasks.filter((t) => [
		"assigned",
		"in_progress",
		"submitted",
		"under_review",
		"rejected"
	].includes(t.status)).length;
	const overdueTasks = filteredTasks.filter((t) => {
		return !["completed", "approved"].includes(t.status) && new Date(t.dueDate) < /* @__PURE__ */ new Date();
	}).length;
	const trendData = (0, import_react.useMemo)(() => {
		if (period === "7d") return Array.from({ length: 7 }).map((_, i) => {
			const d = subDays(/* @__PURE__ */ new Date(), 6 - i);
			const dayLabel = format(d, "EEE");
			const dayTasks = filteredTasks.filter((t) => isSameDay(new Date(t.dueDate), d));
			return {
				name: dayLabel,
				completed: dayTasks.filter((t) => ["completed", "approved"].includes(t.status)).length,
				overdue: dayTasks.filter((t) => !["completed", "approved"].includes(t.status) && new Date(t.dueDate) < /* @__PURE__ */ new Date()).length
			};
		});
		if (period === "30d") return Array.from({ length: 30 }).map((_, i) => {
			const d = subDays(/* @__PURE__ */ new Date(), 29 - i);
			const dayLabel = format(d, "d MMM");
			const dayTasks = filteredTasks.filter((t) => isSameDay(new Date(t.dueDate), d));
			return {
				name: dayLabel,
				completed: dayTasks.filter((t) => ["completed", "approved"].includes(t.status)).length,
				overdue: dayTasks.filter((t) => !["completed", "approved"].includes(t.status) && new Date(t.dueDate) < /* @__PURE__ */ new Date()).length
			};
		});
		if (period === "90d") return Array.from({ length: 12 }).map((_, i) => {
			const start = subWeeks(/* @__PURE__ */ new Date(), 11 - i);
			const weekTasks = filteredTasks.filter((t) => {
				const d = new Date(t.dueDate);
				return d >= start && d <= subDays(start, -7);
			});
			const completed = weekTasks.filter((t) => ["completed", "approved"].includes(t.status)).length;
			const overdue = weekTasks.filter((t) => !["completed", "approved"].includes(t.status) && new Date(t.dueDate) < /* @__PURE__ */ new Date()).length;
			return {
				name: `Wk ${12 - i}`,
				completed,
				overdue
			};
		});
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
		const curMonth = (/* @__PURE__ */ new Date()).getMonth();
		return Array.from({ length: curMonth + 1 }).map((_, i) => {
			const monthTasks = filteredTasks.filter((t) => {
				const d = new Date(t.dueDate);
				return d.getMonth() === i && d.getFullYear() === (/* @__PURE__ */ new Date()).getFullYear();
			});
			const completed = monthTasks.filter((t) => ["completed", "approved"].includes(t.status)).length;
			const overdue = monthTasks.filter((t) => !["completed", "approved"].includes(t.status) && new Date(t.dueDate) < /* @__PURE__ */ new Date()).length;
			return {
				name: months[i],
				completed,
				overdue
			};
		});
	}, [filteredTasks, period]);
	const performanceData = (0, import_react.useMemo)(() => {
		return users.filter((u) => u.role === "staff").map((u) => {
			const userTasks = filteredTasks.filter((t) => t.assignedTo === u.id);
			let on_time = 0;
			let late = 0;
			userTasks.forEach((t) => {
				const isCompleted = ["completed", "approved"].includes(t.status);
				const dueDate = new Date(t.dueDate);
				if (isCompleted) {
					const latestSub = t.submissions?.find((s) => ["approved", "completed"].includes(s.status));
					if ((latestSub ? new Date(latestSub.at) : new Date(t.createdAt)) <= dueDate) on_time++;
					else late++;
				} else if (dueDate < /* @__PURE__ */ new Date()) late++;
				else on_time++;
			});
			return {
				name: u.name.split(" ")[0],
				on_time,
				late
			};
		});
	}, [filteredTasks, users]);
	const handleCSVExport = () => {
		const csvHeaders = ["Report Metric", "Value"];
		const csvRows = [
			["Report Period", period],
			["Total Tasks", totalTasks.toString()],
			["Completed Tasks", completedTasks.toString()],
			["Pending Tasks", pendingTasks.toString()],
			["Overdue Tasks", overdueTasks.toString()],
			[],
			["Staff Member Performance"],
			[
				"Name",
				"On Time Tasks",
				"Late/Overdue Tasks"
			]
		];
		performanceData.forEach((p) => {
			csvRows.push([
				p.name,
				p.on_time.toString(),
				p.late.toString()
			]);
		});
		const csvContent = [csvHeaders.join(","), ...csvRows.map((r) => r.map((c) => `"${c.replace(/"/g, "\"\"")}"`).join(","))].join("\n");
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute("download", `mgg_report_${period}_${format(/* @__PURE__ */ new Date(), "yyyyMMdd")}.csv`);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toast.success("Report exported successfully as CSV!");
	};
	const handleExcelExport = () => {
		const htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
      <!--[if gte mso 9]>
      <xml>
       <x:ExcelWorkbook>
        <x:ExcelWorksheets>
         <x:ExcelWorksheet>
          <x:Name>TaskFlow Report</x:Name>
          <x:WorksheetOptions>
           <x:DisplayGridlines/>
          </x:WorksheetOptions>
         </x:ExcelWorksheet>
        </x:ExcelWorksheets>
       </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        table { border-collapse: collapse; }
        td, th { border: 1px solid #cbd5e1; padding: 8px; font-family: sans-serif; font-size: 12px; }
        th { background-color: #f1f5f9; font-weight: bold; }
        .header-row { font-size: 16px; font-weight: bold; background-color: #4f46e5; color: white; text-align: center; }
        .section-row { font-size: 14px; font-weight: bold; background-color: #e2e8f0; }
      </style>
      </head>
      <body>
      <table>
        <tr><th colspan="3" class="header-row">TaskFlow Report (Period: ${period.toUpperCase()})</th></tr>
        <tr><th>Metric</th><th colspan="2">Value</th></tr>
        <tr><td>Total Tasks</td><td colspan="2">${totalTasks}</td></tr>
        <tr><td>Completed Tasks</td><td colspan="2">${completedTasks}</td></tr>
        <tr><td>Pending Tasks</td><td colspan="2">${pendingTasks}</td></tr>
        <tr><td>Overdue Tasks</td><td colspan="2">${overdueTasks}</td></tr>
        <tr><td colspan="3"></td></tr>
        <tr><th colspan="3" class="section-row">Staff Member Performance</th></tr>
        <tr><th>Name</th><th>On Time Tasks</th><th>Late/Overdue Tasks</th></tr>
        ${performanceData.map((p) => `<tr><td>${p.name}</td><td>${p.on_time}</td><td>${p.late}</td></tr>`).join("")}
      </table>
      </body>
      </html>
    `;
		const blob = new Blob([htmlContent], { type: "application/vnd.ms-excel;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute("download", `mgg_report_${period}_${format(/* @__PURE__ */ new Date(), "yyyyMMdd")}.xls`);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toast.success("Report exported successfully as Excel!");
	};
	const handlePDFExport = () => {
		window.print();
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl border bg-card p-8 text-sm text-muted-foreground",
		children: "Loading reports data…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        @media print {
          aside, nav, header, button, .no-print, [role="combobox"], .flex-wrap {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
          }
          body {
            background: white !important;
          }
          .print-full-width {
            grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
            width: 100% !important;
          }
        }
      ` }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Reports",
			description: "Trends and performance analytics.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2 no-print",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: period,
						onValueChange: setPeriod,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-[140px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "7d",
								children: "Last 7 days"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "30d",
								children: "Last 30 days"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "90d",
								children: "Last 90 days"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "ytd",
								children: "Year to date"
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: handlePDFExport,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "mr-1.5 h-4 w-4" }), "PDF"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: handleExcelExport,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "mr-1.5 h-4 w-4" }), "Excel"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: handleCSVExport,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "mr-1.5 h-4 w-4" }), "CSV"]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-4 md:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total tasks",
					value: totalTasks,
					icon: ListChecks,
					tone: "primary"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Completed",
					value: completedTasks,
					icon: CircleCheck,
					tone: "success"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Pending",
					value: pendingTasks,
					icon: Clock,
					tone: "warning"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Overdue",
					value: overdueTasks,
					icon: TriangleAlert,
					tone: "danger"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3 print-full-width",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border bg-card p-5 shadow-sm lg:col-span-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-semibold",
						children: "Completion trend"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Completed and overdue tasks per period"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 h-72",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
								data: trendData,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "g1",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "0%",
											stopColor: "var(--primary)",
											stopOpacity: .4
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "100%",
											stopColor: "var(--primary)",
											stopOpacity: 0
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "g2",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "0%",
											stopColor: "var(--destructive)",
											stopOpacity: .35
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "100%",
											stopColor: "var(--destructive)",
											stopOpacity: 0
										})]
									})] }),
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
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "completed",
										stroke: "var(--primary)",
										fill: "url(#g1)",
										strokeWidth: 2.5
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "overdue",
										stroke: "var(--destructive)",
										fill: "url(#g2)",
										strokeWidth: 2
									})
								]
							})
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border bg-card p-5 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-semibold",
						children: "Performance"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "On time vs late by member"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 h-72",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: performanceData,
								layout: "vertical",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										stroke: "var(--border)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										type: "number",
										stroke: "var(--muted-foreground)",
										fontSize: 12
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										type: "category",
										dataKey: "name",
										stroke: "var(--muted-foreground)",
										fontSize: 12,
										width: 60
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										background: "var(--popover)",
										border: "1px solid var(--border)",
										borderRadius: 8
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 12 } }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "on_time",
										stackId: "a",
										fill: "var(--primary)",
										radius: [
											0,
											4,
											4,
											0
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "late",
										stackId: "a",
										fill: "var(--destructive)",
										radius: [
											0,
											4,
											4,
											0
										]
									})
								]
							})
						})
					})
				]
			})]
		})
	] });
}
//#endregion
export { ReportsPage as component };
