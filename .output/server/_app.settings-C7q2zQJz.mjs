import { i as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { n as useTheme } from "./_ssr/theme-sqh8yV6V.mjs";
import { n as cn, t as api } from "./_ssr/api-B2iW_vei.mjs";
import { t as Button } from "./_ssr/button-BYa1xzvG.mjs";
import { t as Input } from "./_ssr/input-D4-41uDG.mjs";
import { t as UserAvatar } from "./_ssr/user-avatar-B0MFPv2B.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { W as Bell, _ as Palette, o as Upload, p as Save, r as User, w as Lock } from "./_libs/lucide-react.mjs";
import { t as PageHeader } from "./_ssr/page-header-i5M1fODL.mjs";
import { t as Label } from "./_ssr/label-BElbQhCY.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./_ssr/tabs-Dn910njg.mjs";
import { n as SwitchThumb, t as Switch$1 } from "./_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.settings-C7q2zQJz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
function SettingsPage() {
	const { theme, toggle } = useTheme();
	const [currentUser, setCurrentUser] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [department, setDepartment] = (0, import_react.useState)("");
	const [avatar, setAvatar] = (0, import_react.useState)(null);
	const [savingProfile, setSavingProfile] = (0, import_react.useState)(false);
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [savingSecurity, setSavingSecurity] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		api.getCurrentUser().then((data) => {
			if (data.user) {
				setCurrentUser(data.user);
				setName(data.user.name);
				setEmail(data.user.email);
				setDepartment(data.user.department || "");
				setAvatar(data.user.avatar || null);
			}
		}).catch(() => {});
	}, []);
	const handleAvatarChange = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.size > 1024 * 1024) {
			toast.error("Avatar image must be under 1MB");
			return;
		}
		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result === "string") setAvatar(reader.result);
		};
		reader.readAsDataURL(file);
	};
	const handleRemoveAvatar = async () => {
		if (!currentUser) return;
		try {
			const updatedUser = await api.updateUser(currentUser.id, { avatar: null });
			setAvatar(null);
			setCurrentUser(updatedUser);
			window.sessionStorage.setItem("mgg_user", JSON.stringify(updatedUser));
			toast.success("Profile photo removed successfully!");
			setTimeout(() => {
				window.location.reload();
			}, 1e3);
		} catch (err) {
			toast.error(err.message || "Failed to remove profile photo");
		}
	};
	const handleSaveProfile = async (e) => {
		e.preventDefault();
		if (!currentUser) return;
		setSavingProfile(true);
		try {
			const updatedUser = await api.updateUser(currentUser.id, {
				name,
				email,
				department,
				avatar
			});
			setCurrentUser(updatedUser);
			window.sessionStorage.setItem("mgg_user", JSON.stringify(updatedUser));
			toast.success("Profile details updated successfully!");
			setTimeout(() => {
				window.location.reload();
			}, 1e3);
		} catch (err) {
			toast.error(err.message || "Failed to update profile");
		} finally {
			setSavingProfile(false);
		}
	};
	const handleUpdatePassword = async (e) => {
		e.preventDefault();
		if (!currentUser) return;
		if (!newPassword) {
			toast.error("Please enter a new password");
			return;
		}
		if (newPassword !== confirmPassword) {
			toast.error("New passwords do not match!");
			return;
		}
		setSavingSecurity(true);
		try {
			await api.updateUser(currentUser.id, { password: newPassword });
			setNewPassword("");
			setConfirmPassword("");
			toast.success("Security password updated successfully!");
		} catch (err) {
			toast.error(err.message || "Failed to update password");
		} finally {
			setSavingSecurity(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Settings",
		description: "Manage your account, preferences and notifications."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
		defaultValue: "profile",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
					value: "profile",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "mr-1.5 h-4 w-4" }), "Profile"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
					value: "notifications",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "mr-1.5 h-4 w-4" }), "Notifications"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
					value: "appearance",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { className: "mr-1.5 h-4 w-4" }), "Appearance"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
					value: "security",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "mr-1.5 h-4 w-4" }), "Security"]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "profile",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => void handleSaveProfile(e),
					className: "rounded-xl border bg-card p-6 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-6 sm:flex-row sm:items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative group",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserAvatar, {
									name: currentUser?.name ?? "User",
									avatar,
									size: 80,
									className: "border-2 border-primary/20"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-110",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: "image/*",
										className: "hidden",
										onChange: handleAvatarChange
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-base font-semibold",
									children: currentUser?.name ?? "Loading user"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted-foreground capitalize",
									children: [
										currentUser?.role?.replace("_", " ") ?? "user",
										" · ",
										currentUser?.department ?? ""
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 text-xs text-muted-foreground",
									children: "Accepts JPG, PNG formats under 1MB."
								}),
								avatar && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: handleRemoveAvatar,
									className: "mt-2 text-xs text-destructive hover:underline font-semibold text-left block font-medium",
									children: "Remove photo"
								})
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 grid grid-cols-1 gap-4 md:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "fullname",
									children: "Full name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "fullname",
									value: name,
									onChange: (e) => setName(e.target.value),
									required: true,
									className: "mt-1.5"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "email",
									children: "Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "email",
									type: "email",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									required: true,
									className: "mt-1.5"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "dept",
									children: "Department"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "dept",
									value: department,
									onChange: (e) => setDepartment(e.target.value),
									className: "mt-1.5"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "role",
									children: "Role"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "role",
									value: currentUser?.role?.replace("_", " ").toUpperCase() ?? "",
									disabled: true,
									className: "mt-1.5 bg-muted/50 capitalize"
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 flex justify-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								disabled: savingProfile,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-1.5 h-4 w-4" }), savingProfile ? "Saving..." : "Save changes"]
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "notifications",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border bg-card p-6 shadow-sm",
					children: [
						{
							label: "New task assignments",
							desc: "Email me when a task is assigned to me."
						},
						{
							label: "Deadline reminders",
							desc: "Reminders 24 hours before a task is due."
						},
						{
							label: "Submission approvals",
							desc: "Tell me when a submission is approved."
						},
						{
							label: "Weekly digest",
							desc: "A Monday morning summary of team activity."
						}
					].map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b py-4 last:border-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: row.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: row.desc
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, { defaultChecked: true })]
					}, row.label))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "appearance",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border bg-card p-6 shadow-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: "Dark mode"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								"Currently using ",
								theme,
								" theme."
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: theme === "dark",
							onCheckedChange: toggle
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "security",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => void handleUpdatePassword(e),
					className: "rounded-xl border bg-card p-6 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-4 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "new-password",
							children: "New password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "new-password",
							type: "password",
							required: true,
							value: newPassword,
							onChange: (e) => setNewPassword(e.target.value),
							className: "mt-1.5"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "confirm-password",
							children: "Confirm new password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "confirm-password",
							type: "password",
							required: true,
							value: confirmPassword,
							onChange: (e) => setConfirmPassword(e.target.value),
							className: "mt-1.5"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							disabled: savingSecurity,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-1.5 h-4 w-4" }), savingSecurity ? "Updating..." : "Update password"]
						})
					})]
				})
			})
		]
	})] });
}
//#endregion
export { SettingsPage as component };
