import { useEffect, useRef, useState } from "react";
import { WitchArena, type ArenaSnap } from "@/game/arena";
import type { GraveBody } from "@/game/social-types";

export function ArenaScreen(props: {
  seed: unknown;
  onClose: () => void;
  onCloud: (save: unknown | null) => void;
  onGrave?: (body: GraveBody) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const arenaRef = useRef<WitchArena | null>(null);
  const [snap, setSnap] = useState<ArenaSnap | null>(null);

  const cloudRef = useRef(props.onCloud);
  cloudRef.current = props.onCloud;
  const seedRef = useRef(props.seed);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const arena = new WitchArena(canvas);
    arena.onCloud = (save) => cloudRef.current(save);
    arena.onGrave = (body) => props.onGrave?.(body);
    arenaRef.current = arena;
    const un = arena.subscribe(() => setSnap(arena.getSnap()));
    arena.start(seedRef.current);
    const onResize = () => arena.resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      un();
      arena.stop();
      arenaRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (snap?.phase === "fight" || snap?.phase === "result") arenaRef.current?.resize();
  }, [snap?.phase]);

  const arena = arenaRef.current;
  const fighting = snap?.phase === "fight" || snap?.phase === "result";

  return (
    <div className="arena-root">
      <canvas ref={canvasRef} className={fighting ? "arena-canvas" : "arena-canvas arena-canvas-idle"} aria-label="Witch circle" />
      {snap && !fighting && (
        <div className="flex h-full justify-center overflow-auto p-3">
          <div className="px-panel w-full max-w-3xl p-4">
            <p className="font-display text-xs text-blood">WITCH CIRCLE</p>
            <h2 className="font-display mt-2 text-sm text-bone">{snap.phase === "over" ? "The circle closes" : "Six against six"}</h2>
            <p className="mt-2 text-dim">{snap.note}</p>
            {snap.phase !== "over" && (
              <>
                <div className="mt-3 flex flex-wrap gap-3 font-display text-xs">
                  <span className="text-kyo">Points {snap.points}</span>
                  <span>Tokens {snap.tokens}</span>
                  <span className="text-dim">
                    {snap.wins}–{snap.losses}
                  </span>
                  <span className="text-dim">Marked {snap.party}/6</span>
                </div>
                <div className="arena-list mt-3">
                  {snap.roster.map((w) => (
                    <button
                      key={w.uid}
                      type="button"
                      className={`arena-card ${w.marked ? "arena-card-on" : ""}`}
                      onClick={() => arena?.toggle(w.uid)}
                    >
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="font-display text-xs text-bone">
                          {w.marked ? "● " : ""}
                          {w.name}
                        </span>
                        <span className="text-kyo">
                          Lv {w.level} · {w.power}
                        </span>
                      </span>
                      <span className="mt-1 block truncate text-dim">
                        {w.role === "summoner" ? "Summoner" : "Witch"} · {w.race} · {w.typeName} · {w.gear}
                      </span>
                      <span className="block truncate">{w.moves}</span>
                      <span className="block truncate text-dim">{w.enchants}</span>
                      {w.spirits && <span className="block truncate text-kyo">Spirits {w.spirits}</span>}
                    </button>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button className="px-btn" type="button" disabled={snap.tokens < 1} onClick={() => arena?.summon()}>
                    Draw a witch
                  </button>
                  <button className="px-btn px-btn-kyo" type="button" disabled={snap.party !== 6} onClick={() => arena?.fight()}>
                    Enter the circle
                  </button>
                </div>
              </>
            )}
            {snap.phase === "over" && (
              <div className="mt-4 grid gap-2">
                <button
                  className="px-btn px-btn-kyo"
                  type="button"
                  onClick={() => {
                    arena?.fresh();
                  }}
                >
                  Take six new witches
                </button>
              </div>
            )}
            <button className="px-btn mt-3 w-full" type="button" onClick={props.onClose}>
              {snap.phase === "over" ? "Back to the title" : "Leave the circle"}
            </button>
          </div>
        </div>
      )}
      {snap && fighting && (
        <div className="arena-hud">
          <div className="px-panel flex flex-wrap items-center gap-3 px-3 py-2">
            <span className="font-display text-xs text-kyo">Points {snap.points}</span>
            <span className="font-display text-xs">Tokens {snap.tokens}</span>
            <span className="text-dim">
              You {snap.yours} · Them {snap.theirs}
            </span>
            <button className="px-btn" type="button" onClick={() => arena?.setSpeed(snap.speed === 1 ? 2 : 1)}>
              {snap.speed === 1 ? "Speed 1×" : "Speed 2×"}
            </button>
          </div>
          {snap.phase === "result" && snap.last && (
            <div className="px-panel mt-2 max-w-md p-3">
              <p className="font-display text-xs text-kyo">{snap.last.win ? "Victory" : "Broken"}</p>
              <p className="mt-2">{snap.last.note}</p>
              <button className="px-btn px-btn-kyo mt-3 w-full" type="button" onClick={() => arena?.dismiss()}>
                Back to the coven
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
