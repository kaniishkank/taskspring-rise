import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as cn } from "./api-B2iW_vei.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/user-avatar-B0MFPv2B.js
var import_jsx_runtime = require_jsx_runtime();
function UserAvatar({ name, avatar, size = 32, className }) {
	if (avatar) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: avatar,
		alt: name ?? "Avatar",
		className: cn("rounded-full object-cover border border-border shrink-0", className),
		style: {
			width: size,
			height: size
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-block rounded-full bg-muted border border-muted-foreground/25 shrink-0", className),
		style: {
			width: size,
			height: size
		}
	});
}
//#endregion
export { UserAvatar as t };
