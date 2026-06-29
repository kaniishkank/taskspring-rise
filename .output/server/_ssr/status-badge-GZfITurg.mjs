import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as cn } from "./api-B2iW_vei.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-badge-GZfITurg.js
var import_jsx_runtime = require_jsx_runtime();
var statusStyles = {
	assigned: "bg-muted text-foreground/80 border-border",
	in_progress: "bg-info/15 text-info border-info/30",
	submitted: "bg-primary/15 text-primary border-primary/30",
	under_review: "bg-warning/20 text-warning-foreground border-warning/40 dark:text-warning",
	approved: "bg-success/15 text-success border-success/30",
	rejected: "bg-destructive/15 text-destructive border-destructive/30",
	completed: "bg-success/20 text-success border-success/40"
};
var statusLabel = {
	assigned: "Assigned",
	in_progress: "In Progress",
	submitted: "Submitted",
	under_review: "Under Review",
	approved: "Approved",
	rejected: "Rejected",
	completed: "Completed"
};
function StatusBadge({ status, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", statusStyles[status], className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-current" }), statusLabel[status]]
	});
}
var priorityStyles = {
	low: "bg-muted text-muted-foreground border-border",
	medium: "bg-info/15 text-info border-info/30",
	high: "bg-warning/20 text-warning-foreground dark:text-warning border-warning/40",
	urgent: "bg-destructive/15 text-destructive border-destructive/40"
};
function PriorityBadge({ priority, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize", priorityStyles[priority], className),
		children: priority
	});
}
//#endregion
export { StatusBadge as n, PriorityBadge as t };
