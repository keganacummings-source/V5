/**
 * dreamdaw.com worker.
 *
 *  - Static game files are served by Workers Static Assets *without* invoking this
 *    script (see `run_worker_first` in wrangler.toml), so asset traffic is free.
 *  - `/api/rtc` is the WebRTC signaling relay the multiplayer lobby polls. It is
 *    the same wire contract as src/lib/multiplayer/signaling.server.ts, backed by
 *    one Durable Object per room instead of Postgres.
 */
import type { Env } from "./env.ts";
import { parsePoll, parsePost, MAX_BODY_BYTES } from "./validate.ts";

export { SignalingRoom } from "./room.ts";
export { LobbyRegistry } from "./registry.ts";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

/** Browsers always send Origin on cross-site POSTs; reject ones that aren't ours. */
function crossOrigin(request: Request, url: URL): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host !== url.host;
  } catch {
    return true;
  }
}

async function handleRtc(request: Request, env: Env, url: URL): Promise<Response> {
  try {
    if (request.method === "GET") {
      if (url.searchParams.get("list") === "1") {
        const rooms = await env.REGISTRY.get(env.REGISTRY.idFromName("global")).list();
        return json({ rooms });
      }
      const q = parsePoll(url.searchParams);
      if (!q) return json({ error: "invalid query" }, 400);
      const stub = env.ROOMS.get(env.ROOMS.idFromName(q.room));
      const result = await stub.poll(q.room, q.peer, q.name, q.since);
      if (!result) return json({ error: "room full" }, 409);
      return json(result);
    }

    if (request.method === "POST") {
      if (crossOrigin(request, url)) return json({ error: "forbidden" }, 403);
      const declared = Number(request.headers.get("content-length") ?? 0);
      if (declared > MAX_BODY_BYTES) return json({ error: "payload too large" }, 413);
      const text = await request.text();
      if (text.length > MAX_BODY_BYTES) return json({ error: "payload too large" }, 413);
      let raw: unknown;
      try {
        raw = JSON.parse(text);
      } catch {
        return json({ error: "invalid JSON" }, 400);
      }
      const msg = parsePost(raw);
      if (!msg) return json({ error: "invalid request" }, 400);
      const stub = env.ROOMS.get(env.ROOMS.idFromName(msg.room));
      if (msg.op === "signal") await stub.signal(msg.room, msg.from, msg.to, msg.kind, msg.payload);
      else await stub.leave(msg.room, msg.peer);
      return json({ ok: true });
    }

    return json({ error: "method not allowed" }, 405);
  } catch (error) {
    console.error("[rtc] signaling error:", error);
    return json({ error: "signaling failed" }, 500);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/rtc") return handleRtc(request, env, url);
    if (url.pathname.startsWith("/api/")) return json({ error: "not found" }, 404);
    // Normally unreachable (assets are served before the worker runs), but keeps
    // `wrangler dev` and any future run_worker_first change working.
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
