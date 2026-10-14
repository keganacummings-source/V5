import {
  ENCHANT_BY_ID,
  MONSTERS,
  MOVE_BY_ID,
  MOVES,
  RACES,
  TYPES,
  WITCH_NAMES,
  attackForm,
  attackRange,
  gearScore,
  irand,
  moveTactic,
  mulberry32,
  nextUid,
  pick,
  rollGear,
  rollGhostLook,
  type Gear,
  type GhostLook,
  type Move,
  type RaceId,
  type Rng,
  type TypeId,
  typeMult,
} from "./content";
import { directionFromDelta, type ActorDirection } from "./actor-sheets.config";
import type { GraveBody } from "./social-types";
import { drawActor, drawMonster, drawShadowName } from "./sprites";

const TILE = 32;
const NAMES = [
  ...WITCH_NAMES,
  "Vellum Sax",
  "Nix of Salt",
  "Sable Quill",
  "Ione Marr",
  "Cairn Hess",
  "Rue the Lid",
  "Onyx Pell",
  "Moss Ives",
  "Hester Vetch",
  "Lumen Bret",
  "Silt Ama",
  "Bram of Glass",
  "Nell Dusk",
  "Pax Yarrow",
  "Ivy Sorrow",
  "Cass of Embers",
  "Wren Holt",
  "Otter Vine",
  "Isla Thorn",
  "Quill Mare",
  "Dusk Nen",
  "Cress Vail",
  "Vetch Ora",
  "Nim of the Well",
  "Hale Mot",
  "Sera's Shadow",
  "Juniper Hex",
  "Tallow Mae",
  "Grey Pell",
  "Annis Coil",
  "Mab of Rime",
  "Kit the Toll",
  "Edda Vellum",
  "Noa of Pitch",
  "Fern Widow",
  "Lux of Bone",
  "Pim Salt",
  "Ysolde Marr",
  "Betony Vale",
  "Cressida Ash",
];

export type ArenaSpiritDef = {
  name: string;
  type: TypeId;
  template: number;
  move: string;
  look: GhostLook;
};

export type ArenaWitch = {
  uid: string;
  name: string;
  race: RaceId;
  role: "witch" | "summoner";
  level: number;
  talent: number;
  type: TypeId;
  maxHp: number;
  speed: number;
  moves: string[];
  weapon: Gear;
  gear: Gear[];
  spirits: ArenaSpiritDef[];
  hair: number;
  skin: number;
};

export type ArenaSave = {
  v: 1;
  points: number;
  tokens: number;
  wins: number;
  losses: number;
  roster: ArenaWitch[];
  party: string[];
};

export type ArenaCard = {
  uid: string;
  name: string;
  role: "witch" | "summoner";
  race: string;
  typeName: string;
  type: TypeId;
  level: number;
  power: number;
  moves: string;
  gear: string;
  enchants: string;
  spirits: string;
  marked: boolean;
};

export type ArenaSnap = {
  phase: "roster" | "fight" | "result" | "over";
  points: number;
  tokens: number;
  wins: number;
  losses: number;
  roster: ArenaCard[];
  party: number;
  note: string;
  speed: number;
  yours: number;
  theirs: number;
  last: { win: boolean; tokens: number; note: string } | null;
};

type Fighter = {
  id: string;
  side: 0 | 1;
  role: "witch" | "summoner" | "spirit";
  name: string;
  race: RaceId | null;
  type: TypeId;
  level: number;
  x: number;
  y: number;
  hp: number;
  max: number;
  speed: number;
  facing: number;
  direction: ActorDirection;
  walk: number;
  hurt: number;
  cd: number;
  shield: number;
  root: number;
  sleep: number;
  burn: number;
  trap: number;
  moveIds: string[];
  weapon: Gear | null;
  pieces: { slot: string; style: number; type: TypeId; fxSeed: number; quality: number }[];
  template: number;
  look: GhostLook | null;
  master: string;
  alive: boolean;
  dmgMul: number;
  might: number;
  ward: number;
  crit: number;
  swift: number;
  echo: number;
  double: number;
  second: boolean;
  usedSecond: boolean;
  tokened: boolean;
  buried: boolean;
  grave: GraveBody | null;
  think: number;
  stuck: number;
  lastX: number;
  lastY: number;
  path: { x: number; y: number }[];
  hair: number;
  skin: number;
  tall: number;
};

type Flo = { x: number; y: number; text: string; life: number; color: string };
type Beam = { x0: number; y0: number; x1: number; y1: number; life: number; color: string };

const QUALITY = ["worn", "common", "fine", "rare", "epic", "legendary"];

export function readArena(raw: unknown): ArenaSave | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as ArenaSave;
  if (s.v !== 1 || !Array.isArray(s.roster) || s.roster.length < 6) return null;
  if (typeof s.points !== "number" || s.points <= 0) return null;
  if (!Array.isArray(s.party)) return null;
  return s;
}

function ench(gear: Gear[], id: string): number {
  let n = 0;
  for (const g of gear) for (const e of g.enchants) if (e.id === id) n += e.power;
  return n;
}

function graveOf(w: ArenaWitch): GraveBody {
  const all = [w.weapon, ...w.gear];
  return {
    mode: "arena",
    score: powerOf(w),
    name: w.name,
    race: RACES.find((r) => r.id === w.race)?.name ?? w.race,
    level: w.level,
    accountScore: 0,
    skills: [{ name: w.role === "summoner" ? "Summoning" : "Circle", level: w.level }],
    gear: all.map((g) => ({
      slot: g.slot,
      name: g.name,
      level: g.level,
      quality: g.quality,
      type: TYPES[g.type]?.name ?? g.type,
      enchants: g.enchants.map((e) => ({ name: ENCHANT_BY_ID[e.id]?.name ?? e.id, power: e.power })),
      moves: (g.moves ?? []).map((id) => MOVE_BY_ID[id]?.name ?? id),
    })),
    note: w.role === "summoner" ? `Summoner. Spirits: ${w.spirits.map((s) => s.name).join(", ") || "none"}.` : "Witch of the circle.",
  };
}

function powerOf(w: ArenaWitch): number {
  const gear = gearScore(w.weapon) + w.gear.reduce((s, g) => s + gearScore(g), 0);
  const moves = w.moves.reduce((s, id) => s + (MOVE_BY_ID[id]?.power ?? 0), 0);
  return Math.round(w.level * 16 + w.talent * 40 + gear * 0.22 + moves + (w.role === "summoner" ? 24 : 0));
}

function cardOf(w: ArenaWitch, marked: boolean): ArenaCard {
  const all = [w.weapon, ...w.gear];
  const enchants = all
    .flatMap((g) => g.enchants)
    .slice(0, 4)
    .map((e) => `${ENCHANT_BY_ID[e.id]?.name ?? e.id} ${e.power}`);
  return {
    uid: w.uid,
    name: w.name,
    role: w.role,
    race: RACES.find((r) => r.id === w.race)?.name ?? w.race,
    typeName: TYPES[w.type].name,
    type: w.type,
    level: w.level,
    power: powerOf(w),
    moves: w.moves.map((id) => MOVE_BY_ID[id]?.name ?? id).join(" · "),
    gear: w.weapon.name,
    enchants: enchants.length ? enchants.join(" · ") : "Bare. No enchant.",
    spirits: w.role === "summoner" ? w.spirits.map((s) => s.name).join(", ") : "",
    marked,
  };
}

function rollMoves(rng: Rng, type: TypeId, strong: boolean): string[] {
  const pool = MOVES.filter((m) => m.power > 0 || m.effect === "mend" || m.effect === "shell");
  const biased = pool.filter((m) => m.type === type || m.type === "normal");
  const source = biased.length > 4 ? biased : pool;
  const count = strong ? 3 + irand(rng, 3) : 2 + irand(rng, 2);
  const out: string[] = [];
  const bag = [...(strong && rng() < 0.55 ? source : pool)];
  for (let i = 0; i < count && bag.length; i++) {
    const idx = irand(rng, bag.length);
    const m = bag.splice(idx, 1)[0]!;
    if (!out.includes(m.id)) out.push(m.id);
  }
  if (!out.length) out.push("measured");
  return out;
}

export function rollWitch(rng: Rng, forcedLevel?: number): ArenaWitch {
  const fortune = rng();
  const level =
    forcedLevel ??
    (fortune < 0.18 ? 1 + irand(rng, 8) : fortune > 0.84 ? 22 + irand(rng, 18) : 4 + irand(rng, 20));
  const talent = fortune < 0.14 ? 0.48 + rng() * 0.22 : fortune > 0.9 ? 1.35 + rng() * 0.55 : 0.72 + rng() * 0.55;
  const race = pick(rng, RACES);
  const role: "witch" | "summoner" = rng() < 0.22 ? "summoner" : "witch";
  const strong = talent > 1.15 || level >= 24;
  const weak = talent < 0.7 || level <= 4;
  const luck = weak ? irand(rng, 8) : strong ? 28 + irand(rng, 50) : 8 + irand(rng, 28);
  const floor = strong && rng() < 0.35 ? (rng() < 0.18 ? "legendary" : "epic") : weak ? "worn" : null;
  const gearLevel = Math.max(1, Math.round(level * (weak ? 0.45 + rng() * 0.3 : strong ? 0.9 + rng() * 0.45 : 0.6 + rng() * 0.5)));
  const weapon = rollGear(rng, {
    level: gearLevel,
    slot: "weapon",
    luck,
    floor,
    raceBias: race.id,
    typeBias: rng() < 0.7 ? race.type : null,
  });
  const slots = weak ? (["chest"] as const) : (["head", "chest", "legs", "feet", "relic"] as const);
  const gear = slots.map((slot) =>
    rollGear(rng, {
      level: Math.max(1, gearLevel - irand(rng, 3)),
      slot,
      luck: Math.max(0, luck - 6),
      floor: weak ? "worn" : floor && rng() < 0.4 ? floor : null,
      raceBias: race.id,
      typeBias: rng() < 0.45 ? race.type : null,
    }),
  );
  const moves = rollMoves(rng, race.type, strong);
  for (const id of weapon.moves ?? []) if (!moves.includes(id) && moves.length < 6) moves.push(id);
  if (role === "summoner" && !moves.some((id) => MOVE_BY_ID[id]?.effect === "mend" || MOVE_BY_ID[id]?.effect === "shell")) {
    moves.push(rng() < 0.5 ? "tidemend" : "aegis");
  }
  const spirits: ArenaSpiritDef[] = [];
  if (role === "summoner") {
    const pool = MONSTERS.filter((m) => m.type === "spirit" || m.type === "void" || m.template === 23 || m.template === 16);
    for (let i = 0; i < 3; i++) {
      const spec = pick(rng, pool);
      const bag = MOVES.filter((m) => m.type === spec.type && m.power > 0 && m.power < 56);
      const move = (bag.length ? pick(rng, bag) : MOVES[0]!).id;
      spirits.push({
        name: spec.name,
        type: spec.type,
        template: spec.template,
        move,
        look: rollGhostLook(rng, 1, move, "hunt"),
      });
    }
  }
  const used = new Set<string>();
  let name = pick(rng, NAMES);
  for (let i = 0; i < 6 && used.has(name); i++) name = pick(rng, NAMES);
  if (rng() < 0.08) name = `${name} II`;
  const baseline = 78 + level * 16;
  return {
    uid: nextUid(),
    name,
    race: race.id,
    role,
    level,
    talent,
    type: race.type,
    maxHp: Math.floor(baseline * talent * (role === "summoner" ? 1.08 : 1)),
    speed: Math.floor((role === "summoner" ? 62 : 74) + level * 0.35 + (strong ? 8 : 0)),
    moves,
    weapon,
    gear,
    spirits,
    hair: race.hair,
    skin: irand(rng, 5),
  };
}

class Heap {
  private a: { i: number; c: number }[] = [];
  push(i: number, c: number): void {
    const a = this.a;
    a.push({ i, c });
    let n = a.length - 1;
    while (n > 0) {
      const p = (n - 1) >> 1;
      if (a[p]!.c <= a[n]!.c) break;
      const tmp = a[p]!;
      a[p] = a[n]!;
      a[n] = tmp;
      n = p;
    }
  }
  pop(): { i: number; c: number } | null {
    const a = this.a;
    if (!a.length) return null;
    const top = a[0]!;
    const last = a.pop();
    if (a.length && last) {
      a[0] = last;
      let n = 0;
      for (;;) {
        const l = n * 2 + 1;
        const r = l + 1;
        let m = n;
        if (l < a.length && a[l]!.c < a[m]!.c) m = l;
        if (r < a.length && a[r]!.c < a[m]!.c) m = r;
        if (m === n) break;
        const tmp = a[m]!;
        a[m] = a[n]!;
        a[n] = tmp;
        n = m;
      }
    }
    return top;
  }
}

function buildMap(rng: Rng): { grid: Uint8Array; w: number; h: number } {
  const w = 42;
  const h = 28;
  for (let attempt = 0; attempt < 10; attempt++) {
    const grid = new Uint8Array(w * h);
    const at = (x: number, y: number) => y * w + x;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) if (x === 0 || y === 0 || x === w - 1 || y === h - 1) grid[at(x, y)] = 1;
    }
    const clusters = 9 + irand(rng, 7);
    for (let i = 0; i < clusters; i++) {
      const x = 6 + irand(rng, w - 12);
      const y = 3 + irand(rng, h - 6);
      grid[at(x, y)] = 1;
      if (rng() < 0.55 && x + 1 < w - 1) grid[at(x + 1, y)] = 1;
      if (rng() < 0.4 && y + 1 < h - 1) grid[at(x, y + 1)] = 1;
      if (rng() < 0.25 && x + 1 < w - 1 && y + 1 < h - 1) grid[at(x + 1, y + 1)] = 1;
    }
    for (let i = 0; i < 12 + irand(rng, 8); i++) {
      const x = 3 + irand(rng, w - 6);
      const y = 2 + irand(rng, h - 4);
      if (grid[at(x, y)] === 0) grid[at(x, y)] = 2;
    }
    for (let i = 0; i < 7 + irand(rng, 6); i++) {
      const x = 3 + irand(rng, w - 6);
      const y = 2 + irand(rng, h - 4);
      if (grid[at(x, y)] === 0) grid[at(x, y)] = 3;
    }
    const pads = [4, 8, 12, 16, 20, 23];
    for (const y of pads) {
      for (const x of [2, 3, w - 3, w - 4]) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const xx = x + dx;
            const yy = y + dy;
            if (xx > 0 && yy > 0 && xx < w - 1 && yy < h - 1) grid[at(xx, yy)] = 0;
          }
        }
      }
    }
    if (reachable(grid, w, h, 2, 4, w - 3, 4)) return { grid, w, h };
  }
  const grid = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (x === 0 || y === 0 || x === w - 1 || y === h - 1) grid[y * w + x] = 1;
  return { grid, w, h };
}

function reachable(grid: Uint8Array, w: number, h: number, x0: number, y0: number, x1: number, y1: number): boolean {
  const q = [y0 * w + x0];
  const seen = new Uint8Array(w * h);
  seen[q[0]!] = 1;
  let qi = 0;
  const goal = y1 * w + x1;
  while (qi < q.length) {
    const cur = q[qi++]!;
    if (cur === goal) return true;
    const x = cur % w;
    const y = (cur / w) | 0;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const k = ny * w + nx;
      if (seen[k] || grid[k] === 1) continue;
      seen[k] = 1;
      q.push(k);
    }
  }
  return false;
}

function route(grid: Uint8Array, w: number, h: number, sx: number, sy: number, gx: number, gy: number, fear: boolean): { x: number; y: number }[] {
  sx = Math.max(1, Math.min(w - 2, sx));
  sy = Math.max(1, Math.min(h - 2, sy));
  gx = Math.max(1, Math.min(w - 2, gx));
  gy = Math.max(1, Math.min(h - 2, gy));
  if (grid[gy * w + gx] === 1) {
    let found = false;
    for (let r = 1; r <= 4 && !found; r++) {
      for (let dy = -r; dy <= r && !found; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          const nx = gx + dx;
          const ny = gy + dy;
          if (nx < 1 || ny < 1 || nx >= w - 1 || ny >= h - 1) continue;
          if (grid[ny * w + nx] !== 1) {
            gx = nx;
            gy = ny;
            found = true;
            break;
          }
        }
      }
    }
  }
  const start = sy * w + sx;
  const goal = gy * w + gx;
  const dist = new Float32Array(w * h);
  dist.fill(1e9);
  dist[start] = 0;
  const prev = new Int32Array(w * h);
  prev.fill(-1);
  const heap = new Heap();
  heap.push(start, 0);
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ] as const;
  let guard = 0;
  while (guard++ < w * h * 4) {
    const cur = heap.pop();
    if (!cur) break;
    if (cur.c > dist[cur.i]! + 0.01) continue;
    if (cur.i === goal) break;
    const x = cur.i % w;
    const y = (cur.i / w) | 0;
    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const k = ny * w + nx;
      if (grid[k] === 1) continue;
      const step = grid[k] === 2 ? (fear ? 7 : 2.2) : grid[k] === 3 ? 2.4 : 1;
      const next = dist[cur.i]! + step;
      if (next + 0.01 < dist[k]!) {
        dist[k] = next;
        prev[k] = cur.i;
        heap.push(k, next);
      }
    }
  }
  if (prev[goal] === -1 && goal !== start) return [];
  const raw: { x: number; y: number }[] = [];
  let c = goal;
  let safety = 0;
  while (c !== -1 && safety++ < 800) {
    raw.push({ x: (c % w) * TILE + TILE / 2, y: ((c / w) | 0) * TILE + TILE / 2 });
    if (c === start) break;
    c = prev[c] ?? -1;
  }
  raw.reverse();
  if (raw.length <= 2) return raw;
  const open = (x: number, y: number) => {
    const tx = Math.floor(x / TILE);
    const ty = Math.floor(y / TILE);
    if (tx < 0 || ty < 0 || tx >= w || ty >= h) return false;
    return grid[ty * w + tx] !== 1;
  };
  const sees = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const steps = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 12));
    for (let s = 1; s < steps; s++) {
      const t = s / steps;
      if (!open(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t)) return false;
    }
    return true;
  };
  const slim: { x: number; y: number }[] = [];
  let i = 0;
  while (i < raw.length - 1) {
    let j = Math.min(raw.length - 1, i + 14);
    while (j > i + 1 && !sees(raw[i]!, raw[j]!)) j--;
    slim.push(raw[j]!);
    i = j;
  }
  return slim;
}

function los(grid: Uint8Array, w: number, h: number, x0: number, y0: number, x1: number, y1: number): boolean {
  const steps = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 10));
  for (let s = 1; s < steps; s++) {
    const t = s / steps;
    const x = x0 + (x1 - x0) * t;
    const y = y0 + (y1 - y0) * t;
    const tx = Math.floor(x / TILE);
    const ty = Math.floor(y / TILE);
    if (tx < 0 || ty < 0 || tx >= w || ty >= h) return false;
    if (grid[ty * w + tx] === 1) return false;
  }
  return true;
}

export class WitchArena {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  save: ArenaSave | null = null;
  phase: ArenaSnap["phase"] = "roster";
  note = "Six free witches. Mark a coven. The circle does not wait.";
  speed = 1;
  last: ArenaSnap["last"] = null;
  fighters: Fighter[] = [];
  grid: Uint8Array<ArrayBufferLike> = new Uint8Array(0);
  gw = 42;
  gh = 28;
  camX = 600;
  camY = 400;
  zoom = 0.8;
  wantX = 600;
  wantY = 400;
  wantZ = 0.8;
  floats: Flo[] = [];
  beams: Beam[] = [];
  gained = 0;
  age = 0;
  clock = 0;
  onCloud: (save: ArenaSave | null) => void = () => {};
  onGrave: (body: GraveBody) => void = () => {};
  private buriedKeys = new Set<string>();
  private running = false;
  private raf = 0;
  private lastT = 0;
  private viewW = 800;
  private viewH = 600;
  private dpr = 1;
  private listeners = new Set<() => void>();
  private snap: ArenaSnap = {
    phase: "roster",
    points: 3,
    tokens: 0,
    wins: 0,
    losses: 0,
    roster: [],
    party: 0,
    note: "",
    speed: 1,
    yours: 6,
    theirs: 6,
    last: null,
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas");
    this.ctx = ctx;
  }

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    fn();
    return () => this.listeners.delete(fn);
  }

  getSnap(): ArenaSnap {
    return this.snap;
  }

  start(seed: unknown): void {
    const saved = readArena(seed);
    if (saved) {
      this.save = saved;
      this.phase = "roster";
      this.note = `${saved.points} marks left. Draw with a token, or send the six.`;
    } else this.fresh();
    this.running = true;
    this.lastT = performance.now();
    const loop = (t: number) => {
      if (!this.running) return;
      const dt = Math.min(0.05, (t - this.lastT) / 1000);
      this.lastT = t;
      if (this.phase === "fight") this.step(dt * this.speed);
      else this.clock += dt;
      this.draw();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
    this.publish();
    this.resize();
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  resize(): void {
    const r = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.viewW = Math.max(1, r.width);
    this.viewH = Math.max(1, r.height);
    this.canvas.width = Math.max(1, Math.floor(this.viewW * this.dpr));
    this.canvas.height = Math.max(1, Math.floor(this.viewH * this.dpr));
  }

  fresh(): void {
    this.buriedKeys.clear();
    const rng = mulberry32((Date.now() ^ ((Math.random() * 1e9) | 0)) >>> 0 || 1);
    const roster = [0, 1, 2, 3, 4, 5].map(() => rollWitch(rng));
    this.save = {
      v: 1,
      points: 3,
      tokens: 0,
      wins: 0,
      losses: 0,
      roster,
      party: roster.map((w) => w.uid),
    };
    this.phase = "roster";
    this.last = null;
    this.note = "The circle gives you six. They may be saints or scraps. Send them.";
    this.persist();
  }

  summon(): void {
    const save = this.save;
    if (!save || this.phase !== "roster" || save.tokens < 1) return;
    save.tokens -= 1;
    const rng = mulberry32((Date.now() ^ ((Math.random() * 1e9) | 0)) >>> 0 || 3);
    const witch = rollWitch(rng);
    save.roster.push(witch);
    this.note = `${witch.name} answers. Lv ${witch.level} ${witch.role}. Power ${powerOf(witch)}.`;
    this.persist();
  }

  toggle(uid: string): void {
    const save = this.save;
    if (!save || this.phase !== "roster") return;
    const i = save.party.indexOf(uid);
    if (i >= 0) save.party.splice(i, 1);
    else if (save.party.length >= 6) {
      this.note = "Six already stand. Unmark one.";
      this.publish();
      return;
    } else save.party.push(uid);
    this.persist();
  }

  setSpeed(n: number): void {
    this.speed = n === 2 ? 2 : 1;
    this.publish();
  }

  fight(): void {
    const save = this.save;
    if (!save || this.phase === "fight" || save.points <= 0) return;
    const yours = save.party.map((id) => save.roster.find((w) => w.uid === id)).filter((w): w is ArenaWitch => !!w);
    if (yours.length !== 6) {
      this.note = "Mark exactly six.";
      this.publish();
      return;
    }
    const rng = mulberry32((Date.now() ^ ((Math.random() * 1e9) | 0)) >>> 0 || 9);
    const avg = yours.reduce((s, w) => s + w.level, 0) / yours.length;
    const foes = [0, 1, 2, 3, 4, 5].map(() => rollWitch(rng, Math.max(1, Math.round(avg + (rng() * 15 - 6)))));
    const map = buildMap(rng);
    this.grid = map.grid;
    this.gw = map.w;
    this.gh = map.h;
    this.fighters = [];
    this.floats = [];
    this.beams = [];
    this.gained = 0;
    this.age = 0;
    const ys = [4, 8, 12, 16, 20, 23];
    yours.forEach((w, i) => this.spawnWitch(w, 0, 2 + (i % 2), ys[i]!, rng));
    foes.forEach((w, i) => this.spawnWitch(w, 1, map.w - 3 - (i % 2), ys[i]!, rng));
    this.camX = (map.w * TILE) / 2;
    this.camY = (map.h * TILE) / 2;
    this.zoom = 0.72;
    this.phase = "fight";
    this.note = "The circle is shut. They choose their own cuts.";
    this.last = null;
    this.publish();
    this.resize();
  }

  dismiss(): void {
    if (this.phase === "over") return;
    if (this.phase === "result") {
      this.phase = "roster";
      this.note = this.save ? `${this.save.points} marks. ${this.save.tokens} tokens.` : "";
      this.publish();
    }
  }

  private persist(): void {
    if (!this.save) return;
    this.onCloud(this.save);
    this.publish();
  }

  private publish(): void {
    const save = this.save;
    const yours = this.fighters.filter((f) => f.side === 0 && f.role !== "spirit" && f.alive).length;
    const theirs = this.fighters.filter((f) => f.side === 1 && f.role !== "spirit" && f.alive).length;
    this.snap = {
      phase: this.phase,
      points: save?.points ?? 0,
      tokens: save?.tokens ?? 0,
      wins: save?.wins ?? 0,
      losses: save?.losses ?? 0,
      roster: (save?.roster ?? []).map((w) => cardOf(w, !!save?.party.includes(w.uid))),
      party: save?.party.length ?? 0,
      note: this.note,
      speed: this.speed,
      yours: this.phase === "fight" || this.phase === "result" ? yours : 6,
      theirs: this.phase === "fight" || this.phase === "result" ? theirs : 6,
      last: this.last,
    };
    this.listeners.forEach((fn) => fn());
  }

  private spawnWitch(w: ArenaWitch, side: 0 | 1, tx: number, ty: number, rng: Rng): void {
    const gear = [w.weapon, ...w.gear];
    const id = nextUid();
    const body = this.makeBody(w, side, tx, ty, id, "", w.role, w.talent * (w.role === "summoner" ? 0.2 : 1));
    body.moveIds = w.moves;
    body.might = ench(gear, "might");
    body.ward = ench(gear, "ward");
    body.crit = ench(gear, "crit_edge");
    body.swift = ench(gear, "swift");
    body.echo = ench(gear, "echo_guard");
    body.double = ench(gear, "double_strike");
    body.second = ench(gear, "second_chance") > 0;
    this.fighters.push(body);
    if (side === 0) body.grave = graveOf(w);
    if (w.role !== "summoner") return;
    w.spirits.forEach((s, i) => {
      const sx = tx + (side === 0 ? 2 : -2);
      const sy = ty - 1 + i;
      const spirit = this.makeBody(
        {
          name: s.name,
          race: w.race,
          type: s.type,
          level: w.level,
          maxHp: Math.floor((78 + w.level * 16) * 0.2),
          speed: Math.floor(68 + w.level * 0.2),
          moves: [s.move],
          weapon: w.weapon,
          gear: w.gear,
          hair: w.hair,
          skin: w.skin,
        },
        side,
        sx,
        sy,
        nextUid(),
        id,
        "spirit",
        w.talent * 0.34,
      );
      spirit.template = s.template;
      spirit.look = s.look;
      spirit.race = null;
      spirit.pieces = [];
      spirit.weapon = null;
      spirit.moveIds = [s.move];
      spirit.walk = rng() * 4;
      this.fighters.push(spirit);
    });
  }

  private makeBody(
    w: Pick<ArenaWitch, "name" | "race" | "type" | "level" | "maxHp" | "speed" | "moves" | "weapon" | "gear" | "hair" | "skin">,
    side: 0 | 1,
    tx: number,
    ty: number,
    id: string,
    master: string,
    role: Fighter["role"],
    dmgMul: number,
  ): Fighter {
    const pieces = [w.weapon, ...w.gear].map((g) => ({
      slot: g.slot,
      style: g.style,
      type: g.type,
      fxSeed: g.fxSeed,
      quality: Math.max(0, QUALITY.indexOf(g.quality)),
    }));
    return {
      id,
      side,
      role,
      name: w.name,
      race: w.race,
      type: w.type,
      level: w.level,
      x: tx * TILE + TILE / 2,
      y: ty * TILE + TILE / 2,
      hp: w.maxHp,
      max: w.maxHp,
      speed: w.speed,
      facing: side === 0 ? 1 : -1,
      direction: side === 0 ? "right" : "left",
      walk: 0,
      hurt: 0,
      cd: 0.3 + Math.random() * 0.4,
      shield: 0,
      root: 0,
      sleep: 0,
      burn: 0,
      trap: 0.2,
      moveIds: w.moves,
      weapon: w.weapon,
      pieces,
      template: 20,
      look: null,
      master,
      alive: true,
      dmgMul,
      might: 0,
      ward: 0,
      crit: 4,
      swift: 0,
      echo: 0,
      double: 0,
      second: false,
      usedSecond: false,
      tokened: false,
      buried: false,
      grave: null,
      think: Math.random() * 0.3,
      stuck: 0,
      lastX: tx * TILE,
      lastY: ty * TILE,
      path: [],
      hair: w.hair,
      skin: w.skin,
      tall: 1,
    };
  }

  private step(dt: number): void {
    this.age += dt;
    this.clock += dt;
    for (const f of this.fighters) {
      if (!f.alive) continue;
      f.hurt = Math.max(0, f.hurt - dt * 3);
      f.walk += dt * (f.path.length ? 5 : 1.2);
      f.cd = Math.max(0, f.cd - dt);
      f.shield = Math.max(0, f.shield - dt);
      f.root = Math.max(0, f.root - dt);
      f.sleep = Math.max(0, f.sleep - dt);
      f.burn = Math.max(0, f.burn - dt);
      if (f.burn > 0) this.hurt(f, (3 + f.level * 0.15) * dt, "#e25a32");
      const tx = Math.floor(f.x / TILE);
      const ty = Math.floor(f.y / TILE);
      const cell = this.grid[ty * this.gw + tx] ?? 1;
      if (cell === 2) {
        f.trap -= dt;
        if (f.trap <= 0) {
          f.trap = 0.6;
          this.hurt(f, 5 + f.level * 0.35, "#c4473a");
          this.float(f.x, f.y - 20, "trap", "#ffb4a8");
        }
      }
      if (f.sleep > 0) continue;
      f.think -= dt;
      if (f.think <= 0) {
        f.think = 0.28 + Math.random() * 0.12;
        this.think(f);
      }
      if (f.root <= 0) this.follow(f, dt, cell === 3);
      this.strike(f);
    }
    for (const b of this.beams) b.life -= dt;
    this.beams = this.beams.filter((b) => b.life > 0);
    for (const fl of this.floats) fl.life -= dt;
    this.floats = this.floats.filter((fl) => fl.life > 0);
    this.frame();
    if (this.age > 0.6) this.maybeEnd();
  }

  private think(f: Fighter): void {
    const allies = this.fighters.filter((o) => o.alive && o.side === f.side);
    const foes = this.fighters.filter((o) => o.alive && o.side !== f.side && o.role !== "spirit");
    const anyFoe = this.fighters.filter((o) => o.alive && o.side !== f.side);
    const pool = foes.length ? foes : anyFoe;
    if (!pool.length) return;
    let goal = this.goalFor(f, allies, pool);
    const moved = Math.hypot(f.x - f.lastX, f.y - f.lastY);
    if (moved < 5) f.stuck += 0.35;
    else f.stuck = 0;
    f.lastX = f.x;
    f.lastY = f.y;
    if (f.stuck > 1) {
      f.stuck = 0;
      const ang = Math.random() * Math.PI * 2;
      goal = { x: f.x + Math.cos(ang) * 70, y: f.y + Math.sin(ang) * 70 };
    }
    const fear = f.hp / f.max > 0.35;
    this.pathTo(f, goal.x, goal.y, fear);
  }

  private goalFor(f: Fighter, allies: Fighter[], foes: Fighter[]): { x: number; y: number } {
    if (f.role === "summoner") {
      const spirits = allies.filter((a) => a.master === f.id);
      if (spirits.length) {
        let sx = 0;
        let sy = 0;
        for (const s of spirits) {
          sx += s.x;
          sy += s.y;
        }
        sx /= spirits.length;
        sy /= spirits.length;
        const threat = nearest(foes, sx, sy);
        const dx = sx - threat.x;
        const dy = sy - threat.y;
        const l = Math.hypot(dx, dy) || 1;
        return { x: sx - (dx / l) * 46, y: sy - (dy / l) * 46 };
      }
    }
    if (f.role === "spirit") {
      const master = allies.find((a) => a.id === f.master);
      if (master && Math.hypot(f.x - master.x, f.y - master.y) > 128) return { x: master.x, y: master.y + 18 };
    }
    const target = this.pickTarget(f, foes);
    const move = this.bestMove(f, target, false);
    const reach = attackRange(move);
    const form = attackForm(move);
    const d = Math.hypot(target.x - f.x, target.y - f.y);
    if (form !== "melee") {
      if (d < reach * 0.5) {
        const ang = Math.atan2(f.y - target.y, f.x - target.x);
        return { x: f.x + Math.cos(ang) * 90, y: f.y + Math.sin(ang) * 90 };
      }
      if (d <= reach * 0.92 && los(this.grid, this.gw, this.gh, f.x, f.y, target.x, target.y)) return { x: f.x, y: f.y };
    }
    const ang = Math.atan2(f.y - target.y, f.x - target.x);
    const hold = form === "melee" ? 28 : Math.min(reach * 0.75, 120);
    return { x: target.x + Math.cos(ang) * hold, y: target.y + Math.sin(ang) * hold };
  }

  private pickTarget(f: Fighter, foes: Fighter[]): Fighter {
    if (f.role === "summoner") {
      const spirits = this.fighters.filter((a) => a.alive && a.master === f.id);
      if (spirits.length) {
        const weak = spirits.reduce((a, b) => (a.hp / a.max < b.hp / b.max ? a : b));
        return nearest(foes, weak.x, weak.y);
      }
    }
    let best = foes[0]!;
    let score = 1e9;
    for (const o of foes) {
      const d = Math.hypot(o.x - f.x, o.y - f.y);
      const low = o.hp / o.max < 0.34 ? 0.62 : 1;
      const s = d * low;
      if (s < score) {
        score = s;
        best = o;
      }
    }
    return best;
  }

  private bestMove(f: Fighter, target: Fighter | null, commit: boolean): Move {
    const list = f.moveIds.map((id) => MOVE_BY_ID[id]).filter((m): m is Move => !!m);
    const bag = list.length ? list : [MOVES[0]!];
    if (!commit) return bag.slice().sort((a, b) => b.power - a.power)[0]!;
    const hurt = f.hp / f.max < 0.48;
    if (hurt) {
      const mend = bag.find((m) => m.effect === "mend" || moveTactic(m) === "heal");
      if (mend) {
        const ally = this.lowestFriend(f);
        if (ally && ally.hp / ally.max < 0.62) return mend;
      }
      const ward = bag.find((m) => m.effect === "shell" || moveTactic(m) === "ward");
      if (ward && f.shield <= 0) return ward;
    }
    if (f.role === "summoner") {
      const spirits = this.fighters.filter((a) => a.alive && a.master === f.id);
      const bruised = spirits.find((s) => s.hp / s.max < 0.55);
      const mend = bag.find((m) => m.effect === "mend" || moveTactic(m) === "heal");
      if (bruised && mend) return mend;
    }
    const d = target ? Math.hypot(target.x - f.x, target.y - f.y) : 999;
    const inReach = bag.filter((m) => attackRange(m) + 10 >= d);
    const use = (inReach.length ? inReach : bag).slice().sort((a, b) => b.power - a.power);
    return use[0]!;
  }

  private lowestFriend(f: Fighter): Fighter | null {
    const allies = this.fighters.filter((a) => a.alive && a.side === f.side);
    if (!allies.length) return f;
    return allies.reduce((a, b) => (a.hp / a.max < b.hp / b.max ? a : b));
  }

  private pathTo(f: Fighter, x: number, y: number, fear: boolean): void {
    const sx = Math.floor(f.x / TILE);
    const sy = Math.floor(f.y / TILE);
    const gx = Math.floor(x / TILE);
    const gy = Math.floor(y / TILE);
    if (sx === gx && sy === gy) {
      f.path = [];
      return;
    }
    f.path = route(this.grid, this.gw, this.gh, sx, sy, gx, gy, fear);
  }

  private follow(f: Fighter, dt: number, mud: boolean): void {
    let tx = f.x;
    let ty = f.y;
    const step = f.path[0];
    if (step) {
      tx = step.x;
      ty = step.y;
      if (Math.hypot(step.x - f.x, step.y - f.y) < 10) f.path.shift();
    }
    let dx = tx - f.x;
    let dy = ty - f.y;
    const l = Math.hypot(dx, dy);
    if (l < 2) return;
    for (const o of this.fighters) {
      if (o === f || !o.alive || o.side !== f.side) continue;
      const d = Math.hypot(f.x - o.x, f.y - o.y);
      if (d < 22 && d > 0.2) {
        dx += ((f.x - o.x) / d) * 10;
        dy += ((f.y - o.y) / d) * 10;
      }
    }
    const mag = Math.hypot(dx, dy) || 1;
    const speed = f.speed * (mud ? 0.55 : 1) * (f.role === "spirit" ? 1.05 : 1);
    this.slide(f, (dx / mag) * speed * dt, (dy / mag) * speed * dt);

  }

  private slide(f: Fighter, dx: number, dy: number): void {
    const blocked = (x: number, y: number) => {
      const tx = Math.floor(x / TILE);
      const ty = Math.floor(y / TILE);
      if (tx < 0 || ty < 0 || tx >= this.gw || ty >= this.gh) return true;
      return this.grid[ty * this.gw + tx] === 1;
    };
    const x = f.x;
    const y = f.y;
    if (!blocked(f.x + dx, f.y)) f.x += dx;
    if (!blocked(f.x, f.y + dy)) f.y += dy;
    f.direction = directionFromDelta(f.x - x, f.y - y, f.direction);
    if (f.x !== x) f.facing = f.x < x ? -1 : 1;
  }

  private strike(f: Fighter): void {
    if (f.cd > 0 || f.sleep > 0) return;
    const foes = this.fighters.filter((o) => o.alive && o.side !== f.side);
    if (!foes.length) return;
    const witches = foes.filter((o) => o.role !== "spirit");
    const target = this.pickTarget(f, witches.length ? witches : foes);
    const move = this.bestMove(f, target, true);
    const tactic = moveTactic(move);
    if (tactic === "heal" || move.effect === "mend") {
      const ally = f.role === "summoner" ? this.lowestFriend(f) : f.hp / f.max < 0.7 ? f : this.lowestFriend(f);
      if (!ally) return;
      const heal = (10 + move.power * 0.7) * (0.75 + f.dmgMul);
      ally.hp = Math.min(ally.max, ally.hp + heal);
      this.float(ally.x, ally.y - 28, `${Math.round(heal)}`, "#9ad8c8");
      this.beams.push({ x0: f.x, y0: f.y - 20, x1: ally.x, y1: ally.y - 16, life: 0.18, color: "#9ad8c8" });
      f.cd = this.cooldown(f, move);
      return;
    }
    if ((tactic === "ward" || move.effect === "shell") && f.shield <= 0) {
      f.shield = 2.5;
      this.float(f.x, f.y - 30, "ward", "#e6c15a");
      f.cd = this.cooldown(f, move);
      return;
    }
    const d = Math.hypot(target.x - f.x, target.y - f.y);
    const reach = attackRange(move);
    if (tactic === "roll" && d < 78) {
      const ang = Math.atan2(f.y - target.y, f.x - target.x);
      this.slide(f, Math.cos(ang) * 54, Math.sin(ang) * 54);
      f.cd = 0.55;
      return;
    }
    if (d > reach + 6) return;
    const form = attackForm(move);
    if (form !== "melee" && !los(this.grid, this.gw, this.gh, f.x, f.y - 8, target.x, target.y - 8)) return;
    if (tactic === "blink" && d > 46) {
      const ang = Math.atan2(target.y - f.y, target.x - f.x);
      const nx = target.x - Math.cos(ang) * 30;
      const ny = target.y - Math.sin(ang) * 30;
      if (!this.pillar(nx, ny)) {
        f.x = nx;
        f.y = ny;
      }
    } else if (tactic === "lunge" && d > 36) {
      const ang = Math.atan2(target.y - f.y, target.x - f.x);
      this.slide(f, Math.cos(ang) * Math.min(d - 24, 80), Math.sin(ang) * Math.min(d - 24, 80));
    }
    this.cast(f, target, move);
    f.cd = this.cooldown(f, move);
    f.facing = target.x < f.x ? -1 : 1;
  }

  private cooldown(f: Fighter, move: Move): number {
    const tactic = moveTactic(move);
    const base = tactic === "heavy" || tactic === "channel" ? 1.55 : tactic === "roll" ? 0.7 : 0.95;
    return Math.max(0.35, base * (1 - Math.min(0.35, f.swift / 120)) * (f.role === "spirit" ? 1.15 : 1));
  }

  private cast(f: Fighter, target: Fighter, move: Move): void {
    const tm = typeMult(move.type, target.type);
    this.beams.push({
      x0: f.x,
      y0: f.y - 18,
      x1: target.x,
      y1: target.y - 16,
      life: 0.16,
      color: TYPES[move.type].color,
    });
    if (tm === 0) {
      this.float(target.x, target.y - 26, "immune", "#e7d9ff");
      return;
    }
    if (Math.random() * 100 < target.echo) {
      this.float(target.x, target.y - 26, "miss", "#f0e2c8");
      return;
    }
    const form = attackForm(move);
    const gear = 1 + (f.weapon?.level ?? f.level) * 0.035;
    const might = 1 + f.might / 100;
    const stab = move.type === f.type ? 1.12 : 1;
    let dmg =
      (5 + move.power * 0.34) *
      (1 + f.level * 0.045) *
      gear *
      might *
      stab *
      tm *
      f.dmgMul *
      (form === "melee" ? 1.15 : 1) *
      (moveTactic(move) === "heavy" ? 1.35 : 1);
    const crit = Math.random() * 100 < move.crit + f.crit;
    if (crit) dmg *= 1.65;
    if (target.shield > 0) dmg *= 0.55;
    dmg *= 1 - Math.min(0.45, target.ward / 140);
    const hits = Math.random() * 100 < f.double ? 2 : 1;
    for (let i = 0; i < hits; i++) this.hurt(target, Math.max(1, dmg * (hits === 2 ? 0.8 : 1)), crit ? "#fff1a8" : "#fff6e8");
    if (move.effect === "burn") target.burn = Math.max(target.burn, 2.4);
    if (move.effect === "root") target.root = Math.max(target.root, 1.3);
    const wasAsleep = target.sleep > 0;
    if (wasAsleep) target.sleep = 0;
    if (move.effect === "sleep" && Math.random() < 0.45) target.sleep = 1.4;
    if (move.effect === "leech") f.hp = Math.min(f.max, f.hp + dmg * 0.25);
  }

  private hurt(f: Fighter, amount: number, color: string | null): void {
    if (!f.alive) return;
    f.hp -= amount;
    f.hurt = 0.35;
    if (color && amount >= 1) this.float(f.x, f.y - 24, `${Math.round(amount)}`, color);
    if (f.hp > 0) return;
    if (f.second && !f.usedSecond) {
      f.usedSecond = true;
      f.hp = Math.max(1, f.max * 0.22);
      this.float(f.x, f.y - 36, "second", "#e6c15a");
      return;
    }
    f.hp = 0;
    f.alive = false;
    if (f.grave && !f.buried) {
      f.buried = true;
      const key = `${f.grave.name}:${f.grave.level}:${f.grave.note}`;
      if (!this.buriedKeys.has(key)) {
        this.buriedKeys.add(key);
        this.onGrave(f.grave);
      }
    }
    if (f.role !== "spirit") {
      for (const s of this.fighters) {
        if (s.master === f.id && s.alive) {
          s.alive = false;
          s.hp = 0;
          this.float(s.x, s.y - 16, "unravels", "#b9a8d8");
        }
      }
    }
    if (f.side === 1 && f.role !== "spirit" && !f.tokened && this.save) {
      f.tokened = true;
      this.save.tokens += 1;
      this.gained += 1;
      this.float(f.x, f.y - 42, "+1 token", "#e6c15a");
      this.note = `${f.name} falls. Token in the jar.`;
      this.publish();
    }
  }

  private pillar(x: number, y: number): boolean {
    const tx = Math.floor(x / TILE);
    const ty = Math.floor(y / TILE);
    if (tx < 0 || ty < 0 || tx >= this.gw || ty >= this.gh) return true;
    return this.grid[ty * this.gw + tx] === 1;
  }

  private maybeEnd(): void {
    const you = this.fighters.some((f) => f.alive && f.side === 0 && f.role !== "spirit");
    const them = this.fighters.some((f) => f.alive && f.side === 1 && f.role !== "spirit");
    if (you && them && this.age < 70) return;
    let win = you && !them;
    let timed = "";
    if (you && them) {
      const score = (side: 0 | 1) =>
        this.fighters.filter((f) => f.alive && f.side === side && f.role !== "spirit").reduce((s, f) => s + f.hp / f.max, 0);
      win = score(0) >= score(1);
      timed = win ? "The circle calls time. Your six held more life." : "The circle calls time. Their six held more life.";
    }
    const save = this.save;
    if (!save) return;
    save.points += win ? 1 : -1;
    if (win) save.wins += 1;
    else save.losses += 1;
    const tokens = this.gained;
    if (save.points <= 0) {
      for (const w of save.roster) {
        const g = graveOf(w);
        const key = `${g.name}:${g.level}:${g.note}`;
        if (this.buriedKeys.has(key)) continue;
        this.buriedKeys.add(key);
        this.onGrave(g);
      }
      this.last = { win: false, tokens, note: "No marks left. The circle forgets this coven." };
      this.phase = "over";
      this.note = this.last.note;
      this.save = null;
      this.onCloud(null);
      this.publish();
      return;
    }
    this.last = {
      win,
      tokens,
      note: timed || (win ? `The six stand. +1 mark. ${tokens} tokens from the dead.` : `Your six break. -1 mark. ${tokens} tokens kept.`),
    };
    this.phase = "result";
    this.note = this.last.note;
    this.persist();
  }

  private frame(): void {
    const living = this.fighters.filter((f) => f.alive);
    const witches = living.filter((f) => f.role !== "spirit");
    const focus = witches.length <= 2 && witches.length > 0 ? witches : living.length ? living : this.fighters;
    let minX = 1e9;
    let minY = 1e9;
    let maxX = -1e9;
    let maxY = -1e9;
    for (const f of focus) {
      minX = Math.min(minX, f.x);
      minY = Math.min(minY, f.y);
      maxX = Math.max(maxX, f.x);
      maxY = Math.max(maxY, f.y);
    }
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2 - 10;
    const span = Math.max(maxX - minX, maxY - minY, witches.length <= 2 ? 160 : 280);
    const fit = Math.min(this.viewW, this.viewH) / (span + (witches.length <= 2 ? 180 : 280));
    const cap = witches.length <= 2 ? 2.05 : 1.05;
    this.wantX = cx;
    this.wantY = cy;
    this.wantZ = Math.max(0.42, Math.min(cap, fit));
    const k = Math.min(1, 0.08);
    this.camX += (this.wantX - this.camX) * k;
    this.camY += (this.wantY - this.camY) * k;
    this.zoom += (this.wantZ - this.zoom) * k;
  }

  private float(x: number, y: number, text: string, color: string): void {
    this.floats.push({ x, y, text, life: 0.8, color });
  }

  private draw(): void {
    const ctx = this.ctx;
    const dpr = this.dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#100c0a";
    ctx.fillRect(0, 0, this.viewW, this.viewH);
    if (this.phase === "roster" || this.phase === "over" || !this.grid.length) {
      ctx.fillStyle = "#f0e2c8";
      ctx.font = "12px 'Press Start 2P', monospace";
      ctx.fillText("CIRCLE", 24, 48);
      return;
    }
    ctx.save();
    ctx.translate(this.viewW / 2, this.viewH / 2);
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.camX, -this.camY);
    ctx.imageSmoothingEnabled = false;
    for (let y = 0; y < this.gh; y++) {
      for (let x = 0; x < this.gw; x++) {
        const cell = this.grid[y * this.gw + x] ?? 0;
        ctx.fillStyle = (x + y) % 2 === 0 ? "#2a211c" : "#241c18";
        ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
        if (cell === 2) {
          ctx.strokeStyle = "#c4473a";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x * TILE + 16, y * TILE + 16, 8, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = "rgba(196,71,58,0.35)";
          ctx.fill();
        } else if (cell === 3) {
          ctx.fillStyle = "#3a2a18";
          ctx.beginPath();
          ctx.ellipse(x * TILE + 16, y * TILE + 18, 12, 7, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    for (let y = 0; y < this.gh; y++) {
      for (let x = 0; x < this.gw; x++) {
        if (this.grid[y * this.gw + x] !== 1) continue;
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.beginPath();
        ctx.ellipse(x * TILE + 16, y * TILE + 22, 12, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#6e6258";
        ctx.fillRect(x * TILE + 8, y * TILE - 10, 16, 30);
        ctx.fillStyle = "#8a7b70";
        ctx.fillRect(x * TILE + 8, y * TILE - 10, 5, 30);
      }
    }
    for (const b of this.beams) {
      ctx.globalAlpha = Math.max(0, b.life * 5);
      ctx.strokeStyle = b.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(b.x0, b.y0);
      ctx.lineTo(b.x1, b.y1);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    const order = this.fighters.filter((f) => f.alive).sort((a, b) => a.y - b.y);
    for (const f of order) {
      if (f.role === "spirit" && f.look) {
        drawMonster(ctx, {
          x: f.x,
          y: f.y,
          template: f.template,
          type: f.type,
          facing: f.facing,
          walk: f.walk,
          hurt: f.hurt,
          boss: false,
          rarity: 0,
          ghost: true,
          look: f.look,
          time: this.clock,
        });
      } else if (f.race) {
        drawActor(ctx, {
          x: f.x,
          y: f.y,
          race: f.race,
          direction: f.direction,
          female: true,
          hair: f.hair,
          skin: f.skin,
          facing: f.facing,
          walk: f.walk,
          attack: f.cd > 0.7 ? 0.45 : 0,
          hurt: f.hurt,
          pieces: f.pieces,
          setFx: null,
          setOn: false,
          time: this.clock,
          scale: 1,
        });
      }
      const bar = f.role === "spirit" ? 28 : 46;
      const by = f.y - (f.role === "spirit" ? 36 : 44);
      ctx.fillStyle = "#1a1214";
      ctx.fillRect(f.x - bar / 2 - 1, by - 1, bar + 2, 6);
      ctx.fillStyle = f.side === 0 ? "#e6c15a" : "#c4473a";
      ctx.fillRect(f.x - bar / 2, by, bar * Math.max(0, f.hp / f.max), 4);
      if (f.role !== "spirit") drawShadowName(ctx, `${f.name} ${f.level}`, f.x, by - 12, f.side === 0 ? "#fff1a8" : "#ffd0c8");
    }
    for (const fl of this.floats) {
      ctx.globalAlpha = Math.max(0, Math.min(1, fl.life * 2));
      drawShadowName(ctx, fl.text, fl.x, fl.y - (0.8 - fl.life) * 18, fl.color);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }
}

function nearest(list: Fighter[], x: number, y: number): Fighter {
  let best = list[0]!;
  let bd = 1e9;
  for (const f of list) {
    const d = Math.hypot(f.x - x, f.y - y);
    if (d < bd) {
      bd = d;
      best = f;
    }
  }
  return best;
}
