/** Request validation for /api/rtc. Same rules as the zod schemas in signaling.server.ts. */
import { MAX_NAME_LENGTH, type SignalKind } from "./signaling-core.ts";

const ID = /^[a-zA-Z0-9_-]{1,64}$/;
export const MAX_BODY_BYTES = 40_000;
export const MAX_PAYLOAD_CHARS = 32_768;

export type PollQuery = { room: string; peer: string; name: string; since: number };

export type PostBody =
  | { op: "signal"; room: string; from: string; to: string; kind: SignalKind; payload: unknown }
  | { op: "leave"; room: string; peer: string };

export function isId(v: unknown): v is string {
  return typeof v === "string" && ID.test(v);
}

export function parsePoll(params: URLSearchParams): PollQuery | null {
  const room = params.get("room");
  const peer = params.get("peer");
  const name = params.get("name") ?? "";
  const sinceRaw = params.get("since") ?? "0";
  if (!isId(room) || !isId(peer)) return null;
  if (name.length > MAX_NAME_LENGTH) return null;
  if (!/^\d{1,16}$/.test(sinceRaw)) return null;
  const since = Number(sinceRaw);
  if (!Number.isSafeInteger(since)) return null;
  return { room, peer, name, since };
}

export function parsePost(body: unknown): PostBody | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (b.op === "leave") {
    return isId(b.room) && isId(b.peer) ? { op: "leave", room: b.room, peer: b.peer } : null;
  }
  if (b.op === "signal") {
    if (!isId(b.room) || !isId(b.from) || !isId(b.to)) return null;
    if (b.kind !== "offer" && b.kind !== "answer" && b.kind !== "ice") return null;
    if (!("payload" in b) || b.payload === undefined) return null;
    const size = JSON.stringify(b.payload)?.length ?? 0;
    if (size > MAX_PAYLOAD_CHARS) return null;
    return { op: "signal", room: b.room, from: b.from, to: b.to, kind: b.kind, payload: b.payload };
  }
  return null;
}
