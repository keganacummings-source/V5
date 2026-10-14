import type { SignalingRoom } from "./room.ts";
import type { LobbyRegistry } from "./registry.ts";

export interface Env {
  /** Static build output (dist-static). */
  ASSETS: Fetcher;
  ROOMS: DurableObjectNamespace<SignalingRoom>;
  REGISTRY: DurableObjectNamespace<LobbyRegistry>;
}
