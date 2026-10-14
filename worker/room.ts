import { DurableObject } from "cloudflare:workers";
import { RoomState, type PollResult, type SignalKind } from "./signaling-core.ts";
import type { Env } from "./env.ts";

/** How often a live room re-announces itself to the lobby registry / prunes. */
const HEARTBEAT_MS = 15_000;

/**
 * One Durable Object per room code. Holds the roster and SDP/ICE mailbox in
 * memory — all of it expires within a minute, and clients re-register on their
 * next poll, so nothing needs to survive eviction.
 */
export class SignalingRoom extends DurableObject<Env> {
  private state = new RoomState();
  private room = "";
  private lastReported = "";
  private alarmArmed = false;

  async poll(room: string, peer: string, name: string, since: number): Promise<PollResult | null> {
    this.room = room;
    const result = this.state.poll(peer, name, since, Date.now());
    if (result) this.afterChange();
    return result;
  }

  async signal(room: string, from: string, to: string, kind: SignalKind, payload: unknown): Promise<void> {
    this.room = room;
    this.state.signal(from, to, kind, payload, Date.now());
  }

  async leave(room: string, peer: string): Promise<void> {
    this.room = room;
    this.state.leave(peer);
    this.afterChange();
  }

  /** Report roster changes to the lobby registry and keep the heartbeat alarm running. */
  private afterChange(): void {
    const now = Date.now();
    if (this.room.startsWith("tz")) {
      const { players, names } = this.state.summary(now);
      const sig = `${players}|${names}`;
      if (sig !== this.lastReported) {
        this.lastReported = sig;
        this.ctx.waitUntil(this.report(players, names));
      }
    }
    if (!this.alarmArmed && !this.state.isEmpty(now)) {
      this.alarmArmed = true;
      this.ctx.waitUntil(this.ctx.storage.setAlarm(now + HEARTBEAT_MS));
    }
  }

  async alarm(): Promise<void> {
    this.alarmArmed = false;
    const now = Date.now();
    const empty = this.state.isEmpty(now);
    if (this.room.startsWith("tz")) {
      const { players, names } = this.state.summary(now);
      this.lastReported = `${players}|${names}`;
      await this.report(players, names);
    }
    if (!empty) {
      this.alarmArmed = true;
      await this.ctx.storage.setAlarm(now + HEARTBEAT_MS);
    }
  }

  private async report(players: number, names: string): Promise<void> {
    try {
      const registry = this.env.REGISTRY.get(this.env.REGISTRY.idFromName("global"));
      if (players === 0) await registry.remove(this.room);
      else await registry.report(this.room, players, names);
    } catch (err) {
      console.error("[rtc] registry report failed:", err);
    }
  }
}
