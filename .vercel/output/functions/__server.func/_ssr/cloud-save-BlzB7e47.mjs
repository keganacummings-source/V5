import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CU-UvGv9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cloud-save-BlzB7e47.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var loadCloudSave = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("17a0478080ff89068ebf357f0aaf996389fb99e37bf7e3ee2079d128cd1e8574"));
var writeCloudSave = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	if (typeof data !== "string" || data.length < 2 || data.length > 15e5) throw new Error("bad save");
	JSON.parse(data);
	return data;
}).handler(createSsrRpc("2e5d1e7f8b3e272d72387e9612696667fbbb30699e0f4586cf4e6b3146a52ded"));
//#endregion
export { loadCloudSave, writeCloudSave };
