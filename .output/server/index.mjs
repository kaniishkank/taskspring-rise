globalThis.__nitro_main__ = import.meta.url;
import { a as FastResponse, n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/logo.svg": {
		"type": "image/svg+xml",
		"etag": "\"10f0a-kpqJAJaLYdc8IF690GUu9S1Sh58\"",
		"mtime": "2026-06-28T08:32:37.772Z",
		"size": 69386,
		"path": "../public/logo.svg"
	},
	"/assets/bell-C5UG7VVR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"115-ojV8xYo6jZWfyE4+WDrWo9RjKVw\"",
		"mtime": "2026-06-29T04:47:49.887Z",
		"size": 277,
		"path": "../public/assets/bell-C5UG7VVR.js"
	},
	"/assets/api-D1ORCrLU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7f4a-8kwhmFOKDu1eD0H7izxQlQzgtIM\"",
		"mtime": "2026-06-29T04:47:49.886Z",
		"size": 32586,
		"path": "../public/assets/api-D1ORCrLU.js"
	},
	"/assets/calendar-B-50hebI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f4-yiUY+iEMWYt+H2KcRbhD0kknSkc\"",
		"mtime": "2026-06-29T04:47:49.888Z",
		"size": 244,
		"path": "../public/assets/calendar-B-50hebI.js"
	},
	"/assets/button-Besdbi1A.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1012-4KIwuAAEx9ApPyPafogSkWRQaBs\"",
		"mtime": "2026-06-29T04:47:49.888Z",
		"size": 4114,
		"path": "../public/assets/button-Besdbi1A.js"
	},
	"/assets/circle-check-CK1kUgTG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-niV9YSWimZGtaqJw5BdVK6m4atg\"",
		"mtime": "2026-06-29T04:47:49.891Z",
		"size": 165,
		"path": "../public/assets/circle-check-CK1kUgTG.js"
	},
	"/assets/clock-Bfdv1Csx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9c-5s5mNBLfb8bStEBiqbnGxV7x4H8\"",
		"mtime": "2026-06-29T04:47:49.892Z",
		"size": 156,
		"path": "../public/assets/clock-Bfdv1Csx.js"
	},
	"/assets/chevron-right-Db8udRmQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"75-K2Ny9DTXHiZHUWrjJxr4xbDjQXI\"",
		"mtime": "2026-06-29T04:47:49.891Z",
		"size": 117,
		"path": "../public/assets/chevron-right-Db8udRmQ.js"
	},
	"/assets/dialog-DiVT6vgn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"837-Hm0lew04hv8EJVcAaFATqED19kA\"",
		"mtime": "2026-06-29T04:47:49.893Z",
		"size": 2103,
		"path": "../public/assets/dialog-DiVT6vgn.js"
	},
	"/assets/dist-B-LXywuh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22e-BHBLqoU+X58LtOpvHIRInpcnqXI\"",
		"mtime": "2026-06-29T04:47:49.896Z",
		"size": 558,
		"path": "../public/assets/dist-B-LXywuh.js"
	},
	"/assets/dist-B-VAUvaF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10c4-WJ/ufLrStvYI5HOZqdUUpbQ1aqQ\"",
		"mtime": "2026-06-29T04:47:49.897Z",
		"size": 4292,
		"path": "../public/assets/dist-B-VAUvaF.js"
	},
	"/assets/dist-CSZ1-eRy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"de2-MAq7nXLCU0Mc+32dyK3f+Lm7wGA\"",
		"mtime": "2026-06-29T04:47:49.898Z",
		"size": 3554,
		"path": "../public/assets/dist-CSZ1-eRy.js"
	},
	"/assets/dist-DLceL-CW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bbac-VhZSO0nbcdB5+p7m2LJdkKws0DQ\"",
		"mtime": "2026-06-29T04:47:49.899Z",
		"size": 48044,
		"path": "../public/assets/dist-DLceL-CW.js"
	},
	"/assets/dist-IJgIZM6U.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"101-urbKfZW7zW2VTIDfTxXzBlOIxfs\"",
		"mtime": "2026-06-29T04:47:49.902Z",
		"size": 257,
		"path": "../public/assets/dist-IJgIZM6U.js"
	},
	"/assets/dist-Dp4oI-ZW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1725-zqQM2Fc3ZHb0NBuivsYn9oYon4M\"",
		"mtime": "2026-06-29T04:47:49.900Z",
		"size": 5925,
		"path": "../public/assets/dist-Dp4oI-ZW.js"
	},
	"/assets/dist-_8ozzAst.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"236-BNG2BxB4Y5MBeNFuS0Z7M+JD5NY\"",
		"mtime": "2026-06-29T04:47:49.903Z",
		"size": 566,
		"path": "../public/assets/dist-_8ozzAst.js"
	},
	"/assets/empty-state-DK-rLLVx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"281-oXacjHEd9fDx2rh3VtImRvhqIkQ\"",
		"mtime": "2026-06-29T04:47:49.904Z",
		"size": 641,
		"path": "../public/assets/empty-state-DK-rLLVx.js"
	},
	"/assets/format-DMmPmhV_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2ea3-nADZ94+Rgys6te0Q+xJSi4vtx+o\"",
		"mtime": "2026-06-29T04:47:49.907Z",
		"size": 11939,
		"path": "../public/assets/format-DMmPmhV_.js"
	},
	"/assets/en-US-DS1S10SZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d60-P0j2KQsjHrhC+TmRIiuDFJzE4lE\"",
		"mtime": "2026-06-29T04:47:49.904Z",
		"size": 7520,
		"path": "../public/assets/en-US-DS1S10SZ.js"
	},
	"/assets/endOfMonth-D9vWnYvv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a9-5JwHbyrOCEhcTuyTWKWfKOFQHeA\"",
		"mtime": "2026-06-29T04:47:49.905Z",
		"size": 169,
		"path": "../public/assets/endOfMonth-D9vWnYvv.js"
	},
	"/assets/formatDistanceToNow-Dl-SrPlc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"89a-aGrg1xLuTWZ5ib+0BWOcvHv8SxY\"",
		"mtime": "2026-06-29T04:47:49.908Z",
		"size": 2202,
		"path": "../public/assets/formatDistanceToNow-Dl-SrPlc.js"
	},
	"/assets/input-ra69fMD4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26b-SLnx7vw4TuEgQrW4NvJLeh4UHBk\"",
		"mtime": "2026-06-29T04:47:49.908Z",
		"size": 619,
		"path": "../public/assets/input-ra69fMD4.js"
	},
	"/assets/isSameDay-BWKVsK6e.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9b-7Oylpu9y1tePES1BY0O20oqrHNk\"",
		"mtime": "2026-06-29T04:47:49.911Z",
		"size": 155,
		"path": "../public/assets/isSameDay-BWKVsK6e.js"
	},
	"/assets/jsx-runtime-Bypl69v7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2ef0-ACars+e3uvePnryacYnsdW/x5ds\"",
		"mtime": "2026-06-29T04:47:49.914Z",
		"size": 12016,
		"path": "../public/assets/jsx-runtime-Bypl69v7.js"
	},
	"/assets/index-CW9VTxY6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5509a-qntef17lKBbjfjdsUPIbgRpkJ58\"",
		"mtime": "2026-06-29T04:47:49.872Z",
		"size": 348314,
		"path": "../public/assets/index-CW9VTxY6.js"
	},
	"/assets/label-DNkrdGbr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"291-IpiSKjWegb5OGyztHxdBdatmFmY\"",
		"mtime": "2026-06-29T04:47:49.915Z",
		"size": 657,
		"path": "../public/assets/label-DNkrdGbr.js"
	},
	"/assets/link-BS5F1bQe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"58ab-qIP8sWOSbwVU9R5X3fyk3oJItdA\"",
		"mtime": "2026-06-29T04:47:49.915Z",
		"size": 22699,
		"path": "../public/assets/link-BS5F1bQe.js"
	},
	"/assets/page-header-B-W0d8nn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"21b-Zd8xEERs7/IySk6Y243F9RVm9gQ\"",
		"mtime": "2026-06-29T04:47:49.918Z",
		"size": 539,
		"path": "../public/assets/page-header-B-W0d8nn.js"
	},
	"/assets/list-checks-C0na58py.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10a-YXWvrIQ+XoTFIgTMAKBDS4oHOyA\"",
		"mtime": "2026-06-29T04:47:49.916Z",
		"size": 266,
		"path": "../public/assets/list-checks-C0na58py.js"
	},
	"/assets/message-square-CzjRWtyo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"176-FB/8ZqHssoLZ6y59qIU4QP61ABU\"",
		"mtime": "2026-06-29T04:47:49.918Z",
		"size": 374,
		"path": "../public/assets/message-square-CzjRWtyo.js"
	},
	"/assets/login-Bo13nl50.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1125-jEf/hxjLlJh4cokiZjdqHJt4Wp0\"",
		"mtime": "2026-06-29T04:47:49.917Z",
		"size": 4389,
		"path": "../public/assets/login-Bo13nl50.js"
	},
	"/assets/plus-VdhtWa4K.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8c-/AiXnHKIbgvEk9aUaCsbAYzulhw\"",
		"mtime": "2026-06-29T04:47:49.919Z",
		"size": 140,
		"path": "../public/assets/plus-VdhtWa4K.js"
	},
	"/assets/search-C63V67_a.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a1-qeCWOMLlhR8fcWJVqUgD/t+dIP4\"",
		"mtime": "2026-06-29T04:47:49.921Z",
		"size": 161,
		"path": "../public/assets/search-C63V67_a.js"
	},
	"/assets/select-DbGoT79t.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"55ee-mHC5l8PFFHVS0Ykc/HlOjnRUYzY\"",
		"mtime": "2026-06-29T04:47:49.922Z",
		"size": 21998,
		"path": "../public/assets/select-DbGoT79t.js"
	},
	"/assets/send-dlcl088M.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"115-7INitBjueiSPePQIlHpjN6vEE7A\"",
		"mtime": "2026-06-29T04:47:49.923Z",
		"size": 277,
		"path": "../public/assets/send-dlcl088M.js"
	},
	"/assets/status-badge-CTlYa6Sr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"578-by6D2+UHyt0DbS4r/axvnGjCq1g\"",
		"mtime": "2026-06-29T04:47:49.925Z",
		"size": 1400,
		"path": "../public/assets/status-badge-CTlYa6Sr.js"
	},
	"/assets/tabs-BgRZlK2P.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d48-vabSOYx4n9GIcDYsWh6Ki1iyKis\"",
		"mtime": "2026-06-29T04:47:49.926Z",
		"size": 3400,
		"path": "../public/assets/tabs-BgRZlK2P.js"
	},
	"/assets/styles-CjXye4v4.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"17bf5-AjZPmonA3gF6PrU8MmAOtGYIS4U\"",
		"mtime": "2026-06-29T04:47:49.937Z",
		"size": 97269,
		"path": "../public/assets/styles-CjXye4v4.css"
	},
	"/assets/upload-B-JYN4dN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1eb-u7AXU7YPGKqVbgih81MimEmwsDw\"",
		"mtime": "2026-06-29T04:47:49.929Z",
		"size": 491,
		"path": "../public/assets/upload-B-JYN4dN.js"
	},
	"/assets/textarea-CLrmYyu0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2bb-XhTcAYuUeSIp4dRfRd8095H2Nl4\"",
		"mtime": "2026-06-29T04:47:49.928Z",
		"size": 699,
		"path": "../public/assets/textarea-CLrmYyu0.js"
	},
	"/assets/use-clock-CGmbkh8o.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"248-NBEighNxlwYgHPxmskTOqdHafvg\"",
		"mtime": "2026-06-29T04:47:49.930Z",
		"size": 584,
		"path": "../public/assets/use-clock-CGmbkh8o.js"
	},
	"/assets/user-avatar-BfqeEqRg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c1-tZzuTODQS8FkVnAQLOScsElSG0U\"",
		"mtime": "2026-06-29T04:47:49.935Z",
		"size": 449,
		"path": "../public/assets/user-avatar-BfqeEqRg.js"
	},
	"/assets/user-CwF4MYJp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b7-+/zuI0ba5SXQQG4asZFsxA5RdHI\"",
		"mtime": "2026-06-29T04:47:49.934Z",
		"size": 183,
		"path": "../public/assets/user-CwF4MYJp.js"
	},
	"/assets/useRouter-CrRRNxmr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b2-ssmfLAl2PHrijx43e9mc/51PqyI\"",
		"mtime": "2026-06-29T04:47:49.931Z",
		"size": 690,
		"path": "../public/assets/useRouter-CrRRNxmr.js"
	},
	"/assets/x-DSoSltPS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8d-1+y1x95RtJur+8b8gpVuJICKvog\"",
		"mtime": "2026-06-29T04:47:49.936Z",
		"size": 141,
		"path": "../public/assets/x-DSoSltPS.js"
	},
	"/assets/_app.calendar-BtPXWRQv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20b1-Hk7NtMU8MG+uDyKzEozpkt297Oc\"",
		"mtime": "2026-06-29T04:47:49.874Z",
		"size": 8369,
		"path": "../public/assets/_app.calendar-BtPXWRQv.js"
	},
	"/assets/_app-t2kysrZD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b1b2-eBybu0k6hViZ633in88IGKH2o9Y\"",
		"mtime": "2026-06-29T04:47:49.872Z",
		"size": 45490,
		"path": "../public/assets/_app-t2kysrZD.js"
	},
	"/assets/_app.my-tasks-B8NzOEjA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7e3-VN2Yyca8+Ps0raCxegEAt6LJsG8\"",
		"mtime": "2026-06-29T04:47:49.876Z",
		"size": 2019,
		"path": "../public/assets/_app.my-tasks-B8NzOEjA.js"
	},
	"/assets/_app.index-Bj4xPR8n.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b785-mQPbHIxR2VveHnAgav71snw7eAI\"",
		"mtime": "2026-06-29T04:47:49.875Z",
		"size": 46981,
		"path": "../public/assets/_app.index-Bj4xPR8n.js"
	},
	"/assets/stat-card-MfIryXgP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5aec8-VOIXNZuS9YT/eSTRhRcC46kvxnc\"",
		"mtime": "2026-06-29T04:47:49.924Z",
		"size": 372424,
		"path": "../public/assets/stat-card-MfIryXgP.js"
	},
	"/assets/_app.notifications-DFMs7W8R.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"121f-VKBx4HMIkhZdh9Ni8k96pVHNbVs\"",
		"mtime": "2026-06-29T04:47:49.877Z",
		"size": 4639,
		"path": "../public/assets/_app.notifications-DFMs7W8R.js"
	},
	"/assets/_app.reports-BkY2PSAe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"581b-FoEfWCG8r3+0GwurSG7omVwNJe4\"",
		"mtime": "2026-06-29T04:47:49.879Z",
		"size": 22555,
		"path": "../public/assets/_app.reports-BkY2PSAe.js"
	},
	"/assets/_app.settings-Bve7ZD2p.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c2f-+wP+EejXiHrPWHEgtFnSnoxWCKA\"",
		"mtime": "2026-06-29T04:47:49.880Z",
		"size": 11311,
		"path": "../public/assets/_app.settings-Bve7ZD2p.js"
	},
	"/assets/_app.submissions-CsPe68hk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"102b-dgRN3Io24fVPQu2V33XT00SOVno\"",
		"mtime": "2026-06-29T04:47:49.881Z",
		"size": 4139,
		"path": "../public/assets/_app.submissions-CsPe68hk.js"
	},
	"/assets/_app.tasks.new-CCU6RLyp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"18c9-jISV8hV6KaJWOpmhSO0XD9bt6Pg\"",
		"mtime": "2026-06-29T04:47:49.884Z",
		"size": 6345,
		"path": "../public/assets/_app.tasks.new-CCU6RLyp.js"
	},
	"/assets/_app.tasks._id-44hgJj9m.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"317d-p6Ui0QC0fh591PnPmxthw6AXIa0\"",
		"mtime": "2026-06-29T04:47:49.883Z",
		"size": 12669,
		"path": "../public/assets/_app.tasks._id-44hgJj9m.js"
	},
	"/assets/_app.tasks.index-yGMHmg9y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2d45-xqBBYplJfHfu+5wU2hdHTbvWEnk\"",
		"mtime": "2026-06-29T04:47:49.884Z",
		"size": 11589,
		"path": "../public/assets/_app.tasks.index-yGMHmg9y.js"
	},
	"/assets/_app.users-CZ-8NRNw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"32e1-oXoj6gizMhqYR3a6UAiGHyzIKnM\"",
		"mtime": "2026-06-29T04:47:49.885Z",
		"size": 13025,
		"path": "../public/assets/_app.users-CZ-8NRNw.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_wgqWbi = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_wgqWbi
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
