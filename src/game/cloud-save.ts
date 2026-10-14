import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";

export const loadCloudSave = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{ payload: string }>`select payload from turbz_saves where user_id = ${context.userId} limit 1`;
    return rows[0]?.payload ?? null;
  });

export const writeCloudSave = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: string) => {
    if (typeof data !== "string" || data.length < 2 || data.length > 1_500_000) throw new Error("bad save");
    JSON.parse(data);
    return data;
  })
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      insert into turbz_saves (user_id, payload, updated_at)
      values (${context.userId}, ${data}, now())
      on conflict (user_id) do update set payload = excluded.payload, updated_at = now()
    `;
    return true;
  });
