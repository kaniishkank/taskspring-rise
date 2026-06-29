import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as cn } from "./api-B2iW_vei.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stat-card-CHro2gP3.js
var import_jsx_runtime = require_jsx_runtime();
var tones = {
	primary: "bg-primary/12 text-primary",
	success: "bg-success/15 text-success",
	warning: "bg-warning/20 text-warning-foreground dark:text-warning",
	danger: "bg-destructive/15 text-destructive",
	info: "bg-info/15 text-info"
};
function StatCard({ label, value, icon: Icon, delta, tone = "primary" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group rounded-xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-medium text-muted-foreground",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 text-3xl font-bold tracking-tight",
					children: value
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("grid h-10 w-10 shrink-0 place-items-center rounded-lg", tones[tone]),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
			})]
		}), delta && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: delta.positive ? "text-success" : "text-destructive",
				children: delta.value
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "ml-1 text-muted-foreground",
				children: "vs last week"
			})]
		})]
	});
}
//#endregion
export { StatCard as t };
