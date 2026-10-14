# TURBZ — PRD
## Original request
Add all character sprite sheets as playable classes (only 10 were wired), rename all classes by their attributes, add a Character Trait system (buffs, debuffs, unique movesets, skill aptitudes, +1 picked trait), movement classes/moves, a full Character Sheet (C key + HUD button), all UI windows moveable/pinnable/resizable with layout saved to the TURBZ API account, and a fully working multiplayer lobby.
## Architecture
TanStack Start (Vite 8, React 19) SSR app in /app (src/, server fns, Better Auth, PGLite/Neon). Preview runner: /app/frontend/package.json starts vite dev on :3000; /app/backend/server.py is a FastAPI reverse proxy for /api/* -> :3000.
## Implemented (Oct 2026)
- src/game/classes.ts: 29 classes (all named sheet chars except townsfolk/child/elder/zombies), roles, stat mods, immunities, passive, 5-verse movesets with ★signature + »movement, skill aptitudes; 14 pickable traits; classProfile().
- 45 new moves (29 signatures, dash/surge movement tactics + new blinks/lunges/rolls).
- actor-sheets.config: character registry incl. 4th sheet (vampire, bard, paladin, samurai m/f, angel m/f, bunny, dancer, king/queen); male/female body choice.
- Engine: stats wired (HP, might, arcana, guard, speed, crit, haste, regen, lifesteal, kyo, xp, affinity, status immunity, skill XP aptitude), dash & surge, old saves migrated (legacy class ids kept).
- Character Sheet window (C / HUD), Lobby window (L / HUD) with members, copy code, leave, open-lobby browser (/api/rtc?list=1) also on title.
- FloatWin: drag/resize/pin for vitals, chat, verse bar, survival, NPC talk and all panels; pinned panels stay open; layout saved to localStorage + turbz_layouts table (server fns, migration 0004); reset in pause menu.
## Backlog
- P1: per-class sprite tint for gear; class-specific talent trees; lobby ready-check / kick
- P2: zombie/child/elder sheets as NPCs or enemies; TURN server for strict NATs
## Iteration 2 (Oct 2026)
- Map Builder: stack overlay tiles (up to 4 layers), remove top overlay, bucket fill, eyedropper, make walkable / make solid, collision overlay toggle, portals (to overworld or any saved map, optional arrival X/Y), remove portal. Saved maps are enterable in-game from pause menu (Designer maps) and portals chain maps; "Return to overworld".
- Gear visuals restored: rarity-scaled aura (ground glow, rare+ slot motifs, embers, epic rune ring, legendary pillar + orbiting motes) on player and remote players (src/game/gear-fx.ts).
- Combat: enemy attacks telegraph ("!") with windup; moving out of reach or away from ranged aim = DODGED; dash/blink/lunge/roll grant real i-frames (EVADE).
- Balance: threat() scaling — hardcore enemies gain HP/damage/levels with player level, gear rarity and dungeon depth; hardcore spawns never below hunter-1.
## Iteration 3 (Jun 2026)
- Combat FX rewrite (src/game/combat-fx.ts): per-element projectiles (comet, droplet, arcing boulder, gust, spark ball, ice shard, void orb, light lance, wisp, ghoul blob, shuriken), per-element impacts (flames, splash, cracks+debris, cyclone, arcs, ice spikes, implosion, light pillar, spirit ring, goo), crescent slashes with seeded radius/tilt, thrusts, slam pillars, channel runes, beams, dash afterimages, roll dust, blink implosion, evade afterimage, cast flash, additive glow, screen-shake kick. Weapon swings scale with rarity.
- Gear FX: element motifs for rare+ gear (flames, bubbles, pebbles, wind, sparks, snow, void motes, halo, wisps, drips).
- Dodge: evaded hits skip status effects; roll i-frames 0.45s; blink breaks root/soak (BREAK FREE) and works with no target; dash refused while rooted.
- UI/QOL: no text selection in game (inputs still selectable); new vitals (HP/XP meters, status chips, icon menu buttons with key badges incl. Map); square verse hotbar with cooldown overlay + countdown, centred; float windows fold (button / double-click), clamp to viewport on resize; panels cascade below chat; active custom map indicator.
- Fixed stale BETTER_AUTH_URL default in frontend/package.json (Invalid origin on signup).
