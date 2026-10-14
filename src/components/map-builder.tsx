import { useEffect, useRef, useState } from "react";
import { ANIMALS, MONSTERS, TILE } from "@/game/content";
import {
  downloadMapFile,
  emptyMap,
  FLOOR_COLOR,
  parseMapJson,
  DESIGNER_KEY,
  MAX_LAYERS,
  type MapFile,
  type MapTile,
  type SpawnZone,
} from "@/game/map-format";
import { loadTileCatalog, tileImage, type AtlasTile, type TileCatalog } from "@/game/tile-atlas";

const KEY = DESIGNER_KEY;
type Tool = "pan" | "paint" | "overlay" | "peel" | "fill" | "pick" | "erase" | "wall" | "walk" | "block" | "portal" | "unportal" | "start" | "enemy" | "boss" | "remove" | "zone";
export function MapBuilder({ onBack }: { onBack: () => void }) {
  const [map, setMap] = useState(() => ({
    ...emptyMap("new-dungeon", "New Dungeon", 48, 32, 8),
    kind: "dungeon" as const,
  }));
  const [catalog, setCatalog] = useState<TileCatalog | null>(null);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [tile, setTile] = useState<AtlasTile | null>(null);
  const [tool, setTool] = useState<Tool>("paint");
  const [species, setSpecies] = useState("gaikotsu");
  const [portal, setPortal] = useState({ map: "world", tx: "", ty: "" });
  const [showCollision, setShowCollision] = useState(true);
  const [zoom, setZoom] = useState(24);
  const [status, setStatus] = useState("Pick a tile and paint. Scroll to explore your map.");
  const [saved, setSaved] = useState<MapFile[]>([]);
  const [savedId, setSavedId] = useState("");
  const [width, setWidth] = useState(48),
    [height, setHeight] = useState(32);
  const [kind, setKind] = useState<MapFile["kind"]>("dungeon");
  const [history, setHistory] = useState<MapFile[]>([]),
    [redo, setRedo] = useState<MapFile[]>([]);
  const [zoneId, setZoneId] = useState<string | null>(null);
  const [zonePreview, setZonePreview] = useState<{ tx: number; ty: number; tw: number; th: number } | null>(null);
  const zoneDrag = useRef<{ x: number; y: number } | null>(null);
  const viewport = useRef<HTMLDivElement>(null),
    canvas = useRef<HTMLCanvasElement>(null),
    input = useRef<HTMLInputElement>(null);
  const [view, setView] = useState({ x: 0, y: 0, w: 700, h: 480 });
  const pan = useRef({ x: 0, y: 0, left: 0, top: 0 });
  const painting = useRef(false),
    lastCell = useRef(-1),
    current = useRef<MapFile>(map);
  const setDocument = (next: MapFile) => {
    current.current = next;
    setMap(next as typeof map);
  };
  useEffect(() => {
    void loadTileCatalog().then((c) => {
      setCatalog(c);
      if (c) {
        setCategory(c.categories[0]?.id ?? "");
        setTile(c.categories[0]?.tiles[0] ?? null);
      } else setStatus("Tile catalog could not load. Reload Designer Mode to retry.");
    });
    try {
      const list = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      setSaved(Array.isArray(list) ? list.map(parseMapJson) : []);
    } catch {
      setStatus("Saved map library could not be read. Import a backup to recover it.");
    }
    const el = viewport.current;
    if (!el) return;
    const observer = new ResizeObserver(() =>
      setView((v) => ({ ...v, w: el.clientWidth, h: el.clientHeight })),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    let frame = 0;
    const draw = () => {
      const c = canvas.current,
        ctx = c?.getContext("2d");
      if (!c || !ctx) return;
      c.width = view.w;
      c.height = view.h;
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, c.width, c.height);
      let pending = false;
      for (
        let y = Math.floor(view.y / zoom);
        y < Math.min(map.h, Math.ceil((view.y + view.h) / zoom));
        y++
      )
        for (
          let x = Math.floor(view.x / zoom);
          x < Math.min(map.w, Math.ceil((view.x + view.w) / zoom));
          x++
        ) {
          const t = map.tiles[y * map.w + x]!;
          const dx = x * zoom - view.x,
            dy = y * zoom - view.y;
          ctx.fillStyle = FLOOR_COLOR[t.floor] ?? FLOOR_COLOR[0]!;
          ctx.fillRect(dx, dy, zoom, zoom);
          for (const src of [t.sprite, ...((t as MapTile).layers ?? [])]) {
            if (!src) continue;
            const img = tileImage(src);
            if (img.complete && img.naturalWidth) ctx.drawImage(img, dx, dy, zoom, zoom);
            else if (!img.complete) pending = true;
          }
          if (showCollision && t.block) {
            ctx.fillStyle = "rgba(196,71,58,0.28)";
            ctx.fillRect(dx, dy, zoom, zoom);
          }
          ctx.strokeStyle = t.block ? "#c4473a" : "#ffffff18";
          ctx.strokeRect(dx, dy, zoom, zoom);
          const pt = (t as MapTile).portal;
          if (pt) {
            ctx.strokeStyle = "#b4a6ff";
            ctx.lineWidth = 2;
            ctx.strokeRect(dx + 2, dy + 2, zoom - 4, zoom - 4);
            ctx.lineWidth = 1;
            ctx.fillStyle = "#b4a6ff";
            ctx.font = "bold 12px monospace";
            ctx.fillText("P", dx + zoom / 2 - 4, dy + zoom / 2 + 4);
          }
        }
      for (const s of map.spawns ?? []) {
        ctx.fillStyle = s.boss ? "#c4473a" : "#e6c15a";
        ctx.font = "bold 14px monospace";
        ctx.fillText(
          s.boss ? "B" : "E",
          (s.x / TILE) * zoom - view.x - 5,
          (s.y / TILE) * zoom - view.y + 5,
        );
      }
      const paintZone = (z: { tx: number; ty: number; tw: number; th: number }, on: boolean) => {
        ctx.fillStyle = on ? "rgba(196,71,58,0.28)" : "rgba(230,193,90,0.18)";
        ctx.strokeStyle = on ? "#ffb4a8" : "#e6c15a";
        ctx.lineWidth = 2;
        ctx.fillRect(z.tx * zoom - view.x, z.ty * zoom - view.y, z.tw * zoom, z.th * zoom);
        ctx.strokeRect(z.tx * zoom - view.x, z.ty * zoom - view.y, z.tw * zoom, z.th * zoom);
        ctx.lineWidth = 1;
        ctx.fillStyle = "#fff6e8";
        ctx.font = "bold 11px monospace";
        ctx.fillText("ZONE", z.tx * zoom - view.x + 4, z.ty * zoom - view.y + 12);
      };
      for (const z of map.zones ?? []) paintZone(z, z.id === zoneId);
      if (zonePreview) paintZone(zonePreview, true);
      if (map.spawn) {
        ctx.fillStyle = "#8fd06a";
        ctx.font = "bold 14px monospace";
        ctx.fillText(
          "S",
          (map.spawn.tx + 0.5) * zoom - view.x - 5,
          (map.spawn.ty + 0.5) * zoom - view.y + 5,
        );
      }
      if (pending) frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, [map, view, zoom, showCollision, zoneId, zonePreview]);
  useEffect(() => {
    setWidth(map.w);
    setHeight(map.h);
    setKind(map.kind ?? "world");
  }, [map.w, map.h, map.kind]);
  function checkpoint() {
    setHistory((h) => [...h.slice(-19), structuredClone(current.current)]);
    setRedo([]);
  }
  function cellOf(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left + (viewport.current?.scrollLeft ?? 0)) / zoom);
    const y = Math.floor((e.clientY - rect.top + (viewport.current?.scrollTop ?? 0)) / zoom);
    return { x, y };
  }
  function rectFrom(a: { x: number; y: number }, b: { x: number; y: number }, w: number, h: number) {
    const tx = Math.max(0, Math.min(a.x, b.x));
    const ty = Math.max(0, Math.min(a.y, b.y));
    const x2 = Math.min(w - 1, Math.max(a.x, b.x));
    const y2 = Math.min(h - 1, Math.max(a.y, b.y));
    return { tx, ty, tw: x2 - tx + 1, th: y2 - ty + 1 };
  }
  function commitZone(rect: { tx: number; ty: number; tw: number; th: number }) {
    const m = current.current;
    const hit = (m.zones ?? []).find((z) => rect.tw === 1 && rect.th === 1 && rect.tx >= z.tx && rect.ty >= z.ty && rect.tx < z.tx + z.tw && rect.ty < z.ty + z.th);
    if (hit) {
      setZoneId(hit.id);
      setStatus(`Selected spawn zone. Levels ${hit.levelMin}–${hit.levelMax}, ${hit.count} foes.`);
      return;
    }
    if (rect.tx < 0 || rect.ty < 0 || rect.tx + rect.tw > m.w || rect.ty + rect.th > m.h) return;
    checkpoint();
    const zone: SpawnZone = {
      id: crypto.randomUUID(),
      ...rect,
      levelMin: 1,
      levelMax: 8,
      species: species ? [species] : [],
      count: Math.max(1, Math.min(12, Math.floor((rect.tw * rect.th) / 4) || 1)),
      respawn: 25,
    };
    const next = { ...m, zones: [...(m.zones ?? []), zone] };
    setDocument(next);
    setZoneId(zone.id);
    setStatus("Spawn zone placed. Set levels, count, respawn, and which enemies appear.");
  }
  function patchZone(id: string, patch: Partial<SpawnZone>) {
    const m = current.current;
    const zones = (m.zones ?? []).map((z) => (z.id === id ? { ...z, ...patch } : z));
    setDocument({ ...m, zones });
  }
  function paint(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left + (viewport.current?.scrollLeft ?? 0)) / zoom),
      y = Math.floor((e.clientY - rect.top + (viewport.current?.scrollTop ?? 0)) / zoom);
    const m = current.current,
      idx = y * m.w + x;
    if (x < 0 || y < 0 || x >= m.w || y >= m.h || idx === lastCell.current) return;
    lastCell.current = idx;
    const next = { ...m, tiles: [...m.tiles], spawns: [...(m.spawns ?? [])] };
    if (tool === "start") {
      if (m.tiles[idx]?.block) return setStatus("Player start needs a walkable tile.");
      next.spawn = { tx: x, ty: y };
    } else if (tool === "enemy" || tool === "boss") {
      if (m.tiles[idx]?.block) return setStatus("Enemies need a walkable tile.");
      if (next.spawns.some((s) => Math.floor(s.x / TILE) === x && Math.floor(s.y / TILE) === y))
        return;
      next.spawns.push({
        id: crypto.randomUUID(),
        kind: "mob",
        species,
        x: (x + 0.5) * TILE,
        y: (y + 0.5) * TILE,
        level: tool === "boss" ? 10 : 1,
        boss: tool === "boss",
      });
    } else if (tool === "remove")
      next.spawns = next.spawns.filter(
        (s) => Math.floor(s.x / TILE) !== x || Math.floor(s.y / TILE) !== y,
      );
    else if (tool === "wall")
      next.tiles[idx] = { ...m.tiles[idx]!, block: m.tiles[idx]!.block ? 0 : 1 };
    else if (tool === "walk") {
      const t = m.tiles[idx]!;
      next.tiles[idx] = { ...t, block: 0, floor: t.floor === 1 || t.floor === 2 ? 8 : t.floor };
    } else if (tool === "block") next.tiles[idx] = { ...m.tiles[idx]!, block: 1 };
    else if (tool === "overlay") {
      if (!tile) return;
      const t = m.tiles[idx]! as MapTile;
      if (!t.sprite) next.tiles[idx] = { ...t, sprite: tile.path };
      else {
        const layers = [...(t.layers ?? [])];
        if (layers[layers.length - 1] === tile.path) return;
        if (layers.length >= MAX_LAYERS) return setStatus(`A tile holds at most ${MAX_LAYERS} stacked layers.`);
        next.tiles[idx] = { ...t, layers: [...layers, tile.path], block: tile.solid ? 1 : t.block };
      }
    } else if (tool === "peel") {
      const t = m.tiles[idx]! as MapTile;
      const layers = [...(t.layers ?? [])];
      if (layers.length) layers.pop();
      const { layers: _drop, ...rest } = t;
      void _drop;
      next.tiles[idx] = layers.length ? { ...rest, layers } : rest;
    } else if (tool === "pick") {
      const t = m.tiles[idx]! as MapTile;
      const path = t.layers?.[t.layers.length - 1] ?? t.sprite;
      const found = catalog?.categories.flatMap((c) => c.tiles).find((a) => a.path === path);
      if (found) {
        setTile(found);
        setStatus(`Picked ${found.file}.`);
      }
      return;
    } else if (tool === "fill") {
      if (!tile) return;
      const from = (m.tiles[idx] as MapTile).sprite ?? `floor:${m.tiles[idx]!.floor}`;
      const key = (t: MapTile) => t.sprite ?? `floor:${t.floor}`;
      const stack = [idx];
      const seen = new Set<number>();
      while (stack.length && seen.size < 20000) {
        const i = stack.pop()!;
        if (seen.has(i) || key(next.tiles[i] as MapTile) !== from) continue;
        seen.add(i);
        next.tiles[i] = { ...next.tiles[i]!, sprite: tile.path, block: tile.solid ? 1 : 0 };
        const cx = i % m.w, cy = Math.floor(i / m.w);
        if (cx > 0) stack.push(i - 1);
        if (cx < m.w - 1) stack.push(i + 1);
        if (cy > 0) stack.push(i - m.w);
        if (cy < m.h - 1) stack.push(i + m.w);
      }
      setStatus(`Filled ${seen.size} tiles.`);
    } else if (tool === "portal") {
      if (portal.map === m.id) return setStatus("A portal cannot lead to the same map. Pick another map.");
      const tx = portal.tx === "" ? undefined : Number(portal.tx), ty = portal.ty === "" ? undefined : Number(portal.ty);
      next.tiles[idx] = { ...m.tiles[idx]!, block: 0, floor: m.tiles[idx]!.floor === 1 || m.tiles[idx]!.floor === 2 ? 8 : m.tiles[idx]!.floor, portal: { map: portal.map, ...(tx !== undefined && ty !== undefined && Number.isInteger(tx) && Number.isInteger(ty) ? { tx, ty } : {}) } } as MapTile;
      setStatus(`Portal to ${portal.map === "world" ? "the overworld" : portal.map} placed.`);
    } else if (tool === "unportal") {
      const { portal: _p, ...rest } = m.tiles[idx]! as MapTile;
      void _p;
      next.tiles[idx] = rest;
    }
    else if (tool === "erase") next.tiles[idx] = { floor: 8, biome: 3, block: 0, decor: 0 };
    else if (tile)
      next.tiles[idx] = { ...m.tiles[idx]!, sprite: tile.path, block: tile.solid ? 1 : 0 };
    setDocument(next);
  }
  function accept(m: MapFile) {
    checkpoint();
    setDocument(m);
    setWidth(m.w);
    setHeight(m.h);
    setKind(m.kind);
    viewport.current?.scrollTo(0, 0);
    setStatus(`Loaded ${m.name}.`);
  }
  function save() {
    try {
      const doc = parseMapJson(current.current);
      const list = [...saved.filter((m) => m.id !== doc.id), doc];
      localStorage.setItem(KEY, JSON.stringify(list));
      setSaved(list);
      setSavedId(doc.id);
      setStatus("Saved on this device. Export a file to share or back up.");
    } catch (e) {
      setStatus((e as Error).message);
    }
  }
  const tiles =
    catalog?.categories
      .find((c) => c.id === category)
      ?.tiles.filter((t) => t.file.toLowerCase().includes(search.toLowerCase())) ?? [];
  return (
    <section className="designer-screen">
      <header className="designer-header">
        <div>
          <p className="font-display text-xs text-blood">BUILDER TOOLS</p>
          <h1 className="font-display text-lg">Map Builder</h1>
        </div>
        <button className="px-btn" onClick={onBack}>
          Back to Designer Mode
        </button>
      </header>
      <div className="designer-toolbar px-panel">
        <label>
          Name
          <input
            aria-label="Map name"
            className="px-input"
            value={map.name}
            maxLength={100}
            onChange={(e) => setDocument({ ...map, name: e.target.value })}
          />
        </label>
        <label>
          File ID
          <input
            aria-label="Map ID"
            className="px-input"
            value={map.id}
            onChange={(e) =>
              setDocument({ ...map, id: e.target.value.replace(/[^a-z0-9_-]/gi, "-") })
            }
          />
        </label>
        <label>
          Map type
          <select
            aria-label="Map type"
            value={kind}
            onChange={(e) => {
              const k = e.target.value as MapFile["kind"];
              setKind(k);
              setDocument({ ...map, kind: k });
            }}
          >
            <option value="bossroom">Bossroom</option>
            <option value="dungeon">Dungeon</option>
            <option value="world">Full World</option>
          </select>
        </label>
        <label>
          Width
          <input
            className="px-input"
            type="number"
            min={4}
            max={512}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
          />
        </label>
        <label>
          Height
          <input
            className="px-input"
            type="number"
            min={4}
            max={512}
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
          />
        </label>
        <button
          className="px-btn"
          onClick={() => {
            if (
              !Number.isInteger(width) ||
              !Number.isInteger(height) ||
              width < 4 ||
              height < 4 ||
              width > 512 ||
              height > 512
            )
              return setStatus("Dimensions must be 4–512 whole tiles.");
            checkpoint();
            setDocument({ ...emptyMap(map.id, map.name, width, height, 8), kind });
            setStatus("Created a blank map. Undo restores your previous work.");
          }}
        >
          New blank map
        </button>
        <button
          className="px-btn"
          disabled={!history.length}
          onClick={() => {
            const prev = history.at(-1)!;
            setRedo((r) => [...r, current.current]);
            setHistory(history.slice(0, -1));
            setDocument(prev);
          }}
        >
          Undo
        </button>
        <button
          className="px-btn"
          disabled={!redo.length}
          onClick={() => {
            const next = redo.at(-1)!;
            setHistory((h) => [...h, current.current]);
            setRedo(redo.slice(0, -1));
            setDocument(next);
          }}
        >
          Redo
        </button>
        <button className="px-btn" onClick={save}>
          Save map
        </button>
        <button
          className="px-btn"
          onClick={() => {
            try {
              downloadMapFile(parseMapJson(current.current));
              setStatus("Exported map JSON for a future game update.");
            } catch (e) {
              setStatus((e as Error).message);
            }
          }}
        >
          Export JSON
        </button>
        <button className="px-btn" onClick={() => input.current?.click()}>
          Import JSON
        </button>
        <input
          ref={input}
          aria-label="Import map file"
          type="file"
          accept=".json,application/json"
          hidden
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            try {
              if (file.size > 20_000_000) throw Error("Map file is too large (20 MB maximum).");
              accept(parseMapJson(JSON.parse(await file.text())));
            } catch (err) {
              setStatus((err as Error).message);
            }
          }}
        />
        <label>
          Saved maps
          <select
            aria-label="Saved maps"
            value={savedId}
            onChange={(e) => setSavedId(e.target.value)}
          >
            <option value="">Choose a saved map</option>
            {saved.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
        <button
          className="px-btn"
          disabled={!savedId}
          onClick={() => {
            const m = saved.find((m) => m.id === savedId);
            if (m) accept(structuredClone(m));
          }}
        >
          Load saved
        </button>
      </div>
      <p role="status" className="designer-status">
        {status}
      </p>
      <div className="designer-workspace">
        <aside className="px-panel designer-palette">
          <label>
            Tile category
            <select
              aria-label="Tile category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {catalog?.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label} · {c.count}
                </option>
              ))}
            </select>
          </label>
          <input
            className="px-input"
            aria-label="Search tiles"
            placeholder="Search tiles"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <p className="text-dim">{tile?.file ?? "Loading tiles…"} · red border = solid</p>
          <div className="tile-palette">
            {tiles.map((t) => (
              <button
                key={t.id}
                title={t.file}
                aria-label={t.file}
                aria-pressed={tile?.id === t.id}
                className={`tile-choice ${tile?.id === t.id ? "selected" : ""}`}
                onClick={() => {
                  setTile(t);
                  if (!["overlay", "fill", "paint"].includes(tool)) setTool("paint");
                }}
              >
                <img src={t.path} loading="lazy" alt={t.file.replace(/_/g, " ")} />
              </button>
            ))}
          </div>
          {catalog && !tiles.length && <p>No matching tiles.</p>}
        </aside>
        <div className="designer-map">
          <div className="designer-toolbar">
            <label>
              Tool
              <select
                aria-label="Map tool"
                data-testid="map-tool-select"
                value={tool}
                onChange={(e) => setTool(e.target.value as Tool)}
              >
                {(
                  [
                    ["pan", "Pan map"],
                    ["paint", "Paint base tile"],
                    ["overlay", "Stack overlay tile"],
                    ["peel", "Remove top overlay"],
                    ["fill", "Bucket fill"],
                    ["pick", "Eyedropper"],
                    ["erase", "Erase tile"],
                    ["walk", "Make walkable"],
                    ["block", "Make solid"],
                    ["wall", "Toggle collision"],
                    ["portal", "Place portal"],
                    ["unportal", "Remove portal"],
                    ["start", "Player start"],
                    ["enemy", "Enemy spawn"],
                    ["boss", "Boss spawn"],
                    ["zone", "Spawn zone"],
                    ["remove", "Remove entity"],
                  ] as const
                ).map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Enemy
              <select
                aria-label="Enemy species"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
              >
                {MONSTERS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </label>
            {tool === "portal" && (
              <>
                <label>
                  Portal to
                  <select aria-label="Portal target map" data-testid="portal-target-select" value={portal.map} onChange={(e) => setPortal({ ...portal, map: e.target.value })}>
                    <option value="world">Overworld (hearth)</option>
                    {saved.filter((s) => s.id !== map.id).map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Arrive X
                  <input aria-label="Portal target x" data-testid="portal-tx" className="w-16 border-2 border-bone bg-ink px-1" value={portal.tx} placeholder="start" onChange={(e) => setPortal({ ...portal, tx: e.target.value.replace(/\D/g, "") })} />
                </label>
                <label>
                  Y
                  <input aria-label="Portal target y" data-testid="portal-ty" className="w-16 border-2 border-bone bg-ink px-1" value={portal.ty} placeholder="start" onChange={(e) => setPortal({ ...portal, ty: e.target.value.replace(/\D/g, "") })} />
                </label>
              </>
            )}
            <label>
              <input type="checkbox" data-testid="show-collision" checked={showCollision} onChange={(e) => setShowCollision(e.target.checked)} /> Collision
            </label>
            <label>
              Zoom
              <select
                aria-label="Map zoom"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
              >
                {[12, 24, 32, 48].map((n) => (
                  <option key={n} value={n}>
                    {n}px
                  </option>
                ))}
              </select>
            </label>
            <p>
              {map.w} × {map.h} · {map.spawns?.length ?? 0} entities · {map.zones?.length ?? 0} zones
            </p>
          </div>
          {(tool === "zone" || zoneId) && (
            <ZoneEditor
              map={map}
              zoneId={zoneId}
              onSelect={setZoneId}
              onPatch={(id, patch) => patchZone(id, patch)}
              onDelete={(id) => {
                checkpoint();
                const m = current.current;
                setDocument({ ...m, zones: (m.zones ?? []).filter((z) => z.id !== id) });
                setZoneId(null);
                setStatus("Spawn zone removed.");
              }}
            />
          )}
          <div
            ref={viewport}
            className="map-builder-viewport"
            onScroll={(e) => {
              const x = e.currentTarget.scrollLeft,
                y = e.currentTarget.scrollTop;
              setView((v) => ({ ...v, x, y }));
            }}
          >
            <div style={{ width: map.w * zoom, height: map.h * zoom }}>
              <canvas
                ref={canvas}
                aria-label="Map editing canvas"
                className="map-builder-canvas"
                onPointerDown={(e) => {
                  painting.current = true;
                  lastCell.current = -1;
                  e.currentTarget.setPointerCapture(e.pointerId);
                  if (tool === "pan")
                    pan.current = {
                      x: e.clientX,
                      y: e.clientY,
                      left: viewport.current?.scrollLeft ?? 0,
                      top: viewport.current?.scrollTop ?? 0,
                    };
                  else if (tool === "zone") {
                    const cell = cellOf(e);
                    if (cell.x < 0 || cell.y < 0 || cell.x >= current.current.w || cell.y >= current.current.h) return;
                    zoneDrag.current = cell;
                    setZonePreview({ tx: cell.x, ty: cell.y, tw: 1, th: 1 });
                  } else {
                    checkpoint();
                    paint(e);
                  }
                }}
                onPointerMove={(e) => {
                  if (!painting.current) return;
                  if (tool === "pan")
                    viewport.current?.scrollTo(
                      pan.current.left + pan.current.x - e.clientX,
                      pan.current.top + pan.current.y - e.clientY,
                    );
                  else if (tool === "zone" && zoneDrag.current) {
                    const cell = cellOf(e);
                    setZonePreview(rectFrom(zoneDrag.current, cell, current.current.w, current.current.h));
                  } else paint(e);
                }}
                onPointerUp={(e) => {
                  if (tool === "zone" && zoneDrag.current) {
                    const cell = cellOf(e);
                    commitZone(rectFrom(zoneDrag.current, cell, current.current.w, current.current.h));
                    zoneDrag.current = null;
                    setZonePreview(null);
                  }
                  painting.current = false;
                }}
                onPointerCancel={() => {
                  painting.current = false;
                  zoneDrag.current = null;
                  setZonePreview(null);
                }}
              />
            </div>
          </div>
          <p className="text-dim">
            S = player start · E = enemy · B = boss · P = portal · gold box = spawn zone · red = solid. Drag with Spawn zone to mark where foes appear. Stack transparent overlays on any base tile (up to {MAX_LAYERS}).
            Save a map, then enter it in-game from the pause menu (Escape) · Designer maps, or link maps together with portals.
          </p>
        </div>
      </div>
    </section>
  );
}

const ZONE_KINDS = [...MONSTERS, ...ANIMALS];

function ZoneEditor({
  map,
  zoneId,
  onSelect,
  onPatch,
  onDelete,
}: {
  map: MapFile;
  zoneId: string | null;
  onSelect: (id: string) => void;
  onPatch: (id: string, patch: Partial<SpawnZone>) => void;
  onDelete: (id: string) => void;
}) {
  const zones = map.zones ?? [];
  const zone = zones.find((z) => z.id === zoneId) ?? null;
  return (
    <div className="grid gap-2 border-2 border-bone p-2" data-testid="zone-editor">
      <p className="font-display text-xs text-kyo">SPAWN ZONES</p>
      <p className="text-dim">Drag a rectangle with the Spawn zone tool. Foes of the chosen types appear inside it at the level range you set, and come back after they fall.</p>
      {!zones.length && <p className="text-dim">No zones yet.</p>}
      <div className="flex flex-wrap gap-1">
        {zones.map((z, i) => (
          <button key={z.id} className={`px-btn ${z.id === zoneId ? "border-kyo" : ""}`} type="button" onClick={() => onSelect(z.id)}>
            Zone {i + 1} · {z.tw}×{z.th}
          </button>
        ))}
      </div>
      {zone && (
        <div className="grid gap-2">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <label className="text-dim">Level min
              <input className="px-input" aria-label="Zone level min" type="number" min={1} max={zone.levelMax} value={zone.levelMin} onChange={(e) => onPatch(zone.id, { levelMin: clampNum(e.target.value, 1, zone.levelMax) })} />
            </label>
            <label className="text-dim">Level max
              <input className="px-input" aria-label="Zone level max" type="number" min={zone.levelMin} max={100} value={zone.levelMax} onChange={(e) => onPatch(zone.id, { levelMax: clampNum(e.target.value, zone.levelMin, 100) })} />
            </label>
            <label className="text-dim">Count
              <input className="px-input" aria-label="Zone enemy count" type="number" min={1} max={40} value={zone.count} onChange={(e) => onPatch(zone.id, { count: clampNum(e.target.value, 1, 40) })} />
            </label>
            <label className="text-dim">Respawn sec
              <input className="px-input" aria-label="Zone respawn seconds" type="number" min={5} max={600} value={zone.respawn} onChange={(e) => onPatch(zone.id, { respawn: clampNum(e.target.value, 5, 600) })} />
            </label>
          </div>
          <p className="text-dim">Enemy types · none checked means every monster. Animals are optional.</p>
          <div className="grid max-h-40 grid-cols-2 gap-1 overflow-auto sm:grid-cols-3">
            {ZONE_KINDS.map((m) => {
              const on = zone.species.includes(m.id);
              return (
                <label key={m.id} className="flex items-center gap-1 text-dim">
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => onPatch(zone.id, { species: on ? zone.species.filter((id) => id !== m.id) : [...zone.species, m.id] })}
                  />
                  {m.name}{m.animal ? " · animal" : ""}
                </label>
              );
            })}
          </div>
          <button className="px-btn" type="button" onClick={() => onDelete(zone.id)}>Delete this zone</button>
        </div>
      )}
    </div>
  );
}

function clampNum(raw: string, min: number, max: number) {
  const n = Math.round(Number(raw));
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}
