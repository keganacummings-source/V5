import test from "node:test";
import assert from "node:assert/strict";
import {
  RoomState,
  MAX_PEERS,
  MAX_SIGNALS_PER_PEER,
  PEER_TTL_MS,
  SIGNAL_TTL_MS,
  cleanName,
} from "./signaling-core.ts";
import { parsePoll, parsePost } from "./validate.ts";

const T0 = 1_800_000_000_000;

test("poll registers the peer and returns a sorted roster", () => {
  const r = new RoomState();
  r.poll("bob", "Bob", 0, T0);
  const res = r.poll("alice", "Alice", 0, T0 + 10);
  assert.deepEqual(res?.peers, [
    { id: "alice", name: "Alice" },
    { id: "bob", name: "Bob" },
  ]);
  assert.deepEqual(res?.signals, []);
});

test("signals are delivered once per cursor and ids strictly increase", () => {
  const r = new RoomState();
  r.poll("a", "A", 0, T0);
  r.poll("b", "B", 0, T0);
  r.signal("a", "b", "offer", { sdp: "x" }, T0 + 1);
  r.signal("a", "b", "ice", { c: 1 }, T0 + 1);
  r.signal("a", "b", "ice", { c: 2 }, T0 + 1);
  const first = r.poll("b", "B", 0, T0 + 2)!;
  assert.equal(first.signals.length, 3);
  assert.deepEqual(first.signals.map((s) => s.kind), ["offer", "ice", "ice"]);
  const ids = first.signals.map((s) => s.id);
  assert.ok(ids[0] < ids[1] && ids[1] < ids[2]);
  const cursor = ids[2];
  assert.equal(r.poll("b", "B", cursor, T0 + 3)!.signals.length, 0);
  // not leaked to the sender or anyone else
  assert.equal(r.poll("a", "A", 0, T0 + 3)!.signals.length, 0);
});

test("ids keep increasing across a simulated restart (clock-seeded)", () => {
  const before = new RoomState();
  before.signal("a", "b", "offer", 1, T0);
  const cursor = before.poll("b", "B", 0, T0)!.signals[0].id;
  const after = new RoomState(); // fresh counter, like an evicted DO
  after.signal("a", "b", "offer", 2, T0 + 5_000);
  assert.equal(after.poll("b", "B", cursor, T0 + 5_001)!.signals.length, 1);
});

test("stale peers and signals expire", () => {
  const r = new RoomState();
  r.poll("a", "A", 0, T0);
  r.signal("a", "b", "offer", {}, T0);
  assert.equal(r.roster(T0 + PEER_TTL_MS + 1).length, 0);
  assert.equal(r.poll("b", "B", 0, T0 + SIGNAL_TTL_MS + 1)!.signals.length, 0);
  assert.equal(r.isEmpty(T0 + SIGNAL_TTL_MS + 1), false); // b just polled
  assert.equal(r.isEmpty(T0 + SIGNAL_TTL_MS + 1 + PEER_TTL_MS + 1), true);
});

test("leave removes the peer and its inbox", () => {
  const r = new RoomState();
  r.poll("a", "A", 0, T0);
  r.poll("b", "B", 0, T0);
  r.signal("a", "b", "offer", {}, T0);
  r.leave("b");
  assert.deepEqual(r.roster(T0).map((p) => p.id), ["a"]);
  assert.equal(r.poll("b", "B", 0, T0 + 1)!.signals.length, 0);
});

test("room is capped at MAX_PEERS but existing peers can keep polling", () => {
  const r = new RoomState();
  for (let i = 0; i < MAX_PEERS; i++) assert.ok(r.poll(`p${String(i).padStart(2, "0")}`, "", 0, T0));
  assert.equal(r.poll("extra", "", 0, T0), null);
  assert.ok(r.poll("p00", "", 0, T0 + 1));
});

test("per-peer mailbox drops the oldest signal when full", () => {
  const r = new RoomState();
  for (let i = 0; i < MAX_SIGNALS_PER_PEER + 5; i++) r.signal("a", "b", "ice", { i }, T0 + i);
  const got = r.poll("b", "B", 0, T0 + 1_000)!.signals;
  assert.equal(got.length, MAX_SIGNALS_PER_PEER);
  assert.equal((got[0].payload as { i: number }).i, 5);
});

test("summary matches the lobby list shape", () => {
  const r = new RoomState();
  r.poll("b", "Bea", 0, T0);
  r.poll("a", "Al", 0, T0);
  assert.deepEqual(r.summary(T0), { players: 2, names: "Al, Bea" });
});

test("cleanName strips control chars and clamps length", () => {
  assert.equal(cleanName("a\nb\u0000c"), "abc");
  assert.equal(cleanName("x".repeat(200)).length, 64);
});

test("parsePoll mirrors the zod schema", () => {
  const ok = parsePoll(new URLSearchParams({ room: "tzAB12", peer: "p-1", name: "Kyo", since: "42" }));
  assert.deepEqual(ok, { room: "tzAB12", peer: "p-1", name: "Kyo", since: 42 });
  assert.equal(parsePoll(new URLSearchParams({ room: "bad room", peer: "p" })), null);
  assert.equal(parsePoll(new URLSearchParams({ room: "r", peer: "p", since: "-1" })), null);
  assert.equal(parsePoll(new URLSearchParams({ room: "r", peer: "p", name: "n".repeat(65) })), null);
  assert.equal(parsePoll(new URLSearchParams({ peer: "p" })), null);
  assert.deepEqual(parsePoll(new URLSearchParams({ room: "r", peer: "p" })), { room: "r", peer: "p", name: "", since: 0 });
});

test("parsePost validates signal and leave bodies", () => {
  assert.ok(parsePost({ op: "signal", room: "r", from: "a", to: "b", kind: "offer", payload: { sdp: "x" } }));
  assert.ok(parsePost({ op: "signal", room: "r", from: "a", to: "b", kind: "ice", payload: null }));
  assert.ok(parsePost({ op: "leave", room: "r", peer: "a" }));
  assert.equal(parsePost({ op: "signal", room: "r", from: "a", to: "b", kind: "nope", payload: 1 }), null);
  assert.equal(parsePost({ op: "signal", room: "r", from: "a", to: "b", kind: "offer" }), null);
  assert.equal(
    parsePost({ op: "signal", room: "r", from: "a", to: "b", kind: "offer", payload: "x".repeat(40_000) }),
    null,
  );
  assert.equal(parsePost({ op: "wat" }), null);
  assert.equal(parsePost(null), null);
});
