import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-clock-CSmhLoxT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var pad = (n) => String(n).padStart(2, "0");
function useClock() {
	const [now, setNow] = (0, import_react.useState)(() => /* @__PURE__ */ new Date());
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
		return () => window.clearInterval(id);
	}, []);
	return {
		now,
		time: `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
		day: now.toLocaleDateString(void 0, { weekday: "long" }),
		dateLong: now.toLocaleDateString(void 0, {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric"
		}),
		dateShort: now.toLocaleDateString(void 0, {
			day: "numeric",
			month: "short",
			year: "numeric"
		})
	};
}
//#endregion
export { useClock as t };
