import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { ChatLine, FriendRow, GraveBody, GraveMode, GraveRow } from "./social-types";

function cleanName(raw: string): string {
  const name = raw.trim();
  if (!/^[a-zA-Z0-9_]{3,16}$/.test(name)) throw new Error("Username is 3–16 letters, numbers, or _.");
  return name;
}

function asMode(raw: string): GraveMode {
  if (raw === "hunt" || raw === "arena" || raw === "hardcore") return raw;
  throw new Error("Unknown board");
}

async function usernameOf(userId: string): Promise<string> {
  const sql = await getSql();
  const rows = await sql<{ username: string }>`select username from turbz_profiles where user_id = ${userId} limit 1`;
  return rows[0]?.username ?? "witch";
}

export const ensureProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { username: string }) => ({ username: cleanName(String(data?.username ?? "")) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const taken = await sql<{ user_id: string }>`
      select user_id from turbz_profiles where lower(username) = lower(${data.username}) and user_id <> ${context.userId} limit 1
    `;
    if (taken.length) throw new Error("That name is taken");
    await sql`
      insert into turbz_profiles (user_id, username, updated_at)
      values (${context.userId}, ${data.username}, now())
      on conflict (user_id) do update set username = excluded.username, updated_at = now()
    `;
    return { username: data.username };
  });

export const postChat = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { channel: string; body: string }) => {
    const channel = data?.channel === "friends" ? "friends" : "global";
    const body = String(data?.body ?? "").replace(/\s+/g, " ").trim();
    if (body.length < 1 || body.length > 160) throw new Error("Say it in 160 characters.");
    return { channel, body };
  })
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const recent = await sql<{ created_at: string }>`
      select created_at from turbz_chat where user_id = ${context.userId} order by id desc limit 1
    `;
    if (recent[0]) {
      const then = new Date(recent[0].created_at).getTime();
      if (Number.isFinite(then) && Date.now() - then < 1200) throw new Error("The veil needs a breath.");
    }
    const username = await usernameOf(context.userId);
    await sql`
      insert into turbz_chat (user_id, username, channel, body)
      values (${context.userId}, ${username}, ${data.channel}, ${data.body})
    `;
    return true;
  });

export const listChat = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const uid = context.userId;
    const rows = await sql<{ id: number; username: string; user_id: string; channel: string; body: string }>`
      select id, username, user_id, channel, body
      from turbz_chat
      where channel = 'global'
         or (
           channel = 'friends'
           and (
             user_id = ${uid}
             or user_id in (
               select case when requester = ${uid} then target else requester end
               from turbz_friends
               where status = 'accepted' and (requester = ${uid} or target = ${uid})
             )
           )
         )
      order by id desc
      limit 40
    `;
    const lines = rows
      .map((row) => {
        const line: ChatLine = {
          id: Number(row.id),
          username: row.username,
          channel: row.channel === "friends" ? "friends" : "global",
          body: row.body,
          mine: row.user_id === uid,
        };
        return line;
      })
      .reverse();
    return lines;
  });

export const requestFriend = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { username: string }) => ({ username: cleanName(String(data?.username ?? "")) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const found = await sql<{ user_id: string; username: string }>`
      select user_id, username from turbz_profiles where lower(username) = lower(${data.username}) limit 1
    `;
    const other = found[0];
    if (!other) throw new Error("No witch by that name.");
    if (other.user_id === context.userId) throw new Error("That is you.");
    const incoming = await sql<{ status: string }>`
      select status from turbz_friends where requester = ${other.user_id} and target = ${context.userId} limit 1
    `;
    if (incoming[0]?.status === "pending" || incoming[0]?.status === "accepted") {
      await sql`
        update turbz_friends set status = 'accepted' where requester = ${other.user_id} and target = ${context.userId}
      `;
      return { ok: true as const, note: `${other.username} is a friend.` };
    }
    await sql`
      insert into turbz_friends (requester, target, status)
      values (${context.userId}, ${other.user_id}, 'pending')
      on conflict (requester, target) do update set status = case when turbz_friends.status = 'accepted' then 'accepted' else 'pending' end
    `;
    return { ok: true as const, note: `Asked ${other.username}.` };
  });

export const answerFriend = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { username: string; accept: boolean }) => ({
    username: cleanName(String(data?.username ?? "")),
    accept: !!data?.accept,
  }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const found = await sql<{ user_id: string }>`
      select user_id from turbz_profiles where lower(username) = lower(${data.username}) limit 1
    `;
    const other = found[0]?.user_id;
    if (!other) throw new Error("No witch by that name.");
    if (data.accept) {
      await sql`
        update turbz_friends set status = 'accepted'
        where requester = ${other} and target = ${context.userId} and status = 'pending'
      `;
    } else {
      await sql`
        delete from turbz_friends
        where (requester = ${other} and target = ${context.userId})
           or (requester = ${context.userId} and target = ${other})
      `;
    }
    return true;
  });

export const listFriends = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const uid = context.userId;
    const rows = await sql<{ username: string; status: string; mine: boolean }>`
      select p.username as username, f.status as status, (f.requester = ${uid}) as mine
      from turbz_friends f
      join turbz_profiles p on p.user_id = case when f.requester = ${uid} then f.target else f.requester end
      where f.requester = ${uid} or f.target = ${uid}
      order by f.created_at desc
      limit 80
    `;
    const friends: FriendRow[] = rows.map((row) => ({
      username: row.username,
      status: row.status === "accepted" ? "accepted" : row.mine ? "pending-out" : "pending-in",
    }));
    return friends;
  });

function readGrave(raw: string, fallback: { mode: GraveMode; score: number; name: string; race: string; level: number }): GraveBody {
  try {
    const parsed = JSON.parse(raw) as GraveBody;
    if (parsed && typeof parsed === "object" && parsed.name) return parsed;
  } catch {
    /* fall through */
  }
  return {
    mode: fallback.mode,
    score: fallback.score,
    name: fallback.name,
    race: fallback.race,
    level: fallback.level,
    accountScore: 0,
    skills: [],
    gear: [],
    note: "",
  };
}

export const postGrave = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: GraveBody) => {
    const mode = asMode(String(data?.mode ?? ""));
    const name = String(data?.name ?? "").slice(0, 24).trim();
    if (!name) throw new Error("Nameless grave");
    const score = Math.max(0, Math.min(1_000_000_000, Math.floor(Number(data?.score) || 0)));
    const level = Math.max(1, Math.min(400, Math.floor(Number(data?.level) || 1)));
    const race = String(data?.race ?? "Unknown").slice(0, 24);
    const body: GraveBody = {
      mode,
      score,
      name,
      race,
      level,
      accountScore: Math.max(0, Math.floor(Number(data?.accountScore) || 0)),
      skills: Array.isArray(data?.skills) ? data.skills.slice(0, 16).map((sk) => ({
        name: String(sk?.name ?? "").slice(0, 24),
        level: Math.max(0, Math.min(400, Math.floor(Number(sk?.level) || 0))),
      })) : [],
      gear: Array.isArray(data?.gear) ? data.gear.slice(0, 8).map((g) => ({
        slot: String(g?.slot ?? "").slice(0, 16),
        name: String(g?.name ?? "").slice(0, 80),
        level: Math.max(0, Math.min(1000, Math.floor(Number(g?.level) || 0))),
        quality: String(g?.quality ?? "").slice(0, 16),
        type: String(g?.type ?? "").slice(0, 16),
        enchants: Array.isArray(g?.enchants) ? g.enchants.slice(0, 20).map((e) => ({
          name: String(e?.name ?? "").slice(0, 32),
          power: Math.max(0, Math.min(999, Math.floor(Number(e?.power) || 0))),
        })) : [],
        moves: Array.isArray(g?.moves) ? g.moves.slice(0, 6).map((m) => String(m).slice(0, 32)) : [],
      })) : [],
      note: String(data?.note ?? "").slice(0, 180),
    };
    const payload = JSON.stringify(body);
    if (payload.length > 20_000) throw new Error("That corpse is too heavy");
    return body;
  })
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const recent = await sql<{ n: number }>`
      select count(*)::int as n from turbz_graves
      where user_id = ${context.userId} and created_at > now() - interval '20 seconds'
    `;
    if (Number(recent[0]?.n ?? 0) >= 8) throw new Error("The ledger needs a breath.");
    const username = await usernameOf(context.userId);
    await sql`
      insert into turbz_graves (user_id, username, mode, score, name, race, level, payload)
      values (${context.userId}, ${username}, ${data.mode}, ${data.score}, ${data.name}, ${data.race}, ${data.level}, ${JSON.stringify(data)})
    `;
    return true;
  });

export const listGraves = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: { mode: string }) => ({ mode: asMode(String(data?.mode ?? "hunt")) }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      username: string;
      mode: string;
      score: number;
      name: string;
      race: string;
      level: number;
      payload: string;
      created_at: string;
    }>`
      select id, username, mode, score, name, race, level, payload, created_at
      from turbz_graves
      where mode = ${data.mode}
      order by score desc, id asc
      limit 40
    `;
    const graves: GraveRow[] = rows.map((row) => {
      const body = readGrave(row.payload, {
        mode: data.mode,
        score: Number(row.score),
        name: row.name,
        race: row.race,
        level: Number(row.level),
      });
      return {
        ...body,
        id: Number(row.id),
        username: row.username,
        score: Number(row.score),
        createdAt: String(row.created_at).slice(0, 10),
      };
    });
    return graves;
  });
