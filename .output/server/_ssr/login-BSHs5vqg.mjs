import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as api } from "./api-B2iW_vei.mjs";
import { t as Button } from "./button-BYa1xzvG.mjs";
import { t as Input } from "./input-D4-41uDG.mjs";
import { t as useClock } from "./use-clock-CSmhLoxT.mjs";
import { P as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as LogIn, M as Eye, N as EyeOff } from "../_libs/lucide-react.mjs";
import { t as Label } from "./label-BElbQhCY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-BSHs5vqg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const navigate = useNavigate();
	const { time, dateLong, day } = useClock();
	const [loginId, setLoginId] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [showPw, setShowPw] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!loginId.trim()) return;
		setLoading(true);
		try {
			const response = await api.login(loginId, password);
			window.sessionStorage.setItem("mgg_user", JSON.stringify({
				id: response.user.id,
				role: response.user.role,
				name: response.user.name,
				token: response.token
			}));
			toast.success(`Welcome back, ${response.user.name}!`);
			navigate({ to: "/" });
		} catch (err) {
			console.error(err);
			toast.error(err.message || "Invalid credentials. Access Denied.");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative flex min-h-screen items-center justify-center px-4 py-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text font-mono text-4xl font-bold tracking-wider text-transparent md:text-5xl",
							children: time
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-sm text-muted-foreground",
							children: dateLong
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/90 p-6 shadow-2xl backdrop-blur-sm md:p-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-6 flex flex-col items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-20 w-20 rounded-full bg-muted border border-muted-foreground/25 shadow-md ring-2 ring-primary/20 shrink-0" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "text-xl font-bold text-foreground",
										children: "Mahatma Global Gateway Demo"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs uppercase tracking-widest text-muted-foreground",
										children: "School Management Portal"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-mono text-xs text-muted-foreground",
									children: [
										time,
										" • ",
										day
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "loginId",
										children: "Login ID"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "loginId",
										type: "text",
										placeholder: "e.g. principal@mgg.edu.in",
										autoComplete: "username",
										value: loginId,
										onChange: (e) => setLoginId(e.target.value),
										required: true
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "password",
										children: "Password"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "password",
											type: showPw ? "text" : "password",
											placeholder: "Enter password",
											autoComplete: "current-password",
											value: password,
											onChange: (e) => setPassword(e.target.value),
											required: true,
											className: "pr-10"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setShowPw((v) => !v),
											className: "absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
											"aria-label": showPw ? "Hide password" : "Show password",
											children: showPw ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "submit",
									className: "w-full gap-2",
									size: "lg",
									disabled: loading,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "h-4 w-4" }), loading ? "Signing in…" : "Sign in"]
								})
							]
						})]
					})]
				})
			})
		]
	});
}
//#endregion
export { LoginPage as component };
