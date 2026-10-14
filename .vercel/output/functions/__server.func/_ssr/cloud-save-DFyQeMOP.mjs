import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CU-UvGv9.mjs";
import { r as getSql } from "./db-PVYrH3Gp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cloud-save-DFyQeMOP.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var loadCloudSave_createServerFn_handler = createServerRpc({
	id: "17a0478080ff89068ebf357f0aaf996389fb99e37bf7e3ee2079d128cd1e8574",
	name: "loadCloudSave",
	filename: "src/game/cloud-save.ts"
}, (opts) => loadCloudSave.__executeServer(opts));
var loadCloudSave = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(loadCloudSave_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`select payload from turbz_saves where user_id = ${context.userId} limit 1`)[0]?.payload ?? null;
});
var writeCloudSave_createServerFn_handler = createServerRpc({
	id: "2e5d1e7f8b3e272d72387e9612696667fbbb30699e0f4586cf4e6b3146a52ded",
	name: "writeCloudSave",
	filename: "src/game/cloud-save.ts"
}, (opts) => writeCloudSave.__executeServer(opts));
var writeCloudSave = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	if (typeof data !== "string" || data.length < 2 || data.length > 15e5) throw new Error("bad save");
	JSON.parse(data);
	return data;
}).handler(writeCloudSave_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`
      insert into turbz_saves (user_id, payload, updated_at)
      values (${context.userId}, ${data}, now())
      on conflict (user_id) do update set payload = excluded.payload, updated_at = now()
    `;
	return true;
});
//#endregion
export { loadCloudSave_createServerFn_handler, writeCloudSave_createServerFn_handler };
