import type { ChatLine, FriendRow, GraveBody, GraveMode, GraveRow } from "./social-types";

const local = import.meta.env.VITE_STATIC_HUNT === "1";

export async function ensureProfile(username: string): Promise<void> {
  if (local) return;
  const mod = await import("./social-api");
  await mod.ensureProfile({ data: { username } });
}

export async function postChat(channel: "global" | "friends", body: string): Promise<void> {
  if (local) return;
  const mod = await import("./social-api");
  await mod.postChat({ data: { channel, body } });
}

export async function listChat(): Promise<ChatLine[]> {
  if (local) return [];
  const mod = await import("./social-api");
  return mod.listChat();
}

export async function requestFriend(username: string): Promise<string> {
  if (local) return "Local hunt has no veil.";
  const mod = await import("./social-api");
  const res = await mod.requestFriend({ data: { username } });
  return res.note;
}

export async function answerFriend(username: string, accept: boolean): Promise<void> {
  if (local) return;
  const mod = await import("./social-api");
  await mod.answerFriend({ data: { username, accept } });
}

export async function listFriends(): Promise<FriendRow[]> {
  if (local) return [];
  const mod = await import("./social-api");
  return mod.listFriends();
}

export async function postGrave(body: GraveBody): Promise<void> {
  if (local) return;
  const mod = await import("./social-api");
  await mod.postGrave({ data: body });
}

export async function listGraves(mode: GraveMode): Promise<GraveRow[]> {
  if (local) return [];
  const mod = await import("./social-api");
  return mod.listGraves({ data: { mode } });
}
