import { i as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { n as useTheme } from "./_ssr/theme-sqh8yV6V.mjs";
import { t as cva } from "./_libs/class-variance-authority+clsx.mjs";
import { n as cn, r as openMockFile, t as api } from "./_ssr/api-B2iW_vei.mjs";
import { t as Button } from "./_ssr/button-BYa1xzvG.mjs";
import { t as Input } from "./_ssr/input-D4-41uDG.mjs";
import { t as UserAvatar } from "./_ssr/user-avatar-B0MFPv2B.mjs";
import { t as useClock } from "./_ssr/use-clock-CSmhLoxT.mjs";
import { P as useNavigate, f as Outlet, g as Link, l as useRouterState } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { E as ListChecks, I as Circle, J as SquareCheckBig, O as LayoutDashboard, R as ChevronRight, S as LogOut, U as Calendar, V as Check, W as Bell, X as PanelLeftClose, Y as PanelLeftOpen, et as ChartColumn, f as Search, k as Inbox, l as Sun, n as Users, r as User, t as X, u as Settings, v as Moon, x as Menu } from "./_libs/lucide-react.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "./_libs/@radix-ui/react-dialog+[...].mjs";
import { a as Label2, c as Root2, d as SubTrigger2, f as Trigger, i as ItemIndicator2, l as Separator2, n as Content2, o as Portal2, r as Item2, s as RadioItem2, t as CheckboxItem2, u as SubContent2 } from "./_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { i as Trigger$1, n as Portal, r as Root2$1, t as Content2$1 } from "./_libs/radix-ui__react-popover.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app-NQeDUHcQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var mgg_logo_svg_asset_default = {
	version: 1,
	asset_id: "3e7a33a5-1b50-45af-86c4-cd08065c4024",
	project_id: "3cbf842c-db20-4939-9577-ff761f381387",
	url: "/__l5e/assets-v1/3e7a33a5-1b50-45af-86c4-cd08065c4024/mgg-logo.svg",
	r2_key: "a/v1/3cbf842c-db20-4939-9577-ff761f381387/3e7a33a5-1b50-45af-86c4-cd08065c4024/mgg-logo.svg",
	original_filename: "mgg-logo.svg",
	size: 69386,
	content_type: "image/svg+xml",
	created_at: "2026-06-27T11:22:23Z"
};
var items = [
	{
		to: "/",
		label: "Dashboard",
		icon: LayoutDashboard,
		roles: [
			"super_admin",
			"manager",
			"staff"
		]
	},
	{
		to: "/tasks",
		label: "Tasks",
		icon: ListChecks,
		roles: ["super_admin", "manager"]
	},
	{
		to: "/my-tasks",
		label: "My Tasks",
		icon: SquareCheckBig,
		roles: [
			"super_admin",
			"manager",
			"staff"
		]
	},
	{
		to: "/submissions",
		label: "Submissions",
		icon: Inbox,
		roles: ["super_admin", "manager"]
	},
	{
		to: "/calendar",
		label: "Calendar",
		icon: Calendar,
		roles: [
			"super_admin",
			"manager",
			"staff"
		]
	},
	{
		to: "/reports",
		label: "Reports",
		icon: ChartColumn,
		roles: ["super_admin", "manager"]
	},
	{
		to: "/notifications",
		label: "Notifications",
		icon: Bell,
		roles: [
			"super_admin",
			"manager",
			"staff"
		]
	},
	{
		to: "/users",
		label: "Users",
		icon: Users,
		roles: ["super_admin", "manager"]
	},
	{
		to: "/settings",
		label: "Settings",
		icon: Settings,
		roles: [
			"super_admin",
			"manager",
			"staff"
		]
	}
];
function AppSidebar({ onNavigate, collapsed = false }) {
	const path = useRouterState({ select: (s) => s.location.pathname });
	const [currentUser, setCurrentUser] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		api.getCurrentUser().then((data) => setCurrentUser(data.user)).catch(() => {});
	}, []);
	const visible = items.filter((i) => currentUser ? i.roles.includes(currentUser.role) : true);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: cn("flex h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-300", collapsed ? "w-16" : "w-64"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("flex h-16 items-center gap-2 border-b border-sidebar-border", collapsed ? "justify-center px-2" : "px-5"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: mgg_logo_svg_asset_default.url,
					alt: "Mahatma Global Gateway",
					className: "h-9 w-9 shrink-0 rounded-full ring-1 ring-border"
				}), !collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "leading-tight",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold",
						children: "Mahatma Global"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] text-muted-foreground",
						children: "Gateway School"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex-1 overflow-y-auto p-3",
				children: [!collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
					children: "Workspace"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1",
					children: visible.map(({ to, label, icon: Icon }) => {
						const active = to === "/" ? path === "/" : path.startsWith(to);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to,
							onClick: onNavigate,
							title: collapsed ? label : void 0,
							className: cn("group flex items-center gap-3 rounded-md py-2 text-sm font-medium transition-colors", collapsed ? "justify-center px-2" : "px-3", active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground") }),
								!collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: label
								}),
								!collapsed && active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ml-auto h-1.5 w-1.5 rounded-full bg-primary" })
							]
						}) }, to);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-sidebar-border p-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("flex items-center rounded-md bg-sidebar-accent/50 p-2", collapsed ? "justify-center" : "gap-3"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserAvatar, {
						name: currentUser?.name,
						avatar: currentUser?.avatar,
						size: 36
					}), !collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 leading-tight",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-sm font-medium",
							children: currentUser?.name ?? "Loading user"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-[11px] capitalize text-muted-foreground",
							children: currentUser?.role?.replace("_", " ") ?? "user"
						})]
					})]
				})
			})
		]
	});
}
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var Popover = Root2$1;
var PopoverTrigger = Trigger$1;
var PopoverContent = import_react.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2$1, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)", className),
	...props
}) }));
PopoverContent.displayName = Content2$1.displayName;
function Navbar({ onOpenSidebar, onToggleCollapse, collapsed }) {
	const { theme, toggle } = useTheme();
	const navigate = useNavigate();
	const [currentUser, setCurrentUser] = (0, import_react.useState)(null);
	const [showClock, setShowClock] = (0, import_react.useState)(true);
	const [notifications, setNotifications] = (0, import_react.useState)([]);
	const [tasks, setTasks] = (0, import_react.useState)([]);
	const [users, setUsers] = (0, import_react.useState)([]);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [searchFocused, setSearchFocused] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		Promise.all([
			api.getCurrentUser(),
			api.getNotifications(),
			api.getTasks(),
			api.getUsers()
		]).then(([userData, notificationData, taskData, userDataList]) => {
			setCurrentUser(userData.user);
			setNotifications(notificationData);
			setTasks(taskData);
			setUsers(userDataList);
		}).catch(() => {});
	}, []);
	const matchingTasks = (0, import_react.useMemo)(() => {
		if (!searchQuery.trim()) return [];
		const query = searchQuery.toLowerCase();
		return tasks.filter((t) => t.title.toLowerCase().includes(query) || t.id.toLowerCase().includes(query) || t.description.toLowerCase().includes(query)).slice(0, 5);
	}, [tasks, searchQuery]);
	const matchingUsers = (0, import_react.useMemo)(() => {
		if (!searchQuery.trim()) return [];
		const query = searchQuery.toLowerCase();
		return users.filter((u) => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query) || u.department && u.department.toLowerCase().includes(query)).slice(0, 5);
	}, [users, searchQuery]);
	const matchingFiles = (0, import_react.useMemo)(() => {
		if (!searchQuery.trim()) return [];
		const query = searchQuery.toLowerCase();
		const list = [];
		tasks.forEach((t) => {
			if (t.attachments) t.attachments.forEach((a) => {
				if (a.name.toLowerCase().includes(query)) list.push({
					name: a.name,
					taskTitle: t.title,
					taskId: t.id
				});
			});
			if (t.submissions) t.submissions.forEach((s) => {
				if (s.files) s.files.forEach((f) => {
					if (f.toLowerCase().includes(query)) list.push({
						name: f,
						taskTitle: t.title,
						taskId: t.id
					});
				});
			});
		});
		return list.filter((f, idx, self) => self.findIndex((x) => x.name === f.name) === idx).slice(0, 5);
	}, [tasks, searchQuery]);
	const unread = notifications.filter((n) => !n.read).length;
	const { time, dateShort, day } = useClock();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "icon",
				className: "lg:hidden",
				onClick: onOpenSidebar,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
			}),
			onToggleCollapse && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "icon",
				className: "hidden lg:inline-flex",
				onClick: onToggleCollapse,
				"aria-label": collapsed ? "Expand sidebar" : "Collapse sidebar",
				children: collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftOpen, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftClose, { className: "h-5 w-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative hidden max-w-md flex-1 md:block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Search tasks, people, files...",
						className: "h-10 pl-9",
						value: searchQuery,
						onChange: (e) => setSearchQuery(e.target.value),
						onFocus: () => setSearchFocused(true),
						onBlur: () => setTimeout(() => setSearchFocused(false), 200)
					}),
					searchFocused && searchQuery.trim().length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute left-0 right-0 top-full z-50 mt-1.5 max-h-[400px] overflow-y-auto rounded-lg border border-border bg-popover p-2 shadow-lg backdrop-blur",
						children: matchingTasks.length === 0 && matchingUsers.length === 0 && matchingFiles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-3 py-4 text-center text-xs text-muted-foreground",
							children: [
								"No matching results found for \"",
								searchQuery,
								"\""
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 p-1",
							children: [
								matchingTasks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
									children: "Tasks"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-0.5",
									children: matchingTasks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/tasks/$id",
										params: { id: t.id },
										className: "flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate font-medium text-foreground",
											children: t.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[10px] text-muted-foreground",
											children: t.id
										})]
									}) }, t.id))
								})] }),
								matchingUsers.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
									children: "People"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-0.5",
									children: matchingUsers.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center justify-between rounded-md px-2 py-1.5 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-foreground",
												children: u.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs text-muted-foreground",
												children: [
													"(",
													u.email,
													")"
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] rounded bg-muted px-1.5 py-0.5 text-muted-foreground capitalize",
											children: u.role.replace("_", " ")
										})]
									}, u.id))
								})] }),
								matchingFiles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
									children: "Files"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-0.5",
									children: matchingFiles.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => openMockFile(f.name),
										className: "flex w-full items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent text-sm text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate text-foreground hover:underline",
											children: f.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] text-muted-foreground truncate max-w-[120px] ml-2",
											children: ["Task: ", f.taskTitle]
										})]
									}) }, f.name))
								})] })
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ml-auto flex items-center gap-1",
				children: [
					showClock && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mr-2 hidden items-center gap-2 rounded-lg border border-border bg-muted/40 pl-3 pr-8 py-1.5 text-right md:flex group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "leading-tight",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-sm font-semibold tracking-wider text-foreground",
								children: time
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[10px] text-muted-foreground",
								children: [
									day,
									" • ",
									dateShort
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowClock(false),
							className: "absolute right-1 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground opacity-0 hover:bg-accent hover:text-foreground group-hover:opacity-100 transition-opacity",
							title: "Hide clock",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: toggle,
						"aria-label": "Toggle theme",
						children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "icon",
							className: "relative",
							"aria-label": "Notifications",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground",
								children: unread
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
						align: "end",
						className: "w-80 p-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold",
								children: "Notifications"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/notifications",
								className: "text-xs text-primary hover:underline",
								children: "View all"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "max-h-80 divide-y overflow-y-auto",
							children: notifications.slice(0, 5).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-3 p-3 hover:bg-accent/40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-muted" : "bg-primary"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate text-sm font-medium",
										children: n.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "line-clamp-2 text-xs text-muted-foreground",
										children: n.message
									})]
								})]
							}, n.id))
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "ml-1 flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-accent/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserAvatar, {
								name: currentUser?.name,
								avatar: currentUser?.avatar,
								size: 32
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden text-sm font-medium md:inline",
								children: currentUser?.name?.split(" ")[0] ?? "User"
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
						align: "end",
						className: "w-56",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuLabel, {
								className: "leading-tight",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm",
									children: currentUser?.name ?? "Loading user"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-normal text-muted-foreground",
									children: currentUser?.email ?? ""
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onClick: () => void navigate({ to: "/settings" }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "mr-2 h-4 w-4" }), "Profile"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onClick: () => void navigate({ to: "/settings" }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "mr-2 h-4 w-4" }), "Settings"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onClick: () => {
									try {
										window.sessionStorage.removeItem("mgg_user");
										window.sessionStorage.removeItem("mgg_deadline_alert_shown");
									} catch {}
									window.location.href = "/login";
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-2 h-4 w-4" }), "Sign out"]
							})
						]
					})] })
				]
			})
		]
	});
}
var Sheet = Dialog;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription.displayName;
function AppLayout() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [collapsed, setCollapsed] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		if (window.sessionStorage.getItem("mgg_deadline_alert_shown")) return;
		const checkDeadlines = async () => {
			try {
				const [{ user }, tasks] = await Promise.all([api.getCurrentUser(), api.getTasks()]);
				if (!user) return;
				const myTasks = tasks.filter((t) => t.assignedTo === user.id && !["completed", "approved"].includes(t.status));
				const now = /* @__PURE__ */ new Date();
				const overdue = myTasks.filter((t) => new Date(t.dueDate) < now);
				const approaching = myTasks.filter((t) => {
					const d = new Date(t.dueDate);
					return d >= now && d <= new Date(Date.now() + 2880 * 60 * 1e3);
				});
				if (overdue.length > 0 && approaching.length > 0) toast.error(`Attention: You have ${overdue.length} overdue task(s) and ${approaching.length} task(s) due within 48 hours!`, { duration: 8e3 });
				else if (overdue.length > 0) toast.error(`Warning: You have ${overdue.length} overdue task(s)! Please review them.`, { duration: 8e3 });
				else if (approaching.length > 0) toast.warning(`Notice: You have ${approaching.length} task(s) due within the next 48 hours.`, { duration: 8e3 });
				window.sessionStorage.setItem("mgg_deadline_alert_shown", "true");
			} catch (err) {
				console.error("Deadline check failed", err);
			}
		};
		checkDeadlines();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen w-full bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden lg:flex",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSidebar, { collapsed })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
					side: "left",
					className: "w-64 p-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSidebar, { onNavigate: () => setOpen(false) })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {
					onOpenSidebar: () => setOpen(true),
					onToggleCollapse: () => setCollapsed((v) => !v),
					collapsed
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 px-4 py-6 md:px-8 md:py-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				})]
			})
		]
	});
}
//#endregion
export { AppLayout as component };
