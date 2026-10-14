import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";

export const loadLayout = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{ payload: string }>`select payload from turbz_layouts where user_id = ${context.userId} limit 1`;
    return rows[0]?.payload ?? null;
  });

export const saveLayout = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: string) => {
    if (typeof data !== "string" || data.length < 2 || data.length > 20_000) throw new Error("bad layout");
    JSON.parse(data);
    return data;
  })
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      insert into turbz_layouts (user_id, payload, updated_at)
      values (${context.userId}, ${data}, now())
      on conflict (user_id) do update set payload = excluded.payload, updated_at = now()
    `;
    return true;
  });
