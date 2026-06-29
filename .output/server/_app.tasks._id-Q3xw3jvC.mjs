import { i as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { r as openMockFile, t as api } from "./_ssr/api-B2iW_vei.mjs";
import { t as Button } from "./_ssr/button-BYa1xzvG.mjs";
import { t as UserAvatar } from "./_ssr/user-avatar-B0MFPv2B.mjs";
import { g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { $ as CircleCheck, G as ArrowLeft, Q as CircleX, U as Calendar, d as Send, g as Paperclip, r as User, y as MessageSquare } from "./_libs/lucide-react.mjs";
import { t as PageHeader } from "./_ssr/page-header-i5M1fODL.mjs";
import { n as StatusBadge, t as PriorityBadge } from "./_ssr/status-badge-GZfITurg.mjs";
import { l as formatDistanceToNow, u as format } from "./_libs/date-fns.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./_ssr/tabs-Dn910njg.mjs";
import { t as Textarea } from "./_ssr/textarea-CkreZCoA.mjs";
import { t as Route } from "./_app.tasks._id-DalCmUR4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.tasks._id-Q3xw3jvC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TaskDetail() {
	const { id } = Route.useParams();
	const [task, setTask] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [users, setUsers] = (0, import_react.useState)([]);
	const [currentUser, setCurrentUser] = (0, import_react.useState)(null);
	const [commentText, setCommentText] = (0, import_react.useState)("");
	const [submissionNotes, setSubmissionNotes] = (0, import_react.useState)("");
	const [submissionLink, setSubmissionLink] = (0, import_react.useState)("");
	const [submittingWork, setSubmittingWork] = (0, import_react.useState)(false);
	const [reviewing, setReviewing] = (0, import_react.useState)(false);
	const loadTask = async () => {
		try {
			setTask(await api.getTask(id));
		} catch (err) {
			console.error(err);
		}
	};
	(0, import_react.useEffect)(() => {
		const init = async () => {
			try {
				const [freshTask, userData, currentData] = await Promise.all([
					api.getTask(id),
					api.getUsers(),
					api.getCurrentUser()
				]);
				setTask(freshTask);
				setUsers(userData);
				setCurrentUser(currentData.user);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};
		init();
	}, [id]);
	const handleAddComment = async (e) => {
		e.preventDefault();
		if (!commentText.trim() || !currentUser) return;
		try {
			await api.addComment(task.id, currentUser.id, commentText);
			toast.success("Comment added");
			setCommentText("");
			loadTask();
		} catch {
			toast.error("Failed to add comment");
		}
	};
	const handleSubmitWork = async (e) => {
		e.preventDefault();
		if (!submissionNotes.trim() || !currentUser) return;
		setSubmittingWork(true);
		try {
			await api.createSubmission(task.id, {
				userId: currentUser.id,
				notes: submissionNotes,
				files: ["proof.png"],
				links: submissionLink ? [submissionLink] : [],
				status: "submitted"
			});
			toast.success("Proof of work submitted!");
			setSubmissionNotes("");
			setSubmissionLink("");
			loadTask();
		} catch {
			toast.error("Failed to submit work");
		} finally {
			setSubmittingWork(false);
		}
	};
	const handleReview = async (reviewStatus) => {
		setReviewing(true);
		const latestSub = task.submissions[task.submissions.length - 1];
		try {
			if (latestSub) await api.updateSubmissionStatus(task.id, latestSub.id, reviewStatus, `Reviewed: ${reviewStatus.replace("_", " ")}`, currentUser?.id);
			else {
				let taskStatus = "assigned";
				if (reviewStatus === "approved") taskStatus = "approved";
				else if (reviewStatus === "rejected") taskStatus = "rejected";
				else if (reviewStatus === "changes_requested") taskStatus = "in_progress";
				await api.updateTaskStatus(task.id, taskStatus);
			}
			toast.success(`Task reviewed: ${reviewStatus.replace("_", " ")}`);
			loadTask();
		} catch {
			toast.error("Failed to review task");
		} finally {
			setReviewing(false);
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center py-20 gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm text-muted-foreground font-medium",
			children: "Loading task details…"
		})]
	});
	if (!task) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid place-items-center py-20 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-semibold text-destructive",
				children: "Task Not Found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mt-1.5",
				children: "This task may have been deleted or does not exist."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/tasks",
					children: "Back to tasks"
				})
			})
		] })
	});
	const assignee = users.find((u) => u.id === task.assignedTo);
	const assigner = users.find((u) => u.id === task.assignedBy);
	const isAssignee = currentUser && task.assignedTo === currentUser.id;
	const showReviewActions = currentUser && ["manager", "super_admin"].includes(currentUser.role) && [
		"submitted",
		"under_review",
		"assigned",
		"in_progress",
		"rejected"
	].includes(task.status);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/tasks",
			className: "mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Back to tasks"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: task.title,
			description: `${task.id} · Created ${format(new Date(task.createdAt), "MMM d, yyyy")}`,
			actions: showReviewActions && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						className: "hover:bg-destructive/10 hover:text-destructive",
						onClick: () => void handleReview("rejected"),
						disabled: reviewing,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "mr-1.5 h-4 w-4" }), "Reject"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						className: "hover:bg-warning/10 hover:text-warning-foreground",
						onClick: () => void handleReview("changes_requested"),
						disabled: reviewing,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "mr-1.5 h-4 w-4" }), "Request changes"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => void handleReview("approved"),
						disabled: reviewing,
						className: "bg-success text-success-foreground hover:bg-success/90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-1.5 h-4 w-4" }), "Approve"]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-6 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6 lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border bg-card p-6 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: task.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: task.priority })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-muted-foreground",
						children: task.description
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					defaultValue: "overview",
					className: "w-full",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "overview",
								children: "Overview"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "submissions",
								children: [
									"Submissions (",
									task.submissions.length,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "activity",
								children: "Activity log"
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "overview",
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border bg-card p-6 shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mb-4 text-sm font-semibold",
										children: "Attachments"
									}), task.attachments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm text-muted-foreground",
										children: "No attachments"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "space-y-2",
										children: task.attachments.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => openMockFile(a.name),
												className: "flex items-center gap-2 hover:underline hover:text-primary transition text-left",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "h-4 w-4 text-muted-foreground shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium",
													children: a.name
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-muted-foreground",
												children: a.size
											})]
										}, a.name))
									})]
								}),
								isAssignee && !["approved", "completed"].includes(task.status) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border bg-card p-6 shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "mb-4 text-sm font-semibold flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-primary" }), "Submit Proof of Work"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										onSubmit: (e) => void handleSubmitWork(e),
										className: "space-y-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "notes",
												children: "Submission Notes *"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
												id: "notes",
												placeholder: "Detail what you accomplished...",
												className: "mt-1.5",
												rows: 3,
												required: true,
												value: submissionNotes,
												onChange: (e) => setSubmissionNotes(e.target.value)
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "link",
												children: "Reference Links (Optional)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "link",
												type: "url",
												placeholder: "https://example.com/project-link",
												className: "mt-1.5",
												value: submissionLink,
												onChange: (e) => setSubmissionLink(e.target.value)
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex justify-end",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													type: "submit",
													disabled: submittingWork,
													children: submittingWork ? "Submitting..." : "Submit Task"
												})
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border bg-card p-6 shadow-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "mb-4 text-sm font-semibold flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-4 w-4" }), "Comments"]
										}),
										task.comments.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
											className: "space-y-4",
											children: task.comments.map((c) => {
												const u = users.find((user) => user.id === c.userId);
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
													className: "flex gap-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserAvatar, {
														name: u?.name,
														avatar: u?.avatar,
														size: 32
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "min-w-0 flex-1 rounded-lg border bg-muted/30 p-3",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-baseline justify-between gap-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-sm font-medium",
																children: u?.name
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-xs text-muted-foreground",
																children: formatDistanceToNow(new Date(c.at), { addSuffix: true })
															})]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "mt-1 text-sm text-muted-foreground",
															children: c.text
														})]
													})]
												}, c.id);
											})
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm text-muted-foreground",
											children: "No comments yet"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
											onSubmit: (e) => void handleAddComment(e),
											className: "mt-4 flex flex-col gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
												placeholder: "Write a comment...",
												rows: 3,
												value: commentText,
												onChange: (e) => setCommentText(e.target.value)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex justify-end",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													size: "sm",
													type: "submit",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "mr-1.5 h-3.5 w-3.5" }), "Comment"]
												})
											})]
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "submissions",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl border bg-card p-6 shadow-sm",
								children: task.submissions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm text-muted-foreground",
									children: "No submissions yet."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-4",
									children: [...task.submissions].reverse().map((s) => {
										const subUser = users.find((user) => user.id === s.userId);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "rounded-lg border p-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserAvatar, {
															name: subUser?.name,
															avatar: subUser?.avatar,
															size: 24
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-xs font-semibold",
															children: subUser?.name
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: s.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-xs text-muted-foreground",
															children: format(new Date(s.at), "MMM d, yyyy · HH:mm")
														})]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-3 text-sm",
													children: s.notes
												}),
												s.files && s.files.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-3 flex flex-wrap gap-2",
													children: s.files.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														onClick: () => openMockFile(f),
														className: "inline-flex items-center gap-1 rounded-md border bg-primary/10 border-primary/20 hover:bg-primary/25 px-2 py-1 text-xs text-primary transition cursor-pointer",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "h-3 w-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: f })]
													}, f))
												}),
												s.links && s.links.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
													className: "mt-2 space-y-1 text-xs text-primary",
													children: s.links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
														href: l,
														target: "_blank",
														rel: "noopener noreferrer",
														className: "hover:underline",
														children: l
													}) }, l))
												})
											]
										}, s.id);
									})
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "activity",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl border bg-card p-6 shadow-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
									className: "relative space-y-5 border-l pl-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -left-1.5 h-3 w-3 rounded-full bg-primary" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm font-medium",
												children: "Task created"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground",
												children: format(new Date(task.createdAt), "MMM d, yyyy · HH:mm")
											})
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -left-1.5 h-3 w-3 rounded-full bg-info" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-sm font-medium",
												children: ["Assigned to ", assignee?.name]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs text-muted-foreground",
												children: ["by ", assigner?.name]
											})
										] }),
										task.submissions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -left-1.5 h-3 w-3 rounded-full bg-warning" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-sm font-medium",
												children: ["Submission ", s.status.replace("_", " ")]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground",
												children: format(new Date(s.at), "MMM d, yyyy · HH:mm")
											})
										] }, s.id))
									]
								})
							})
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border bg-card p-6 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-4 text-sm font-semibold",
						children: "Details"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "space-y-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
									className: "text-muted-foreground flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" }), "Assignee"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserAvatar, {
										name: assignee?.name,
										size: 24
									}), assignee?.name]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
									className: "text-muted-foreground flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" }), "Assigned by"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: assigner?.name })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
									className: "text-muted-foreground flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-4 w-4" }), "Due date"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: format(new Date(task.dueDate), "MMM d, yyyy") })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: "Priority"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: task.priority }) })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: "Status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: task.status }) })]
							})
						]
					})]
				})
			})]
		})
	] });
}
//#endregion
export { TaskDetail as component };
