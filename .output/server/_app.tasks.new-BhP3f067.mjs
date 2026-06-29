import { i as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as api } from "./_ssr/api-B2iW_vei.mjs";
import { t as Button } from "./_ssr/button-BYa1xzvG.mjs";
import { t as Input } from "./_ssr/input-D4-41uDG.mjs";
import { P as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { d as Send, g as Paperclip, o as Upload, p as Save, t as X } from "./_libs/lucide-react.mjs";
import { t as PageHeader } from "./_ssr/page-header-i5M1fODL.mjs";
import { t as Label } from "./_ssr/label-BElbQhCY.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./_ssr/select-DD2sPjjH.mjs";
import { t as Textarea } from "./_ssr/textarea-CkreZCoA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.tasks.new-BhP3f067.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NewTaskPage() {
	const nav = useNavigate();
	const [files, setFiles] = (0, import_react.useState)([]);
	const [users, setUsers] = (0, import_react.useState)([]);
	const [currentUser, setCurrentUser] = (0, import_react.useState)(null);
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [priority, setPriority] = (0, import_react.useState)("medium");
	const [dueDate, setDueDate] = (0, import_react.useState)("");
	const [selectedAssignees, setSelectedAssignees] = (0, import_react.useState)([]);
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		api.getUsers().then(setUsers).catch(() => {});
		api.getCurrentUser().then((data) => setCurrentUser(data.user)).catch(() => {});
	}, []);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!title.trim() || selectedAssignees.length === 0 || !dueDate) {
			toast.error("Please fill in all required fields and select at least one assignee.");
			return;
		}
		setSaving(true);
		try {
			await Promise.all(selectedAssignees.map((userId) => api.createTask({
				title,
				description,
				priority,
				dueDate: new Date(dueDate).toISOString(),
				assignedToId: userId,
				assignedById: currentUser?.id ?? "m1",
				attachments: files.map((name) => ({
					name,
					size: "1.2 MB"
				}))
			})));
			toast.success(`Successfully created and assigned ${selectedAssignees.length} task(s)!`);
			nav({ to: "/tasks" });
		} catch (err) {
			console.error(err);
			toast.error("Failed to create task(s)");
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Create new task",
			description: "Define the task and assign it to a team member."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (e) => void handleSubmit(e),
			className: "grid grid-cols-1 gap-6 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6 lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border bg-card p-6 shadow-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "title",
							children: "Task title *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "title",
							placeholder: "e.g. Design Q4 launch landing page",
							className: "mt-1.5",
							required: true,
							value: title,
							onChange: (e) => setTitle(e.target.value)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "desc",
							children: "Description"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "desc",
							rows: 6,
							placeholder: "Add context, goals, and acceptance criteria...",
							className: "mt-1.5",
							value: description,
							onChange: (e) => setDescription(e.target.value)
						})] })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border bg-card p-6 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "mb-3 block",
							children: "Attachments"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed py-10 text-center transition hover:border-primary/50 hover:bg-accent/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mb-2 h-6 w-6 text-muted-foreground" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: "Drop files here or click to upload"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "PDF, DOC, PNG, JPG up to 10MB"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									multiple: true,
									className: "hidden",
									onChange: (e) => {
										const f = Array.from(e.target.files ?? []).map((f) => f.name);
										setFiles((prev) => [...prev, ...f]);
									}
								})
							]
						}),
						files.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-2",
							children: files.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2 truncate",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "h-4 w-4 text-muted-foreground" }), f]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setFiles(files.filter((_, idx) => idx !== i)),
									className: "text-muted-foreground hover:text-destructive",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
								})]
							}, i))
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border bg-card p-6 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-4 text-sm font-semibold",
						children: "Details"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Priority" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: priority,
								onValueChange: setPriority,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "mt-1.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
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
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "due",
								children: "Due date *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "due",
								type: "date",
								className: "mt-1.5",
								required: true,
								value: dueDate,
								onChange: (e) => setDueDate(e.target.value)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-sm font-medium",
										children: "Assign to *"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-md border bg-card p-3 space-y-2 max-h-[220px] overflow-y-auto mt-1.5 shadow-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "flex items-center gap-2 cursor-pointer font-semibold text-primary text-xs py-1 select-none",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "checkbox",
													className: "rounded border-gray-300 text-primary focus:ring-primary h-4 w-4",
													checked: selectedAssignees.length === users.filter((u) => u.role === "staff").length && selectedAssignees.length > 0,
													onChange: (e) => {
														const staff = users.filter((u) => u.role === "staff");
														if (e.target.checked) setSelectedAssignees(staff.map((u) => u.id));
														else setSelectedAssignees([]);
													}
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Select All Staff" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t my-1" }),
											users.filter((u) => u.role === "staff").map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "flex items-center gap-2 cursor-pointer py-1 select-none text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "checkbox",
													className: "rounded border-gray-300 text-primary focus:ring-primary h-4 w-4",
													checked: selectedAssignees.includes(u.id),
													onChange: (e) => {
														if (e.target.checked) setSelectedAssignees((prev) => [...prev, u.id]);
														else setSelectedAssignees((prev) => prev.filter((id) => id !== u.id));
													}
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "truncate",
													children: [
														u.name,
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-[10px] text-muted-foreground",
															children: [
																"(",
																u.department,
																")"
															]
														})
													]
												})]
											}, u.id))
										]
									}),
									selectedAssignees.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[10px] text-muted-foreground mt-1",
										children: [
											"Selected: ",
											selectedAssignees.length,
											" staff member",
											selectedAssignees.length > 1 ? "s" : ""
										]
									})
								]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						className: "w-full",
						disabled: saving,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "mr-1.5 h-4 w-4" }), saving ? "Creating..." : "Create task"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						className: "w-full",
						onClick: () => toast("Draft saved"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-1.5 h-4 w-4" }), "Save as draft"]
					})]
				})]
			})]
		})]
	});
}
//#endregion
export { NewTaskPage as component };
