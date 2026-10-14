import { o as __toESM } from "../_runtime.mjs";
import { b as require_jsx_runtime, q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signOut, t as authClient } from "./client-BhcLuWvF.mjs";
import { i as hasGateSessionMarker } from "./server-Cx-AA3Oz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/turbz-app-CutXaeNN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	return useSessionUserState();
}
function useSessionUserState() {
	const { data, isPending } = authClient.useSession();
	const id = data?.user.id;
	const displayName = data?.user.name ?? null;
	const primaryEmail = data?.user.email ?? null;
	const profileImageUrl = data?.user.image ?? null;
	const user = (0, import_react.useMemo)(() => id ? {
		id,
		displayName,
		primaryEmail,
		profileImageUrl,
		isDevFallback: false
	} : null, [
		id,
		displayName,
		primaryEmail,
		profileImageUrl
	]);
	return (0, import_react.useMemo)(() => ({
		user,
		isPending
	}), [user, isPending]);
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
/** POIs were laid out on the old 84×60 chart. The live map stretches them. */
function scaleTile(tx, ty) {
	return {
		tx: Math.max(3, Math.min(416, Math.round(tx * 5))),
		ty: Math.max(3, Math.min(284, Math.round(ty * (288 / 60))))
	};
}
/** Spawn level sits on the hunter, five levels either side. */
function levelNearHunter(hunter, roll) {
	const delta = Math.floor(roll * 11) - 5;
	return Math.max(1, Math.floor(hunter) + delta);
}
/** 0 common, 1 uncommon, 2 rare, 3 epic. Higher levels shift the roll up. */
function rarityForLevel(level, roll, boss = false) {
	if (boss) return 3;
	const t = Math.max(0, Math.min(1, (level - 1) / 40));
	const epic = .04 + t * .28;
	const rare = .1 + t * .24;
	const uncommon = .2 + t * .16;
	if (roll < epic) return 3;
	if (roll < epic + rare) return 2;
	if (roll < epic + rare + uncommon) return 1;
	return 0;
}
var TYPES = {
	normal: {
		name: "Normal",
		color: "#c8c0b0",
		strong: [],
		weak: ["earth", "spirit"],
		immune: []
	},
	fire: {
		name: "Fire",
		color: "#e25a32",
		strong: ["ice", "void"],
		weak: ["water", "earth"],
		immune: []
	},
	water: {
		name: "Water",
		color: "#3a7eb8",
		strong: ["fire", "earth"],
		weak: ["electric", "ice"],
		immune: []
	},
	earth: {
		name: "Earth",
		color: "#8a6a3a",
		strong: ["fire", "electric"],
		weak: ["water", "air"],
		immune: ["electric"]
	},
	air: {
		name: "Air",
		color: "#9ad8c8",
		strong: ["earth", "spirit"],
		weak: ["electric", "ice"],
		immune: ["earth"]
	},
	electric: {
		name: "Electric",
		color: "#f2d43a",
		strong: ["water", "air"],
		weak: ["earth", "void"],
		immune: []
	},
	ice: {
		name: "Ice",
		color: "#9ad0ff",
		strong: ["air", "earth"],
		weak: ["fire", "light"],
		immune: []
	},
	void: {
		name: "Void",
		color: "#6a4cff",
		strong: ["spirit", "normal"],
		weak: ["light"],
		immune: []
	},
	light: {
		name: "Light",
		color: "#fff1a8",
		strong: ["void", "spirit"],
		weak: ["fire", "earth"],
		immune: []
	},
	spirit: {
		name: "Spirit",
		color: "#c9a6e8",
		strong: ["spirit", "ice"],
		weak: ["void"],
		immune: ["normal"]
	},
	ghoul: {
		name: "Ghoul",
		color: "#8d72a8",
		strong: ["spirit", "void"],
		weak: ["light", "fire"],
		immune: []
	}
};
var TYPE_IDS = Object.keys(TYPES);
function typeMult(atk, def) {
	if (TYPES[def].immune.includes(atk)) return 0;
	if (TYPES[atk].strong.includes(def)) return 2;
	if (TYPES[atk].weak.includes(def)) return .5;
	return 1;
}
function moveTactic(m) {
	if (m.tactic) return m.tactic;
	if (m.effect === "mend") return "heal";
	if (m.effect === "shell") return "ward";
	return "strike";
}
var MOVES = [
	{
		id: "wail",
		name: "First Wail",
		type: "fire",
		power: 30,
		accuracy: 100,
		crit: 6,
		priority: 2,
		effect: "none",
		anim: ["beam", "spark"],
		range: 120,
		about: "A thin cry that still burns."
	},
	{
		id: "ember",
		name: "Ember Trail",
		type: "fire",
		power: 42,
		accuracy: 95,
		crit: 12,
		priority: 1,
		effect: "burn",
		anim: [
			"beam",
			"spark",
			"burst"
		],
		range: 130,
		about: "Leaves a burning stitch."
	},
	{
		id: "cinder",
		name: "Cinder Bite",
		type: "fire",
		power: 55,
		accuracy: 85,
		crit: 18,
		priority: 0,
		effect: "burn",
		anim: [
			"slash",
			"spark",
			"burst"
		],
		range: 48,
		about: "Close, cruel, and hot."
	},
	{
		id: "grin",
		name: "Glass Grin",
		type: "fire",
		power: 48,
		accuracy: 90,
		crit: 28,
		priority: 1,
		effect: "expose",
		anim: ["slash", "prism"],
		range: 52,
		about: "A smiling cut that opens guard."
	},
	{
		id: "foam",
		name: "Pale Foam",
		type: "water",
		power: 30,
		accuracy: 100,
		crit: 4,
		priority: 2,
		effect: "none",
		anim: ["rain", "pulse"],
		range: 110,
		about: "Soft water, perfect tempo."
	},
	{
		id: "soak",
		name: "Drip Hex",
		type: "water",
		power: 32,
		accuracy: 100,
		crit: 6,
		priority: 1,
		effect: "soak",
		anim: ["rain", "spiral"],
		range: 120,
		about: "Soaks the joints."
	},
	{
		id: "brine",
		name: "Brine Lash",
		type: "water",
		power: 52,
		accuracy: 86,
		crit: 14,
		priority: 0,
		effect: "soak",
		anim: ["slash", "rain"],
		range: 70,
		about: "Salt that bites twice in memory."
	},
	{
		id: "leech",
		name: "Sip Vein",
		type: "water",
		power: 36,
		accuracy: 95,
		crit: 8,
		priority: 1,
		effect: "leech",
		anim: ["beam", "orbit"],
		range: 100,
		about: "Drinks a little life back."
	},
	{
		id: "tide",
		name: "Rising Dirge",
		type: "water",
		power: 44,
		accuracy: 92,
		crit: 10,
		priority: 1,
		effect: "none",
		anim: ["rain", "spiral"],
		range: 140,
		about: "The hymn of the reach."
	},
	{
		id: "spore",
		name: "Crypt Spore",
		type: "earth",
		power: 28,
		accuracy: 95,
		crit: 6,
		priority: 1,
		effect: "sleep",
		anim: ["orbit", "rain"],
		range: 110,
		about: "Dust that makes eyelids heavy."
	},
	{
		id: "root",
		name: "Grave Root",
		type: "earth",
		power: 34,
		accuracy: 100,
		crit: 4,
		priority: 0,
		effect: "root",
		anim: ["spiral", "shield"],
		range: 90,
		about: "Pins feet to the barrow."
	},
	{
		id: "thorn",
		name: "Coffin Thorn",
		type: "earth",
		power: 46,
		accuracy: 90,
		crit: 10,
		priority: 1,
		effect: "none",
		anim: ["slash", "burst"],
		range: 56,
		about: "A thorn from the lid."
	},
	{
		id: "quake",
		name: "Grave Quake",
		type: "earth",
		power: 50,
		accuracy: 88,
		crit: 10,
		priority: 0,
		effect: "expose",
		anim: ["pulse", "burst"],
		range: 80,
		about: "The floor takes a side."
	},
	{
		id: "vine",
		name: "Widow Vine",
		type: "earth",
		power: 50,
		accuracy: 88,
		crit: 12,
		priority: 0,
		effect: "root",
		anim: ["spiral", "slash"],
		range: 78,
		about: "Binds, then tightens."
	},
	{
		id: "gust",
		name: "Ghost Gust",
		type: "air",
		power: 38,
		accuracy: 96,
		crit: 14,
		priority: 3,
		effect: "none",
		anim: ["spiral", "slash"],
		range: 130,
		about: "A fast cutting gust."
	},
	{
		id: "howl",
		name: "Banshee Howl",
		type: "air",
		power: 46,
		accuracy: 90,
		crit: 10,
		priority: 2,
		effect: "gloom",
		anim: ["orbit", "pulse"],
		range: 150,
		about: "Fear in a clean note."
	},
	{
		id: "jolt",
		name: "Grave Jolt",
		type: "electric",
		power: 36,
		accuracy: 97,
		crit: 12,
		priority: 3,
		effect: "spark",
		anim: ["spark", "beam"],
		range: 140,
		about: "A precise electrical jab."
	},
	{
		id: "storm",
		name: "Storm Wail",
		type: "electric",
		power: 50,
		accuracy: 86,
		crit: 8,
		priority: 1,
		effect: "spark",
		anim: ["spark", "burst"],
		range: 150,
		about: "The sky answers back."
	},
	{
		id: "shard",
		name: "Ice Shard",
		type: "ice",
		power: 36,
		accuracy: 100,
		crit: 16,
		priority: 2,
		effect: "none",
		anim: ["prism", "beam"],
		range: 130,
		about: "A clean frozen needle."
	},
	{
		id: "frost",
		name: "Frost Bite",
		type: "ice",
		power: 44,
		accuracy: 92,
		crit: 12,
		priority: 1,
		effect: "sleep",
		anim: ["rain", "prism"],
		range: 110,
		about: "Cold enough to dream."
	},
	{
		id: "whiteout",
		name: "Whiteout",
		type: "ice",
		power: 48,
		accuracy: 90,
		crit: 8,
		priority: 0,
		effect: "silence",
		anim: ["rain", "pulse"],
		range: 100,
		about: "Steals the next word."
	},
	{
		id: "lantern",
		name: "Void Lantern",
		type: "void",
		power: 33,
		accuracy: 100,
		crit: 6,
		priority: 2,
		effect: "gloom",
		anim: ["orbit", "beam"],
		range: 120,
		about: "A light that eats light."
	},
	{
		id: "shroud",
		name: "Widow Shroud",
		type: "void",
		power: 38,
		accuracy: 94,
		crit: 12,
		priority: 1,
		effect: "gloom",
		anim: ["orbit", "spiral"],
		range: 100,
		about: "Wraps the rhythm."
	},
	{
		id: "dirge",
		name: "Hollow Dirge",
		type: "void",
		power: 54,
		accuracy: 84,
		crit: 18,
		priority: 0,
		effect: "sleep",
		anim: [
			"orbit",
			"rain",
			"pulse"
		],
		range: 130,
		about: "The long note under the floor."
	},
	{
		id: "hex",
		name: "Chain Hex",
		type: "void",
		power: 40,
		accuracy: 92,
		crit: 16,
		priority: 1,
		effect: "spark",
		anim: ["spark", "beam"],
		range: 125,
		about: "Hexes leap once."
	},
	{
		id: "halo",
		name: "Halo Mend",
		type: "light",
		power: 22,
		accuracy: 100,
		crit: 4,
		priority: 2,
		effect: "mend",
		anim: ["spiral", "shield"],
		range: 40,
		about: "Mends the caster."
	},
	{
		id: "flash",
		name: "Holy Flash",
		type: "light",
		power: 46,
		accuracy: 90,
		crit: 14,
		priority: 2,
		effect: "expose",
		anim: ["prism", "burst"],
		range: 120,
		about: "A lance of chapel-light."
	},
	{
		id: "dawn",
		name: "Dawn Lance",
		type: "light",
		power: 40,
		accuracy: 100,
		crit: 10,
		priority: 2,
		effect: "none",
		anim: ["beam", "spark"],
		range: 145,
		about: "Focused and unkind to void."
	},
	{
		id: "creep",
		name: "Shadow Creep",
		type: "spirit",
		power: 42,
		accuracy: 94,
		crit: 12,
		priority: 1,
		effect: "gloom",
		anim: ["orbit", "spiral"],
		range: 100,
		about: "Arrives before the body does."
	},
	{
		id: "bite",
		name: "Night Bite",
		type: "spirit",
		power: 52,
		accuracy: 86,
		crit: 18,
		priority: 1,
		effect: "leech",
		anim: ["slash", "orbit"],
		range: 48,
		about: "Teeth with a receipt."
	},
	{
		id: "whisper",
		name: "Grave Whisper",
		type: "spirit",
		power: 30,
		accuracy: 100,
		crit: 6,
		priority: 3,
		effect: "gloom",
		anim: ["orbit", "beam"],
		range: 140,
		about: "A low chill."
	},
	{
		id: "rattle",
		name: "Bone Rattle",
		type: "normal",
		power: 40,
		accuracy: 95,
		crit: 10,
		priority: 1,
		effect: "spark",
		anim: ["slash", "burst"],
		range: 52,
		about: "Knuckles on a lid."
	},
	{
		id: "marrow",
		name: "Marrow Drain",
		type: "normal",
		power: 34,
		accuracy: 95,
		crit: 6,
		priority: 1,
		effect: "leech",
		anim: ["beam", "orbit"],
		range: 70,
		about: "Takes the warmth out of a rib."
	},
	{
		id: "measured",
		name: "Measured Strike",
		type: "normal",
		power: 30,
		accuracy: 100,
		crit: 5,
		priority: 2,
		effect: "none",
		anim: ["slash"],
		range: 48,
		about: "Clean tempo. Nothing wasted."
	},
	{
		id: "shell",
		name: "Urn Shell",
		type: "water",
		power: 18,
		accuracy: 100,
		crit: 0,
		priority: 2,
		effect: "shell",
		anim: ["shield", "rain"],
		range: 40,
		about: "A wet ward.",
		tactic: "ward"
	},
	{
		id: "veilstep",
		name: "Veil Step",
		type: "void",
		power: 28,
		accuracy: 100,
		crit: 10,
		priority: 3,
		effect: "none",
		anim: ["orbit", "slash"],
		range: 170,
		about: "Blink behind them and cut.",
		tactic: "blink"
	},
	{
		id: "backbite",
		name: "Backbite",
		type: "ghoul",
		power: 34,
		accuracy: 96,
		crit: 18,
		priority: 2,
		effect: "leech",
		anim: ["slash", "orbit"],
		range: 160,
		about: "Appear at their spine and drink.",
		tactic: "blink"
	},
	{
		id: "aegis",
		name: "Three-Ward",
		type: "light",
		power: 0,
		accuracy: 100,
		crit: 0,
		priority: 3,
		effect: "shell",
		anim: ["shield"],
		range: 40,
		about: "No incoming harm for three seconds.",
		tactic: "ward"
	},
	{
		id: "icecrown",
		name: "Ice Crown",
		type: "ice",
		power: 0,
		accuracy: 100,
		crit: 0,
		priority: 3,
		effect: "shell",
		anim: ["prism", "shield"],
		range: 40,
		about: "Three seconds of glass.",
		tactic: "ward"
	},
	{
		id: "lunge",
		name: "Reed Lunge",
		type: "air",
		power: 40,
		accuracy: 92,
		crit: 14,
		priority: 2,
		effect: "none",
		anim: ["slash"],
		range: 130,
		about: "Dash in, strike, spring back.",
		tactic: "lunge"
	},
	{
		id: "pyrelunge",
		name: "Pyre Lunge",
		type: "fire",
		power: 48,
		accuracy: 88,
		crit: 16,
		priority: 1,
		effect: "burn",
		anim: ["slash", "spark"],
		range: 140,
		about: "A burning dash, then a retreat.",
		tactic: "lunge"
	},
	{
		id: "hammer",
		name: "Grave Hammer",
		type: "earth",
		power: 78,
		accuracy: 78,
		crit: 8,
		priority: 0,
		effect: "root",
		anim: ["burst", "pulse"],
		range: 52,
		about: "A heavy windup. You cannot weave through it.",
		tactic: "heavy"
	},
	{
		id: "hymn",
		name: "Chapel Hymn",
		type: "light",
		power: 66,
		accuracy: 90,
		crit: 8,
		priority: 0,
		effect: "expose",
		anim: ["beam", "prism"],
		range: 160,
		about: "A cast. Other verses wait.",
		tactic: "channel"
	},
	{
		id: "voidhymn",
		name: "Void Hymn",
		type: "void",
		power: 72,
		accuracy: 84,
		crit: 12,
		priority: 0,
		effect: "gloom",
		anim: ["orbit", "pulse"],
		range: 170,
		about: "The long note. Your hands are busy.",
		tactic: "channel"
	},
	{
		id: "roll",
		name: "Salt Roll",
		type: "normal",
		power: 0,
		accuracy: 100,
		crit: 0,
		priority: 3,
		effect: "none",
		anim: ["spiral"],
		range: 80,
		about: "Roll aside. Blows miss.",
		tactic: "roll"
	},
	{
		id: "briaroll",
		name: "Briar Roll",
		type: "earth",
		power: 16,
		accuracy: 100,
		crit: 6,
		priority: 3,
		effect: "none",
		anim: ["spiral", "slash"],
		range: 90,
		about: "Roll through thorns and nick them.",
		tactic: "roll"
	},
	{
		id: "tidemend",
		name: "Tide Mend",
		type: "water",
		power: 28,
		accuracy: 100,
		crit: 0,
		priority: 2,
		effect: "mend",
		anim: ["rain", "shield"],
		range: 40,
		about: "Drink the fight back.",
		tactic: "heal"
	}
];
var MOVE_BY_ID = Object.fromEntries(MOVES.map((m) => [m.id, m]));
var MELEE_IDS = /* @__PURE__ */ new Set([
	"cinder",
	"grin",
	"thorn",
	"bite",
	"rattle",
	"measured",
	"brine"
]);
var SPELL_IDS = /* @__PURE__ */ new Set([
	"dirge",
	"storm",
	"howl",
	"quake",
	"whiteout",
	"flash",
	"hex",
	"shroud",
	"dawn",
	"creep",
	"marrow",
	"vine",
	"ember",
	"tide"
]);
function attackForm(m) {
	const tactic = moveTactic(m);
	if (tactic === "channel" || tactic === "heal" || tactic === "ward") return "spell";
	if (tactic === "blink" || tactic === "lunge" || tactic === "heavy" || tactic === "roll") return "melee";
	if (m.effect === "mend" || m.effect === "shell") return "spell";
	if (MELEE_IDS.has(m.id)) return "melee";
	if (SPELL_IDS.has(m.id)) return "spell";
	return "ranged";
}
/** Melee is short. Blinks, lunges, and spells reach across a street. */
function attackRange(m) {
	const tactic = moveTactic(m);
	if (tactic === "blink" || tactic === "lunge") return Math.max(150, m.range);
	if (tactic === "channel" || tactic === "ward" || tactic === "heal" || tactic === "roll") return Math.max(tactic === "roll" ? 80 : 40, m.range);
	const form = attackForm(m);
	if (form === "melee") return 44;
	if (form === "spell") return Math.max(156, m.range);
	const style = rangedStyle(m);
	return Math.max(150, m.range) + (style === "reach" ? 48 : 0);
}
function rangedStyle(m) {
	let n = 0;
	for (const c of m.id) n += c.charCodeAt(0);
	return [
		"volley",
		"reload",
		"reach"
	][n % 3];
}
function formTag(m) {
	const form = attackForm(m);
	if (form === "melee") return "melee · cuts armor";
	if (form === "spell") return "spell · pure";
	const style = rangedStyle(m);
	if (style === "volley") return "ranged · volley";
	if (style === "reload") return "ranged · fast";
	return "ranged · long";
}
function huntMove(type) {
	const live = (m) => m.effect !== "mend" && m.effect !== "shell";
	return MOVES.find((m) => m.type === type && attackForm(m) === "spell" && live(m)) ?? MOVES.find((m) => m.type === type && attackForm(m) === "ranged" && live(m)) ?? MOVES.find((m) => attackForm(m) === "spell" && live(m)) ?? MOVES[0];
}
var RACES = [
	{
		id: "vesper",
		name: "Vesper",
		type: "void",
		blurb: "Pale chapel blood. Long dark hair, a quiet step, void in the teeth.",
		hair: 0,
		tall: 1
	},
	{
		id: "cinder",
		name: "Cinder",
		type: "fire",
		blurb: "Ash-court daughters. Short flame-cut hair and a hotter basic strike.",
		hair: 1,
		tall: 1
	},
	{
		id: "tide",
		name: "Tide",
		type: "water",
		blurb: "Reach-born. Wave hair, fin-tips at the ear, brine on every lash.",
		hair: 2,
		tall: 1
	},
	{
		id: "thorn",
		name: "Thorn",
		type: "earth",
		blurb: "Hollow gardeners. Braided briar, wider stance, roots that answer.",
		hair: 3,
		tall: 1
	},
	{
		id: "rime",
		name: "Rime",
		type: "ice",
		blurb: "March glass. Crystal bob, a cold priority, sleeps that stick.",
		hair: 4,
		tall: 1
	}
];
var SET_ROWS = {
	vesper: [
		[
			"Eclipse Sentinel",
			"voidring",
			"Null ring eats one hit, then throws a void pulse."
		],
		[
			"Widow Psalm",
			"gravepulse",
			"Dirge pulse sleeps nearby foes and mends you."
		],
		[
			"Lantern Nun",
			"lanternwake",
			"Lanterns orbit and hex-chain anything they touch."
		],
		[
			"Quiet Crown",
			"voidring",
			"A crown of silence lengthens enemy cooldowns."
		],
		[
			"Hexweave",
			"stormcrown",
			"Hex sparks jump to a second target."
		],
		[
			"Sable Choir",
			"featherfall",
			"Afterimage step — a echo strike copies your last hit."
		],
		[
			"Umbral Veil",
			"bloodmoon",
			"Leech aura while the set sings."
		],
		[
			"Starless Aegis",
			"whitestorm",
			"A black snow that roots and wards."
		],
		[
			"Oracle Ash",
			"solarnova",
			"Inverted sun: light damage that fears itself."
		],
		[
			"Last Vespers",
			"lanternwake",
			"On proc, a chapel bell staggers the field."
		],
		[
			"Chapel Mourning",
			"gravepulse",
			"A mourning bell sleeps the closest foe and mends you."
		],
		[
			"Black Hymnal",
			"voidring",
			"Sung notes shorten enemy casts."
		],
		[
			"Night Abbess",
			"bloodmoon",
			"Leech grows while you stand still."
		],
		[
			"Grave Lattice",
			"briarburst",
			"A lattice of graves roots the ring."
		],
		[
			"Violet Reliquary",
			"lanternwake",
			"Relics orbit and chain void."
		],
		[
			"Hollow Saint",
			"whitestorm",
			"A hollow ward that reflects one spell."
		],
		[
			"Moon Nun",
			"featherfall",
			"Moonstep leaves a striking afterimage."
		],
		[
			"Dirge Plate",
			"stormcrown",
			"Heavy dirge sparks on every third hit."
		],
		[
			"Ink Procession",
			"voidring",
			"Ink trails silence what they touch."
		],
		[
			"Final Bell",
			"solarnova",
			"One chapel sun. It fears itself."
		]
	],
	cinder: [
		[
			"Solaris Paladin",
			"solarnova",
			"Solar nova burns and exposes everything close."
		],
		[
			"Ashen Vow",
			"gravepulse",
			"Vow-flames linger and tick harder on bosses."
		],
		[
			"Glass Grin",
			"bloodmoon",
			"Crits splatter cinders that chain once."
		],
		[
			"Kiln Regalia",
			"solarnova",
			"Standing in your own fire heals you."
		],
		[
			"Ember Shogun",
			"stormcrown",
			"A flaming arc on every third cast."
		],
		[
			"Cinder Court",
			"featherfall",
			"Dash-embers trail and re-ignite burn."
		],
		[
			"Pyre Mantle",
			"lanternwake",
			"Lanterns explode if a burned foe dies."
		],
		[
			"Scorch Saint",
			"voidring",
			"Fire ring that ignores water once per proc."
		],
		[
			"Brand Crown",
			"bloodmoon",
			"Branded foes take stab as if they were ice."
		],
		[
			"Last Lantern",
			"lanternwake",
			"A giant lantern falls on the marked foe."
		],
		[
			"Furnace Bride",
			"solarnova",
			"The aisle burns. Close foes are exposed."
		],
		[
			"Coal Coronet",
			"gravepulse",
			"Coal sleep, then a hotter wake."
		],
		[
			"Spark Regalia",
			"stormcrown",
			"Sparks jump a second target."
		],
		[
			"Hearth Tyrant",
			"bloodmoon",
			"Standing in your fire leeches."
		],
		[
			"Cinder Nun",
			"lanternwake",
			"Votive flames mend you in combat."
		],
		[
			"Magma Psalm",
			"briarburst",
			"Magma roots, then ticks."
		],
		[
			"Brand Widow",
			"voidring",
			"A brand that ignores water once."
		],
		[
			"Kiln Valkyrie",
			"featherfall",
			"A flaming gap-closer."
		],
		[
			"Ash Parade",
			"whitestorm",
			"Ash whiteout silences the pack."
		],
		[
			"Last Ember",
			"solarnova",
			"The kiln answers. One huge pulse."
		]
	],
	tide: [
		[
			"Tidecaller",
			"tidalsurge",
			"A wave knocks foes back and soaks them."
		],
		[
			"Brine Reliquary",
			"tidalsurge",
			"Soak spreads when you leech."
		],
		[
			"Foam Cantor",
			"featherfall",
			"You skate — move faster while soaked ground is near."
		],
		[
			"Urn Admiral",
			"whitestorm",
			"Shell plus a salt burst."
		],
		[
			"Pearl Dirge",
			"gravepulse",
			"Rising dirge heals allies in the lobby too."
		],
		[
			"Kelp Regent",
			"briarburst",
			"Tide-briars root soaked targets."
		],
		[
			"Abyss Net",
			"voidring",
			"Pulls a foe into melee range."
		],
		[
			"Moonwell",
			"lanternwake",
			"Moonwater cleanses you and flashes light."
		],
		[
			"Stormfoam",
			"stormcrown",
			"Lightning rides the spray."
		],
		[
			"Drowned Choir",
			"bloodmoon",
			"Leech wave. The sea keeps a tithe."
		],
		[
			"Salt Empress",
			"tidalsurge",
			"A salt crown that soaks and knocks back."
		],
		[
			"Coral Aegis",
			"whitestorm",
			"Coral ward. The next hit is halved."
		],
		[
			"Drift Cantor",
			"featherfall",
			"You skate farther on soaked ground."
		],
		[
			"Pearl March",
			"lanternwake",
			"Pearls orbit and flash light."
		],
		[
			"Brine Widow",
			"bloodmoon",
			"Brine leech spreads soak."
		],
		[
			"Harbor Saint",
			"gravepulse",
			"A harbor dirge heals the lobby."
		],
		[
			"Wave Reliquary",
			"tidalsurge",
			"The relic is a wave."
		],
		[
			"Foam Knight",
			"stormcrown",
			"Lightning rides the spray."
		],
		[
			"Deep Choir",
			"voidring",
			"The deep pulls a foe into reach."
		],
		[
			"Last Tide",
			"tidalsurge",
			"The sea itself answers."
		]
	],
	thorn: [
		[
			"Thorn Regalia",
			"briarburst",
			"Briars erupt, root, and bleed the circle."
		],
		[
			"Coffin Garden",
			"gravepulse",
			"Gravesprouts sleep then burst."
		],
		[
			"Moss Empress",
			"briarburst",
			"A heal-over-time thicket."
		],
		[
			"Widow Orchard",
			"bloodmoon",
			"Thorns return a cut of damage taken."
		],
		[
			"Root Sovereign",
			"briarburst",
			"One foe is pinned for a long root."
		],
		[
			"Spore Court",
			"lanternwake",
			"Spore lanterns sleep in a wide ring."
		],
		[
			"Bark Psalm",
			"whitestorm",
			"Bark ward. The next hit is halved."
		],
		[
			"Hollow Antler",
			"featherfall",
			"A leaping gore with earth stab."
		],
		[
			"Umber Relic",
			"gravepulse",
			"Quake plus expose."
		],
		[
			"Briar Nun",
			"voidring",
			"Holy thorns — light and earth together."
		],
		[
			"Vine Abbess",
			"briarburst",
			"Vines erupt and bleed the circle."
		],
		[
			"Orchard Plate",
			"whitestorm",
			"Bark plate. Half the next blow."
		],
		[
			"Mycel Crown",
			"gravepulse",
			"Spores sleep, then burst."
		],
		[
			"Green Reliquary",
			"lanternwake",
			"Spore lanterns in a wide ring."
		],
		[
			"Briar Valkyrie",
			"featherfall",
			"A leaping gore of thorns."
		],
		[
			"Root Nun",
			"briarburst",
			"One foe is pinned a long time."
		],
		[
			"Spore March",
			"bloodmoon",
			"Thorns return a cut of damage."
		],
		[
			"Bark Widow",
			"voidring",
			"A quiet thicket that silences."
		],
		[
			"Garden Psalm",
			"solarnova",
			"A green sun. It heals you a little."
		],
		[
			"Last Thicket",
			"briarburst",
			"The garden answers. Huge root."
		]
	],
	rime: [
		[
			"Frost Coronet",
			"whitestorm",
			"Whiteout silences and slows the pack."
		],
		[
			"Glass March",
			"whitestorm",
			"Shards fan in a prism volley."
		],
		[
			"Sleeping Saint",
			"gravepulse",
			"A deeper sleep. Waking them hurts."
		],
		[
			"Rime Valkyrie",
			"featherfall",
			"Ice wings — a gap-closer of frost."
		],
		[
			"Pale Reliquary",
			"lanternwake",
			"Cold lanterns that spark on impact."
		],
		[
			"Marrow Ice",
			"bloodmoon",
			"Freeze-leech. Stillness drinks."
		],
		[
			"White Psalm",
			"solarnova",
			"A pale sun that is still ice."
		],
		[
			"Shard Empress",
			"stormcrown",
			"Crit shards splinter to neighbors."
		],
		[
			"Hush Crown",
			"voidring",
			"Silence ring. Moves lock for a breath."
		],
		[
			"Last Winter",
			"whitestorm",
			"The march itself answers. Huge storm, one pulse."
		],
		[
			"Glacier Bride",
			"whitestorm",
			"A white aisle that slows the pack."
		],
		[
			"Ice Abbess",
			"gravepulse",
			"Deeper sleep. Waking them hurts."
		],
		[
			"Crystal March",
			"stormcrown",
			"Shards fan and splinter."
		],
		[
			"Pale Choir",
			"lanternwake",
			"Cold lanterns spark on impact."
		],
		[
			"Frost Reliquary",
			"voidring",
			"A hush ring. Moves lock."
		],
		[
			"Snow Valkyrie",
			"featherfall",
			"Ice wings close the gap."
		],
		[
			"Hush Plate",
			"whitestorm",
			"Silence and slow together."
		],
		[
			"Winter Nun",
			"bloodmoon",
			"Freeze-leech. Stillness drinks."
		],
		[
			"Shard Psalm",
			"solarnova",
			"A pale sun that is still ice."
		],
		[
			"Last Frost",
			"whitestorm",
			"The year ends. One killing storm."
		]
	]
};
var SETS = Object.keys(SET_ROWS).flatMap((race) => SET_ROWS[race].map((row, i) => ({
	id: `${race}-${i}`,
	race,
	name: row[0],
	style: i,
	fx: row[1],
	bonus: row[2]
})));
var SET_BY_ID = Object.fromEntries(SETS.map((s) => [s.id, s]));
var SLOT_NOUN = {
	weapon: "Blade",
	head: "Helm",
	chest: "Raiment",
	legs: "Skirt",
	feet: "Boots",
	relic: "Relic"
};
var WEAPONS = [
	"Grave Needle",
	"Choir Knife",
	"Salt Hook",
	"Briar Bill",
	"Rime Pick",
	"Lantern Rod",
	"Bone Knuckle",
	"Void Spindle"
];
var WEAPON_KINDS = [
	"Sling",
	"Crossbow",
	"Bow",
	"Axe",
	"Staff",
	"Tome",
	"Blade",
	"Claw"
];
function rollGhostLook(rng, rarity, move, bias) {
	const huntBias = bias === "hunt" ? .72 : bias === "drift" ? .18 : .42;
	return {
		body: irand(rng, 6),
		horns: irand(rng, 2 + Math.min(3, rarity)),
		tails: 1 + irand(rng, 2 + Math.min(3, rarity)),
		eyes: 1 + irand(rng, 1 + Math.min(4, rarity)),
		trail: irand(rng, 6),
		skin: irand(rng, 5),
		aggression: rng() < huntBias ? "hunt" : "drift",
		move
	};
}
var ENCHANTS = [
	{
		id: "double_strike",
		name: "Double Strike",
		about: "Chance to hit twice",
		max: 40,
		unit: "%"
	},
	{
		id: "second_chance",
		name: "Second Chance",
		about: "Once, break instead of dying",
		max: 1,
		unit: "flat"
	},
	{
		id: "loot_find",
		name: "Loot Find",
		about: "Better drops",
		max: 50,
		unit: "%"
	},
	{
		id: "xp_boost",
		name: "XP Boost",
		about: "More battle XP",
		max: 40,
		unit: "%"
	},
	{
		id: "catch_boost",
		name: "Catch Boost",
		about: "Jars hold tighter",
		max: 30,
		unit: "%"
	},
	{
		id: "kyo_find",
		name: "Kyo Magnet",
		about: "More Kyo",
		max: 45,
		unit: "%"
	},
	{
		id: "ward",
		name: "Ward",
		about: "Take less damage",
		max: 35,
		unit: "%"
	},
	{
		id: "might",
		name: "Might",
		about: "Deal more damage",
		max: 35,
		unit: "%"
	},
	{
		id: "swift",
		name: "Swift",
		about: "Lower cooldowns",
		max: 25,
		unit: "%"
	},
	{
		id: "harvest",
		name: "Harvest",
		about: "Better node yields",
		max: 40,
		unit: "%"
	},
	{
		id: "fish_luck",
		name: "Fish Luck",
		about: "Faster bites",
		max: 40,
		unit: "%"
	},
	{
		id: "shop_charm",
		name: "Shop Charm",
		about: "Cheaper shops",
		max: 30,
		unit: "%"
	},
	{
		id: "sell_boost",
		name: "Merchant Tongue",
		about: "Higher sell prices",
		max: 30,
		unit: "%"
	},
	{
		id: "crit_edge",
		name: "Crit Edge",
		about: "Higher crit chance",
		max: 25,
		unit: "%"
	},
	{
		id: "regen",
		name: "Afterglow",
		about: "Heal after a kill",
		max: 20,
		unit: "%"
	},
	{
		id: "boss_bane",
		name: "Boss Bane",
		about: "Extra damage to bosses",
		max: 40,
		unit: "%"
	},
	{
		id: "shroom_sense",
		name: "Shroom Sense",
		about: "Richer mushrooms",
		max: 35,
		unit: "%"
	},
	{
		id: "echo_guard",
		name: "Echo Guard",
		about: "Chance to ignore a hit",
		max: 15,
		unit: "%"
	},
	{
		id: "spark_life",
		name: "Spark of Life",
		about: "Bonus spirit when a fight starts",
		max: 25,
		unit: "%"
	},
	{
		id: "type_edge",
		name: "Typed Edge",
		about: "Extra stab when types match",
		max: 20,
		unit: "%"
	}
];
var ENCHANT_BY_ID = Object.fromEntries(ENCHANTS.map((e) => [e.id, e]));
var QUALITIES = [
	{
		id: "worn",
		name: "Worn",
		mult: .65
	},
	{
		id: "common",
		name: "Common",
		mult: 1
	},
	{
		id: "fine",
		name: "Fine",
		mult: 1.25
	},
	{
		id: "rare",
		name: "Rare",
		mult: 1.6
	},
	{
		id: "epic",
		name: "Epic",
		mult: 2.15
	},
	{
		id: "legendary",
		name: "Legendary",
		mult: 3
	}
];
function mulberry32(seed) {
	let a = seed >>> 0;
	return () => {
		a |= 0;
		a = a + 1831565813 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function irand(rng, n) {
	return Math.floor(rng() * n);
}
function pick(rng, arr) {
	return arr[irand(rng, arr.length)];
}
var uidN = 1;
function nextUid() {
	uidN += 1;
	return `g${Date.now().toString(36)}${uidN.toString(36)}`;
}
function rollQuality(rng, level, luck, floor) {
	if (floor) return QUALITIES.find((q) => q.id === floor) ?? QUALITIES[1];
	const boost = level / 40 + luck / 100;
	const roll = rng() * (1 + boost * .35);
	if (roll > 1.22) return QUALITIES[5];
	if (roll > 1.05) return QUALITIES[4];
	if (roll > .82) return QUALITIES[3];
	if (roll > .55) return QUALITIES[2];
	if (roll > .28) return QUALITIES[1];
	return QUALITIES[0];
}
function rollGear(rng, opts) {
	const slot = opts.slot ?? pick(rng, [
		"head",
		"chest",
		"legs",
		"feet",
		"relic",
		"weapon"
	]);
	const quality = rollQuality(rng, opts.level, opts.luck ?? 0, opts.floor ?? null);
	const type = opts.typeBias && rng() < .55 ? opts.typeBias : pick(rng, TYPE_IDS);
	let setId = null;
	let style = irand(rng, WEAPON_KINDS.length);
	let title = `${WEAPON_KINDS[style]} of ${WEAPONS[irand(rng, WEAPONS.length)]}`;
	if (slot !== "weapon") {
		const biased = opts.raceBias ? SETS.filter((s) => s.race === opts.raceBias) : SETS;
		const set = opts.setId ? SET_BY_ID[opts.setId] : rng() < .62 && biased.length ? pick(rng, biased) : pick(rng, SETS);
		setId = set.id;
		style = set.style;
		title = set.name;
	}
	const qIndex = QUALITIES.findIndex((q) => q.id === quality.id);
	const count = Math.min(8, 1 + qIndex + (opts.level > 12 ? 1 : 0) + (rng() < .25 ? 1 : 0));
	const pool = [...ENCHANTS];
	const enchants = [];
	for (let i = 0; i < count && pool.length; i++) {
		const idx = irand(rng, pool.length);
		const def = pool.splice(idx, 1)[0];
		const base = 1 + irand(rng, Math.max(1, Math.floor(def.max * .45)));
		const power = def.unit === "flat" && def.max <= 2 ? 1 : Math.max(1, Math.min(def.max, Math.floor((base + opts.level / 8) * quality.mult)));
		enchants.push({
			id: def.id,
			power
		});
	}
	const gear = {
		uid: nextUid(),
		slot,
		setId,
		style,
		name: slot === "weapon" ? `${quality.name} ${TYPES[type].name} ${title}` : `${quality.name} ${TYPES[type].name} ${title} ${SLOT_NOUN[slot]}`,
		level: opts.level,
		quality: quality.id,
		type,
		enchants,
		fxSeed: irand(rng, 6),
		price: 0,
		moves: packMoves(rng, type, rng() < .42 ? 2 : 1)
	};
	gear.price = gearPrice(gear);
	return gear;
}
function gearPrice(g) {
	const q = QUALITIES.findIndex((x) => x.id === g.quality) + 1;
	const ep = g.enchants.reduce((s, e) => s + e.power * 8, 0);
	return Math.max(12, Math.floor(20 + g.level * 6 * q + ep));
}
function gearScore(g) {
	const q = QUALITIES.findIndex((x) => x.id === g.quality) + 1;
	const ench = g.enchants.reduce((s, e) => s + e.power, 0);
	return g.level * 12 + q * 28 + ench * 4 + (g.moves?.length ?? 0) * 6;
}
var MONSTERS = [
	{
		id: "onibi",
		name: "Onibi",
		type: "fire",
		template: 0,
		about: "A funeral flame that learned a face."
	},
	{
		id: "nobi",
		name: "Nobi",
		type: "fire",
		template: 1,
		about: "Small, quick, and already angry."
	},
	{
		id: "hinotama",
		name: "Hinotama",
		type: "fire",
		template: 2,
		about: "A fireball with opinions."
	},
	{
		id: "kagaribi",
		name: "Kagaribi",
		type: "fire",
		template: 3,
		about: "The watchfire that left its post."
	},
	{
		id: "shizuku",
		name: "Shizuku",
		type: "water",
		template: 4,
		about: "One drop, endless patience."
	},
	{
		id: "nami",
		name: "Nami",
		type: "water",
		template: 5,
		about: "A wave that stands up."
	},
	{
		id: "uroko",
		name: "Uroko",
		type: "water",
		template: 6,
		about: "Scales without the fish."
	},
	{
		id: "kasa",
		name: "Kasa",
		type: "water",
		template: 7,
		about: "An umbrella that rains upward."
	},
	{
		id: "tsuchi",
		name: "Tsuchi",
		type: "earth",
		template: 8,
		about: "Clay that refused the grave."
	},
	{
		id: "kusa",
		name: "Kusa",
		type: "earth",
		template: 9,
		about: "Grass with a grudge."
	},
	{
		id: "yanagi",
		name: "Yanagi",
		type: "earth",
		template: 10,
		about: "Willow hair, no woman under it."
	},
	{
		id: "mokuzu",
		name: "Mokuzu",
		type: "earth",
		template: 11,
		about: "River weed that learned to hunt."
	},
	{
		id: "yuki",
		name: "Yuki",
		type: "ice",
		template: 12,
		about: "A child-shaped winter."
	},
	{
		id: "raiju",
		name: "Raiju",
		type: "electric",
		template: 13,
		about: "Thunder's pet, off the leash."
	},
	{
		id: "kaze",
		name: "Kaze",
		type: "air",
		template: 14,
		about: "Wind wearing a beak."
	},
	{
		id: "hikari",
		name: "Hikari",
		type: "light",
		template: 15,
		about: "A halo that bites."
	},
	{
		id: "yami",
		name: "Yami",
		type: "spirit",
		template: 16,
		about: "The dark between two lanterns."
	},
	{
		id: "kage",
		name: "Kage",
		type: "void",
		template: 17,
		about: "Your shadow, employed."
	},
	{
		id: "yomi",
		name: "Yomi",
		type: "void",
		template: 18,
		about: "A door that walks."
	},
	{
		id: "naraku",
		name: "Naraku",
		type: "void",
		template: 19,
		about: "The pit grew teeth."
	},
	{
		id: "muma",
		name: "Muma",
		type: "ghoul",
		template: 20,
		about: "A nun who kept the hunger."
	},
	{
		id: "umoregi",
		name: "Umoregi",
		type: "earth",
		template: 21,
		about: "Buried wood, still growing."
	},
	{
		id: "gaikotsu",
		name: "Gaikotsu",
		type: "ghoul",
		template: 22,
		about: "Bones on patrol."
	},
	{
		id: "wisp",
		name: "Tide Wisp",
		type: "spirit",
		template: 23,
		about: "Marsh-light with a hook."
	},
	{
		id: "saintling",
		name: "Marrow Saintling",
		type: "light",
		template: 24,
		about: "A small saint. Still a problem."
	}
];
var MONSTER_BY_ID = Object.fromEntries(MONSTERS.map((m) => [m.id, m]));
var ANIMAL_BY_ID = Object.fromEntries([
	{
		id: "hare",
		name: "Briar Hare",
		type: "earth",
		template: 9,
		about: "Quick hide. A little meat.",
		animal: true
	},
	{
		id: "boar",
		name: "Tusk Boar",
		type: "earth",
		template: 8,
		about: "Charges. Leather if you live.",
		animal: true
	},
	{
		id: "stag",
		name: "Glass Stag",
		type: "air",
		template: 1,
		about: "The good hide.",
		animal: true
	},
	{
		id: "wolf",
		name: "Marrow Wolf",
		type: "ghoul",
		template: 13,
		about: "Hunts back.",
		animal: true
	},
	{
		id: "crow",
		name: "Veil Crow",
		type: "air",
		template: 14,
		about: "Feathers, a strip of meat.",
		animal: true
	}
].map((a) => [a.id, a]));
var ANIMAL_BIOME = {
	verdant: [
		"hare",
		"boar",
		"stag"
	],
	frost: [
		"stag",
		"wolf",
		"hare"
	],
	crown: ["hare", "crow"],
	tide: ["crow", "hare"],
	bone: ["crow", "wolf"],
	ashen: ["boar", "crow"],
	void: ["crow", "wolf"]
};
var WITCH_NAMES = [
	"Sister Vell",
	"Moth Adel",
	"Quinn Vale",
	"Harrow Nia",
	"Pell the Quiet",
	"Ash Widow",
	"Lark of the Pit",
	"Sera Coil",
	"Brine Nun",
	"Orris Hex"
];
var BIOME_MONSTERS = {
	crown: [
		"gaikotsu",
		"yami",
		"hikari"
	],
	verdant: [
		"kusa",
		"yanagi",
		"mokuzu",
		"umoregi",
		"tsuchi"
	],
	frost: [
		"yuki",
		"kaze",
		"hikari"
	],
	void: [
		"kage",
		"yomi",
		"naraku",
		"muma"
	],
	tide: [
		"shizuku",
		"nami",
		"uroko",
		"kasa",
		"wisp"
	],
	ashen: [
		"onibi",
		"nobi",
		"hinotama",
		"kagaribi",
		"raiju"
	],
	bone: [
		"gaikotsu",
		"muma",
		"yami",
		"saintling"
	]
};
var SKILLS = [
	{
		id: "mining",
		name: "Mining"
	},
	{
		id: "woodcutting",
		name: "Woodcutting"
	},
	{
		id: "hunting",
		name: "Hunting"
	},
	{
		id: "catching",
		name: "Catching"
	},
	{
		id: "trading",
		name: "Trading"
	},
	{
		id: "fishing",
		name: "Fishing"
	},
	{
		id: "social",
		name: "Social"
	},
	{
		id: "shroom",
		name: "Shroom"
	},
	{
		id: "alchemy",
		name: "Alchemy"
	},
	{
		id: "adventuring",
		name: "Adventuring"
	},
	{
		id: "physical",
		name: "Physical"
	},
	{
		id: "magic",
		name: "Magic"
	}
];
function skillNeed(level) {
	return Math.max(20, Math.floor(40 * Math.pow(1.14, Math.min(level - 1, 40)) * (1 + (level - 1) * .02)));
}
function skillLine(id, level) {
	const n = Math.max(0, level - 1);
	switch (id) {
		case "mining":
		case "woodcutting": return `+${(n * .35).toFixed(1)}% yield`;
		case "hunting": return `+${Math.min(40, n * .4).toFixed(1)}% wild damage`;
		case "catching": return `+${Math.min(25, n * .2).toFixed(1)}% jars`;
		case "trading": return `${Math.min(40, n * .25).toFixed(1)}% keener prices`;
		case "fishing": return `+${Math.min(80, n * .8).toFixed(0)}% bite speed`;
		case "social": return `+${Math.floor(n / 8)} story favor`;
		case "shroom": return `+${Math.min(40, n * .4).toFixed(1)}% patches`;
		case "alchemy": return `+${Math.min(35, n * .3).toFixed(1)}% brew`;
		case "adventuring": return `+${(n * .15).toFixed(1)} spirit / s`;
		case "physical": return `+${(n * 2).toFixed(0)}% physical weapons`;
		case "magic": return `+${(n * 2.5).toFixed(0)}% spells, −${Math.min(45, n * 1.2).toFixed(0)}% spell cooldown`;
		default: return "";
	}
}
var ITEMS = [
	{
		id: "potion",
		name: "Potion",
		about: "Mends a modest wound.",
		price: 18,
		heal: 45
	},
	{
		id: "big_potion",
		name: "Big Potion",
		about: "The good bottle.",
		price: 48,
		heal: 110
	},
	{
		id: "ghost_jar",
		name: "Ghost Jar",
		about: "Catches a weakened spirit.",
		price: 26
	},
	{
		id: "cleanse_salt",
		name: "Cleanse Salt",
		about: "Clears a hex. Quest salt.",
		price: 14
	},
	{
		id: "spirit_candy",
		name: "Spirit Candy",
		about: "A rush of spirit.",
		price: 22,
		heal: 30
	},
	{
		id: "smoke_bomb",
		name: "Smoke Bomb",
		about: "Step out of a fight.",
		price: 20
	},
	{
		id: "blue_lantern",
		name: "Blue Lantern",
		about: "Verdant fungus that glows.",
		price: 16
	},
	{
		id: "dreamspore",
		name: "Dreamspore",
		about: "Alchemy dust. Makes sleep.",
		price: 20
	},
	{
		id: "embercap",
		name: "Embercap",
		about: "A hot cap from the wastes.",
		price: 18
	},
	{
		id: "ironroot",
		name: "Ironroot",
		about: "Bitter root. Good in a phial.",
		price: 18
	},
	{
		id: "warmth_tonic",
		name: "Warmth Tonic",
		about: "Brewed fire. Heals and stabs fire.",
		price: 0,
		heal: 70,
		buff: "fire"
	},
	{
		id: "cats_eye",
		name: "Cat's Eye Draught",
		about: "Crit drips for a short while.",
		price: 0,
		buff: "crit"
	},
	{
		id: "ironroot_phial",
		name: "Ironroot Phial",
		about: "A bark ward.",
		price: 0,
		buff: "ward"
	},
	{
		id: "fish",
		name: "Raw Fish",
		about: "Better cooked. Still food.",
		price: 8,
		heal: 18
	},
	{
		id: "fish_meal",
		name: "Fish Meal",
		about: "Bram's way.",
		price: 0,
		heal: 55
	},
	{
		id: "ore",
		name: "Vein Ore",
		about: "Crownfall will buy this.",
		price: 10
	},
	{
		id: "timber",
		name: "Pale Timber",
		about: "Willow-cut.",
		price: 8
	},
	{
		id: "meat",
		name: "Trail Meat",
		about: "From a hunt. Holt will buy it.",
		price: 9,
		heal: 22
	},
	{
		id: "leather",
		name: "Hide Leather",
		about: "Ten hides and ten mushrooms stitch a piece at your account level.",
		price: 14
	},
	{
		id: "mushroom",
		name: "Shroom",
		about: "The patch was generous.",
		price: 11
	}
];
var ITEM_BY_ID = Object.fromEntries(ITEMS.map((i) => [i.id, i]));
var QUESTS = [
	{
		id: "first_steps",
		name: "First Steps",
		about: "Win 3 battles anywhere in the wilds.",
		giver: "Miret",
		chapter: "I · The Hearth",
		rewardKyo: 40,
		rewardItems: {
			potion: 2,
			ghost_jar: 2
		}
	},
	{
		id: "keeper_lanterns",
		name: "Keeper's Lanterns",
		about: "Catch a Light spirit and a Fire spirit.",
		giver: "Keel",
		chapter: "II · Two Flames",
		rewardKyo: 70,
		rewardItems: {
			lantern_jar: 0,
			blue_lantern: 2,
			big_potion: 1
		}
	},
	{
		id: "marsh_walk",
		name: "Marsh Walk",
		about: "Visit Tide Reach, then catch a Water spirit.",
		giver: "Bram",
		chapter: "III · Salt Road",
		rewardKyo: 60,
		rewardItems: { ghost_jar: 3 }
	},
	{
		id: "ember_hunt",
		name: "Ember Hunt",
		about: "Catch two Fire spirits in the Ashen Wastes.",
		giver: "Vey",
		chapter: "IV · Cinder Yard",
		rewardKyo: 80,
		rewardItems: {
			potion: 3,
			embercap: 2
		}
	},
	{
		id: "salt_run",
		name: "Salt Run",
		about: "Bring 2 Cleanse Salt to the ledger.",
		giver: "Holt",
		chapter: "V · The Tithe",
		rewardKyo: 90,
		rewardItems: { big_potion: 1 }
	},
	{
		id: "bone_patrol",
		name: "Bone Patrol",
		about: "Lay down 2 skeletons inside the Tiny Crypt.",
		giver: "Wren",
		chapter: "VI · The Door",
		rewardKyo: 100,
		rewardItems: { spirit_candy: 2 }
	},
	{
		id: "bone_king",
		name: "The Bone King",
		about: "Walk the Bone Garden path and break the Bone King.",
		giver: "Keel",
		chapter: "VII · The Lid",
		rewardKyo: 180,
		rewardItems: {
			big_potion: 2,
			ghost_jar: 2
		}
	}
];
var NPCS = [
	{
		id: "miret",
		name: "Caretaker Miret",
		role: "Hearth keeper",
		female: true,
		outfit: 0,
		hair: 3,
		map: "world",
		tx: 30,
		ty: 31,
		lines: [
			"THE HEARTH IS YOURS. SKILLS STAY WHEN THE VEIL TAKES THE REST.",
			"WIN THREE FIGHTS. THEN WE TALK ABOUT THE DOOR.",
			"CROWNFALL IS DAMAGED. IT IS STILL A CITY."
		]
	},
	{
		id: "vey",
		name: "Captain Vey",
		role: "Citadel guard",
		female: false,
		outfit: 1,
		hair: 1,
		map: "world",
		tx: 26,
		ty: 28,
		lines: [
			"THE ASHEN YARD IS LEAKING FIRE AGAIN.",
			"IF YOU HUNT, HUNT CLEAN. BRING ME COUNTS, NOT STORIES.",
			"HOLT THINKS A DEBT IS PAID IN BONE. HE IS NOT ALWAYS WRONG."
		]
	},
	{
		id: "orien",
		name: "Scribe Orien",
		role: "Ledger scribe",
		female: true,
		outfit: 2,
		hair: 0,
		map: "world",
		tx: 34,
		ty: 28,
		lines: [
			"EVERY ARMOR PIECE ROLLS ITS OWN TYPE. MATCH IT TO THE MOVE.",
			"A FULL SET IS NOT FASHION. IT IS A WEATHER EVENT.",
			"I CAN TEACH A VERSE, IF YOU HAVE KYO."
		]
	},
	{
		id: "holt",
		name: "Quartermaster Holt",
		role: "Stores",
		female: false,
		outfit: 3,
		hair: 2,
		map: "world",
		tx: 32,
		ty: 34,
		shop: "general",
		lines: ["POTIONS, JARS, SALT. THE WALLS DO NOT STOCK THEMSELVES.", "BRING ME SALT IF THE LEDGER ASKS. TWO PINCHES."]
	},
	{
		id: "lise",
		name: "Spore Broker Lise",
		role: "Alchemist",
		female: true,
		outfit: 4,
		hair: 4,
		map: "world",
		tx: 23,
		ty: 33,
		shop: "alchemy",
		lines: ["DREAMSPORE AND EMBERCAP. THAT IS A WARMTH TONIC.", "IRONROOT MAKES A WARD. I JUST HOLD THE FLAME."]
	},
	{
		id: "bram",
		name: "Fisher Bram",
		role: "Tide runner",
		female: false,
		outfit: 5,
		hair: 2,
		map: "world",
		tx: 63,
		ty: 34,
		lines: [
			"THE REACH IS A ROAD IF YOU RESPECT THE WATER.",
			"CATCH ME SOMETHING THAT DRINKS. A WATER SPIRIT.",
			"COOK THE FISH. RAW IS A RUMOR, NOT A MEAL."
		]
	},
	{
		id: "ada",
		name: "Sister Ada",
		role: "Chancel sister",
		female: true,
		outfit: 0,
		hair: 4,
		map: "world",
		tx: 28,
		ty: 26,
		shrine: "light",
		lines: [
			"THE CHANCEL OWES THE HUSH A WALK, NOT A SLAUGHTER.",
			"THE SHRINE WILL HEAL YOU, THEN IT WILL TEST YOU.",
			"LIGHT IS A WEAPON HERE. DO NOT APOLOGIZE FOR IT."
		]
	},
	{
		id: "brask",
		name: "Warden Brask",
		role: "Chancel warden",
		female: false,
		outfit: 1,
		hair: 0,
		map: "world",
		tx: 36,
		ty: 33,
		lines: [
			"I WILL WALK YOU INTO A FIGHT AND CALL IT SETTLED.",
			"WORLD BOSSES DO NOT WAIT ON YOUR STORY. THEY RISE ANYWAY.",
			"IF YOU DIE, PICK ONE THING. THE VEIL IS GREEDY, NOT THOROUGH."
		]
	},
	{
		id: "wren",
		name: "Digger Wren",
		role: "Barrow digger",
		female: true,
		outfit: 6,
		hair: 1,
		map: "world",
		tx: 40,
		ty: 44,
		lines: [
			"PEOPLE WENT IN FOR THE OLD PAY CHEST AND DID NOT COME OUT.",
			"KEEL WILL LET THEM STAY DOWN THERE. I WILL NOT.",
			"THE CRYPT DOOR IS SOUTH OF THE GARDEN. TWO SKELETONS, THEN THE KING."
		]
	},
	{
		id: "keel",
		name: "Priest Keel",
		role: "Barrow priest",
		female: false,
		outfit: 7,
		hair: 3,
		map: "world",
		tx: 37,
		ty: 42,
		lines: [
			"THE BARROW IS NOT A HOLE. IT IS A DOOR.",
			"IF YOU OPEN IT, YOU OWN WHAT COMES OUT.",
			"CATCH A LIGHT AND A FIRE BEFORE YOU CALL YOURSELF READY."
		]
	},
	{
		id: "pike",
		name: "Quiet Pike",
		role: "Fence",
		female: false,
		outfit: 5,
		hair: 1,
		map: "world",
		tx: 22,
		ty: 40,
		shop: "fence",
		lines: ["I BUY ROLLS. I SELL ROLLS. I DO NOT BUY STORIES.", "TYPE ON THE PIECE IS HALF THE BUILD. READ IT."]
	},
	{
		id: "nessa",
		name: "Peddler Nessa",
		role: "Ash peddler",
		female: true,
		outfit: 4,
		hair: 2,
		map: "world",
		tx: 22,
		ty: 50,
		shop: "armor",
		lines: ["THE KILN DROPS BETTER THAN I DO. I AM JUST CLOSER.", "FULL SETS CHANGE THE AIR. YOU WILL FEEL IT IN YOUR TEETH."]
	},
	{
		id: "moss",
		name: "Sister Moss",
		role: "Hollow shrine",
		female: true,
		outfit: 0,
		hair: 3,
		map: "world",
		tx: 42,
		ty: 14,
		shrine: "earth",
		lines: ["VERDANT SHRINE. EARTH ANSWERS IF YOU BLEED A LITTLE.", "THREE ROUNDS. EACH SAINT IS LOUDER."]
	},
	{
		id: "brine",
		name: "Cantor Brine",
		role: "Tide shrine",
		female: false,
		outfit: 2,
		hair: 2,
		map: "world",
		tx: 70,
		ty: 36,
		shrine: "water",
		lines: ["STAND IN THE RING. THE REACH KEEPS SCORE.", "SOAK THEM. THEN ASK THE WATER FOR MORE."]
	},
	{
		id: "sleet",
		name: "Warden Sleet",
		role: "Frost shrine",
		female: true,
		outfit: 6,
		hair: 4,
		map: "world",
		tx: 66,
		ty: 12,
		shrine: "ice",
		lines: ["THE MARCH SHRINE DOES NOT MELT FOR PLEADING.", "WHITEOUT IS A KINDNESS COMPARED TO THE BOSS OUT THERE."]
	},
	{
		id: "cinderkin",
		name: "Ash Cantor Vesper",
		role: "Kiln shrine",
		female: true,
		outfit: 4,
		hair: 1,
		map: "world",
		tx: 16,
		ty: 52,
		shrine: "fire",
		lines: ["FIRE SHRINE. YOU WILL LEAVE WITH A BURN OR A RELIC.", "THE ASH REGENT SLEEPS IN THE KILN, NOT IN THIS RING."]
	}
];
var POIS = [
	...NPCS.map((n) => ({
		kind: "npc",
		id: n.id
	})),
	{
		kind: "shrine",
		id: "sh_light",
		type: "light",
		tx: 28,
		ty: 25,
		name: "Chancel Shrine"
	},
	{
		kind: "shrine",
		id: "sh_earth",
		type: "earth",
		tx: 44,
		ty: 16,
		name: "Hollow Shrine"
	},
	{
		kind: "shrine",
		id: "sh_water",
		type: "water",
		tx: 72,
		ty: 38,
		name: "Tide Shrine"
	},
	{
		kind: "shrine",
		id: "sh_ice",
		type: "ice",
		tx: 68,
		ty: 10,
		name: "March Shrine"
	},
	{
		kind: "shrine",
		id: "sh_fire",
		type: "fire",
		tx: 14,
		ty: 54,
		name: "Kiln Shrine"
	},
	{
		kind: "dungeon",
		id: "crypt",
		tx: 41,
		ty: 46,
		name: "Tiny Crypt"
	},
	{
		kind: "dungeon",
		id: "kiln",
		tx: 18,
		ty: 54,
		name: "Ash Kiln"
	},
	{
		kind: "boss",
		id: "tide_tyrant",
		name: "Tide Tyrant",
		type: "water",
		template: 5,
		tx: 74,
		ty: 30,
		level: 14
	},
	{
		kind: "boss",
		id: "void_cantor",
		name: "Void Cantor",
		type: "void",
		template: 19,
		tx: 10,
		ty: 8,
		level: 16
	},
	{
		kind: "boss",
		id: "marrow_saint",
		name: "Marrow Saint",
		type: "light",
		template: 24,
		tx: 58,
		ty: 8,
		level: 15
	},
	{
		kind: "hearth",
		tx: 30,
		ty: 33
	},
	{
		kind: "node",
		id: "ore1",
		node: "ore",
		tx: 24,
		ty: 36
	},
	{
		kind: "node",
		id: "ore2",
		node: "ore",
		tx: 48,
		ty: 22
	},
	{
		kind: "node",
		id: "ore3",
		node: "ore",
		tx: 12,
		ty: 18
	},
	{
		kind: "node",
		id: "tree1",
		node: "tree",
		tx: 38,
		ty: 18
	},
	{
		kind: "node",
		id: "tree2",
		node: "tree",
		tx: 46,
		ty: 12
	},
	{
		kind: "node",
		id: "tree3",
		node: "tree",
		tx: 20,
		ty: 46
	},
	{
		kind: "node",
		id: "sh1",
		node: "shroom",
		tx: 36,
		ty: 12
	},
	{
		kind: "node",
		id: "sh2",
		node: "shroom",
		tx: 50,
		ty: 20
	},
	{
		kind: "node",
		id: "sh3",
		node: "shroom",
		tx: 14,
		ty: 48
	},
	{
		kind: "node",
		id: "fish1",
		node: "fish",
		tx: 60,
		ty: 24
	},
	{
		kind: "node",
		id: "fish2",
		node: "fish",
		tx: 76,
		ty: 34
	},
	{
		kind: "node",
		id: "fish3",
		node: "fish",
		tx: 66,
		ty: 40
	}
];
/** A fresh huntress wakes with a handful of verses. The rest live in her gear. */
function rollInnate(rng) {
	const must = [
		"measured",
		"halo",
		"roll"
	];
	const bag = MOVES.filter((m) => !must.includes(m.id));
	const out = [...must];
	while (out.length < 4 && bag.length) {
		const i = irand(rng, bag.length);
		out.push(bag.splice(i, 1)[0].id);
	}
	return out;
}
function packMoves(rng, type, n) {
	const prefer = MOVES.filter((m) => m.type === type);
	const rest = MOVES.filter((m) => m.type !== type);
	const bag = [...prefer, ...rest];
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	let guard = 0;
	while (out.length < n && bag.length && guard < 40) {
		guard += 1;
		const i = irand(rng, Math.min(bag.length, Math.max(6, prefer.length + 2)));
		const m = bag.splice(i, 1)[0];
		if (!m || seen.has(m.id)) continue;
		seen.add(m.id);
		out.push(m.id);
	}
	return out.length ? out : ["measured"];
}
function ensureGearMoves(g) {
	if (g.moves?.length) return g.moves;
	const rng = mulberry32((g.fxSeed + 3) * 997 + g.level * 17 + g.style * 13);
	const n = g.quality === "rare" || g.quality === "epic" || g.quality === "legendary" ? 2 : 1;
	g.moves = packMoves(rng, g.type, n);
	return g.moves;
}
/** Ethereal hides shrug steel. Solid hides shrug hymns. */
function bodyRead(type) {
	if (type === "spirit" || type === "void" || type === "air" || type === "electric" || type === "light") return {
		kind: "magic",
		line: "Ethereal hide. Magic lands cleaner than steel."
	};
	return {
		kind: "physical",
		line: "Solid hide. Physical cuts deeper than hymns."
	};
}
var COMPANION_IDS = /* @__PURE__ */ new Set([
	"miret",
	"wren",
	"brask",
	"vey",
	"brine",
	"sleet",
	"ada"
]);
function npcOffers(n) {
	const offers = [];
	if (n.shop) offers.push("Trade");
	const last = n.name.split(" ").slice(-1)[0].toLowerCase();
	if (n.shrine || QUESTS.some((q) => q.giver.toLowerCase().includes(last))) offers.push("Quest");
	if (COMPANION_IDS.has(n.id)) offers.push("Companionship");
	return offers;
}
function accountNeed(level) {
	return Math.floor(140 * Math.pow(1.32, Math.max(0, level - 1)));
}
function learnPool(level, race) {
	const type = RACES.find((r) => r.id === race).type;
	return MOVES.filter((m) => m.power <= 22 + level * 2.2 || m.type === type || m.type === "normal").map((m) => m.id);
}
async function loadCloudSave() {
	return (await import("./cloud-save-BlzB7e47.mjs")).loadCloudSave();
}
async function writeCloudSave(args) {
	return (await import("./cloud-save-BlzB7e47.mjs")).writeCloudSave(args);
}
/** Hunt and Witch Circle keep separate saves, bundled on the signed-in account. */
var ARENA_KEY = "turbz-arena-v1";
var hunt = null;
var arena = null;
var ready = false;
var writer = null;
function bindCloud(fn) {
	writer = fn;
}
function cloudReady() {
	ready = true;
	flush();
}
function noteHunt(save) {
	hunt = save;
	flush();
}
function noteArena(save) {
	arena = save;
	try {
		if (save) localStorage.setItem(ARENA_KEY, JSON.stringify(save));
		else localStorage.removeItem(ARENA_KEY);
	} catch {}
	flush();
}
function readArenaLocal() {
	try {
		const text = localStorage.getItem(ARENA_KEY);
		return text ? JSON.parse(text) : null;
	} catch {
		return null;
	}
}
/** Old accounts stored a bare hunt save. A bundle keeps both modes. */
function ingestCloud(raw) {
	if (raw && typeof raw === "object" && raw.kind === "turbz-bundle") {
		const bundle = raw;
		hunt = bundle.hunt ?? null;
		arena = bundle.arena ?? null;
		try {
			if (arena) localStorage.setItem(ARENA_KEY, JSON.stringify(arena));
			else localStorage.removeItem(ARENA_KEY);
		} catch {}
		return {
			hunt,
			arena
		};
	}
	hunt = raw ?? null;
	arena = readArenaLocal();
	return {
		hunt,
		arena
	};
}
function flush() {
	if (!ready || !writer) return;
	const json = JSON.stringify({
		kind: "turbz-bundle",
		v: 1,
		hunt: hunt ?? null,
		arena: arena ?? null
	});
	writer(json);
}
var BANK = {
	fire: [
		"flame",
		"ember",
		"flame"
	],
	water: [
		"drop",
		"cloud",
		"drop"
	],
	earth: [
		"root",
		"thorn",
		"root"
	],
	air: [
		"cloud",
		"ribbon",
		"cloud"
	],
	electric: [
		"bolt",
		"bolt",
		"ray"
	],
	ice: [
		"frost",
		"frost",
		"ray"
	],
	void: [
		"rift",
		"ribbon",
		"rift"
	],
	light: [
		"ray",
		"flame",
		"ray"
	],
	spirit: [
		"ribbon",
		"cloud",
		"ribbon"
	],
	ghoul: [
		"ichor",
		"ember",
		"rift"
	],
	normal: [
		"ember",
		"ribbon",
		"thorn"
	]
};
function motifOf(type, n) {
	const list = BANK[type] ?? BANK.normal;
	return {
		motif: list[Math.abs(n) % list.length] ?? "flame",
		variant: Math.abs(n * 3 + 1) % 3
	};
}
function hash(n) {
	const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
}
function tongue(ctx, h, w, outer, inner) {
	ctx.beginPath();
	ctx.moveTo(-w, 0);
	ctx.quadraticCurveTo(-w * .2, -h * .58, w * .15, -h);
	ctx.quadraticCurveTo(w * .7, -h * .46, w, 0);
	ctx.closePath();
	ctx.fillStyle = outer;
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(-w * .4, 0);
	ctx.quadraticCurveTo(-w * .05, -h * .5, w * .08, -h * .7);
	ctx.quadraticCurveTo(w * .35, -h * .28, w * .45, 0);
	ctx.closePath();
	ctx.fillStyle = inner;
	ctx.fill();
}
function teardrop(ctx, s, fill) {
	ctx.beginPath();
	ctx.moveTo(0, -s * 2.1);
	ctx.bezierCurveTo(s * .55, -s * .7, s * .72, s * .15, 0, s * .55);
	ctx.bezierCurveTo(-s * .72, s * .15, -s * .55, -s * .7, 0, -s * 2.1);
	ctx.fillStyle = fill;
	ctx.fill();
	ctx.fillStyle = "rgba(255,255,255,0.85)";
	ctx.beginPath();
	ctx.moveTo(-s * .05, -s * .85);
	ctx.lineTo(s * .16, -s * .35);
	ctx.lineTo(-s * .02, -s * .05);
	ctx.closePath();
	ctx.fill();
}
function streak(ctx, x0, y0, x1, y1, pal) {
	ctx.strokeStyle = pal.l;
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.moveTo(x0, y0);
	ctx.lineTo(x1, y1);
	ctx.stroke();
	ctx.fillStyle = "#fff6d8";
	ctx.beginPath();
	ctx.moveTo(x1, y1 - 3);
	ctx.lineTo(x1 + 2.2, y1);
	ctx.lineTo(x1, y1 + 3);
	ctx.lineTo(x1 - 2.2, y1);
	ctx.closePath();
	ctx.fill();
}
function spike(ctx, len, w, pal) {
	ctx.beginPath();
	ctx.moveTo(-w * .45, 0);
	ctx.lineTo(w * .2, -len * .42);
	ctx.lineTo(0, -len);
	ctx.lineTo(-w * .15, -len * .38);
	ctx.closePath();
	ctx.fillStyle = pal.l;
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(-w * .12, -len * .12);
	ctx.lineTo(w * .08, -len * .4);
	ctx.lineTo(0, -len * .78);
	ctx.closePath();
	ctx.fillStyle = pal.h;
	ctx.globalAlpha = .85;
	ctx.fill();
	ctx.globalAlpha = 1;
}
function wedge(ctx, len, spread, pal) {
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(Math.sin(spread) * len, -len);
	ctx.lineTo(-Math.sin(spread) * len * .35, -len * .92);
	ctx.closePath();
	ctx.fillStyle = pal.a;
	ctx.globalAlpha = .88;
	ctx.fill();
	ctx.globalAlpha = 1;
	ctx.strokeStyle = "#fff6d0";
	ctx.lineWidth = 1.3;
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(0, -len);
	ctx.stroke();
}
function tear(ctx, h, pal) {
	ctx.beginPath();
	ctx.moveTo(0, 2);
	ctx.lineTo(4.2, -h * .22);
	ctx.lineTo(-2.4, -h * .46);
	ctx.lineTo(5, -h * .7);
	ctx.lineTo(.4, -h);
	ctx.lineTo(-4, -h * .66);
	ctx.lineTo(2.2, -h * .4);
	ctx.lineTo(-3.4, -h * .16);
	ctx.closePath();
	ctx.fillStyle = "#140816";
	ctx.fill();
	ctx.strokeStyle = pal.l;
	ctx.lineWidth = 1.8;
	ctx.stroke();
	ctx.strokeStyle = pal.h;
	ctx.globalAlpha = .75;
	ctx.lineWidth = .8;
	ctx.stroke();
	ctx.globalAlpha = 1;
}
function puff(ctx, x, y, w, pal) {
	ctx.fillStyle = pal.m;
	ctx.globalAlpha = .72;
	ctx.beginPath();
	ctx.ellipse(x, y + w * .22, w * .95, w * .38, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = pal.l;
	ctx.globalAlpha = .88;
	ctx.beginPath();
	ctx.ellipse(x - w * .38, y, w * .46, w * .34, 0, 0, Math.PI * 2);
	ctx.ellipse(x + w * .34, y - w * .02, w * .4, w * .3, 0, 0, Math.PI * 2);
	ctx.ellipse(x - w * .02, y - w * .28, w * .42, w * .32, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "#fff";
	ctx.globalAlpha = .35;
	ctx.beginPath();
	ctx.ellipse(x - w * .08, y - w * .38, w * .18, w * .1, -.4, 0, Math.PI * 2);
	ctx.fill();
	ctx.globalAlpha = 1;
}
function feather(ctx, ang, sc, pal) {
	ctx.save();
	ctx.rotate(ang);
	ctx.fillStyle = pal.l;
	ctx.beginPath();
	ctx.moveTo(0, -9 * sc);
	ctx.quadraticCurveTo(4.2 * sc, -2 * sc, 1.1 * sc, 7 * sc);
	ctx.quadraticCurveTo(0, 2 * sc, -1.3 * sc, 7 * sc);
	ctx.quadraticCurveTo(-4.4 * sc, -1 * sc, 0, -9 * sc);
	ctx.fill();
	ctx.strokeStyle = pal.h;
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(0, -7 * sc);
	ctx.lineTo(0, 5 * sc);
	ctx.stroke();
	ctx.restore();
}
function ribbon(ctx, t, seed, len, pal) {
	const amp = 3.5 + Math.abs(seed) % 3;
	ctx.beginPath();
	ctx.moveTo(0, 0);
	for (let i = 1; i <= 8; i++) {
		const u = i / 8;
		ctx.lineTo(Math.sin(t * 3.2 + seed + u * 6) * amp * (.4 + u), -len * u);
	}
	ctx.lineCap = "round";
	ctx.strokeStyle = pal.m;
	ctx.lineWidth = 4.2;
	ctx.globalAlpha = .8;
	ctx.stroke();
	ctx.strokeStyle = pal.l;
	ctx.lineWidth = 2;
	ctx.globalAlpha = .95;
	ctx.stroke();
	ctx.strokeStyle = pal.h;
	ctx.lineWidth = .8;
	ctx.stroke();
	ctx.globalAlpha = 1;
}
function rootCurve(ctx, t, seed, len, side, pal, thorns) {
	const curl = Math.sin(t * 1.8 + seed) * 5 * side;
	ctx.lineCap = "round";
	ctx.strokeStyle = pal.d;
	ctx.lineWidth = 3.4;
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.bezierCurveTo(side * 7, -len * .2, side * -4 + curl, -len * .55, side * 3 + curl, -len);
	ctx.stroke();
	ctx.strokeStyle = pal.l;
	ctx.lineWidth = 1.5;
	ctx.stroke();
	if (!thorns) return;
	ctx.fillStyle = pal.a;
	for (let i = 0; i < 3; i++) {
		const y = -len * (.28 + i * .24);
		const x = side * (2 + i * 1.4) + Math.sin(seed + i) * 2;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + side * 6, y - 2.5);
		ctx.lineTo(x + side * 1.2, y + 2.4);
		ctx.closePath();
		ctx.fill();
	}
}
function bolt(ctx, t, seed, len, jag, pal) {
	const flick = Math.floor(t * 18 + seed * .17);
	const pts = [{
		x: 0,
		y: 0
	}];
	const segs = 6;
	for (let i = 1; i <= segs; i++) {
		const u = i / segs;
		pts.push({
			x: (hash(flick * 9 + i * 5 + seed) - .5) * jag * (1.2 - u),
			y: -len * u
		});
	}
	const stroke = (width, color) => {
		ctx.beginPath();
		ctx.moveTo(pts[0].x, pts[0].y);
		for (const p of pts) ctx.lineTo(p.x, p.y);
		ctx.strokeStyle = color;
		ctx.lineWidth = width;
		ctx.stroke();
	};
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	stroke(4.2, pal.m);
	stroke(2.1, pal.l);
	stroke(.9, "#fffef6");
	const branchAt = pts[3];
	if (!branchAt) return;
	const dir = hash(flick + seed) > .5 ? 1 : -1;
	ctx.beginPath();
	ctx.moveTo(branchAt.x, branchAt.y);
	ctx.lineTo(branchAt.x + dir * jag * .85, branchAt.y - len * .18);
	ctx.lineTo(branchAt.x + dir * jag * .35, branchAt.y - len * .38);
	ctx.strokeStyle = "#fffef6";
	ctx.lineWidth = 1.1;
	ctx.stroke();
}
function paintFlame(ctx, t, seed, pal, variant, sc) {
	const n = variant === 1 ? 5 : 3;
	const fan = variant === 1 ? .42 : .16;
	for (let i = 0; i < n; i++) {
		const k = i - (n - 1) / 2;
		const flick = .72 + Math.sin(t * (variant === 2 ? 14 : 9) + seed + i) * .28;
		const h = (variant === 2 ? 18 : 13) * sc * flick + i % 2 * 3 * sc;
		const w = (variant === 1 ? 2.2 : 3.4) * sc;
		ctx.save();
		ctx.rotate(k * fan);
		ctx.translate(k * 1.2 * sc, 0);
		tongue(ctx, h, w, i % 2 ? pal.l : pal.m, variant === 2 ? "#fff4c8" : pal.h);
		ctx.restore();
	}
	if (variant === 2) for (let i = 0; i < 3; i++) {
		const life = (t * .7 + i * .33) % 1;
		streak(ctx, (i - 1) * 3 * sc, -2, (i - 1) * 5 * sc, -8 * sc - life * 14 * sc, pal);
	}
}
function paintBolt(ctx, t, seed, pal, variant, sc) {
	const n = variant === 1 ? 2 : 3;
	for (let i = 0; i < n; i++) {
		ctx.save();
		ctx.rotate((i - (n - 1) / 2) * (variant === 2 ? .15 : .48));
		bolt(ctx, t, seed + i * 19, (variant === 2 ? 22 : 16) * sc, (variant === 1 ? 14 : 9) * sc, pal);
		ctx.restore();
	}
}
function paintRoot(ctx, t, seed, pal, variant, sc) {
	const n = variant === 1 ? 4 : 3;
	for (let i = 0; i < n; i++) {
		const side = i % 2 === 0 ? -1 : 1;
		ctx.save();
		ctx.rotate((i - (n - 1) / 2) * .35);
		rootCurve(ctx, t, seed + i, (14 + variant * 3) * sc, side, pal, variant !== 0);
		ctx.restore();
	}
}
function paintDrop(ctx, t, seed, pal, variant, sc) {
	if (variant === 1) {
		ctx.beginPath();
		ctx.moveTo(-12 * sc, 1);
		for (let i = 0; i <= 10; i++) {
			const x = -12 * sc + i / 10 * 24 * sc;
			const y = Math.sin(t * 4 + i + seed) * 2.4 * sc - 3 * sc;
			ctx.lineTo(x, y);
		}
		ctx.lineTo(12 * sc, 6 * sc);
		ctx.lineTo(-12 * sc, 6 * sc);
		ctx.closePath();
		ctx.fillStyle = pal.l;
		ctx.globalAlpha = .8;
		ctx.fill();
		ctx.globalAlpha = 1;
		ctx.strokeStyle = pal.h;
		ctx.lineWidth = 1.2;
		ctx.beginPath();
		for (let i = 0; i <= 10; i++) {
			const x = -12 * sc + i / 10 * 24 * sc;
			const y = Math.sin(t * 4 + i + seed) * 2.4 * sc - 3 * sc;
			if (i === 0) ctx.moveTo(x, y);
			else ctx.lineTo(x, y);
		}
		ctx.stroke();
	}
	const drops = variant === 2 ? 5 : 4;
	for (let i = 0; i < drops; i++) {
		const life = (t * (.45 + i % 3 * .08) + i * .27 + seed * .01) % 1;
		const x = (i - (drops - 1) / 2) * 4.2 * sc + Math.sin(t * 2 + i) * 1.5 * sc;
		const y = -life * (16 + variant * 4) * sc;
		ctx.save();
		ctx.translate(x, y);
		ctx.globalAlpha = life < .15 || life > .9 ? .35 : .95;
		teardrop(ctx, (2.1 + i % 2 * .6) * sc, i % 2 ? pal.a : pal.l);
		ctx.restore();
	}
	ctx.globalAlpha = 1;
}
function paintCloud(ctx, t, seed, pal, variant, sc) {
	const drift = Math.sin(t * .8 + seed) * 3 * sc;
	puff(ctx, drift - 4 * sc, -6 * sc, 7 * sc, pal);
	if (variant !== 2) puff(ctx, drift + 6 * sc, -11 * sc, 5.5 * sc, pal);
	if (variant === 1) {
		ctx.save();
		ctx.translate(0, -4 * sc);
		ribbon(ctx, t, seed, 12 * sc, pal);
		ctx.restore();
	}
	if (variant === 2) for (let i = 0; i < 3; i++) {
		const life = (t * .6 + i * .3) % 1;
		ctx.save();
		ctx.translate((i - 1) * 4 * sc, -2 * sc - life * 10 * sc);
		teardrop(ctx, 1.8 * sc, pal.a);
		ctx.restore();
	}
}
function paintFrost(ctx, t, seed, pal, variant, sc) {
	const n = variant === 1 ? 1 : 4;
	if (variant !== 1) for (let i = 0; i < n; i++) {
		const grow = .75 + Math.sin(t * 2.4 + i + seed) * .25;
		ctx.save();
		ctx.rotate((i - (n - 1) / 2) * .4);
		spike(ctx, 14 * sc * grow, 3.2 * sc, pal);
		ctx.restore();
	}
	if (variant === 1 || variant === 2) {
		ctx.save();
		ctx.translate(Math.sin(t + seed) * 3 * sc, -8 * sc + Math.cos(t * .7) * 2);
		ctx.rotate(t * .6);
		ctx.strokeStyle = pal.h;
		ctx.lineWidth = 1.2;
		for (let i = 0; i < 6; i++) {
			ctx.rotate(Math.PI / 3);
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(0, -7 * sc);
			ctx.moveTo(0, -4 * sc);
			ctx.lineTo(2 * sc, -5.5 * sc);
			ctx.moveTo(0, -4 * sc);
			ctx.lineTo(-2 * sc, -5.5 * sc);
			ctx.stroke();
		}
		ctx.restore();
	}
}
function paintRift$1(ctx, t, seed, pal, variant, sc) {
	tear(ctx, (16 + variant * 3) * sc, pal);
	if (variant === 1) {
		ctx.save();
		ctx.rotate(.8);
		tear(ctx, 12 * sc, pal);
		ctx.restore();
	}
	ctx.save();
	ctx.translate(2, -4 * sc);
	ribbon(ctx, t * 1.4, seed, 12 * sc, pal);
	ctx.restore();
	for (let i = 0; i < 3; i++) {
		const life = (t * .8 + i * .31) % 1;
		const ang = -.8 + i * .7;
		const dist = (1 - life) * 12 * sc;
		ctx.save();
		ctx.translate(Math.sin(ang) * dist, -8 * sc - Math.cos(ang) * dist * .3);
		ctx.rotate(ang);
		ctx.fillStyle = pal.h;
		ctx.fillRect(-1.2, -2.4, 2.2, 4);
		ctx.restore();
	}
}
function paintRay(ctx, t, seed, pal, variant, sc) {
	const n = variant === 1 ? 3 : 5;
	ctx.save();
	ctx.rotate(variant === 0 ? t * .35 : 0);
	for (let i = 0; i < n; i++) {
		const flick = .65 + Math.sin(t * 5 + i + seed) * .35;
		ctx.save();
		ctx.rotate((i - (n - 1) / 2) * (variant === 1 ? .22 : .38));
		wedge(ctx, (12 + variant * 3) * sc * flick, .14, pal);
		ctx.restore();
	}
	ctx.restore();
	if (variant === 1) {
		const life = t * .9 % 1;
		ctx.fillStyle = "#fff";
		ctx.globalAlpha = 1 - life;
		ctx.fillRect(-1.2, -life * 18 * sc, 2.4, 3);
		ctx.globalAlpha = 1;
	}
}
function paintRibbon(ctx, t, seed, pal, variant, sc) {
	if (variant === 1) {
		for (let i = 0; i < 3; i++) {
			const life = (t * .35 + i * .33) % 1;
			ctx.save();
			ctx.translate((i - 1) * 6 * sc + Math.sin(t + i) * 2, -life * 16 * sc);
			ctx.rotate(-.4 + i * .35 + Math.sin(t * 2 + i) * .2);
			feather(ctx, 0, sc, pal);
			ctx.restore();
		}
		return;
	}
	ribbon(ctx, t, seed, (14 + variant * 4) * sc, pal);
	if (variant === 2) {
		ctx.save();
		ctx.rotate(.5);
		ribbon(ctx, t + 1.2, seed + 4, 11 * sc, pal);
		ctx.restore();
	}
}
function paintIchor(ctx, t, seed, pal, variant, sc) {
	const n = 3 + variant;
	for (let i = 0; i < n; i++) {
		const life = (t * (.55 + i * .05) + i * .2) % 1;
		const x = (i - (n - 1) / 2) * 3.6 * sc;
		ctx.save();
		ctx.translate(x, 0);
		ctx.strokeStyle = pal.m;
		ctx.lineWidth = 1.6 + life;
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.quadraticCurveTo(Math.sin(seed + i) * 2, -life * 6 * sc, 0, -life * (12 + variant * 3) * sc);
		ctx.stroke();
		ctx.translate(0, -life * (12 + variant * 3) * sc);
		teardrop(ctx, (1.8 + life) * sc, pal.l);
		ctx.restore();
	}
	if (variant === 1) {
		ctx.strokeStyle = pal.a;
		ctx.lineWidth = 1.3;
		ctx.beginPath();
		ctx.moveTo(-6 * sc, -2);
		ctx.quadraticCurveTo(0, -8 * sc, 7 * sc, -3 * sc + Math.sin(t * 6) * 2);
		ctx.stroke();
	}
}
function paintEmber(ctx, t, seed, pal, variant, sc) {
	if (variant === 1) {
		ctx.strokeStyle = pal.l;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(-8 * sc, 0);
		ctx.lineTo(-3 * sc, -3 * sc);
		ctx.lineTo(1 * sc, -1 * sc);
		ctx.lineTo(6 * sc, -5 * sc);
		ctx.lineTo(9 * sc, -2 * sc);
		ctx.stroke();
		ctx.strokeStyle = "#fff1c4";
		ctx.lineWidth = 1;
		ctx.stroke();
	}
	const n = 4 + variant;
	for (let i = 0; i < n; i++) {
		const life = (t * (.8 + i % 2 * .2) + i * .17 + seed * .02) % 1;
		const spread = (i - (n - 1) / 2) * (variant === 2 ? .55 : .22);
		const len = life * (12 + variant * 4) * sc;
		streak(ctx, Math.sin(spread) * 2, -1, Math.sin(spread) * len * .8, -len, pal);
	}
}
function paintThorn(ctx, t, seed, pal, variant, sc) {
	const n = variant === 2 ? 5 : 3;
	for (let i = 0; i < n; i++) {
		const grow = variant === 0 ? .55 + (Math.sin(t * 4 + i) * .5 + .5) * .6 : 1;
		ctx.save();
		ctx.rotate((i - (n - 1) / 2) * .42);
		spike(ctx, 12 * sc * grow, 2.4 * sc, pal);
		ctx.restore();
	}
	if (variant !== 0) rootCurve(ctx, t, seed, 12 * sc, 1, pal, true);
}
function paintMotif(ctx, motif, variant, t, seed, pal, sc) {
	ctx.save();
	ctx.scale(1.55, 1.55);
	ctx.lineJoin = "round";
	ctx.lineCap = "round";
	ctx.globalCompositeOperation = "source-over";
	const v = (variant % 3 + 3) % 3;
	if (motif === "flame") paintFlame(ctx, t, seed, pal, v, sc);
	else if (motif === "bolt") paintBolt(ctx, t, seed, pal, v, sc);
	else if (motif === "root") paintRoot(ctx, t, seed, pal, v, sc);
	else if (motif === "drop") paintDrop(ctx, t, seed, pal, v, sc);
	else if (motif === "cloud") paintCloud(ctx, t, seed, pal, v, sc);
	else if (motif === "frost") paintFrost(ctx, t, seed, pal, v, sc);
	else if (motif === "rift") paintRift$1(ctx, t, seed, pal, v, sc);
	else if (motif === "ray") paintRay(ctx, t, seed, pal, v, sc);
	else if (motif === "ribbon") paintRibbon(ctx, t, seed, pal, v, sc);
	else if (motif === "ichor") paintIchor(ctx, t, seed, pal, v, sc);
	else if (motif === "ember") paintEmber(ctx, t, seed, pal, v, sc);
	else paintThorn(ctx, t, seed, pal, v, sc);
	ctx.restore();
}
function auraPal(hex) {
	return {
		d: hex,
		m: hex,
		l: hex,
		h: "#fff6e8",
		a: hex
	};
}
function paintSetAura(ctx, fx, t, scale, color) {
	const sc = Math.max(.75, scale);
	const pal = auraPal(color);
	ctx.save();
	if (fx === "solarnova") {
		ctx.save();
		ctx.translate(0, -30 * sc);
		ctx.rotate(t * .45);
		for (let i = 0; i < 8; i++) {
			ctx.rotate(Math.PI / 4);
			wedge(ctx, (26 + Math.sin(t * 3 + i) * 6) * sc, .22, pal);
		}
		ctx.restore();
		ctx.save();
		ctx.translate(0, -22 * sc);
		paintMotif(ctx, "flame", 1, t, 2, pal, sc * .95);
		ctx.restore();
	} else if (fx === "stormcrown") {
		ctx.save();
		ctx.translate(0, -46 * sc);
		paintMotif(ctx, "bolt", 0, t, 8, pal, sc);
		ctx.restore();
	} else if (fx === "tidalsurge") {
		ctx.save();
		ctx.translate(0, -2 * sc);
		paintMotif(ctx, "drop", 1, t, 3, pal, sc * 1.35);
		ctx.restore();
	} else if (fx === "briarburst") {
		ctx.save();
		ctx.translate(0, -4 * sc);
		ctx.rotate(Math.PI);
		paintMotif(ctx, "root", 1, t, 6, pal, sc * 1.15);
		ctx.restore();
		ctx.save();
		ctx.translate(0, -16 * sc);
		paintMotif(ctx, "thorn", 2, t, 9, pal, sc * .8);
		ctx.restore();
	} else if (fx === "whitestorm") {
		ctx.save();
		ctx.translate(-14 * sc, -40 * sc);
		paintMotif(ctx, "cloud", 0, t, 1, pal, sc);
		ctx.restore();
		ctx.save();
		ctx.translate(12 * sc, -46 * sc);
		paintMotif(ctx, "cloud", 2, t, 5, pal, sc * .8);
		ctx.restore();
		ctx.save();
		ctx.translate(0, -36 * sc);
		ctx.rotate(Math.PI);
		paintMotif(ctx, "bolt", 2, t, 11, pal, sc * .85);
		ctx.restore();
	} else if (fx === "voidring") {
		ctx.save();
		ctx.translate(-12 * sc, -28 * sc);
		paintMotif(ctx, "rift", 0, t, 4, pal, sc);
		ctx.restore();
		ctx.save();
		ctx.translate(12 * sc, -34 * sc);
		paintMotif(ctx, "rift", 1, t + .6, 12, pal, sc * .85);
		ctx.restore();
	} else if (fx === "gravepulse") {
		ctx.save();
		ctx.translate(0, -38 * sc);
		ctx.rotate(Math.PI);
		paintMotif(ctx, "ichor", 1, t, 7, pal, sc);
		ctx.restore();
		ctx.save();
		ctx.translate(0, -20 * sc);
		paintMotif(ctx, "ribbon", 2, t, 3, pal, sc * .7);
		ctx.restore();
	} else if (fx === "lanternwake") {
		ctx.save();
		ctx.translate(0, -50 * sc);
		paintMotif(ctx, "ray", 1, t, 2, pal, sc);
		paintMotif(ctx, "flame", 0, t, 5, pal, sc * .7);
		ctx.restore();
	} else if (fx === "featherfall") for (let i = 0; i < 6; i++) {
		const life = (t * .22 + i * .16) % 1;
		ctx.save();
		ctx.translate(Math.sin(t * .8 + i * 1.4) * 16 * sc, -8 * sc - (1 - life) * 40 * sc);
		ctx.rotate(.4 + Math.sin(t * 2 + i) * .5);
		feather(ctx, 0, sc * .85, pal);
		ctx.restore();
	}
	else if (fx === "bloodmoon") {
		ctx.save();
		ctx.translate(0, -54 * sc);
		const r = 14 * sc;
		ctx.fillStyle = pal.l;
		ctx.beginPath();
		ctx.arc(-r * .15, 0, r, 0, Math.PI * 2);
		ctx.arc(r * .55, -r * .05, r * .86, 0, Math.PI * 2, true);
		ctx.fill("evenodd");
		ctx.restore();
		ctx.save();
		ctx.translate(0, -24 * sc);
		paintMotif(ctx, "flame", 2, t, 9, pal, sc * .85);
		ctx.restore();
	}
	ctx.restore();
}
var SKIN = {
	0: {
		d: "#6a4038",
		m: "#c48a78",
		l: "#f0d2c4",
		h: "#fff4ee",
		a: "#e8b0a8"
	},
	1: {
		d: "#5a3028",
		m: "#d09878",
		l: "#f0c8a8",
		h: "#ffe8d4",
		a: "#e07050"
	},
	2: {
		d: "#4a3830",
		m: "#c4a090",
		l: "#efd8cc",
		h: "#fff6f0",
		a: "#7ec8ea"
	},
	3: {
		d: "#5a4030",
		m: "#c89878",
		l: "#f0d0b0",
		h: "#fff0e0",
		a: "#6a9a52"
	},
	4: {
		d: "#6a5868",
		m: "#e0c8d0",
		l: "#f6e6ee",
		h: "#ffffff",
		a: "#b9dcff"
	}
};
var HAIR = {
	0: "#241830",
	1: "#3a140c",
	2: "#163044",
	3: "#243018",
	4: "#d5ecff"
};
function typePal(t) {
	const c = TYPES[t].color;
	return {
		d: shade(c, -70),
		m: shade(c, -25),
		l: c,
		h: "#fff6e8",
		a: shade(c, 40)
	};
}
function shade(hex, amt) {
	const n = parseInt(hex.slice(1), 16);
	const ch = (i) => Math.max(0, Math.min(255, (n >> i & 255) + amt));
	return `#${[
		16,
		8,
		0
	].map((i) => ch(i).toString(16).padStart(2, "0")).join("")}`;
}
var WIDE = 1.28;
var SQUAT = .58;
var NECK = -64;
var ARM_X = 6.3;
var ARM_Y = -50;
function worn(pieces, slot) {
	return pieces.find((p) => p.slot === slot);
}
function edgeFx(ctx, piece, t, spots, unsquat) {
	if (!piece) return;
	spots.forEach((spot, i) => {
		ctx.save();
		ctx.translate(spot.x, spot.y);
		ctx.rotate(spot.rot);
		paintFitted(ctx, {
			...piece,
			fxSeed: piece.fxSeed + i * 17,
			style: piece.style + i * 3
		}, t + i * .41, spot.sc, unsquat);
		ctx.restore();
	});
}
function paintFitted(ctx, piece, t, sc, unsquat) {
	if (!piece) return;
	const { motif, variant } = motifOf(piece.type, piece.style * 5 + piece.fxSeed + piece.slot.length);
	ctx.save();
	if (unsquat) ctx.scale(.46 / WIDE, .46 / SQUAT);
	paintMotif(ctx, motif, variant, t, piece.fxSeed * 3 + piece.style, typePal(piece.type), sc);
	ctx.restore();
}
function drawActor(ctx, a) {
	const s = (a.scale ?? 1) * (a.tall ?? 1);
	const skin = SKIN[a.skin] ?? SKIN[0];
	const hair = HAIR[a.hair] ?? "#241830";
	const fxT = a.time ?? a.walk;
	if (a.setOn && a.setFx) drawSetAura(ctx, a.x, a.y, a.setFx, fxT, s);
	ctx.save();
	ctx.translate(a.x, a.y);
	ctx.scale(a.facing < 0 ? -s * WIDE : s * WIDE, s * SQUAT);
	const bob = Math.sin(a.walk * 8) * (a.walk > .2 ? 1.2 : .25);
	ctx.translate(0, bob);
	if (a.attack > 0) ctx.translate(4 * a.attack, 0);
	ctx.fillStyle = "rgba(0,0,0,0.38)";
	ctx.beginPath();
	ctx.ellipse(0, 3, 11, 3.6, 0, 0, Math.PI * 2);
	ctx.fill();
	const chest = worn(a.pieces, "chest");
	const legs = worn(a.pieces, "legs");
	const feet = worn(a.pieces, "feet");
	const helm = worn(a.pieces, "head");
	const relic = worn(a.pieces, "relic");
	const weapon = worn(a.pieces, "weapon");
	const sleeve = chest ? typePal(chest.type) : null;
	drawArm(ctx, skin, 0, false, sleeve);
	drawLegs(ctx, skin, Math.sin(a.walk * 8) * (a.walk > .2 ? 4 : .35), a.female, legs, feet);
	if (legs && (legs.style % 4 + 4) % 4 !== 3) {
		const skirt = (legs.style % 20 + 20) % 20;
		drawSkirt(ctx, skirt, typePal(legs.type));
		const flare = 8.2 + skirt % 3 * .8;
		edgeFx(ctx, legs, fxT, [{
			x: -flare - 1.5,
			y: -3.2,
			rot: Math.PI - .55,
			sc: .16
		}, {
			x: flare + 1.5,
			y: -3.2,
			rot: -(Math.PI - .55),
			sc: .16
		}], true);
	} else if (legs) edgeFx(ctx, legs, fxT, [{
		x: -8.4,
		y: -6,
		rot: Math.PI - .35,
		sc: .14
	}, {
		x: 8.4,
		y: -6,
		rot: -(Math.PI - .35),
		sc: .14
	}], true);
	if (chest) drawChestArmor(ctx, (chest.style % 20 + 20) % 20, typePal(chest.type), a.female, chest.fxSeed);
	else {
		drawTorso(ctx, skin, a.female);
		drawRobes(ctx, a.race, a.female);
	}
	if (chest) edgeFx(ctx, chest, fxT, [{
		x: -12.4,
		y: -50,
		rot: -Math.PI / 2,
		sc: .15
	}, {
		x: 12.4,
		y: -50,
		rot: Math.PI / 2,
		sc: .15
	}], true);
	if (relic) {
		drawRelicArmor(ctx, (relic.style % 20 + 20) % 20, typePal(relic.type));
		edgeFx(ctx, relic, fxT, [{
			x: -22,
			y: -30,
			rot: -Math.PI / 2,
			sc: .13
		}], true);
	}
	drawArm(ctx, skin, a.attack, true, sleeve);
	ctx.save();
	ctx.translate(0, NECK);
	ctx.scale(1, WIDE / SQUAT);
	ctx.translate(0, 64);
	drawHead(ctx, skin, hair, a.female, a.hair, a.race);
	if (helm) {
		drawHelm(ctx, helm.style, typePal(helm.type));
		edgeFx(ctx, helm, fxT, [
			{
				x: 0,
				y: -88,
				rot: 0,
				sc: .13
			},
			{
				x: -12.5,
				y: -74,
				rot: -Math.PI / 2,
				sc: .11
			},
			{
				x: 12.5,
				y: -74,
				rot: Math.PI / 2,
				sc: .11
			}
		], false);
	}
	ctx.restore();
	if (weapon) {
		ctx.save();
		placeFrontHand(ctx, a.attack);
		drawWeapon(ctx, weapon.style, typePal(weapon.type), a.attack, fxT);
		edgeFx(ctx, weapon, fxT, [{
			x: 0,
			y: weaponTip(weapon.style),
			rot: 0,
			sc: .15
		}], false);
		ctx.restore();
	}
	if (feet) edgeFx(ctx, feet, fxT, [{
		x: -11.2,
		y: 1.4,
		rot: Math.PI - .4,
		sc: .12
	}, {
		x: 11.6,
		y: 1.4,
		rot: -(Math.PI - .4),
		sc: .12
	}], true);
	if (a.hurt > 0) {
		ctx.globalAlpha = a.hurt * .55;
		ctx.fillStyle = "#fff";
		ctx.beginPath();
		ctx.ellipse(0, -36, 12, 28, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.globalAlpha = 1;
	}
	ctx.restore();
}
function placeFrontHand(ctx, attack) {
	ctx.translate(ARM_X, ARM_Y);
	ctx.rotate(-.42 - attack * 1.05);
	ctx.translate(.2, 9);
	ctx.rotate(.35 + attack * .3);
	ctx.translate(.2, 16.4);
	ctx.scale(1 / WIDE, 1 / SQUAT);
	ctx.rotate(Math.PI - 1.05);
	ctx.scale(.74, .74);
}
function drawLegs(ctx, skin, leg, female, pants, boots) {
	const swing = female ? leg * .85 : leg * .55;
	const hip = female ? 4.2 : 4.5;
	const trousers = !!pants && (pants.style % 4 + 4) % 4 === 3;
	const cloth = pants ? typePal(pants.type) : null;
	const boot = boots ? typePal(boots.type) : null;
	const drawLeg = (side, swingAmt) => {
		ctx.save();
		ctx.translate(side * hip, -30);
		ctx.rotate(swingAmt * .09);
		ctx.fillStyle = skin.m;
		ctx.beginPath();
		ctx.moveTo(-3.6, 0);
		ctx.quadraticCurveTo(-3.8, 5, -2.8, 9);
		ctx.lineTo(3, 9);
		ctx.quadraticCurveTo(3.8, 5, 3.5, 0);
		ctx.closePath();
		ctx.fill();
		if (trousers && cloth) {
			ctx.fillStyle = cloth.m;
			ctx.beginPath();
			ctx.moveTo(-4.2, -2);
			ctx.lineTo(-3.6, 9.2);
			ctx.lineTo(3.6, 9.2);
			ctx.lineTo(4.1, -2);
			ctx.closePath();
			ctx.fill();
			ctx.fillStyle = cloth.l;
			ctx.fillRect(-2.2, 1, 1.4, 6);
		}
		ctx.fillStyle = skin.l;
		ctx.beginPath();
		ctx.ellipse(0, 9.2, 3.1, 2.2, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.translate(0, 9);
		ctx.rotate(-swingAmt * .06);
		ctx.fillStyle = skin.d;
		ctx.beginPath();
		ctx.moveTo(-2.9, 0);
		ctx.lineTo(-2.4, 18);
		ctx.lineTo(2.7, 18);
		ctx.lineTo(3.1, 0);
		ctx.closePath();
		ctx.fill();
		if (trousers && cloth) {
			ctx.fillStyle = cloth.d;
			ctx.beginPath();
			ctx.moveTo(-3.5, -.4);
			ctx.lineTo(-3.1, 17.2);
			ctx.lineTo(3.2, 17.2);
			ctx.lineTo(3.6, -.4);
			ctx.closePath();
			ctx.fill();
			ctx.fillStyle = cloth.h;
			ctx.fillRect(-3.2, 15.4, 6.4, 1.3);
		}
		const footY = 19.2;
		if (boot) {
			ctx.fillStyle = boot.d;
			ctx.beginPath();
			ctx.ellipse(side > 0 ? 1.5 : 1.2, footY, 5.1, 2.5, 0, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = boot.m;
			ctx.fillRect(-2.6, 14.4, 5.2, 4.4);
			ctx.fillStyle = boot.h;
			ctx.fillRect(-2.4, 15.2, 4.8, 1.1);
			ctx.fillStyle = boot.a;
			ctx.fillRect(side > 0 ? 2.2 : .2, 18.8, 3.2, 1.1);
		} else {
			ctx.fillStyle = skin.m;
			ctx.beginPath();
			ctx.ellipse(side > 0 ? 1.6 : 1.3, footY, 4.6, 2.3, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	};
	drawLeg(-1, swing);
	drawLeg(1, -swing);
}
function drawSkirt(ctx, s, pal) {
	const flare = 7.4 + s % 3 * .8;
	const hem = -5;
	ctx.fillStyle = pal.m;
	ctx.beginPath();
	ctx.moveTo(-6.4, -34);
	ctx.lineTo(6.4, -34);
	ctx.lineTo(flare, hem);
	if (s === 14 || s === 18) {
		ctx.lineTo(3.2, -2);
		ctx.lineTo(0, -6);
		ctx.lineTo(-3.4, -1.7999999999999998);
	}
	ctx.lineTo(-flare, hem);
	ctx.closePath();
	ctx.fill();
	ctx.strokeStyle = pal.h;
	ctx.lineWidth = 1;
	ctx.stroke();
	ctx.fillStyle = pal.l;
	if (s % 3 === 0) ctx.fillRect(-1.1, -32, 2.2, 22);
	else if (s % 3 === 1) {
		ctx.beginPath();
		ctx.moveTo(0, -32);
		ctx.lineTo(4.2, -4);
		ctx.lineTo(-4.2, -4);
		ctx.fill();
	} else for (let i = 0; i < 4; i++) ctx.fillRect(-6 + i * 3.2, -28, 1, 16);
	ctx.fillStyle = pal.d;
	ctx.fillRect(-flare, -6.4, flare * 2, 1.5);
}
function drawTorso(ctx, skin, female) {
	ctx.fillStyle = skin.d;
	ctx.beginPath();
	ctx.moveTo(female ? -7 : -8, -32);
	ctx.quadraticCurveTo(0, -24, female ? 7 : 8, -32);
	ctx.lineTo(female ? 5.5 : 6.5, -36);
	ctx.lineTo(female ? -5.5 : -6.5, -36);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = skin.l;
	ctx.beginPath();
	if (female) {
		ctx.moveTo(-5.2, -54);
		ctx.quadraticCurveTo(-8.4, -44, -6.6, -34);
		ctx.lineTo(6.6, -34);
		ctx.quadraticCurveTo(8.4, -44, 5.2, -54);
	} else {
		ctx.moveTo(-8, -54);
		ctx.lineTo(-7, -32);
		ctx.lineTo(7, -32);
		ctx.lineTo(8, -54);
	}
	ctx.closePath();
	ctx.fill();
	ctx.strokeStyle = skin.d;
	ctx.globalAlpha = .35;
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(-5, -51);
	ctx.quadraticCurveTo(0, -47.5, 5, -51);
	ctx.stroke();
	ctx.globalAlpha = 1;
	if (female) {
		ctx.fillStyle = skin.m;
		ctx.beginPath();
		ctx.ellipse(-2.6, -44, 2.8, 2.3, -.15, 0, Math.PI * 2);
		ctx.ellipse(2.6, -44, 2.8, 2.3, .15, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = skin.a;
		ctx.beginPath();
		ctx.ellipse(-2.6, -43.6, .7, .7, 0, 0, Math.PI * 2);
		ctx.ellipse(2.6, -43.6, .7, .7, 0, 0, Math.PI * 2);
		ctx.fill();
	} else {
		ctx.fillStyle = skin.m;
		ctx.fillRect(-6, -48, 12, 4);
	}
	ctx.fillStyle = skin.l;
	ctx.fillRect(-1.8, -58, 3.6, 12);
}
function drawArm(ctx, skin, attack, front, sleeve) {
	ctx.save();
	ctx.fillStyle = skin.l;
	if (front) {
		ctx.translate(ARM_X, ARM_Y);
		ctx.rotate(-.42 - attack * 1.05);
	} else {
		ctx.translate(-6.5, ARM_Y);
		ctx.rotate(.5);
	}
	ctx.beginPath();
	ctx.moveTo(-2.6, 0);
	ctx.quadraticCurveTo(-3, 5, -2.1, 9);
	ctx.lineTo(2.3, 9);
	ctx.quadraticCurveTo(3, 5, 2.6, 0);
	ctx.closePath();
	ctx.fill();
	if (sleeve) {
		ctx.fillStyle = sleeve.d;
		ctx.beginPath();
		ctx.moveTo(-3.5, .2);
		ctx.lineTo(-3.9, 8.4);
		ctx.lineTo(3.7, 8.4);
		ctx.lineTo(3.3, .2);
		ctx.closePath();
		ctx.fill();
		ctx.fillStyle = sleeve.m;
		ctx.fillRect(-3.1, .6, 6.2, 2.2);
		ctx.fillStyle = sleeve.l;
		ctx.fillRect(-3.3, 6.8, 6.6, 1.4);
	}
	ctx.translate(.2, 9);
	ctx.rotate(front ? .35 + attack * .3 : -.25);
	ctx.fillStyle = skin.m;
	ctx.fillRect(-2.1, 0, 4.2, 14);
	ctx.fillStyle = skin.l;
	ctx.beginPath();
	ctx.ellipse(.2, 16.2, 2.2, 2.3, .2, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}
function drawHead(ctx, skin, hair, female, hairId, race) {
	ctx.fillStyle = skin.l;
	ctx.beginPath();
	ctx.ellipse(0, -68, female ? 7.4 : 7.8, female ? 8.4 : 8, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = skin.m;
	ctx.beginPath();
	ctx.ellipse(0, -63.5, 2.2, 1.5, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "#fff6f0";
	ctx.beginPath();
	ctx.ellipse(-2.7, -69.4, 2.3, 1.7, 0, 0, Math.PI * 2);
	ctx.ellipse(2.8, -69.4, 2.3, 1.7, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "#1a1214";
	ctx.beginPath();
	ctx.ellipse(-2.5, -69.2, 1.05, 1.35, 0, 0, Math.PI * 2);
	ctx.ellipse(3.05, -69.2, 1.05, 1.35, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "#fff";
	ctx.fillRect(-2.9, -70, .8, .8);
	ctx.fillRect(2.7, -70, .8, .8);
	if (female) {
		ctx.strokeStyle = "#1a1214";
		ctx.lineWidth = .8;
		ctx.beginPath();
		ctx.moveTo(-4.6, -70.6);
		ctx.quadraticCurveTo(-2.6, -71.6, -.8, -70.2);
		ctx.moveTo(.9, -70.2);
		ctx.quadraticCurveTo(2.8, -71.6, 4.7, -70.6);
		ctx.stroke();
	}
	ctx.fillStyle = skin.a;
	ctx.fillRect(-1.1, -64.4, 2.2, 1.1);
	ctx.strokeStyle = skin.d;
	ctx.globalAlpha = .7;
	ctx.beginPath();
	ctx.moveTo(-1.6, -61.6);
	ctx.quadraticCurveTo(0, -60.6, 1.6, -61.6);
	ctx.stroke();
	ctx.globalAlpha = 1;
	ctx.fillStyle = hair;
	if (!female) {
		ctx.beginPath();
		ctx.ellipse(0, -73, 8.2, 5.2, 0, Math.PI, 0);
		ctx.fill();
		ctx.fillRect(-8, -72, 3, 8);
		ctx.fillRect(5.2, -72, 3, 6);
	} else if (race === "vesper" || hairId === 0) {
		ctx.beginPath();
		ctx.ellipse(0, -74, 9, 6.5, 0, Math.PI, 0);
		ctx.fill();
		ctx.fillRect(-10.5, -70, 5.5, 14);
		ctx.fillRect(6.2, -70, 4.6, 11);
		ctx.fillStyle = shade(hair, 36);
		ctx.fillRect(-9, -74, 4, 6);
	} else if (race === "cinder" || hairId === 1) {
		ctx.beginPath();
		ctx.moveTo(-8, -66);
		ctx.lineTo(-6, -76);
		ctx.lineTo(-1, -68);
		ctx.lineTo(2, -78);
		ctx.lineTo(7, -66);
		ctx.lineTo(8, -66);
		ctx.closePath();
		ctx.fill();
		ctx.fillStyle = "#ffb15e";
		ctx.fillRect(-5, -76, 2, 5);
		ctx.fillRect(2, -78, 2, 6);
	} else if (race === "tide" || hairId === 2) {
		ctx.fillRect(-9, -76, 18, 8);
		ctx.beginPath();
		ctx.moveTo(6, -68);
		ctx.quadraticCurveTo(16, -52, 6, -46);
		ctx.lineTo(4, -46);
		ctx.quadraticCurveTo(12, -54, 4, -66);
		ctx.fill();
		ctx.fillStyle = "#7ec8ea";
		ctx.beginPath();
		ctx.moveTo(-7, -66);
		ctx.lineTo(-15, -64);
		ctx.lineTo(-7, -60);
		ctx.fill();
	} else if (race === "rime" || hairId === 4) {
		ctx.fillRect(-8.5, -78, 17, 10);
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(-4, -86, 2, 10);
		ctx.fillRect(3, -84, 2, 8);
		ctx.fillStyle = hair;
		ctx.fillRect(-9, -70, 4, 12);
		ctx.fillRect(6, -70, 3, 9);
	} else {
		ctx.fillRect(-8.5, -77, 17, 9);
		ctx.fillRect(-11, -70, 4.5, 10);
		ctx.fillRect(6.5, -70, 4.5, 10);
		ctx.fillStyle = "#6a9a52";
		ctx.fillRect(7.5, -58, 3, 12);
		ctx.fillRect(-12, -54, 3, 10);
	}
}
function drawRobes(ctx, race, female) {
	const ink = race === "cinder" ? "#4a2218" : race === "tide" ? "#163044" : race === "thorn" ? "#243018" : race === "rime" ? "#243044" : "#2a1840";
	const trim = race === "cinder" ? "#e07050" : race === "tide" ? "#7ec8ea" : race === "thorn" ? "#6a9a52" : race === "rime" ? "#b9dcff" : "#b4a6ff";
	ctx.fillStyle = ink;
	ctx.beginPath();
	if (female) {
		ctx.moveTo(-6.2, -55);
		ctx.quadraticCurveTo(-8.6, -44, -7.4, -33);
	} else {
		ctx.moveTo(-8.6, -55);
		ctx.lineTo(-7.6, -33);
	}
	ctx.lineTo(-8.6, -5);
	ctx.lineTo(8.6, -5);
	if (female) {
		ctx.lineTo(7.4, -33);
		ctx.quadraticCurveTo(8.6, -44, 6.2, -55);
	} else {
		ctx.lineTo(7.6, -33);
		ctx.lineTo(8.6, -55);
	}
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = trim;
	ctx.fillRect(-6.4, -55, 12.8, 2);
	ctx.fillRect(-1.4, -53, 2.8, 30);
	ctx.globalAlpha = .9;
	ctx.beginPath();
	ctx.arc(0, -40, 2.1, 0, Math.PI * 2);
	ctx.fill();
	ctx.globalAlpha = 1;
	ctx.fillRect(-8.6, -6.4, 17.2, 1.5);
}
function torsoShell(ctx, female, pad) {
	const top = -55 - pad * .2;
	const bot = -32 + pad * .15;
	if (female) {
		ctx.moveTo(-5.6 - pad, top);
		ctx.quadraticCurveTo(-8.8 - pad, -44, -7.2 - pad, bot);
		ctx.lineTo(7.2 + pad, bot);
		ctx.quadraticCurveTo(8.8 + pad, -44, 5.6 + pad, top);
	} else {
		ctx.moveTo(-8.2 - pad, top);
		ctx.lineTo(-7.4 - pad, bot);
		ctx.lineTo(7.4 + pad, bot);
		ctx.lineTo(8.2 + pad, top);
	}
	ctx.closePath();
}
function drawChestArmor(ctx, s, pal, female, fx) {
	ctx.save();
	ctx.beginPath();
	torsoShell(ctx, female, 1.15);
	ctx.fillStyle = pal.d;
	ctx.fill();
	ctx.save();
	ctx.clip();
	ctx.beginPath();
	torsoShell(ctx, female, -1.1);
	ctx.fillStyle = pal.m;
	ctx.fill();
	if (s === 1 || s === 15 || s === 7) {
		ctx.fillStyle = pal.l;
		for (let i = 0; i < 3; i++) ctx.fillRect(-7, -50 + i * 5, 14, 1.7);
	} else if (s === 2 || s === 11 || s === 16) {
		ctx.fillStyle = pal.h;
		ctx.beginPath();
		ctx.arc(0, -44, 4.4, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = pal.a;
		ctx.beginPath();
		ctx.arc(0, -44, 2.2, 0, Math.PI * 2);
		ctx.fill();
	} else if (s === 3 || s === 12 || s === 6) {
		ctx.fillStyle = pal.h;
		ctx.beginPath();
		ctx.moveTo(-7.4, -50);
		ctx.lineTo(-4.2, -42);
		ctx.lineTo(-7.4, -36);
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(7.4, -50);
		ctx.lineTo(4.2, -42);
		ctx.lineTo(7.4, -36);
		ctx.fill();
	} else if (s === 5 || s === 10) {
		ctx.strokeStyle = pal.h;
		ctx.lineWidth = 1;
		for (let i = 0; i < 4; i++) {
			ctx.beginPath();
			ctx.arc(-3.2 + i % 2 * 6.4, -50 + i * 4, 2.4, 0, Math.PI);
			ctx.stroke();
		}
	} else if (s === 9 || s === 13) {
		ctx.fillStyle = pal.l;
		ctx.beginPath();
		ctx.moveTo(-6, -50);
		ctx.quadraticCurveTo(-8.4, -42, -5, -34);
		ctx.lineTo(-3.2, -40);
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(6, -50);
		ctx.quadraticCurveTo(8.4, -42, 5, -34);
		ctx.lineTo(3.2, -40);
		ctx.fill();
	} else if (s === 14 || s === 18) {
		ctx.strokeStyle = pal.h;
		ctx.lineWidth = 1.1;
		ctx.beginPath();
		ctx.moveTo(-5, -51);
		ctx.lineTo(-3, -34);
		ctx.moveTo(5, -51);
		ctx.lineTo(3, -34);
		ctx.moveTo(0, -52);
		ctx.lineTo(-4.5, -40);
		ctx.lineTo(4.5, -40);
		ctx.closePath();
		ctx.stroke();
	} else if (s === 4 || s === 8 || s === 19) {
		ctx.fillStyle = pal.l;
		ctx.fillRect(-7.2, -55, 14.4, 3.2);
		ctx.fillRect(-2.2, -51, 4.4, 14);
	} else {
		ctx.fillStyle = pal.l;
		ctx.beginPath();
		ctx.moveTo(0, -52);
		ctx.lineTo(5.2, -34);
		ctx.lineTo(-5.2, -34);
		ctx.fill();
	}
	mark(ctx, pal, 0, -43, s);
	ctx.fillStyle = pal.a;
	ctx.beginPath();
	ctx.arc(s % 2 ? -2.4 : 2.4, -46, 1.4 + fx % 3 * .25, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
	ctx.strokeStyle = pal.h;
	ctx.lineWidth = 1;
	ctx.beginPath();
	torsoShell(ctx, female, 1.15);
	ctx.stroke();
	ctx.fillStyle = pal.d;
	ctx.beginPath();
	ctx.ellipse(-9.4, -50, 3.6, 2.3, -.35, 0, Math.PI * 2);
	ctx.ellipse(9.4, -50, 3.6, 2.3, .35, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = pal.h;
	ctx.fillRect(-11.6, -51.1, 3.4, 1.15);
	ctx.fillRect(8.2, -51.1, 3.4, 1.15);
	ctx.restore();
}
function drawRelicArmor(ctx, s, pal) {
	ctx.save();
	ctx.strokeStyle = pal.d;
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.moveTo(-2, -50);
	ctx.quadraticCurveTo(-10, -42, -14, -32);
	ctx.stroke();
	ctx.fillStyle = pal.l;
	ctx.translate(-14, -30);
	if (s % 5 === 0) {
		ctx.beginPath();
		ctx.arc(0, 0, 5, 0, Math.PI * 2);
		ctx.fill();
	} else if (s % 5 === 1) {
		ctx.beginPath();
		ctx.moveTo(0, -7);
		ctx.lineTo(5, 4);
		ctx.lineTo(-5, 4);
		ctx.fill();
	} else if (s % 5 === 2) ctx.fillRect(-5, -5, 10, 10);
	else if (s % 5 === 3) {
		ctx.beginPath();
		ctx.moveTo(0, -6);
		ctx.lineTo(6, 0);
		ctx.lineTo(0, 6);
		ctx.lineTo(-6, 0);
		ctx.fill();
	} else for (let i = 0; i < 6; i++) {
		const a = i / 6 * Math.PI * 2;
		ctx.beginPath();
		ctx.arc(Math.cos(a) * 4, Math.sin(a) * 4, 1.6, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.fillStyle = pal.a;
	ctx.beginPath();
	ctx.arc(0, 0, 2, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}
function mark(ctx, pal, x, y, s) {
	ctx.save();
	ctx.translate(x, y);
	ctx.fillStyle = pal.h;
	ctx.strokeStyle = pal.h;
	ctx.lineWidth = 1.1;
	if (s % 6 === 0) ctx.fillRect(-1, -4, 2, 8);
	else if (s % 6 === 1) {
		ctx.beginPath();
		ctx.arc(0, 0, 2.2, 0, Math.PI * 2);
		ctx.stroke();
	} else if (s % 6 === 2) {
		ctx.beginPath();
		ctx.moveTo(0, -3);
		ctx.lineTo(3, 2);
		ctx.lineTo(-3, 2);
		ctx.fill();
	} else if (s % 6 === 3) ctx.fillRect(-4, -1, 8, 2);
	else if (s % 6 === 4) {
		ctx.beginPath();
		ctx.moveTo(-3, 0);
		ctx.lineTo(0, -3);
		ctx.lineTo(3, 0);
		ctx.lineTo(0, 3);
		ctx.stroke();
	} else {
		ctx.fillRect(-3, -3, 2, 2);
		ctx.fillRect(1, 1, 2, 2);
	}
	ctx.restore();
}
function drawHelm(ctx, style, pal) {
	ctx.save();
	ctx.translate(0, -70);
	const s = (style % 20 + 20) % 20;
	ctx.fillStyle = pal.m;
	ctx.strokeStyle = pal.h;
	ctx.lineWidth = 1.1;
	if (s % 5 === 0) {
		ctx.beginPath();
		ctx.moveTo(-6.4, 6);
		ctx.lineTo(0, -10);
		ctx.lineTo(6.4, 6);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	} else if (s % 5 === 1) {
		ctx.beginPath();
		ctx.arc(0, 6, 7.6, Math.PI, 0);
		ctx.fill();
		ctx.stroke();
		ctx.fillStyle = pal.d;
		ctx.fillRect(-6.4, 2, 12.8, 3.2);
	} else if (s % 5 === 2) {
		ctx.fillRect(-7.4, 0, 14.8, 4);
		ctx.fillRect(-8.2, 2, 3.2, 6);
		ctx.fillRect(5, 2, 3.2, 6);
	} else if (s % 5 === 3) {
		ctx.beginPath();
		ctx.moveTo(-6.6, 6);
		ctx.lineTo(-3.2, -4);
		ctx.lineTo(0, 0);
		ctx.lineTo(3.2, -7);
		ctx.lineTo(6.6, 6);
		ctx.closePath();
		ctx.fill();
	} else {
		ctx.strokeRect(-6.2, -2, 12.4, 9);
		ctx.fillStyle = pal.a;
		ctx.fillRect(-5, 0, 10, 2.4);
	}
	mark(ctx, pal, 0, s % 5 === 0 ? -2 : -4, s);
	ctx.restore();
}
function weaponTip(style) {
	const kind = (style % 8 + 8) % 8;
	if (kind === 0) return -17;
	if (kind === 1) return -19;
	if (kind === 2) return -20;
	if (kind === 3) return -24;
	if (kind === 4) return -31;
	if (kind === 5) return -21;
	if (kind === 7) return -19;
	return -23;
}
function drawWeapon(ctx, style, pal, attack, time = 0) {
	ctx.save();
	const kind = (style % 8 + 8) % 8;
	const pulse = .65 + Math.sin(time * 6) * .35;
	ctx.fillStyle = "#4a4038";
	if (kind === 0) {
		ctx.fillRect(-1.2, 0, 2.4, 12);
		ctx.strokeStyle = pal.d;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(-7, -16);
		ctx.lineTo(0, -2);
		ctx.lineTo(7, -16);
		ctx.stroke();
		ctx.strokeStyle = pal.h;
		ctx.beginPath();
		ctx.moveTo(-6, -14);
		ctx.quadraticCurveTo(0, -6 - attack * 4, 6, -14);
		ctx.stroke();
		const spark = (Math.sin(time * 7) + 1) / 2;
		ctx.fillStyle = pal.a;
		ctx.beginPath();
		const sx = -6 + spark * 12;
		ctx.moveTo(sx, -16);
		ctx.lineTo(sx + 2.2, -13);
		ctx.lineTo(sx, -10);
		ctx.lineTo(sx - 2.2, -13);
		ctx.closePath();
		ctx.fill();
	} else if (kind === 1) {
		ctx.fillRect(-2, -2, 4, 16);
		ctx.fillStyle = pal.m;
		ctx.fillRect(-10, -6, 20, 3);
		ctx.fillStyle = pal.l;
		ctx.fillRect(-1, -18 - attack * 4, 2, 12);
		ctx.fillStyle = pal.h;
		ctx.fillRect(-9, -7, 3, 5);
		ctx.fillRect(6, -7, 3, 5);
	} else if (kind === 2) {
		ctx.strokeStyle = pal.m;
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.arc(-2, -8, 12, -1.15, 1.15);
		ctx.stroke();
		ctx.strokeStyle = pal.h;
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(-2, -19);
		ctx.lineTo(-2 + attack * 3, -8);
		ctx.lineTo(-2, 3);
		ctx.stroke();
		ctx.strokeStyle = pal.l;
		ctx.beginPath();
		ctx.moveTo(-2, -16);
		ctx.lineTo(8, -8);
		ctx.stroke();
		ctx.fillStyle = pal.a;
		ctx.beginPath();
		ctx.moveTo(8, -8);
		ctx.lineTo(4, -6);
		ctx.lineTo(4, -10);
		ctx.fill();
	} else if (kind === 3) {
		ctx.fillRect(-1.4, -2, 2.8, 16);
		ctx.fillStyle = pal.l;
		ctx.beginPath();
		ctx.moveTo(-2, -4);
		ctx.quadraticCurveTo(-16, -18, -4, -24);
		ctx.quadraticCurveTo(2, -16, 3, -4);
		ctx.fill();
		ctx.fillStyle = pal.h;
		ctx.globalAlpha = pulse;
		ctx.beginPath();
		ctx.moveTo(-4, -8);
		ctx.lineTo(-12, -16);
		ctx.lineTo(-6, -10);
		ctx.fill();
		ctx.globalAlpha = 1;
	} else if (kind === 4) {
		ctx.fillStyle = pal.d;
		ctx.fillRect(-1.6, -4, 3.2, 18);
		ctx.fillStyle = pal.l;
		ctx.beginPath();
		ctx.moveTo(0, -30 - pulse * 3);
		ctx.lineTo(6.5, -16);
		ctx.lineTo(0, -5);
		ctx.lineTo(-6.5, -16);
		ctx.closePath();
		ctx.fill();
		ctx.fillStyle = pal.h;
		ctx.beginPath();
		ctx.moveTo(0, -24);
		ctx.lineTo(2.1, -16);
		ctx.lineTo(0, -9);
		ctx.lineTo(-2.1, -16);
		ctx.closePath();
		ctx.fill();
		ctx.strokeStyle = pal.a;
		ctx.lineWidth = 1.3;
		for (let i = 0; i < 4; i++) {
			const a = -Math.PI / 2 + (i - 1.5) * .55;
			const len = 7 + Math.sin(time * 8 + i) * 3;
			ctx.beginPath();
			ctx.moveTo(Math.cos(a) * 3, -16 + Math.sin(a) * 3);
			ctx.lineTo(Math.cos(a) * len, -16 + Math.sin(a) * len);
			ctx.stroke();
		}
	} else if (kind === 5) {
		ctx.fillStyle = pal.d;
		ctx.fillRect(-8, -16, 16, 12);
		ctx.fillStyle = pal.l;
		const page = Math.sin(time * 4) * 3;
		ctx.beginPath();
		ctx.moveTo(-7, -15);
		ctx.quadraticCurveTo(0, -20 - page, 7, -15);
		ctx.lineTo(7, -6);
		ctx.lineTo(-7, -6);
		ctx.fill();
		ctx.fillStyle = pal.h;
		ctx.fillRect(-5, -13, 4, 1);
		ctx.fillRect(-5, -10, 6, 1);
		ctx.strokeStyle = pal.a;
		ctx.globalAlpha = .5 + pulse * .5;
		ctx.lineWidth = 1.2;
		ctx.beginPath();
		ctx.moveTo(-2, -20);
		ctx.lineTo(1, -16 - pulse * 3);
		ctx.lineTo(4, -21);
		ctx.stroke();
		ctx.globalAlpha = 1;
	} else if (kind === 7) {
		ctx.strokeStyle = pal.l;
		ctx.lineWidth = 2.2;
		for (let i = -1; i <= 1; i++) {
			ctx.beginPath();
			ctx.moveTo(i * 3, 2);
			ctx.quadraticCurveTo(i * 6, -8, i * 4 + Math.sin(time * 8 + i) * 1.5, -18 - attack * 4);
			ctx.stroke();
		}
		ctx.strokeStyle = pal.d;
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(-4, 3);
		ctx.quadraticCurveTo(0, 6, 4, 3);
		ctx.stroke();
		ctx.fillStyle = pal.a;
		ctx.fillRect(-1.4, 2, 2.8, 3);
	} else {
		ctx.fillRect(-1.3, 0, 2.6, 14);
		ctx.fillStyle = pal.h;
		ctx.fillRect(-2.4, -1, 4.8, 2);
		ctx.fillStyle = pal.l;
		ctx.beginPath();
		ctx.moveTo(0, -22);
		ctx.lineTo(2.6, -2);
		ctx.lineTo(-2.6, -2);
		ctx.closePath();
		ctx.fill();
		ctx.fillStyle = pal.a;
		ctx.globalAlpha = pulse;
		ctx.fillRect(-1, -16, 2, 8);
		ctx.globalAlpha = 1;
	}
	ctx.restore();
}
function drawSetAura(ctx, x, y, fx, t, scale = 1) {
	ctx.save();
	ctx.translate(x, y);
	paintSetAura(ctx, fx, t, scale, fxColor(fx));
	ctx.restore();
}
function fxColor(fx) {
	switch (fx) {
		case "voidring": return "#6a4cff";
		case "solarnova": return "#ffb15e";
		case "tidalsurge": return "#3a7eb8";
		case "briarburst": return "#6ecf6a";
		case "whitestorm": return "#d6ecff";
		case "gravepulse": return "#c4473a";
		case "stormcrown": return "#f2d43a";
		case "lanternwake": return "#fff1a8";
		case "featherfall": return "#e7d9ff";
		case "bloodmoon": return "#ff4d6a";
		default: return "#fff";
	}
}
var SHAPE = [
	{
		body: 0,
		legs: 0,
		wings: 0,
		horns: 0,
		tail: 1,
		eyes: 2,
		crown: 0
	},
	{
		body: 1,
		legs: 2,
		wings: 0,
		horns: 2,
		tail: 1,
		eyes: 2,
		crown: 0
	},
	{
		body: 0,
		legs: 0,
		wings: 0,
		horns: 0,
		tail: 0,
		eyes: 1,
		crown: 0
	},
	{
		body: 2,
		legs: 0,
		wings: 0,
		horns: 0,
		tail: 0,
		eyes: 2,
		crown: 1
	},
	{
		body: 3,
		legs: 0,
		wings: 0,
		horns: 0,
		tail: 0,
		eyes: 2,
		crown: 0
	},
	{
		body: 4,
		legs: 0,
		wings: 0,
		horns: 0,
		tail: 1,
		eyes: 2,
		crown: 0
	},
	{
		body: 5,
		legs: 0,
		wings: 1,
		horns: 0,
		tail: 1,
		eyes: 2,
		crown: 0
	},
	{
		body: 2,
		legs: 2,
		wings: 0,
		horns: 0,
		tail: 0,
		eyes: 1,
		crown: 1
	},
	{
		body: 6,
		legs: 2,
		wings: 0,
		horns: 0,
		tail: 0,
		eyes: 2,
		crown: 0
	},
	{
		body: 1,
		legs: 2,
		wings: 1,
		horns: 1,
		tail: 0,
		eyes: 2,
		crown: 0
	},
	{
		body: 7,
		legs: 0,
		wings: 0,
		horns: 0,
		tail: 2,
		eyes: 2,
		crown: 0
	},
	{
		body: 5,
		legs: 4,
		wings: 0,
		horns: 0,
		tail: 1,
		eyes: 3,
		crown: 0
	},
	{
		body: 1,
		legs: 2,
		wings: 0,
		horns: 0,
		tail: 0,
		eyes: 2,
		crown: 1
	},
	{
		body: 5,
		legs: 4,
		wings: 0,
		horns: 2,
		tail: 1,
		eyes: 2,
		crown: 0
	},
	{
		body: 8,
		legs: 0,
		wings: 2,
		horns: 1,
		tail: 1,
		eyes: 2,
		crown: 0
	},
	{
		body: 0,
		legs: 0,
		wings: 1,
		horns: 0,
		tail: 0,
		eyes: 1,
		crown: 2
	},
	{
		body: 7,
		legs: 0,
		wings: 0,
		horns: 2,
		tail: 1,
		eyes: 4,
		crown: 0
	},
	{
		body: 1,
		legs: 2,
		wings: 0,
		horns: 2,
		tail: 1,
		eyes: 2,
		crown: 0
	},
	{
		body: 2,
		legs: 0,
		wings: 0,
		horns: 0,
		tail: 0,
		eyes: 1,
		crown: 2
	},
	{
		body: 6,
		legs: 4,
		wings: 0,
		horns: 3,
		tail: 0,
		eyes: 5,
		crown: 0
	},
	{
		body: 1,
		legs: 2,
		wings: 1,
		horns: 0,
		tail: 0,
		eyes: 2,
		crown: 1
	},
	{
		body: 6,
		legs: 2,
		wings: 0,
		horns: 1,
		tail: 2,
		eyes: 2,
		crown: 0
	},
	{
		body: 9,
		legs: 2,
		wings: 0,
		horns: 0,
		tail: 0,
		eyes: 2,
		crown: 0
	},
	{
		body: 0,
		legs: 0,
		wings: 2,
		horns: 0,
		tail: 1,
		eyes: 1,
		crown: 0
	},
	{
		body: 1,
		legs: 2,
		wings: 2,
		horns: 2,
		tail: 0,
		eyes: 2,
		crown: 2
	}
];
function drawGhost(ctx, m, pal, sc) {
	const look = m.look ?? {
		body: m.template % 6,
		horns: m.rarity % 3,
		tails: 1 + m.rarity % 3,
		eyes: 2,
		trail: m.template % 6,
		skin: m.type.length % 5,
		aggression: "hunt",
		move: ""
	};
	const t = m.time ?? m.walk;
	const wave = Math.sin(t * 5);
	ctx.save();
	ctx.translate(m.x, m.y);
	ctx.scale((m.facing < 0 ? -1 : 1) * sc, sc);
	ctx.translate(0, Math.sin(t * 3) * (2 + look.body));
	ctx.fillStyle = "rgba(0,0,0,0.28)";
	ctx.beginPath();
	ctx.ellipse(0, 6, 14 + look.tails * 2, 4, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.globalAlpha = m.hurt > 0 ? 1 : .9;
	if (look.skin === 0) {
		ctx.save();
		ctx.globalAlpha = .35;
		ctx.strokeStyle = pal.h;
		for (let i = 0; i < 4; i++) {
			ctx.beginPath();
			ctx.moveTo(-16, -10 - i * 10 + t * 20 % 10);
			ctx.lineTo(16, -14 - i * 10 + t * 20 % 10);
			ctx.stroke();
		}
		ctx.restore();
	}
	ctx.fillStyle = pal.l;
	if (look.body === 1) {
		ctx.beginPath();
		ctx.arc(0, -28, 16 + look.eyes, 0, Math.PI * 2);
		ctx.fill();
	} else if (look.body === 2) {
		ctx.fillRect(-8, -58, 16, 40);
		ctx.beginPath();
		ctx.arc(0, -60, 10, 0, Math.PI * 2);
		ctx.fill();
	} else if (look.body === 3) {
		ctx.beginPath();
		ctx.ellipse(0, -24, 20, 14, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = pal.d;
		ctx.beginPath();
		ctx.ellipse(0, -20, 10, 5 + wave, 0, 0, Math.PI);
		ctx.fill();
		ctx.fillStyle = pal.l;
	} else if (look.body === 4) {
		ctx.beginPath();
		ctx.arc(-8, -30, 10, 0, Math.PI * 2);
		ctx.arc(8, -26, 9, 0, Math.PI * 2);
		ctx.fill();
	} else if (look.body === 5) {
		ctx.strokeStyle = pal.l;
		ctx.lineWidth = 8;
		ctx.beginPath();
		ctx.moveTo(-6, 2);
		ctx.quadraticCurveTo(16, -10, 4, -28);
		ctx.quadraticCurveTo(-14, -40, 0, -52);
		ctx.stroke();
		ctx.fillStyle = pal.l;
		ctx.beginPath();
		ctx.arc(0, -54, 8, 0, Math.PI * 2);
		ctx.fill();
	} else {
		ctx.beginPath();
		ctx.moveTo(-14, -8);
		ctx.quadraticCurveTo(-18, -36, -8, -58);
		ctx.quadraticCurveTo(0, -70, 9, -58);
		ctx.quadraticCurveTo(18, -36, 14, -8);
		for (let i = 0; i < look.tails + 2; i++) {
			const x = -12 + i * (24 / (look.tails + 2));
			ctx.lineTo(x + 4, -2 + wave * 3 * (i % 2 ? 1 : -1));
			ctx.lineTo(x, -12);
		}
		ctx.closePath();
		ctx.fill();
	}
	if (look.skin === 1) {
		ctx.save();
		ctx.globalAlpha = .45;
		ctx.strokeStyle = pal.h;
		ctx.lineWidth = 2;
		for (let i = 0; i < 3; i++) {
			ctx.beginPath();
			ctx.moveTo(-10 + i * 8, -8);
			ctx.quadraticCurveTo(-6 + i * 5, -28 + wave * 5, -2 + i * 3, -50);
			ctx.stroke();
		}
		ctx.restore();
	}
	ctx.fillStyle = pal.d;
	for (let i = 0; i < look.horns; i++) {
		const side = i % 2 === 0 ? -1 : 1;
		ctx.beginPath();
		ctx.moveTo(side * 4, -52);
		ctx.quadraticCurveTo(side * (10 + i * 3), -70 - i * 2, side * (4 + i), -78 - (look.horns > 2 ? 6 : 0));
		ctx.lineTo(side * 2, -50);
		ctx.fill();
	}
	ctx.strokeStyle = pal.a;
	ctx.lineWidth = 2;
	for (let i = 0; i < look.tails; i++) {
		const spread = (i - (look.tails - 1) / 2) * 8;
		ctx.beginPath();
		ctx.moveTo(spread, -8);
		ctx.quadraticCurveTo(spread + 16, 4 + wave * 4, spread + 8, 12 + Math.sin(t * 4 + i) * 4);
		ctx.stroke();
	}
	const eyes = Math.max(1, look.eyes);
	for (let i = 0; i < eyes; i++) {
		const ex = (i - (eyes - 1) / 2) * 6;
		ctx.fillStyle = "#140e0c";
		ctx.beginPath();
		ctx.ellipse(ex, -44, 2.2, 3.1, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = pal.h;
		ctx.fillRect(ex - .6, -45, 1.2, 1.4);
	}
	ctx.save();
	ctx.translate(0, -34);
	const cast = motifOf(m.type, look.trail + m.template);
	paintMotif(ctx, cast.motif, cast.variant, t, m.template * 5 + look.trail, pal, .78 + m.rarity * .06);
	ctx.restore();
	if (look.aggression === "hunt") {
		ctx.globalAlpha = .9;
		ctx.fillStyle = "#ff4d6a";
		ctx.fillRect(-2, -66, 4, 4);
		ctx.globalAlpha = 1;
	}
	ctx.restore();
}
function limb(ctx, x, y0, y1, w, color) {
	ctx.strokeStyle = color;
	ctx.lineWidth = w;
	ctx.lineCap = "round";
	ctx.beginPath();
	ctx.moveTo(x, y0);
	ctx.lineTo(x, y1);
	ctx.stroke();
}
function hoof(ctx, x, y, color) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.ellipse(x, y, 3.2, 1.8, 0, 0, Math.PI * 2);
	ctx.fill();
}
var BEAST_W = {
	hare: 52,
	boar: 76,
	stag: 84,
	wolf: 78,
	crow: 46
};
var beastCache = {};
function beastFrames(id) {
	if (typeof Image === "undefined") return null;
	if (!beastCache[id]) beastCache[id] = [
		0,
		1,
		2,
		3
	].map((i) => {
		const img = new Image();
		img.decoding = "async";
		img.src = `/beasts/${id}-${i}.png`;
		return img;
	});
	const set = beastCache[id];
	if (!set.every((img) => img.complete && img.naturalWidth > 0)) return null;
	return set;
}
function drawBeast(ctx, m) {
	const id = m.species ?? "hare";
	const sc = (m.boss ? 1.35 : 1) * (1 + Math.min(.18, m.rarity * .03));
	const frames = beastFrames(id);
	ctx.save();
	ctx.translate(m.x, m.y);
	ctx.scale((m.facing < 0 ? -1 : 1) * sc, sc);
	ctx.fillStyle = "rgba(20,14,12,0.35)";
	ctx.beginPath();
	ctx.ellipse(0, 2, id === "stag" || id === "boar" ? 18 : 12, 3.4, 0, 0, Math.PI * 2);
	ctx.fill();
	if (frames) {
		const fr = frames[Math.abs(Math.floor(m.walk * 2.4)) % frames.length];
		const dw = BEAST_W[id] ?? 64;
		const dh = dw * (fr.naturalHeight / fr.naturalWidth);
		const foot = 5 / fr.naturalHeight * dh;
		ctx.imageSmoothingEnabled = true;
		ctx.drawImage(fr, -dw * .42, 3 - dh + foot, dw, dh);
	} else {
		const gait = Math.sin(m.walk * 9);
		if (id === "hare") drawHare(ctx, gait);
		else if (id === "boar") drawBoar(ctx, gait);
		else if (id === "stag") drawStag(ctx, gait);
		else if (id === "wolf") drawWolf(ctx, gait);
		else drawCrow(ctx, gait);
	}
	if (m.hurt > 0) {
		ctx.globalAlpha = m.hurt * .4;
		ctx.fillStyle = "#fff";
		ctx.beginPath();
		ctx.ellipse(0, -16, 20, 12, 0, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();
}
function drawHare(ctx, gait) {
	const fur = "#c4a06a";
	const dark = "#8a623c";
	const belly = "#f3e2c4";
	limb(ctx, -8, -12, -1 + gait * 2, 2.4, dark);
	limb(ctx, -2, -11, 0 - gait * 2, 2.2, dark);
	limb(ctx, 8, -12, 0 - gait * 2, 2.2, fur);
	limb(ctx, 13, -11, -1 + gait * 2, 2, fur);
	ctx.fillStyle = fur;
	ctx.beginPath();
	ctx.ellipse(-1, -16, 13, 8, -.15, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = belly;
	ctx.beginPath();
	ctx.ellipse(1, -13, 8, 4.2, -.1, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "#f7f1e6";
	ctx.beginPath();
	ctx.arc(-12, -16, 3.2, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = fur;
	ctx.beginPath();
	ctx.ellipse(12, -20, 7, 6.2, .2, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = dark;
	ctx.beginPath();
	ctx.ellipse(8, -30, 2.1, 8, -.25, 0, Math.PI * 2);
	ctx.ellipse(12, -31, 2.1, 9, .15, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "#e7b4b0";
	ctx.beginPath();
	ctx.ellipse(8.4, -30, .8, 5, -.25, 0, Math.PI * 2);
	ctx.ellipse(11.6, -31, .8, 5.4, .15, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "#1a1210";
	ctx.beginPath();
	ctx.ellipse(15.5, -21, 1.3, 1.6, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "#c46a6a";
	ctx.beginPath();
	ctx.ellipse(18.2, -18.5, 1.3, .9, .2, 0, Math.PI * 2);
	ctx.fill();
}
function drawBoar(ctx, gait) {
	const hide = "#6a4030";
	const dark = "#3e261c";
	limb(ctx, -12, -12, 1 + gait * 1.5, 3.4, dark);
	limb(ctx, -4, -12, 1 - gait * 1.5, 3.4, dark);
	limb(ctx, 8, -12, 1 - gait, 3.2, hide);
	limb(ctx, 15, -11, 1 + gait, 3.2, hide);
	hoof(ctx, -12, 2 + gait * 1.5, "#2a1c14");
	hoof(ctx, 15, 2 + gait, "#2a1c14");
	ctx.fillStyle = hide;
	ctx.beginPath();
	ctx.ellipse(0, -16, 18, 10, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.strokeStyle = dark;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(-10, -24);
	ctx.lineTo(-4, -20);
	ctx.lineTo(2, -25);
	ctx.lineTo(8, -20);
	ctx.lineTo(14, -24);
	ctx.stroke();
	ctx.fillStyle = "#8a5840";
	ctx.beginPath();
	ctx.ellipse(16, -15, 9, 7, .15, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "#c4a070";
	ctx.beginPath();
	ctx.ellipse(24, -13, 4.2, 3.2, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.strokeStyle = "#f0e2c4";
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.moveTo(18, -12);
	ctx.quadraticCurveTo(24, -6, 22, -10);
	ctx.moveTo(16, -11);
	ctx.quadraticCurveTo(21, -4, 19, -9);
	ctx.stroke();
	ctx.fillStyle = "#1a1210";
	ctx.beginPath();
	ctx.ellipse(20, -17, 1.2, 1.4, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.strokeStyle = dark;
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.arc(-16, -14, 3.5, .4, 5);
	ctx.stroke();
}
function drawStag(ctx, gait) {
	const hide = "#8d5a32";
	const dark = "#5c3a22";
	limb(ctx, -10, -20, 1 + gait * 3, 2.2, dark);
	limb(ctx, -3, -20, 1 - gait * 3, 2.2, dark);
	limb(ctx, 8, -20, 1 - gait * 3, 2.1, hide);
	limb(ctx, 14, -19, 1 + gait * 3, 2.1, hide);
	hoof(ctx, -10, 2 + gait * 3, "#2a1c14");
	hoof(ctx, 14, 2 + gait * 3, "#2a1c14");
	ctx.fillStyle = hide;
	ctx.beginPath();
	ctx.ellipse(-1, -24, 16, 7, -.05, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "#f4efe4";
	ctx.beginPath();
	ctx.ellipse(-14, -22, 2.4, 2, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.strokeStyle = hide;
	ctx.lineWidth = 5;
	ctx.beginPath();
	ctx.moveTo(10, -26);
	ctx.quadraticCurveTo(16, -30, 18, -38);
	ctx.stroke();
	ctx.fillStyle = hide;
	ctx.beginPath();
	ctx.ellipse(20, -40, 5.5, 4.2, .3, 0, Math.PI * 2);
	ctx.fill();
	ctx.strokeStyle = "#d8c4a4";
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.moveTo(18, -43);
	ctx.lineTo(14, -52);
	ctx.moveTo(16, -48);
	ctx.lineTo(12, -50);
	ctx.moveTo(20, -44);
	ctx.lineTo(24, -54);
	ctx.moveTo(22, -49);
	ctx.lineTo(26, -51);
	ctx.stroke();
	ctx.fillStyle = "#1a1210";
	ctx.beginPath();
	ctx.ellipse(22.5, -40.5, 1.1, 1.3, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "#1a1210";
	ctx.beginPath();
	ctx.ellipse(24.5, -38.5, 1.1, .8, 0, 0, Math.PI * 2);
	ctx.fill();
}
function drawWolf(ctx, gait) {
	const fur = "#7a7e86";
	const dark = "#3e424a";
	limb(ctx, -10, -16, 1 + gait * 2.4, 2.6, dark);
	limb(ctx, -3, -16, 1 - gait * 2.4, 2.6, dark);
	limb(ctx, 8, -15, 1 - gait * 2.4, 2.4, fur);
	limb(ctx, 14, -14, 1 + gait * 2.4, 2.4, fur);
	ctx.fillStyle = fur;
	ctx.beginPath();
	ctx.ellipse(-1, -20, 16, 8, -.08, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "#c8ccd2";
	ctx.beginPath();
	ctx.ellipse(2, -16, 8, 3.4, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.strokeStyle = dark;
	ctx.lineWidth = 4;
	ctx.beginPath();
	ctx.moveTo(-14, -18);
	ctx.quadraticCurveTo(-26, -28 + gait * 2, -22, -12);
	ctx.stroke();
	ctx.fillStyle = fur;
	ctx.beginPath();
	ctx.ellipse(16, -26, 7, 5.5, .35, 0, Math.PI * 2);
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(18, -24);
	ctx.lineTo(28, -22);
	ctx.lineTo(18, -20);
	ctx.fill();
	ctx.fillStyle = dark;
	ctx.beginPath();
	ctx.moveTo(12, -30);
	ctx.lineTo(14, -36);
	ctx.lineTo(17, -29);
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(16, -30);
	ctx.lineTo(19, -37);
	ctx.lineTo(21, -28);
	ctx.fill();
	ctx.fillStyle = "#1a1210";
	ctx.beginPath();
	ctx.ellipse(19, -27, 1.15, 1.3, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "#1a1210";
	ctx.beginPath();
	ctx.ellipse(26.5, -21.6, 1.1, .8, 0, 0, Math.PI * 2);
	ctx.fill();
}
function drawCrow(ctx, gait) {
	const ink = "#1c1a22";
	const sheen = "#3a3a48";
	limb(ctx, 2, -8, 1, 1.4, ink);
	limb(ctx, 7, -8, 1, 1.4, ink);
	ctx.strokeStyle = ink;
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.moveTo(1, 1);
	ctx.lineTo(-1, 3);
	ctx.moveTo(8, 1);
	ctx.lineTo(10, 3);
	ctx.stroke();
	ctx.fillStyle = ink;
	ctx.beginPath();
	ctx.ellipse(0, -16, 12, 7, -.2, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = sheen;
	ctx.beginPath();
	ctx.ellipse(-2, -18, 7, 3.2, -.4, 0, Math.PI * 2);
	ctx.fill();
	const flap = gait * 6;
	ctx.fillStyle = ink;
	ctx.beginPath();
	ctx.moveTo(-2, -16);
	ctx.quadraticCurveTo(-16, -24 - flap, -8, -10);
	ctx.quadraticCurveTo(-10, -14, 2, -12);
	ctx.fill();
	ctx.fillStyle = ink;
	ctx.beginPath();
	ctx.moveTo(-10, -14);
	ctx.lineTo(-20, -12 + gait);
	ctx.lineTo(-16, -8);
	ctx.lineTo(-8, -10);
	ctx.fill();
	ctx.beginPath();
	ctx.arc(10, -20, 5.2, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "#e6c15a";
	ctx.beginPath();
	ctx.moveTo(14, -20);
	ctx.lineTo(22, -18.5);
	ctx.lineTo(14, -17);
	ctx.fill();
	ctx.fillStyle = "#f2d43a";
	ctx.beginPath();
	ctx.arc(12.2, -21.2, 1.1, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "#140e0c";
	ctx.beginPath();
	ctx.arc(12.4, -21.2, .45, 0, Math.PI * 2);
	ctx.fill();
}
function drawMonster(ctx, m) {
	if (m.animal) {
		drawBeast(ctx, m);
		return;
	}
	const pal = typePal(m.type);
	const sc = (m.boss ? 1.85 : 1.2) * (1 + m.rarity * .06);
	if (m.ghost || m.look || m.type === "spirit" || m.template === 16 || m.template === 23) {
		drawGhost(ctx, m, pal, sc);
		return;
	}
	const sh = SHAPE[m.template % SHAPE.length];
	ctx.save();
	ctx.translate(m.x, m.y);
	ctx.scale((m.facing < 0 ? -1 : 1) * sc, sc);
	const bob = Math.sin(m.walk * 6) * 2;
	ctx.translate(0, bob);
	ctx.fillStyle = "rgba(0,0,0,0.35)";
	ctx.beginPath();
	ctx.ellipse(0, 3, 14, 4.5, 0, 0, Math.PI * 2);
	ctx.fill();
	if (sh.wings) {
		ctx.fillStyle = pal.d;
		ctx.globalAlpha = .88;
		const flap = Math.sin(m.walk * 7) * 3;
		ctx.beginPath();
		ctx.ellipse(-16, -24 + flap, 14, 7, -.7, 0, Math.PI * 2);
		ctx.ellipse(16, -24 - flap, 14, 7, .7, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = pal.l;
		ctx.globalAlpha = .45;
		ctx.beginPath();
		ctx.ellipse(-16, -24 + flap, 7, 3, -.7, 0, Math.PI * 2);
		ctx.ellipse(16, -24 - flap, 7, 3, .7, 0, Math.PI * 2);
		ctx.fill();
		ctx.globalAlpha = 1;
	}
	if (sh.tail) {
		ctx.strokeStyle = pal.m;
		ctx.lineWidth = 3 + sh.tail;
		ctx.beginPath();
		ctx.moveTo(-8, -10);
		ctx.quadraticCurveTo(-20, -6 - sh.tail * 4, -22, 2 + Math.sin(m.walk * 6) * 3);
		ctx.stroke();
		ctx.fillStyle = pal.a;
		ctx.beginPath();
		ctx.arc(-22, 2, 2.4, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.fillStyle = pal.m;
	const lift = sh.legs ? 0 : -8;
	if (sh.body === 0) {
		ctx.beginPath();
		ctx.ellipse(0, -18 + lift, 12, 13, 0, 0, Math.PI * 2);
		ctx.fill();
	} else if (sh.body === 1 || sh.body === 9) {
		ctx.fillRect(-8, -30, 16, 20);
		ctx.beginPath();
		ctx.arc(0, -34, 8, 0, Math.PI * 2);
		ctx.fill();
	} else if (sh.body === 2) {
		ctx.fillRect(-9, -30, 18, 20);
		ctx.fillStyle = pal.d;
		ctx.fillRect(-9, -30, 18, 4);
		ctx.fillStyle = pal.m;
	} else if (sh.body === 3) {
		ctx.beginPath();
		ctx.moveTo(0, -36);
		ctx.quadraticCurveTo(12, -12, 0, -4);
		ctx.quadraticCurveTo(-12, -12, 0, -36);
		ctx.fill();
	} else if (sh.body === 4) {
		ctx.beginPath();
		ctx.moveTo(-14, -8);
		ctx.quadraticCurveTo(0, -32, 16, -6);
		ctx.quadraticCurveTo(0, -2, -14, -8);
		ctx.fill();
	} else if (sh.body === 5) {
		ctx.beginPath();
		ctx.ellipse(0, -16, 16, 10, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.beginPath();
		ctx.ellipse(10, -18, 6, 4, .4, 0, Math.PI * 2);
		ctx.fill();
	} else if (sh.body === 6) {
		ctx.fillRect(-12, -26, 24, 18);
		ctx.fillStyle = pal.l;
		ctx.fillRect(-8, -22, 16, 3);
		ctx.fillStyle = pal.m;
	} else if (sh.body === 7) {
		ctx.beginPath();
		ctx.moveTo(0, -38);
		ctx.lineTo(10, -8);
		ctx.lineTo(-10, -8);
		ctx.closePath();
		ctx.fill();
	} else if (sh.body === 8) {
		ctx.beginPath();
		ctx.moveTo(10, -8);
		ctx.quadraticCurveTo(0, -16, -16, -28);
		ctx.quadraticCurveTo(-8, -14, -4, -8);
		ctx.fill();
	}
	if (sh.body === 9) {
		ctx.strokeStyle = pal.h;
		ctx.lineWidth = 1.4;
		ctx.strokeRect(-7, -28, 14, 16);
	}
	ctx.fillStyle = pal.l;
	ctx.globalAlpha = .35;
	ctx.beginPath();
	ctx.ellipse(-3, -20 + lift, 3, 5, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.globalAlpha = 1;
	ctx.fillStyle = pal.d;
	for (let i = 0; i < sh.legs; i++) {
		const lx = -9 + i % 4 * 6;
		const step = Math.sin(m.walk * 8 + i) * 2;
		ctx.fillRect(lx, -10, 3.2, 12 + step);
		ctx.fillStyle = pal.m;
		ctx.fillRect(lx - 1, 1 + step, 5, 2);
		ctx.fillStyle = pal.d;
	}
	ctx.fillStyle = pal.l;
	for (let i = 0; i < sh.horns; i++) {
		ctx.beginPath();
		ctx.moveTo(-5 + i * 6, -36);
		ctx.quadraticCurveTo(-8 + i * 7, -48, -2 + i * 5, -52 - i * 2);
		ctx.lineTo(-1 + i * 6, -34);
		ctx.fill();
	}
	if (sh.crown) {
		ctx.fillStyle = pal.h;
		ctx.fillRect(-7, -46, 14, 3);
		ctx.fillRect(-6, -52, 2.4, 7);
		ctx.fillRect(-1, -56, 2.4, 11);
		ctx.fillRect(4, -50, 2.4, 5);
		if (sh.crown > 1) {
			ctx.fillStyle = pal.a;
			ctx.beginPath();
			ctx.arc(0, -58, 2.2, 0, Math.PI * 2);
			ctx.fill();
		}
	}
	const headY = sh.body === 0 ? -24 + lift : sh.body === 1 || sh.body === 9 ? -36 : sh.body === 7 ? -30 : sh.body === 4 ? -16 : sh.body === 3 ? -28 : -22;
	ctx.fillStyle = m.hurt > 0 ? "#fff" : "#140e0c";
	const eyes = Math.max(1, Math.min(4, sh.eyes));
	for (let i = 0; i < eyes; i++) {
		const col = i % 2;
		const row = Math.floor(i / 2);
		ctx.beginPath();
		ctx.ellipse(-4 + col * 8, headY - row * 4, 1.7, 2.1, 0, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.fillStyle = pal.a;
	ctx.fillRect(-1.2, headY + 6, 2.4, 2);
	ctx.restore();
}
function drawShadowName(ctx, text, x, y, color) {
	ctx.font = "16px VT323, monospace";
	ctx.textAlign = "center";
	ctx.fillStyle = "#140e0c";
	ctx.fillText(text, x + 1, y + 1);
	ctx.fillStyle = color;
	ctx.fillText(text, x, y);
}
var GEAR_TYPES = [
	"fire",
	"water",
	"earth",
	"ice",
	"light",
	"void",
	"electric",
	"air"
];
/** Contact sheet used to check that each worn piece sits on its body region. */
function paintGearCatalog(ctx, w, h) {
	ctx.fillStyle = "#140e0c";
	ctx.fillRect(0, 0, w, h);
	const slots = [
		"head",
		"chest",
		"legs",
		"feet",
		"relic",
		"weapon"
	];
	const cols = 4;
	const cellW = w / cols;
	const cellH = h / (slots.length + 1);
	ctx.font = "14px VT323, monospace";
	ctx.textAlign = "left";
	slots.forEach((slot, row) => {
		for (let col = 0; col < cols; col++) {
			const style = col * 5 + row;
			ctx.save();
			ctx.translate(col * cellW + cellW * .5, row * cellH + cellH * .86);
			ctx.scale(1.15, 1.15);
			drawActor(ctx, {
				x: 0,
				y: 0,
				race: "vesper",
				female: true,
				hair: 0,
				skin: 1,
				facing: 1,
				walk: .15,
				attack: slot === "weapon" ? .35 : 0,
				hurt: 0,
				pieces: [{
					slot,
					style,
					type: GEAR_TYPES[(col + row) % GEAR_TYPES.length],
					fxSeed: style * 3 + 2,
					quality: 4
				}],
				setFx: null,
				setOn: false,
				time: .8 + col * .4
			});
			ctx.restore();
			ctx.fillStyle = "#e6c15a";
			ctx.fillText(`${slot} ${style}`, col * cellW + 8, row * cellH + 16);
		}
	});
	for (let col = 0; col < cols; col++) {
		const row = slots.length;
		ctx.save();
		ctx.translate(col * cellW + cellW * .5, row * cellH + cellH * .86);
		ctx.scale(1.15, 1.15);
		drawActor(ctx, {
			x: 0,
			y: 0,
			race: "cinder",
			female: true,
			hair: 1,
			skin: 2,
			facing: 1,
			walk: .2,
			attack: .2,
			hurt: 0,
			pieces: slots.map((slot, i) => ({
				slot,
				style: col * 3 + i * 2,
				type: GEAR_TYPES[(col + i) % GEAR_TYPES.length],
				fxSeed: 4 + i * 5 + col,
				quality: 4
			})),
			setFx: null,
			setOn: false,
			time: 1.4
		});
		ctx.restore();
		ctx.fillStyle = "#fff6e8";
		ctx.fillText(`full kit ${col + 1}`, col * cellW + 8, row * cellH + 16);
	}
}
if (typeof window !== "undefined") {
	const hook = window;
	hook.__paintGear = paintGearCatalog;
	hook.__paintFit = (ctx, w, h) => {
		ctx.fillStyle = "#140e0c";
		ctx.fillRect(0, 0, w, h);
		for (let col = 0; col < 3; col++) {
			ctx.save();
			ctx.translate((col + .5) * (w / 3), h * .86);
			ctx.scale(2.4, 2.4);
			drawActor(ctx, {
				x: 0,
				y: 0,
				race: col === 1 ? "cinder" : "vesper",
				female: true,
				hair: col,
				skin: col,
				facing: 1,
				walk: .2,
				attack: .15,
				hurt: 0,
				pieces: [
					"head",
					"chest",
					"legs",
					"feet",
					"relic",
					"weapon"
				].map((slot, i) => ({
					slot,
					style: col * 4 + i * 3,
					type: GEAR_TYPES[(col * 2 + i) % GEAR_TYPES.length],
					fxSeed: 9 + i * 4 + col * 7,
					quality: 5
				})),
				setFx: null,
				setOn: false,
				time: 1.1 + col
			});
			ctx.restore();
		}
	};
}
var TILE = 32;
var NAMES = [
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
	"Cressida Ash"
];
var QUALITY = [
	"worn",
	"common",
	"fine",
	"rare",
	"epic",
	"legendary"
];
function readArena(raw) {
	if (!raw || typeof raw !== "object") return null;
	const s = raw;
	if (s.v !== 1 || !Array.isArray(s.roster) || s.roster.length < 6) return null;
	if (typeof s.points !== "number" || s.points <= 0) return null;
	if (!Array.isArray(s.party)) return null;
	return s;
}
function ench(gear, id) {
	let n = 0;
	for (const g of gear) for (const e of g.enchants) if (e.id === id) n += e.power;
	return n;
}
function powerOf(w) {
	const gear = gearScore(w.weapon) + w.gear.reduce((s, g) => s + gearScore(g), 0);
	const moves = w.moves.reduce((s, id) => s + (MOVE_BY_ID[id]?.power ?? 0), 0);
	return Math.round(w.level * 16 + w.talent * 40 + gear * .22 + moves + (w.role === "summoner" ? 24 : 0));
}
function cardOf(w, marked) {
	const enchants = [w.weapon, ...w.gear].flatMap((g) => g.enchants).slice(0, 4).map((e) => `${ENCHANT_BY_ID[e.id]?.name ?? e.id} ${e.power}`);
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
		marked
	};
}
function rollMoves(rng, type, strong) {
	const pool = MOVES.filter((m) => m.power > 0 || m.effect === "mend" || m.effect === "shell");
	const biased = pool.filter((m) => m.type === type || m.type === "normal");
	const source = biased.length > 4 ? biased : pool;
	const count = strong ? 3 + irand(rng, 3) : 2 + irand(rng, 2);
	const out = [];
	const bag = [...strong && rng() < .55 ? source : pool];
	for (let i = 0; i < count && bag.length; i++) {
		const idx = irand(rng, bag.length);
		const m = bag.splice(idx, 1)[0];
		if (!out.includes(m.id)) out.push(m.id);
	}
	if (!out.length) out.push("measured");
	return out;
}
function rollWitch(rng, forcedLevel) {
	const fortune = rng();
	const level = forcedLevel ?? (fortune < .18 ? 1 + irand(rng, 8) : fortune > .84 ? 22 + irand(rng, 18) : 4 + irand(rng, 20));
	const talent = fortune < .14 ? .48 + rng() * .22 : fortune > .9 ? 1.35 + rng() * .55 : .72 + rng() * .55;
	const race = pick(rng, RACES);
	const role = rng() < .22 ? "summoner" : "witch";
	const strong = talent > 1.15 || level >= 24;
	const weak = talent < .7 || level <= 4;
	const luck = weak ? irand(rng, 8) : strong ? 28 + irand(rng, 50) : 8 + irand(rng, 28);
	const floor = strong && rng() < .35 ? rng() < .18 ? "legendary" : "epic" : weak ? "worn" : null;
	const gearLevel = Math.max(1, Math.round(level * (weak ? .45 + rng() * .3 : strong ? .9 + rng() * .45 : .6 + rng() * .5)));
	const weapon = rollGear(rng, {
		level: gearLevel,
		slot: "weapon",
		luck,
		floor,
		raceBias: race.id,
		typeBias: rng() < .7 ? race.type : null
	});
	const gear = (weak ? ["chest"] : [
		"head",
		"chest",
		"legs",
		"feet",
		"relic"
	]).map((slot) => rollGear(rng, {
		level: Math.max(1, gearLevel - irand(rng, 3)),
		slot,
		luck: Math.max(0, luck - 6),
		floor: weak ? "worn" : floor && rng() < .4 ? floor : null,
		raceBias: race.id,
		typeBias: rng() < .45 ? race.type : null
	}));
	const moves = rollMoves(rng, race.type, strong);
	for (const id of weapon.moves ?? []) if (!moves.includes(id) && moves.length < 6) moves.push(id);
	if (role === "summoner" && !moves.some((id) => MOVE_BY_ID[id]?.effect === "mend" || MOVE_BY_ID[id]?.effect === "shell")) moves.push(rng() < .5 ? "tidemend" : "aegis");
	const spirits = [];
	if (role === "summoner") {
		const pool = MONSTERS.filter((m) => m.type === "spirit" || m.type === "void" || m.template === 23 || m.template === 16);
		for (let i = 0; i < 3; i++) {
			const spec = pick(rng, pool);
			const bag = MOVES.filter((m) => m.type === spec.type && m.power > 0 && m.power < 56);
			const move = (bag.length ? pick(rng, bag) : MOVES[0]).id;
			spirits.push({
				name: spec.name,
				type: spec.type,
				template: spec.template,
				move,
				look: rollGhostLook(rng, 1, move, "hunt")
			});
		}
	}
	const used = /* @__PURE__ */ new Set();
	let name = pick(rng, NAMES);
	for (let i = 0; i < 6 && used.has(name); i++) name = pick(rng, NAMES);
	if (rng() < .08) name = `${name} II`;
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
		speed: Math.floor((role === "summoner" ? 62 : 74) + level * .35 + (strong ? 8 : 0)),
		moves,
		weapon,
		gear,
		spirits,
		hair: race.hair,
		skin: irand(rng, 5)
	};
}
var Heap = class {
	a = [];
	push(i, c) {
		const a = this.a;
		a.push({
			i,
			c
		});
		let n = a.length - 1;
		while (n > 0) {
			const p = n - 1 >> 1;
			if (a[p].c <= a[n].c) break;
			const tmp = a[p];
			a[p] = a[n];
			a[n] = tmp;
			n = p;
		}
	}
	pop() {
		const a = this.a;
		if (!a.length) return null;
		const top = a[0];
		const last = a.pop();
		if (a.length && last) {
			a[0] = last;
			let n = 0;
			for (;;) {
				const l = n * 2 + 1;
				const r = l + 1;
				let m = n;
				if (l < a.length && a[l].c < a[m].c) m = l;
				if (r < a.length && a[r].c < a[m].c) m = r;
				if (m === n) break;
				const tmp = a[m];
				a[m] = a[n];
				a[n] = tmp;
				n = m;
			}
		}
		return top;
	}
};
function buildMap(rng) {
	const w = 42;
	const h = 28;
	for (let attempt = 0; attempt < 10; attempt++) {
		const grid = /* @__PURE__ */ new Uint8Array(1176);
		const at = (x, y) => y * w + x;
		for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (x === 0 || y === 0 || x === 41 || y === 27) grid[at(x, y)] = 1;
		const clusters = 9 + irand(rng, 7);
		for (let i = 0; i < clusters; i++) {
			const x = 6 + irand(rng, 30);
			const y = 3 + irand(rng, 22);
			grid[at(x, y)] = 1;
			if (rng() < .55 && x + 1 < 41) grid[at(x + 1, y)] = 1;
			if (rng() < .4 && y + 1 < 27) grid[at(x, y + 1)] = 1;
			if (rng() < .25 && x + 1 < 41 && y + 1 < 27) grid[at(x + 1, y + 1)] = 1;
		}
		for (let i = 0; i < 12 + irand(rng, 8); i++) {
			const x = 3 + irand(rng, 36);
			const y = 2 + irand(rng, 24);
			if (grid[at(x, y)] === 0) grid[at(x, y)] = 2;
		}
		for (let i = 0; i < 7 + irand(rng, 6); i++) {
			const x = 3 + irand(rng, 36);
			const y = 2 + irand(rng, 24);
			if (grid[at(x, y)] === 0) grid[at(x, y)] = 3;
		}
		for (const y of [
			4,
			8,
			12,
			16,
			20,
			23
		]) for (const x of [
			2,
			3,
			39,
			38
		]) for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
			const xx = x + dx;
			const yy = y + dy;
			if (xx > 0 && yy > 0 && xx < 41 && yy < 27) grid[at(xx, yy)] = 0;
		}
		if (reachable(grid, w, h, 2, 4, 39, 4)) return {
			grid,
			w,
			h
		};
	}
	const grid = /* @__PURE__ */ new Uint8Array(1176);
	for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (x === 0 || y === 0 || x === 41 || y === 27) grid[y * w + x] = 1;
	return {
		grid,
		w,
		h
	};
}
function reachable(grid, w, h, x0, y0, x1, y1) {
	const q = [y0 * w + x0];
	const seen = new Uint8Array(w * h);
	seen[q[0]] = 1;
	let qi = 0;
	const goal = y1 * w + x1;
	while (qi < q.length) {
		const cur = q[qi++];
		if (cur === goal) return true;
		const x = cur % w;
		const y = cur / w | 0;
		for (const [dx, dy] of [
			[1, 0],
			[-1, 0],
			[0, 1],
			[0, -1]
		]) {
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
function route(grid, w, h, sx, sy, gx, gy, fear) {
	sx = Math.max(1, Math.min(w - 2, sx));
	sy = Math.max(1, Math.min(h - 2, sy));
	gx = Math.max(1, Math.min(w - 2, gx));
	gy = Math.max(1, Math.min(h - 2, gy));
	if (grid[gy * w + gx] === 1) {
		let found = false;
		for (let r = 1; r <= 4 && !found; r++) for (let dy = -r; dy <= r && !found; dy++) for (let dx = -r; dx <= r; dx++) {
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
		[0, -1]
	];
	let guard = 0;
	while (guard++ < w * h * 4) {
		const cur = heap.pop();
		if (!cur) break;
		if (cur.c > dist[cur.i] + .01) continue;
		if (cur.i === goal) break;
		const x = cur.i % w;
		const y = cur.i / w | 0;
		for (const [dx, dy] of dirs) {
			const nx = x + dx;
			const ny = y + dy;
			if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
			const k = ny * w + nx;
			if (grid[k] === 1) continue;
			const step = grid[k] === 2 ? fear ? 7 : 2.2 : grid[k] === 3 ? 2.4 : 1;
			const next = dist[cur.i] + step;
			if (next + .01 < dist[k]) {
				dist[k] = next;
				prev[k] = cur.i;
				heap.push(k, next);
			}
		}
	}
	if (prev[goal] === -1 && goal !== start) return [];
	const raw = [];
	let c = goal;
	let safety = 0;
	while (c !== -1 && safety++ < 800) {
		raw.push({
			x: c % w * TILE + TILE / 2,
			y: (c / w | 0) * TILE + TILE / 2
		});
		if (c === start) break;
		c = prev[c] ?? -1;
	}
	raw.reverse();
	if (raw.length <= 2) return raw;
	const open = (x, y) => {
		const tx = Math.floor(x / TILE);
		const ty = Math.floor(y / TILE);
		if (tx < 0 || ty < 0 || tx >= w || ty >= h) return false;
		return grid[ty * w + tx] !== 1;
	};
	const sees = (a, b) => {
		const steps = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 12));
		for (let s = 1; s < steps; s++) {
			const t = s / steps;
			if (!open(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t)) return false;
		}
		return true;
	};
	const slim = [];
	let i = 0;
	while (i < raw.length - 1) {
		let j = Math.min(raw.length - 1, i + 14);
		while (j > i + 1 && !sees(raw[i], raw[j])) j--;
		slim.push(raw[j]);
		i = j;
	}
	return slim;
}
function los(grid, w, h, x0, y0, x1, y1) {
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
var WitchArena = class {
	canvas;
	ctx;
	save = null;
	phase = "roster";
	note = "Six free witches. Mark a coven. The circle does not wait.";
	speed = 1;
	last = null;
	fighters = [];
	grid = /* @__PURE__ */ new Uint8Array(0);
	gw = 42;
	gh = 28;
	camX = 600;
	camY = 400;
	zoom = .8;
	wantX = 600;
	wantY = 400;
	wantZ = .8;
	floats = [];
	beams = [];
	gained = 0;
	age = 0;
	clock = 0;
	onCloud = () => {};
	running = false;
	raf = 0;
	lastT = 0;
	viewW = 800;
	viewH = 600;
	dpr = 1;
	listeners = /* @__PURE__ */ new Set();
	snap = {
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
		last: null
	};
	constructor(canvas) {
		this.canvas = canvas;
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("canvas");
		this.ctx = ctx;
	}
	subscribe(fn) {
		this.listeners.add(fn);
		fn();
		return () => this.listeners.delete(fn);
	}
	getSnap() {
		return this.snap;
	}
	start(seed) {
		const saved = readArena(seed);
		if (saved) {
			this.save = saved;
			this.phase = "roster";
			this.note = `${saved.points} marks left. Draw with a token, or send the six.`;
		} else this.fresh();
		this.running = true;
		this.lastT = performance.now();
		const loop = (t) => {
			if (!this.running) return;
			const dt = Math.min(.05, (t - this.lastT) / 1e3);
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
	stop() {
		this.running = false;
		cancelAnimationFrame(this.raf);
	}
	resize() {
		const r = this.canvas.getBoundingClientRect();
		this.dpr = Math.min(2, window.devicePixelRatio || 1);
		this.viewW = Math.max(1, r.width);
		this.viewH = Math.max(1, r.height);
		this.canvas.width = Math.max(1, Math.floor(this.viewW * this.dpr));
		this.canvas.height = Math.max(1, Math.floor(this.viewH * this.dpr));
	}
	fresh() {
		const rng = mulberry32((Date.now() ^ (Math.random() * 1e9 | 0)) >>> 0 || 1);
		const roster = [
			0,
			1,
			2,
			3,
			4,
			5
		].map(() => rollWitch(rng));
		this.save = {
			v: 1,
			points: 3,
			tokens: 0,
			wins: 0,
			losses: 0,
			roster,
			party: roster.map((w) => w.uid)
		};
		this.phase = "roster";
		this.last = null;
		this.note = "The circle gives you six. They may be saints or scraps. Send them.";
		this.persist();
	}
	summon() {
		const save = this.save;
		if (!save || this.phase !== "roster" || save.tokens < 1) return;
		save.tokens -= 1;
		const witch = rollWitch(mulberry32((Date.now() ^ (Math.random() * 1e9 | 0)) >>> 0 || 3));
		save.roster.push(witch);
		this.note = `${witch.name} answers. Lv ${witch.level} ${witch.role}. Power ${powerOf(witch)}.`;
		this.persist();
	}
	toggle(uid) {
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
	setSpeed(n) {
		this.speed = n === 2 ? 2 : 1;
		this.publish();
	}
	fight() {
		const save = this.save;
		if (!save || this.phase === "fight" || save.points <= 0) return;
		const yours = save.party.map((id) => save.roster.find((w) => w.uid === id)).filter((w) => !!w);
		if (yours.length !== 6) {
			this.note = "Mark exactly six.";
			this.publish();
			return;
		}
		const rng = mulberry32((Date.now() ^ (Math.random() * 1e9 | 0)) >>> 0 || 9);
		const avg = yours.reduce((s, w) => s + w.level, 0) / yours.length;
		const foes = [
			0,
			1,
			2,
			3,
			4,
			5
		].map(() => rollWitch(rng, Math.max(1, Math.round(avg + (rng() * 15 - 6)))));
		const map = buildMap(rng);
		this.grid = map.grid;
		this.gw = map.w;
		this.gh = map.h;
		this.fighters = [];
		this.floats = [];
		this.beams = [];
		this.gained = 0;
		this.age = 0;
		const ys = [
			4,
			8,
			12,
			16,
			20,
			23
		];
		yours.forEach((w, i) => this.spawnWitch(w, 0, 2 + i % 2, ys[i], rng));
		foes.forEach((w, i) => this.spawnWitch(w, 1, map.w - 3 - i % 2, ys[i], rng));
		this.camX = map.w * TILE / 2;
		this.camY = map.h * TILE / 2;
		this.zoom = .72;
		this.phase = "fight";
		this.note = "The circle is shut. They choose their own cuts.";
		this.last = null;
		this.publish();
		this.resize();
	}
	dismiss() {
		if (this.phase === "over") return;
		if (this.phase === "result") {
			this.phase = "roster";
			this.note = this.save ? `${this.save.points} marks. ${this.save.tokens} tokens.` : "";
			this.publish();
		}
	}
	persist() {
		if (!this.save) return;
		this.onCloud(this.save);
		this.publish();
	}
	publish() {
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
			last: this.last
		};
		this.listeners.forEach((fn) => fn());
	}
	spawnWitch(w, side, tx, ty, rng) {
		const gear = [w.weapon, ...w.gear];
		const id = nextUid();
		const body = this.makeBody(w, side, tx, ty, id, "", w.role, w.talent * (w.role === "summoner" ? .2 : 1));
		body.moveIds = w.moves;
		body.might = ench(gear, "might");
		body.ward = ench(gear, "ward");
		body.crit = ench(gear, "crit_edge");
		body.swift = ench(gear, "swift");
		body.echo = ench(gear, "echo_guard");
		body.double = ench(gear, "double_strike");
		body.second = ench(gear, "second_chance") > 0;
		this.fighters.push(body);
		if (w.role !== "summoner") return;
		w.spirits.forEach((s, i) => {
			const sx = tx + (side === 0 ? 2 : -2);
			const sy = ty - 1 + i;
			const spirit = this.makeBody({
				name: s.name,
				race: w.race,
				type: s.type,
				level: w.level,
				maxHp: Math.floor((78 + w.level * 16) * .2),
				speed: Math.floor(68 + w.level * .2),
				moves: [s.move],
				weapon: w.weapon,
				gear: w.gear,
				hair: w.hair,
				skin: w.skin
			}, side, sx, sy, nextUid(), id, "spirit", w.talent * .34);
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
	makeBody(w, side, tx, ty, id, master, role, dmgMul) {
		const pieces = [w.weapon, ...w.gear].map((g) => ({
			slot: g.slot,
			style: g.style,
			type: g.type,
			fxSeed: g.fxSeed,
			quality: Math.max(0, QUALITY.indexOf(g.quality))
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
			walk: 0,
			hurt: 0,
			cd: .3 + Math.random() * .4,
			shield: 0,
			root: 0,
			sleep: 0,
			burn: 0,
			trap: .2,
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
			think: Math.random() * .3,
			stuck: 0,
			lastX: tx * TILE,
			lastY: ty * TILE,
			path: [],
			hair: w.hair,
			skin: w.skin,
			tall: 1
		};
	}
	step(dt) {
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
			if (f.burn > 0) this.hurt(f, (3 + f.level * .15) * dt, "#e25a32");
			const tx = Math.floor(f.x / TILE);
			const ty = Math.floor(f.y / TILE);
			const cell = this.grid[ty * this.gw + tx] ?? 1;
			if (cell === 2) {
				f.trap -= dt;
				if (f.trap <= 0) {
					f.trap = .6;
					this.hurt(f, 5 + f.level * .35, "#c4473a");
					this.float(f.x, f.y - 20, "trap", "#ffb4a8");
				}
			}
			if (f.sleep > 0) continue;
			f.think -= dt;
			if (f.think <= 0) {
				f.think = .28 + Math.random() * .12;
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
		if (this.age > .6) this.maybeEnd();
	}
	think(f) {
		const allies = this.fighters.filter((o) => o.alive && o.side === f.side);
		const foes = this.fighters.filter((o) => o.alive && o.side !== f.side && o.role !== "spirit");
		const anyFoe = this.fighters.filter((o) => o.alive && o.side !== f.side);
		const pool = foes.length ? foes : anyFoe;
		if (!pool.length) return;
		let goal = this.goalFor(f, allies, pool);
		if (Math.hypot(f.x - f.lastX, f.y - f.lastY) < 5) f.stuck += .35;
		else f.stuck = 0;
		f.lastX = f.x;
		f.lastY = f.y;
		if (f.stuck > 1) {
			f.stuck = 0;
			const ang = Math.random() * Math.PI * 2;
			goal = {
				x: f.x + Math.cos(ang) * 70,
				y: f.y + Math.sin(ang) * 70
			};
		}
		const fear = f.hp / f.max > .35;
		this.pathTo(f, goal.x, goal.y, fear);
	}
	goalFor(f, allies, foes) {
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
				return {
					x: sx - dx / l * 46,
					y: sy - dy / l * 46
				};
			}
		}
		if (f.role === "spirit") {
			const master = allies.find((a) => a.id === f.master);
			if (master && Math.hypot(f.x - master.x, f.y - master.y) > 128) return {
				x: master.x,
				y: master.y + 18
			};
		}
		const target = this.pickTarget(f, foes);
		const move = this.bestMove(f, target, false);
		const reach = attackRange(move);
		const form = attackForm(move);
		const d = Math.hypot(target.x - f.x, target.y - f.y);
		if (form !== "melee") {
			if (d < reach * .5) {
				const ang = Math.atan2(f.y - target.y, f.x - target.x);
				return {
					x: f.x + Math.cos(ang) * 90,
					y: f.y + Math.sin(ang) * 90
				};
			}
			if (d <= reach * .92 && los(this.grid, this.gw, this.gh, f.x, f.y, target.x, target.y)) return {
				x: f.x,
				y: f.y
			};
		}
		const ang = Math.atan2(f.y - target.y, f.x - target.x);
		const hold = form === "melee" ? 28 : Math.min(reach * .75, 120);
		return {
			x: target.x + Math.cos(ang) * hold,
			y: target.y + Math.sin(ang) * hold
		};
	}
	pickTarget(f, foes) {
		if (f.role === "summoner") {
			const spirits = this.fighters.filter((a) => a.alive && a.master === f.id);
			if (spirits.length) {
				const weak = spirits.reduce((a, b) => a.hp / a.max < b.hp / b.max ? a : b);
				return nearest(foes, weak.x, weak.y);
			}
		}
		let best = foes[0];
		let score = 1e9;
		for (const o of foes) {
			const s = Math.hypot(o.x - f.x, o.y - f.y) * (o.hp / o.max < .34 ? .62 : 1);
			if (s < score) {
				score = s;
				best = o;
			}
		}
		return best;
	}
	bestMove(f, target, commit) {
		const list = f.moveIds.map((id) => MOVE_BY_ID[id]).filter((m) => !!m);
		const bag = list.length ? list : [MOVES[0]];
		if (!commit) return bag.slice().sort((a, b) => b.power - a.power)[0];
		if (f.hp / f.max < .48) {
			const mend = bag.find((m) => m.effect === "mend" || moveTactic(m) === "heal");
			if (mend) {
				const ally = this.lowestFriend(f);
				if (ally && ally.hp / ally.max < .62) return mend;
			}
			const ward = bag.find((m) => m.effect === "shell" || moveTactic(m) === "ward");
			if (ward && f.shield <= 0) return ward;
		}
		if (f.role === "summoner") {
			const bruised = this.fighters.filter((a) => a.alive && a.master === f.id).find((s) => s.hp / s.max < .55);
			const mend = bag.find((m) => m.effect === "mend" || moveTactic(m) === "heal");
			if (bruised && mend) return mend;
		}
		const d = target ? Math.hypot(target.x - f.x, target.y - f.y) : 999;
		const inReach = bag.filter((m) => attackRange(m) + 10 >= d);
		return (inReach.length ? inReach : bag).slice().sort((a, b) => b.power - a.power)[0];
	}
	lowestFriend(f) {
		const allies = this.fighters.filter((a) => a.alive && a.side === f.side);
		if (!allies.length) return f;
		return allies.reduce((a, b) => a.hp / a.max < b.hp / b.max ? a : b);
	}
	pathTo(f, x, y, fear) {
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
	follow(f, dt, mud) {
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
		if (Math.hypot(dx, dy) < 2) return;
		for (const o of this.fighters) {
			if (o === f || !o.alive || o.side !== f.side) continue;
			const d = Math.hypot(f.x - o.x, f.y - o.y);
			if (d < 22 && d > .2) {
				dx += (f.x - o.x) / d * 10;
				dy += (f.y - o.y) / d * 10;
			}
		}
		const mag = Math.hypot(dx, dy) || 1;
		const speed = f.speed * (mud ? .55 : 1) * (f.role === "spirit" ? 1.05 : 1);
		this.slide(f, dx / mag * speed * dt, dy / mag * speed * dt);
		if (dx < -1) f.facing = -1;
		else if (dx > 1) f.facing = 1;
	}
	slide(f, dx, dy) {
		const blocked = (x, y) => {
			const tx = Math.floor(x / TILE);
			const ty = Math.floor(y / TILE);
			if (tx < 0 || ty < 0 || tx >= this.gw || ty >= this.gh) return true;
			return this.grid[ty * this.gw + tx] === 1;
		};
		if (!blocked(f.x + dx, f.y)) f.x += dx;
		if (!blocked(f.x, f.y + dy)) f.y += dy;
	}
	strike(f) {
		if (f.cd > 0 || f.sleep > 0) return;
		const foes = this.fighters.filter((o) => o.alive && o.side !== f.side);
		if (!foes.length) return;
		const witches = foes.filter((o) => o.role !== "spirit");
		const target = this.pickTarget(f, witches.length ? witches : foes);
		const move = this.bestMove(f, target, true);
		const tactic = moveTactic(move);
		if (tactic === "heal" || move.effect === "mend") {
			const ally = f.role === "summoner" ? this.lowestFriend(f) : f.hp / f.max < .7 ? f : this.lowestFriend(f);
			if (!ally) return;
			const heal = (10 + move.power * .7) * (.75 + f.dmgMul);
			ally.hp = Math.min(ally.max, ally.hp + heal);
			this.float(ally.x, ally.y - 28, `${Math.round(heal)}`, "#9ad8c8");
			this.beams.push({
				x0: f.x,
				y0: f.y - 20,
				x1: ally.x,
				y1: ally.y - 16,
				life: .18,
				color: "#9ad8c8"
			});
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
			f.cd = .55;
			return;
		}
		if (d > reach + 6) return;
		if (attackForm(move) !== "melee" && !los(this.grid, this.gw, this.gh, f.x, f.y - 8, target.x, target.y - 8)) return;
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
	cooldown(f, move) {
		const tactic = moveTactic(move);
		return Math.max(.35, (tactic === "heavy" || tactic === "channel" ? 1.55 : tactic === "roll" ? .7 : .95) * (1 - Math.min(.35, f.swift / 120)) * (f.role === "spirit" ? 1.15 : 1));
	}
	cast(f, target, move) {
		const tm = typeMult(move.type, target.type);
		this.beams.push({
			x0: f.x,
			y0: f.y - 18,
			x1: target.x,
			y1: target.y - 16,
			life: .16,
			color: TYPES[move.type].color
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
		const gear = 1 + (f.weapon?.level ?? f.level) * .035;
		const might = 1 + f.might / 100;
		const stab = move.type === f.type ? 1.12 : 1;
		let dmg = (5 + move.power * .34) * (1 + f.level * .045) * gear * might * stab * tm * f.dmgMul * (form === "melee" ? 1.15 : 1) * (moveTactic(move) === "heavy" ? 1.35 : 1);
		const crit = Math.random() * 100 < move.crit + f.crit;
		if (crit) dmg *= 1.65;
		if (target.shield > 0) dmg *= .55;
		dmg *= 1 - Math.min(.45, target.ward / 140);
		const hits = Math.random() * 100 < f.double ? 2 : 1;
		for (let i = 0; i < hits; i++) this.hurt(target, Math.max(1, dmg * (hits === 2 ? .8 : 1)), crit ? "#fff1a8" : "#fff6e8");
		if (move.effect === "burn") target.burn = Math.max(target.burn, 2.4);
		if (move.effect === "root") target.root = Math.max(target.root, 1.3);
		if (target.sleep > 0) target.sleep = 0;
		if (move.effect === "sleep" && Math.random() < .45) target.sleep = 1.4;
		if (move.effect === "leech") f.hp = Math.min(f.max, f.hp + dmg * .25);
	}
	hurt(f, amount, color) {
		if (!f.alive) return;
		f.hp -= amount;
		f.hurt = .35;
		if (color && amount >= 1) this.float(f.x, f.y - 24, `${Math.round(amount)}`, color);
		if (f.hp > 0) return;
		if (f.second && !f.usedSecond) {
			f.usedSecond = true;
			f.hp = Math.max(1, f.max * .22);
			this.float(f.x, f.y - 36, "second", "#e6c15a");
			return;
		}
		f.hp = 0;
		f.alive = false;
		if (f.role !== "spirit") {
			for (const s of this.fighters) if (s.master === f.id && s.alive) {
				s.alive = false;
				s.hp = 0;
				this.float(s.x, s.y - 16, "unravels", "#b9a8d8");
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
	pillar(x, y) {
		const tx = Math.floor(x / TILE);
		const ty = Math.floor(y / TILE);
		if (tx < 0 || ty < 0 || tx >= this.gw || ty >= this.gh) return true;
		return this.grid[ty * this.gw + tx] === 1;
	}
	maybeEnd() {
		const you = this.fighters.some((f) => f.alive && f.side === 0 && f.role !== "spirit");
		const them = this.fighters.some((f) => f.alive && f.side === 1 && f.role !== "spirit");
		if (you && them && this.age < 70) return;
		let win = you && !them;
		let timed = "";
		if (you && them) {
			const score = (side) => this.fighters.filter((f) => f.alive && f.side === side && f.role !== "spirit").reduce((s, f) => s + f.hp / f.max, 0);
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
			this.last = {
				win: false,
				tokens,
				note: "No marks left. The circle forgets this coven."
			};
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
			note: timed || (win ? `The six stand. +1 mark. ${tokens} tokens from the dead.` : `Your six break. -1 mark. ${tokens} tokens kept.`)
		};
		this.phase = "result";
		this.note = this.last.note;
		this.persist();
	}
	frame() {
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
		this.wantZ = Math.max(.42, Math.min(cap, fit));
		const k = Math.min(1, .08);
		this.camX += (this.wantX - this.camX) * k;
		this.camY += (this.wantY - this.camY) * k;
		this.zoom += (this.wantZ - this.zoom) * k;
	}
	float(x, y, text, color) {
		this.floats.push({
			x,
			y,
			text,
			life: .8,
			color
		});
	}
	draw() {
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
		for (let y = 0; y < this.gh; y++) for (let x = 0; x < this.gw; x++) {
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
		for (let y = 0; y < this.gh; y++) for (let x = 0; x < this.gw; x++) {
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
			if (f.role === "spirit" && f.look) drawMonster(ctx, {
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
				time: this.clock
			});
			else if (f.race) drawActor(ctx, {
				x: f.x,
				y: f.y,
				race: f.race,
				female: true,
				hair: f.hair,
				skin: f.skin,
				facing: f.facing,
				walk: f.walk,
				attack: f.cd > .7 ? .45 : 0,
				hurt: f.hurt,
				pieces: f.pieces,
				setFx: null,
				setOn: false,
				time: this.clock,
				scale: f.role === "summoner" ? 1.02 : 1
			});
			const bar = f.role === "spirit" ? 28 : 46;
			const by = f.y - (f.role === "spirit" ? 48 : 62);
			ctx.fillStyle = "#1a1214";
			ctx.fillRect(f.x - bar / 2 - 1, by - 1, bar + 2, 6);
			ctx.fillStyle = f.side === 0 ? "#e6c15a" : "#c4473a";
			ctx.fillRect(f.x - bar / 2, by, bar * Math.max(0, f.hp / f.max), 4);
			if (f.role !== "spirit") drawShadowName(ctx, `${f.name} ${f.level}`, f.x, by - 12, f.side === 0 ? "#fff1a8" : "#ffd0c8");
		}
		for (const fl of this.floats) {
			ctx.globalAlpha = Math.max(0, Math.min(1, fl.life * 2));
			drawShadowName(ctx, fl.text, fl.x, fl.y - (.8 - fl.life) * 18, fl.color);
			ctx.globalAlpha = 1;
		}
		ctx.restore();
	}
};
function nearest(list, x, y) {
	let best = list[0];
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
function ArenaScreen(props) {
	const canvasRef = (0, import_react.useRef)(null);
	const arenaRef = (0, import_react.useRef)(null);
	const [snap, setSnap] = (0, import_react.useState)(null);
	const cloudRef = (0, import_react.useRef)(props.onCloud);
	cloudRef.current = props.onCloud;
	const seedRef = (0, import_react.useRef)(props.seed);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const arena = new WitchArena(canvas);
		arena.onCloud = (save) => cloudRef.current(save);
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
	(0, import_react.useEffect)(() => {
		if (snap?.phase === "fight" || snap?.phase === "result") arenaRef.current?.resize();
	}, [snap?.phase]);
	const arena = arenaRef.current;
	const fighting = snap?.phase === "fight" || snap?.phase === "result";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "arena-root",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: fighting ? "arena-canvas" : "arena-canvas arena-canvas-idle",
				"aria-label": "Witch circle"
			}),
			snap && !fighting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-full justify-center overflow-auto p-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-panel w-full max-w-3xl p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xs text-blood",
							children: "WITCH CIRCLE"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display mt-2 text-sm text-bone",
							children: snap.phase === "over" ? "The circle closes" : "Six against six"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-dim",
							children: snap.note
						}),
						snap.phase !== "over" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap gap-3 font-display text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-kyo",
										children: ["Points ", snap.points]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Tokens ", snap.tokens] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-dim",
										children: [
											snap.wins,
											"–",
											snap.losses
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-dim",
										children: [
											"Marked ",
											snap.party,
											"/6"
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "arena-list mt-3",
								children: snap.roster.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: `arena-card ${w.marked ? "arena-card-on" : ""}`,
									onClick: () => arena?.toggle(w.uid),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-baseline justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-display text-xs text-bone",
												children: [w.marked ? "● " : "", w.name]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-kyo",
												children: [
													"Lv ",
													w.level,
													" · ",
													w.power
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "mt-1 block truncate text-dim",
											children: [
												w.role === "summoner" ? "Summoner" : "Witch",
												" · ",
												w.race,
												" · ",
												w.typeName,
												" · ",
												w.gear
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate",
											children: w.moves
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate text-dim",
											children: w.enchants
										}),
										w.spirits && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "block truncate text-kyo",
											children: ["Spirits ", w.spirits]
										})
									]
								}, w.uid))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "px-btn",
									type: "button",
									disabled: snap.tokens < 1,
									onClick: () => arena?.summon(),
									children: "Draw a witch"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "px-btn px-btn-kyo",
									type: "button",
									disabled: snap.party !== 6,
									onClick: () => arena?.fight(),
									children: "Enter the circle"
								})]
							})
						] }),
						snap.phase === "over" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 grid gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "px-btn px-btn-kyo",
								type: "button",
								onClick: () => {
									arena?.fresh();
								},
								children: "Take six new witches"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "px-btn mt-3 w-full",
							type: "button",
							onClick: props.onClose,
							children: snap.phase === "over" ? "Back to the title" : "Leave the circle"
						})
					]
				})
			}),
			snap && fighting && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "arena-hud",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-panel flex flex-wrap items-center gap-3 px-3 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-display text-xs text-kyo",
							children: ["Points ", snap.points]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-display text-xs",
							children: ["Tokens ", snap.tokens]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-dim",
							children: [
								"You ",
								snap.yours,
								" · Them ",
								snap.theirs
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "px-btn",
							type: "button",
							onClick: () => arena?.setSpeed(snap.speed === 1 ? 2 : 1),
							children: snap.speed === 1 ? "Speed 1×" : "Speed 2×"
						})
					]
				}), snap.phase === "result" && snap.last && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-panel mt-2 max-w-md p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xs text-kyo",
							children: snap.last.win ? "Victory" : "Broken"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2",
							children: snap.last.note
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "px-btn px-btn-kyo mt-3 w-full",
							type: "button",
							onClick: () => arena?.dismiss(),
							children: "Back to the coven"
						})
					]
				})]
			})
		]
	});
}
var FAST_POLL_MS = 400;
var IDLE_POLL_MS = 2e3;
var PING_INTERVAL_MS = 2e3;
var STALL_MS = 1e4;
var MAX_RECOVERY_ATTEMPTS = 3;
var SIGNAL_RETRY_DELAYS_MS = [250, 750];
function defaultIceServers() {
	return [{ urls: ["stun:stun.l.google.com:19302", "stun:stun.cloudflare.com:3478"] }];
}
var P2PRoom = class {
	opts;
	peers = /* @__PURE__ */ new Map();
	/** Per-remote-peer signal delivery chains (order-preserving). */
	signalQueues = /* @__PURE__ */ new Map();
	cursor = 0;
	pollTimer = null;
	pingTimer = null;
	closed = false;
	everPolled = false;
	lastPeersFingerprint = "";
	constructor(opts) {
		this.opts = opts;
	}
	/**
	* The first poll IS the join: it registers this peer and returns the
	* roster. A failed first poll (cold DB, offline tab) must not strand the
	* room: the loop and timers start regardless and the next poll retries.
	*/
	async join() {
		try {
			await this.pollOnce();
		} catch {}
		if (this.closed) return;
		this.schedulePoll(this.anyPairConnecting() ? FAST_POLL_MS : IDLE_POLL_MS);
		this.pingTimer = setInterval(() => {
			this.pingAll();
			this.watchdog();
		}, PING_INTERVAL_MS);
	}
	close() {
		this.closed = true;
		if (this.pollTimer) clearTimeout(this.pollTimer);
		if (this.pingTimer) clearInterval(this.pingTimer);
		for (const slot of this.peers.values()) slot.pc.close();
		this.peers.clear();
		fetch("/api/rtc", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				op: "leave",
				room: this.opts.room,
				peer: this.opts.selfId
			}),
			keepalive: true
		}).catch(() => {});
	}
	/** Send on the unreliable game-state channel (drops stale packets). */
	broadcast(data) {
		const wire = JSON.stringify({
			t: "d",
			d: data
		});
		for (const slot of this.peers.values()) if (slot.state?.readyState === "open") slot.state.send(wire);
	}
	/** Send reliably (ordered) to one peer, or to all when peerId is omitted. */
	send(data, peerId) {
		const wire = JSON.stringify({
			t: "d",
			d: data
		});
		const targets = peerId ? [this.peers.get(peerId)] : [...this.peers.values()];
		for (const slot of targets) if (slot?.reliable?.readyState === "open") slot.reliable.send(wire);
	}
	peerList() {
		return [...this.peers.values()].map((s) => ({ ...s.info }));
	}
	schedulePoll(delay) {
		if (this.closed) return;
		if (this.pollTimer) clearTimeout(this.pollTimer);
		this.pollTimer = setTimeout(() => void this.poll(), delay);
	}
	anyPairConnecting() {
		for (const s of this.peers.values()) {
			if (s.terminal) continue;
			if (s.info.connectionState !== "connected") return true;
		}
		return false;
	}
	async pollOnce() {
		const params = new URLSearchParams({
			room: this.opts.room,
			peer: this.opts.selfId,
			name: this.opts.name ?? "",
			since: String(this.cursor)
		});
		const res = await fetch(`/api/rtc?${params}`);
		if (this.closed) return;
		if (!res.ok) throw new Error(`signaling poll failed: ${res.status}`);
		const body = await res.json();
		if (this.closed) return;
		if (!this.everPolled) {
			this.everPolled = true;
			this.opts.onConnected?.();
		}
		this.reconcileRoster(body.peers);
		const roster = new Set(body.peers.map((p) => p.id));
		for (const sig of body.signals) {
			this.cursor = Math.max(this.cursor, sig.id);
			await this.onSignal(sig.from, sig.kind, sig.payload, roster);
			if (this.closed) return;
		}
	}
	async poll() {
		if (this.closed) return;
		try {
			await this.pollOnce();
		} catch {}
		this.schedulePoll(this.anyPairConnecting() ? FAST_POLL_MS : IDLE_POLL_MS);
	}
	reconcileRoster(peers) {
		const alive = new Set(peers.map((p) => p.id));
		for (const p of peers) {
			if (p.id === this.opts.selfId) continue;
			const existing = this.peers.get(p.id);
			if (existing) existing.info.name = p.name;
			else this.connectTo(p.id, p.name, this.opts.selfId > p.id);
		}
		for (const [id, slot] of this.peers) if (!alive.has(id)) {
			slot.pc.close();
			this.peers.delete(id);
		}
		this.emitPeers();
	}
	connectTo(peerId, name, initiator) {
		if (this.closed) return null;
		const pc = new RTCPeerConnection({ iceServers: this.opts.iceServers ?? defaultIceServers() });
		const slot = {
			pc,
			makingOffer: false,
			ignoreOffer: false,
			pendingCandidates: [],
			lastProgressAt: Date.now(),
			recoveryAttempts: 0,
			info: {
				id: peerId,
				name,
				connectionState: pc.connectionState,
				candidateType: null,
				rttMs: null
			}
		};
		this.peers.set(peerId, slot);
		pc.onicecandidate = (e) => {
			if (e.candidate) this.sendSignal(peerId, "ice", e.candidate.toJSON());
		};
		pc.onconnectionstatechange = () => {
			slot.info.connectionState = pc.connectionState;
			if (pc.connectionState === "connecting" || pc.connectionState === "connected") slot.lastProgressAt = Date.now();
			if (pc.connectionState === "connected") {
				slot.recoveryAttempts = 0;
				slot.terminal = false;
				this.readCandidateType(slot);
			}
			this.emitPeers();
			if (pc.connectionState === "failed") pc.restartIce();
			if (pc.connectionState === "failed" || pc.connectionState === "disconnected") this.schedulePoll(FAST_POLL_MS);
		};
		pc.onnegotiationneeded = async () => {
			try {
				slot.makingOffer = true;
				await pc.setLocalDescription();
				await this.sendSignal(peerId, "offer", pc.localDescription.toJSON());
			} catch {} finally {
				slot.makingOffer = false;
			}
		};
		pc.ondatachannel = (e) => this.attachChannel(slot, e.channel);
		if (initiator) {
			this.attachChannel(slot, pc.createDataChannel("state", {
				ordered: false,
				maxRetransmits: 0
			}));
			this.attachChannel(slot, pc.createDataChannel("reliable", { ordered: true }));
		}
		return slot;
	}
	attachChannel(slot, channel) {
		if (channel.label === "state") slot.state = channel;
		else slot.reliable = channel;
		channel.onopen = () => {
			slot.lastProgressAt = Date.now();
		};
		channel.onmessage = (e) => {
			let msg;
			try {
				msg = JSON.parse(e.data);
			} catch {
				return;
			}
			if (msg.t === "ping") {
				if (slot.state?.readyState === "open") slot.state.send(JSON.stringify({ t: "pong" }));
			} else if (msg.t === "pong") {
				if (slot.pingSentAt) {
					slot.info.rttMs = Math.round(performance.now() - slot.pingSentAt);
					slot.pingSentAt = void 0;
					this.emitPeers();
				}
			} else this.opts.onMessage?.(slot.info.id, msg.d, channel.label === "state" ? "state" : "reliable");
		};
	}
	/** Apply buffered ICE candidates once a remote description is in place. */
	async flushPendingCandidates(slot) {
		while (slot.pendingCandidates.length > 0) {
			const candidate = slot.pendingCandidates.shift();
			try {
				await slot.pc.addIceCandidate(candidate);
			} catch (err) {
				if (!slot.ignoreOffer) console.warn("[p2p] addIceCandidate failed:", err);
			}
			if (this.closed) return;
		}
	}
	async onSignal(from, kind, payload, roster) {
		if (this.closed) return;
		let slot = this.peers.get(from);
		if (!slot) {
			if (!roster.has(from)) return;
			const created = this.connectTo(from, "", false);
			if (!created) return;
			slot = created;
		}
		const polite = this.opts.selfId < from;
		try {
			if (kind === "offer" || kind === "answer") {
				const description = payload;
				const collision = kind === "offer" && (slot.makingOffer || slot.pc.signalingState !== "stable");
				slot.ignoreOffer = !polite && collision;
				if (slot.ignoreOffer) return;
				try {
					await slot.pc.setRemoteDescription(description);
				} catch (err) {
					if (kind !== "offer" || slot.recreatedForOffer) throw err;
					const attempts = slot.recoveryAttempts;
					const name = slot.info.name;
					slot.pc.close();
					this.peers.delete(from);
					const fresh = this.connectTo(from, name, false);
					if (!fresh) return;
					fresh.recoveryAttempts = attempts;
					fresh.recreatedForOffer = true;
					slot = fresh;
					await slot.pc.setRemoteDescription(description);
				}
				if (this.closed) return;
				await this.flushPendingCandidates(slot);
				if (this.closed) return;
				if (kind === "offer") {
					await slot.pc.setLocalDescription();
					if (this.closed) return;
					await this.sendSignal(from, "answer", slot.pc.localDescription.toJSON());
				}
			} else if (kind === "ice") {
				const candidate = payload;
				if (!slot.pc.remoteDescription) {
					slot.pendingCandidates.push(candidate);
					return;
				}
				try {
					await slot.pc.addIceCandidate(candidate);
				} catch (err) {
					if (!slot.ignoreOffer) console.warn("[p2p] addIceCandidate failed:", err);
				}
			}
		} catch {}
	}
	/**
	* Signals are serialized per remote peer (a candidate must never overtake
	* its SDP into the DB) and retried on failure with short backoff.
	*/
	sendSignal(to, kind, payload) {
		const next = (this.signalQueues.get(to) ?? Promise.resolve()).then(() => this.postSignal(to, kind, payload));
		this.signalQueues.set(to, next.catch(() => {}));
		return next;
	}
	async postSignal(to, kind, payload) {
		for (let attempt = 0;; attempt++) {
			if (this.closed) return;
			try {
				const res = await fetch("/api/rtc", {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({
						op: "signal",
						room: this.opts.room,
						from: this.opts.selfId,
						to,
						kind,
						payload
					})
				});
				if (res.ok) return;
				throw new Error(`signal POST failed: ${res.status}`);
			} catch (err) {
				if (attempt >= SIGNAL_RETRY_DELAYS_MS.length) {
					console.warn(`[p2p] signal ${kind} to ${to} failed after retries`, err);
					return;
				}
				await new Promise((r) => setTimeout(r, SIGNAL_RETRY_DELAYS_MS[attempt]));
			}
		}
	}
	pingAll() {
		const wire = JSON.stringify({ t: "ping" });
		for (const slot of this.peers.values()) {
			if (slot.state?.readyState !== "open") continue;
			const stale = slot.pingSentAt !== void 0 && performance.now() - slot.pingSentAt > 2 * PING_INTERVAL_MS;
			if (slot.pingSentAt === void 0 || stale) {
				slot.pingSentAt = performance.now();
				slot.state.send(wire);
			}
		}
	}
	/**
	* Stuck-pair recovery, piggybacked on the ping interval. A pair that has
	* made no progress for STALL_MS gets rebuilt by the dialer with a FRESH
	* RTCPeerConnection (new DTLS identity — fixes the suspend/resume
	* fingerprint wedge). After MAX_RECOVERY_ATTEMPTS the pair is terminal:
	* visible to the app as its last connectionState, ignored by fast-poll.
	*/
	watchdog() {
		if (this.closed) return;
		const now = Date.now();
		for (const [peerId, slot] of this.peers) {
			const live = slot.pc.connectionState;
			if (live !== slot.info.connectionState) {
				slot.info.connectionState = live;
				if (live === "connecting" || live === "connected") slot.lastProgressAt = now;
				this.emitPeers();
			}
			if (slot.terminal || live === "connected") continue;
			if (now - slot.lastProgressAt <= STALL_MS) continue;
			if (slot.recoveryAttempts >= MAX_RECOVERY_ATTEMPTS) {
				slot.terminal = true;
				this.emitPeers();
				continue;
			}
			slot.recoveryAttempts += 1;
			slot.lastProgressAt = now;
			if (this.opts.selfId > peerId) {
				const { name } = slot.info;
				const attempts = slot.recoveryAttempts;
				slot.pc.close();
				this.peers.delete(peerId);
				const fresh = this.connectTo(peerId, name, true);
				if (fresh) fresh.recoveryAttempts = attempts;
				this.schedulePoll(FAST_POLL_MS);
			}
		}
	}
	async readCandidateType(slot) {
		try {
			const stats = await slot.pc.getStats();
			let selected;
			stats.forEach((s) => {
				if (s.type === "candidate-pair" && s.nominated) selected = s;
			});
			const localId = selected?.localCandidateId;
			if (localId) {
				const local = stats.get(localId);
				slot.info.candidateType = local?.candidateType ?? null;
				this.emitPeers();
			}
		} catch {}
	}
	emitPeers() {
		const list = this.peerList();
		const fingerprint = JSON.stringify(list.map((p) => [
			p.id,
			p.name,
			p.connectionState,
			p.candidateType,
			p.rttMs
		]));
		if (fingerprint === this.lastPeersFingerprint) return;
		this.lastPeersFingerprint = fingerprint;
		this.opts.onPeersChanged?.(list);
	}
};
var BIOMES = [
	"void",
	"frost",
	"verdant",
	"crown",
	"bone",
	"tide",
	"ashen"
];
var REGION = [
	{
		id: "void",
		x: 12,
		y: 10,
		r: 14
	},
	{
		id: "frost",
		x: 64,
		y: 12,
		r: 16
	},
	{
		id: "verdant",
		x: 42,
		y: 16,
		r: 16
	},
	{
		id: "crown",
		x: 30,
		y: 32,
		r: 14
	},
	{
		id: "bone",
		x: 40,
		y: 44,
		r: 9
	},
	{
		id: "tide",
		x: 68,
		y: 34,
		r: 16
	},
	{
		id: "ashen",
		x: 20,
		y: 50,
		r: 15
	}
].map((r) => {
	const p = scaleTile(r.x, r.y);
	return {
		id: r.id,
		x: p.tx,
		y: p.ty,
		r: Math.round(r.r * 5 * .93)
	};
});
var TAVERNS = [
	{
		id: "crown_tap",
		name: "Crownfall Tap",
		biome: "crown",
		tx: 27,
		ty: 36
	},
	{
		id: "hollow_inn",
		name: "Hollow Inn",
		biome: "verdant",
		tx: 40,
		ty: 12
	},
	{
		id: "march_lodge",
		name: "March Lodge",
		biome: "frost",
		tx: 62,
		ty: 8
	},
	{
		id: "salt_house",
		name: "Salt House",
		biome: "tide",
		tx: 72,
		ty: 40
	},
	{
		id: "kiln_bar",
		name: "Kiln Bar",
		biome: "ashen",
		tx: 14,
		ty: 52
	},
	{
		id: "pit_rest",
		name: "Pit Rest",
		biome: "void",
		tx: 8,
		ty: 8
	},
	{
		id: "lid_tavern",
		name: "Lid Tavern",
		biome: "bone",
		tx: 44,
		ty: 46
	}
].map((t) => {
	const p = scaleTile(t.tx, t.ty);
	return {
		...t,
		tx: p.tx,
		ty: p.ty,
		boardTx: p.tx + 3,
		boardTy: p.ty + 6
	};
});
function noise(x, y, seed) {
	let n = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(seed, 1442695041) >>> 0;
	n = Math.imul(n ^ n >>> 13, 1274126177);
	return ((n ^ n >>> 16) >>> 0) / 4294967296;
}
function biomeIndex(x, y, seed) {
	const n = noise(x, y, seed);
	let best = 3;
	let bestD = 99;
	REGION.forEach((r, i) => {
		const d = Math.hypot(x - r.x, y - r.y) / r.r + (n - .5) * .45;
		if (d < bestD) {
			bestD = d;
			best = i;
		}
	});
	return best;
}
function idx(x, y, w = 420) {
	return y * w + x;
}
function buildWorld(seed) {
	const w = 420;
	const h = 288;
	const tiles = new Array(w * h);
	for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
		const edge = x <= 1 || y <= 1 || x >= 418 || y >= 286;
		const b = biomeIndex(x, y, seed);
		const biome = BIOMES[b];
		let floor = 0;
		let block = 0;
		let decor = 0;
		if (edge) block = 1;
		else if (x >= 402) {
			floor = 2;
			block = 1;
		} else if (Math.abs(y - Math.round(23 * (h / 96))) <= 1 && x > Math.round(36 * (w / 140)) && x < Math.round(62 * (w / 140))) {
			const bridge = [
				42,
				50,
				58
			].map((n) => Math.round(n * (w / 140))).some((b) => Math.abs(x - b) <= 2);
			floor = bridge ? 4 : 2;
			block = bridge ? 0 : 1;
		} else {
			floor = biome === "tide" ? 4 : biome === "frost" ? 5 : biome === "ashen" ? 6 : biome === "void" ? 7 : biome === "bone" ? 8 : biome === "crown" ? 9 : 0;
			const n = noise(x, y, seed + 9);
			if (biome !== "crown" && biome !== "bone" && n > .86) decor = biome === "verdant" || biome === "tide" ? 1 : 2;
			else if (n > .8) decor = biome === "verdant" ? 3 : biome === "bone" ? 4 : 5;
		}
		tiles[idx(x, y)] = {
			floor,
			biome: b,
			block,
			decor
		};
	}
	carveRoad(tiles, w, ...ends(30, 32, 42, 16));
	carveRoad(tiles, w, ...ends(30, 32, 68, 34));
	carveRoad(tiles, w, ...ends(30, 32, 20, 50));
	carveRoad(tiles, w, ...ends(30, 32, 12, 10));
	carveRoad(tiles, w, ...ends(42, 16, 64, 12));
	carveRoad(tiles, w, ...ends(30, 32, 40, 44));
	carveRoad(tiles, w, ...ends(64, 12, 68, 34));
	buildings(tiles, w);
	const taverns = stampTaverns(tiles, w);
	const clear = (tx, ty) => {
		const t = tiles[idx(tx, ty)];
		if (!t) return;
		t.block = 0;
		t.decor = 0;
		if (t.floor === 2 || t.floor === 1) t.floor = 9;
	};
	for (const p of POIS) if ("tx" in p) {
		const s = scaleTile(p.tx, p.ty);
		const span = p.kind === "shrine" || p.kind === "dungeon" ? 3 : 1;
		for (let dy = -1; dy <= span; dy++) for (let dx = -span; dx <= span; dx++) clear(s.tx + dx, s.ty + dy);
	}
	for (const n of NPCS) if (n.map === "world") {
		const p = scaleTile(n.tx, n.ty);
		clear(p.tx, p.ty);
	}
	for (const t of taverns) {
		clear(t.boardTx, t.boardTy);
		clear(t.boardTx, t.boardTy - 1);
		clear(t.boardTx, t.boardTy + 1);
		clear(t.boardTx, t.boardTy + 2);
	}
	for (const t of tiles) if (t.floor !== 1 && t.floor !== 2) t.block = 0;
	const reached = linkMainland(tiles, w, h);
	return {
		w,
		h,
		tiles,
		spawns: spawnMobs(mulberry32(seed), tiles, w, h, reached),
		cache: null
	};
}
function ends(x0, y0, x1, y1) {
	const a = scaleTile(x0, y0);
	const b = scaleTile(x1, y1);
	return [
		a.tx,
		a.ty,
		b.tx,
		b.ty
	];
}
function carveRoad(tiles, w, x0, y0, x1, y1) {
	let x = x0;
	let y = y0;
	const stamp = (tx, ty) => {
		if (tx <= 1 || ty <= 1 || tx >= w - 2 || ty >= 286) return;
		const t = tiles[idx(tx, ty, w)];
		if (!t) return;
		const water = t.floor === 2;
		if (t.floor === 1 && !water) return;
		t.floor = water ? 4 : 3;
		t.block = 0;
		t.decor = 0;
	};
	for (let i = 0; i < 4e3; i++) {
		const water = tiles[idx(x, y, w)]?.floor === 2;
		stamp(x, y);
		if (water) {
			stamp(x + 1, y);
			stamp(x - 1, y);
			stamp(x, y + 1);
			stamp(x, y - 1);
		}
		if (x === x1 && y === y1) break;
		if (x !== x1) x += Math.sign(x1 - x);
		else if (y !== y1) y += Math.sign(y1 - y);
	}
}
function openTile(tiles, w, h, x, y) {
	if (x <= 1 || y <= 1 || x >= w - 2 || y >= h - 2) return false;
	const t = tiles[idx(x, y, w)];
	if (!t || t.floor === 1 || t.floor === 2 || t.block) return false;
	return true;
}
function floodLand(tiles, w, h, seen, sx, sy) {
	if (!openTile(tiles, w, h, sx, sy) || seen[idx(sx, sy, w)]) return;
	const stack = [sy * w + sx];
	seen[sy * w + sx] = 1;
	while (stack.length) {
		const i = stack.pop();
		i % w;
		i / w | 0;
		for (const n of [
			i + 1,
			i - 1,
			i + w,
			i - w
		]) {
			if (n < 0 || n >= seen.length || seen[n]) continue;
			const nx = n % w;
			const ny = n / w | 0;
			if (nx <= 1 || ny <= 1 || nx >= w - 2 || ny >= h - 2) continue;
			if (!openTile(tiles, w, h, nx, ny)) continue;
			seen[n] = 1;
			stack.push(n);
		}
	}
}
function dock(tiles, w, h, x, y) {
	if (x <= 1 || y <= 1 || x >= w - 2 || y >= h - 2) return;
	const t = tiles[idx(x, y, w)];
	if (!t) return;
	if (t.floor === 1 || t.floor === 2 || t.block) {
		t.floor = t.floor === 2 ? 4 : 3;
		t.block = 0;
		t.decor = 0;
	}
}
/** Every tavern, shrine, and shore camp gets a walkable road back to Crownfall. */
function linkMainland(tiles, w, h) {
	const seen = new Uint8Array(w * h);
	const crown = TAVERNS[0];
	floodLand(tiles, w, h, seen, crown.tx + 3, crown.ty + 2);
	if (!seen.some((v) => v === 1)) {
		for (let y = 2; y < h - 2 && !seen.some((v) => v === 1); y++) for (let x = 2; x < w - 2; x++) if (openTile(tiles, w, h, x, y)) {
			floodLand(tiles, w, h, seen, x, y);
			break;
		}
	}
	const goals = [];
	for (const t of TAVERNS) goals.push({
		x: t.boardTx,
		y: t.boardTy
	});
	for (const p of POIS) if ("tx" in p && "ty" in p) {
		const s = scaleTile(p.tx, p.ty);
		goals.push({
			x: s.tx,
			y: s.ty
		});
	}
	for (const n of NPCS) if (n.map === "world") {
		const s = scaleTile(n.tx, n.ty);
		goals.push({
			x: s.tx,
			y: s.ty
		});
	}
	for (const g of goals) {
		for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) dock(tiles, w, h, g.x + dx, g.y + dy);
		if (seen[idx(g.x, g.y, w)]) {
			floodLand(tiles, w, h, seen, g.x, g.y);
			continue;
		}
		const prev = new Int32Array(w * h);
		prev.fill(-1);
		const start = g.y * w + g.x;
		prev[start] = start;
		const q = [start];
		let hit = -1;
		for (let qi = 0; qi < q.length && hit < 0; qi++) {
			const i = q[qi];
			const x = i % w;
			const y = i / w | 0;
			for (const [dx, dy] of [
				[1, 0],
				[-1, 0],
				[0, 1],
				[0, -1]
			]) {
				const nx = x + dx;
				const ny = y + dy;
				if (nx <= 1 || ny <= 1 || nx >= w - 2 || ny >= h - 2) continue;
				const ni = ny * w + nx;
				if (prev[ni] !== -1) continue;
				prev[ni] = i;
				if (seen[ni]) {
					hit = ni;
					break;
				}
				q.push(ni);
			}
		}
		if (hit < 0) continue;
		let i = hit;
		for (let steps = 0; steps < w * h; steps++) {
			const x = i % w;
			const y = i / w | 0;
			dock(tiles, w, h, x, y);
			dock(tiles, w, h, x + 1, y);
			dock(tiles, w, h, x - 1, y);
			dock(tiles, w, h, x, y + 1);
			dock(tiles, w, h, x, y - 1);
			if (i === start) break;
			const n = prev[i];
			if (n < 0) break;
			i = n;
		}
		floodLand(tiles, w, h, seen, g.x, g.y);
	}
	return seen;
}
function buildings(tiles, w) {
	for (const hall of [
		[
			24,
			26,
			8,
			5
		],
		[
			33,
			26,
			7,
			5
		],
		[
			26,
			35,
			10,
			4
		]
	]) {
		const origin = scaleTile(hall[0], hall[1]);
		stampHall(tiles, w, origin.tx, origin.ty, Math.max(6, hall[2]), Math.max(4, hall[3]));
	}
}
function stampHall(tiles, w, x, y, bw, bh) {
	for (let yy = y; yy < y + bh; yy++) for (let xx = x; xx < x + bw; xx++) {
		const edge = xx === x || yy === y || xx === x + bw - 1 || yy === y + bh - 1;
		const door = yy === y + bh - 1 && xx === x + Math.floor(bw / 2);
		const t = tiles[idx(xx, yy, w)];
		if (!t) continue;
		if (edge && !door) {
			t.block = 1;
			t.floor = 1;
			t.decor = 0;
		} else {
			t.block = 0;
			t.floor = 9;
			t.decor = 0;
		}
	}
}
function stampTaverns(tiles, w) {
	return TAVERNS.map((tavern) => {
		stampHall(tiles, w, tavern.tx, tavern.ty, 7, 5);
		const board = tiles[idx(tavern.boardTx, tavern.boardTy, w)];
		if (board) {
			board.block = 0;
			board.floor = 4;
			board.decor = 6;
		}
		return tavern;
	});
}
function spawnMobs(rng, tiles, w, h, reached) {
	const out = [];
	let n = 0;
	for (let y = 4; y < h - 4; y += 11) for (let x = 4; x < w - 4; x += 13) {
		const t = tiles[idx(x, y, w)];
		const biome = BIOMES[t.biome] ?? "verdant";
		if (t.block || t.floor === 1 || t.floor === 2 || t.floor === 3 || t.floor === 9) continue;
		if (reached && !reached[idx(x, y, w)]) continue;
		if (rng() > .48) continue;
		const list = BIOME_MONSTERS[biome];
		const species = list[Math.floor(rng() * list.length)];
		const def = MONSTER_BY_ID[species];
		const level = 2 + Math.floor(Math.hypot(x - w / 2, y - h / 2) / 8) + Math.floor(rng() * 3);
		out.push({
			id: `m${n++}`,
			kind: "mob",
			species,
			x: x * 32 + 16,
			y: y * 32 + 16,
			level,
			template: def.template,
			type: def.type
		});
	}
	for (let y = 6; y < h - 6; y += 15) for (let x = 6; x < w - 6; x += 17) {
		const t = tiles[idx(x, y, w)];
		const biome = BIOMES[t.biome] ?? "verdant";
		if (t.block || t.floor === 1 || t.floor === 2 || t.floor === 3 || t.floor === 9) continue;
		if (reached && !reached[idx(x, y, w)]) continue;
		if (rng() > .62) continue;
		const list = ANIMAL_BIOME[biome];
		if (!list?.length) continue;
		const species = list[Math.floor(rng() * list.length)];
		const def = ANIMAL_BY_ID[species];
		out.push({
			id: `a${n++}`,
			kind: "mob",
			species,
			x: x * 32 + 16,
			y: y * 32 + 16,
			level: 1 + Math.floor(rng() * 4),
			template: def.template,
			type: def.type,
			animal: true
		});
	}
	for (const p of POIS) if (p.kind === "boss") {
		const at = scaleTile(p.tx, p.ty);
		out.push({
			id: p.id,
			kind: "mob",
			species: "saintling",
			boss: true,
			bossId: p.id,
			x: at.tx * 32 + 16,
			y: at.ty * 32 + 16,
			level: p.level,
			template: p.template,
			type: p.type
		});
	}
	return out;
}
var FLOOR_COLOR = [
	"#4f9a45",
	"#6e6258",
	"#2a78b0",
	"#cbb89a",
	"#e4d2a4",
	"#e7f3fb",
	"#c56a3c",
	"#7d62c8",
	"#a08478",
	"#c6b18e"
];
function paintWorld(world) {
	const c = document.createElement("canvas");
	c.width = world.w * 32;
	c.height = world.h * 32;
	const g = c.getContext("2d");
	for (let y = 0; y < world.h; y++) for (let x = 0; x < world.w; x++) {
		const t = world.tiles[idx(x, y, world.w)];
		g.fillStyle = FLOOR_COLOR[t.floor] ?? "#333";
		g.fillRect(x * 32, y * 32, 32, 32);
		if ((x + y) % 2 === 0) {
			g.fillStyle = "rgba(0,0,0,0.08)";
			g.fillRect(x * 32, y * 32, 32, 32);
		}
		if (t.floor === 1) {
			g.fillStyle = "#3a322c";
			g.fillRect(x * 32 + 2, y * 32 + 2, 28, 28);
			g.fillStyle = "#1a1412";
			g.fillRect(x * 32 + 4, y * 32 + 6, 24, 6);
		}
		if (t.floor === 3) {
			g.fillStyle = "#4a4038";
			g.fillRect(x * 32 + 6, y * 32 + 14, 6, 4);
			g.fillRect(x * 32 + 18, y * 32 + 14, 6, 4);
		}
		if (t.decor === 1) {} else if (t.decor === 2) {
			g.fillStyle = "#3a3430";
			g.beginPath();
			g.ellipse(x * 32 + 16, y * 32 + 18, 10, 7, 0, 0, Math.PI * 2);
			g.fill();
		} else if (t.decor === 3) {
			g.fillStyle = "#8fd06a";
			g.fillRect(x * 32 + 14, y * 32 + 16, 2, 8);
			g.fillRect(x * 32 + 18, y * 32 + 14, 2, 10);
		} else if (t.decor === 4) {
			g.fillStyle = "#e8dcc4";
			g.fillRect(x * 32 + 14, y * 32 + 16, 4, 8);
			g.fillRect(x * 32 + 12, y * 32 + 14, 8, 3);
		} else if (t.decor === 5 && BIOMES[t.biome] === "ashen") {
			g.fillStyle = "#e25a32";
			g.fillRect(x * 32 + 15, y * 32 + 18, 2, 6);
		}
		if (t.floor === 2) {
			g.fillStyle = "rgba(180,220,255,0.25)";
			g.fillRect(x * 32, y * 32 + 8 + x * 3 % 6, 32, 2);
		}
	}
	for (let y = 0; y < world.h; y++) for (let x = 0; x < world.w; x++) if (world.tiles[idx(x, y, world.w)].decor === 1) paintTree(g, x * 32 + 16, y * 32 + 28);
	for (const p of POIS) {
		if (p.kind !== "node" || p.node !== "tree") continue;
		const at = scaleTile(p.tx, p.ty);
		paintTree(g, at.tx * 32 + 16, at.ty * 32 + 26);
	}
	for (const p of POIS) {
		if (p.kind !== "shrine" && p.kind !== "dungeon") continue;
		const at = scaleTile(p.tx, p.ty);
		const x = at.tx * 32 + 16;
		const y = at.ty * 32 + 28;
		if (p.kind === "shrine") paintArena(g, x, y);
		else paintRift(g, x, y);
	}
	world.cache = c;
	return c;
}
/** Paint only the camera window. The overworld is too large for one bitmap. */
function drawWorldSlice(ctx, world, camX, camY, viewW, viewH, zoom) {
	const z = Math.max(.2, zoom);
	const pad = 150;
	const left = camX - viewW / (2 * z) - pad;
	const top = camY - viewH / (2 * z) - pad;
	const right = camX + viewW / (2 * z) + pad;
	const bottom = camY + viewH / (2 * z) + pad;
	const x0 = Math.max(0, Math.floor(left / 32));
	const y0 = Math.max(0, Math.floor(top / 32));
	const x1 = Math.min(world.w - 1, Math.ceil(right / 32));
	const y1 = Math.min(world.h - 1, Math.ceil(bottom / 32));
	for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
		const t = world.tiles[idx(x, y, world.w)];
		ctx.fillStyle = FLOOR_COLOR[t.floor] ?? "#333";
		ctx.fillRect(x * 32, y * 32, 32, 32);
		if ((x + y) % 2 === 0) {
			ctx.fillStyle = "rgba(0,0,0,0.08)";
			ctx.fillRect(x * 32, y * 32, 32, 32);
		}
		if (t.floor === 1) {
			ctx.fillStyle = "#3a322c";
			ctx.fillRect(x * 32 + 2, y * 32 + 2, 28, 28);
			ctx.fillStyle = "#1a1412";
			ctx.fillRect(x * 32 + 4, y * 32 + 6, 24, 6);
		}
		if (t.floor === 3) {
			ctx.fillStyle = "#4a4038";
			ctx.fillRect(x * 32 + 6, y * 32 + 14, 6, 4);
			ctx.fillRect(x * 32 + 18, y * 32 + 14, 6, 4);
		}
		if (t.decor === 2) {
			ctx.fillStyle = "#3a3430";
			ctx.beginPath();
			ctx.ellipse(x * 32 + 16, y * 32 + 18, 10, 7, 0, 0, Math.PI * 2);
			ctx.fill();
		} else if (t.decor === 3) {
			ctx.fillStyle = "#8fd06a";
			ctx.fillRect(x * 32 + 14, y * 32 + 16, 2, 8);
			ctx.fillRect(x * 32 + 18, y * 32 + 14, 2, 10);
		} else if (t.decor === 4) {
			ctx.fillStyle = "#e8dcc4";
			ctx.fillRect(x * 32 + 14, y * 32 + 16, 4, 8);
			ctx.fillRect(x * 32 + 12, y * 32 + 14, 8, 3);
		} else if (t.decor === 5 && BIOMES[t.biome] === "ashen") {
			ctx.fillStyle = "#e25a32";
			ctx.fillRect(x * 32 + 15, y * 32 + 18, 2, 6);
		}
		if (t.floor === 2) {
			ctx.fillStyle = "rgba(180,220,255,0.25)";
			ctx.fillRect(x * 32, y * 32 + 8 + x * 3 % 6, 32, 2);
		}
		if (t.decor === 6) {
			ctx.fillStyle = "#e6c15a";
			ctx.fillRect(x * 32 + 10, y * 32 + 8, 12, 16);
		}
	}
	for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (world.tiles[idx(x, y, world.w)].decor === 1) paintTree(ctx, x * 32 + 16, y * 32 + 28);
	for (const p of POIS) {
		if (p.kind !== "node" || p.node !== "tree") continue;
		const at = scaleTile(p.tx, p.ty);
		if (at.tx < x0 || at.tx > x1 || at.ty < y0 || at.ty > y1) continue;
		paintTree(ctx, at.tx * 32 + 16, at.ty * 32 + 26);
	}
	for (const p of POIS) {
		if (p.kind !== "shrine" && p.kind !== "dungeon") continue;
		const at = scaleTile(p.tx, p.ty);
		if (at.tx < x0 - 2 || at.tx > x1 + 2 || at.ty < y0 - 2 || at.ty > y1 + 2) continue;
		const x = at.tx * 32 + 16;
		const y = at.ty * 32 + 28;
		if (p.kind === "shrine") paintArena(ctx, x, y);
		else paintRift(ctx, x, y);
	}
}
function paintTree(g, x, y) {
	g.fillStyle = "rgba(0,0,0,0.28)";
	g.beginPath();
	g.ellipse(x, y + 4, 34, 10, 0, 0, Math.PI * 2);
	g.fill();
	g.fillStyle = "#2a180e";
	g.fillRect(x - 7, y - 28, 14, 36);
	g.fillStyle = "#4a2c18";
	g.fillRect(x - 4, y - 46, 4, 18);
	g.fillRect(x + 2, y - 40, 4, 14);
	g.fillStyle = "#1c3e22";
	g.beginPath();
	g.arc(x, y - 58, 46, 0, Math.PI * 2);
	g.fill();
	g.fillStyle = "#245c2c";
	g.beginPath();
	g.arc(x - 22, y - 70, 28, 0, Math.PI * 2);
	g.arc(x + 24, y - 62, 26, 0, Math.PI * 2);
	g.arc(x, y - 84, 24, 0, Math.PI * 2);
	g.fill();
	g.fillStyle = "#8fd06a";
	g.fillRect(x - 3, y - 108, 5, 12);
	g.fillRect(x + 16, y - 88, 4, 8);
	g.fillRect(x - 20, y - 78, 4, 7);
}
function drawRift(g, x, y) {
	g.fillStyle = "rgba(10, 4, 18, 0.45)";
	g.beginPath();
	g.ellipse(x, y + 8, 78, 22, 0, 0, Math.PI * 2);
	g.fill();
	g.fillStyle = "#1a0e28";
	g.beginPath();
	g.moveTo(x - 28, y + 8);
	g.quadraticCurveTo(x - 54, y - 40, x - 18, y - 92);
	g.quadraticCurveTo(x, y - 118, x + 22, y - 88);
	g.quadraticCurveTo(x + 58, y - 36, x + 30, y + 10);
	g.quadraticCurveTo(x, y - 8, x - 28, y + 8);
	g.fill();
	g.fillStyle = "#3a2a88";
	g.beginPath();
	g.moveTo(x - 16, y + 4);
	g.quadraticCurveTo(x - 28, y - 36, x - 8, y - 78);
	g.quadraticCurveTo(x + 2, y - 96, x + 12, y - 74);
	g.quadraticCurveTo(x + 30, y - 30, x + 16, y + 6);
	g.quadraticCurveTo(x, y - 6, x - 16, y + 4);
	g.fill();
	g.fillStyle = "#efe6ff";
	g.beginPath();
	g.ellipse(x, y - 36, 7, 28, -.08, 0, Math.PI * 2);
	g.fill();
	g.strokeStyle = "#b4a6ff";
	g.lineWidth = 4;
	g.beginPath();
	g.moveTo(x - 70, y + 6);
	g.lineTo(x - 36, y - 18);
	g.lineTo(x - 22, y + 10);
	g.moveTo(x + 74, y);
	g.lineTo(x + 34, y - 22);
	g.lineTo(x + 18, y + 8);
	g.stroke();
	g.font = "bold 16px monospace";
	g.textAlign = "center";
	g.fillStyle = "#efe6ff";
	g.fillText("RIFT", x, y - 124);
}
function paintRift(g, x, y) {
	drawRift(g, x, y);
}
function paintArena(g, x, y) {
	g.fillStyle = "rgba(0,0,0,0.28)";
	g.beginPath();
	g.ellipse(x, y + 6, 70, 16, 0, 0, Math.PI * 2);
	g.fill();
	g.fillStyle = "#8a7560";
	g.fillRect(x - 62, y - 18, 124, 28);
	g.strokeStyle = "#f0e2c8";
	g.lineWidth = 3;
	g.strokeRect(x - 62, y - 18, 124, 28);
	g.fillStyle = "#d9c6a4";
	g.fillRect(x - 54, y - 78, 12, 64);
	g.fillRect(x + 42, y - 78, 12, 64);
	g.fillRect(x - 18, y - 92, 12, 76);
	g.fillRect(x + 6, y - 92, 12, 76);
	g.fillStyle = "#c4473a";
	g.beginPath();
	g.moveTo(x - 72, y - 70);
	g.lineTo(x, y - 118);
	g.lineTo(x + 72, y - 70);
	g.closePath();
	g.fill();
	g.fillStyle = "#e6c15a";
	g.fillRect(x - 3, y - 108, 6, 16);
	g.fillStyle = "#1a1214";
	g.fillRect(x - 12, y - 16, 24, 22);
	g.fillStyle = "#6a4a32";
	g.fillRect(x - 10, y - 14, 20, 18);
	g.fillStyle = "#e6c15a";
	g.fillRect(x - 2, y - 6, 4, 8);
	g.font = "bold 15px monospace";
	g.textAlign = "center";
	g.fillStyle = "#1a1214";
	g.fillText("ARENA", x + 1, y - 123);
	g.fillStyle = "#fff1a8";
	g.fillText("ARENA", x, y - 124);
}
function buildDungeon(kind, seed) {
	const w = kind === "crypt" ? 34 : 30;
	const h = kind === "crypt" ? 22 : 20;
	const tiles = [];
	for (let i = 0; i < w * h; i++) tiles.push({
		floor: kind === "crypt" ? 8 : 6,
		biome: kind === "crypt" ? 4 : 6,
		block: 1,
		decor: 0
	});
	const rooms = kind === "crypt" ? [
		[
			2,
			2,
			8,
			6
		],
		[
			14,
			2,
			8,
			6
		],
		[
			24,
			3,
			8,
			6
		],
		[
			4,
			12,
			10,
			7
		],
		[
			18,
			11,
			13,
			8
		]
	] : [
		[
			2,
			2,
			8,
			6
		],
		[
			12,
			3,
			8,
			5
		],
		[
			20,
			2,
			8,
			6
		],
		[
			6,
			11,
			10,
			6
		],
		[
			16,
			10,
			12,
			8
		]
	];
	const carve = (x, y, rw, rh) => {
		for (let yy = y; yy < y + rh; yy++) for (let xx = x; xx < x + rw; xx++) {
			const t = tiles[yy * w + xx];
			if (t) t.block = 0;
		}
	};
	for (const r of rooms) carve(r[0], r[1], r[2], r[3]);
	for (let i = 0; i < rooms.length - 1; i++) {
		const a = rooms[i];
		const b = rooms[i + 1];
		const x0 = a[0] + Math.floor(a[2] / 2);
		const y0 = a[1] + Math.floor(a[3] / 2);
		const x1 = b[0] + Math.floor(b[2] / 2);
		const y1 = b[1] + Math.floor(b[3] / 2);
		for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) {
			const t = tiles[y0 * w + x];
			if (t) t.block = 0;
			const t2 = tiles[(y0 + 1) * w + x];
			if (t2) t2.block = 0;
		}
		for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) {
			const t = tiles[y * w + x1];
			if (t) t.block = 0;
		}
	}
	const rng = mulberry32(seed + (kind === "crypt" ? 3 : 9));
	const spawns = [];
	const pool = kind === "crypt" ? [
		"gaikotsu",
		"muma",
		"yami",
		"kage"
	] : [
		"onibi",
		"nobi",
		"hinotama",
		"kagaribi"
	];
	rooms.slice(0, -1).forEach((r, i) => {
		for (let k = 0; k < 2; k++) {
			const species = pool[Math.floor(rng() * pool.length)];
			const def = MONSTER_BY_ID[species];
			spawns.push({
				id: `${kind}-${i}-${k}`,
				kind: "mob",
				species,
				x: (r[0] + 2 + k * 3) * 32,
				y: (r[1] + 3) * 32,
				level: (kind === "crypt" ? 8 : 7) + i,
				template: def.template,
				type: def.type
			});
		}
	});
	const bossRoom = rooms[rooms.length - 1];
	spawns.push({
		id: kind === "crypt" ? "bone_king" : "ash_regent",
		kind: "mob",
		species: kind === "crypt" ? "gaikotsu" : "kagaribi",
		boss: true,
		bossId: kind === "crypt" ? "bone_king" : "ash_regent",
		x: (bossRoom[0] + 6) * 32,
		y: (bossRoom[1] + 4) * 32,
		level: kind === "crypt" ? 18 : 16,
		template: kind === "crypt" ? 22 : 3,
		type: kind === "crypt" ? "ghoul" : "fire"
	});
	return {
		w,
		h,
		tiles,
		spawns,
		cache: null
	};
}
function blocked(world, x, y) {
	const tx = Math.floor(x / 32);
	const ty = Math.floor(y / 32);
	if (tx < 0 || ty < 0 || tx >= world.w || ty >= world.h) return true;
	if (tx <= 1 || ty <= 1 || tx >= world.w - 2 || ty >= world.h - 2) return true;
	const t = world.tiles[ty * world.w + tx];
	if (t.floor === 1 || t.floor === 2) return true;
	if (t.decor > 0) return false;
	return t.block === 1;
}
function biomeNameAt(world, x, y) {
	const tx = Math.max(0, Math.min(world.w - 1, Math.floor(x / 32)));
	const ty = Math.max(0, Math.min(world.h - 1, Math.floor(y / 32)));
	return BIOMES[world.tiles[ty * world.w + tx].biome] ?? "crown";
}
var BIOME_LABEL = {
	crown: "Crownfall Citadel",
	verdant: "Verdant Hollow",
	frost: "Frost Marches",
	void: "Void Expanse",
	tide: "Tide Reach",
	ashen: "Ashen Wastes",
	bone: "Bone Garden"
};
function dungeonExit() {
	return {
		x: 128,
		y: 128
	};
}
var WORLD_RETURN = {
	crypt: (() => {
		const p = scaleTile(41, 47);
		return {
			x: p.tx * 32 + 16,
			y: p.ty * 32
		};
	})(),
	kiln: (() => {
		const p = scaleTile(18, 55);
		return {
			x: p.tx * 32 + 16,
			y: p.ty * 32
		};
	})()
};
var SAVE_KEY = "turbz-v3";
var emptySnap = () => ({
	mode: "title",
	hasSave: false,
	panel: null,
	name: "",
	race: "vesper",
	level: 1,
	xp: 0,
	xpNeed: 30,
	hp: 80,
	maxHp: 80,
	shield: 0,
	kyo: 0,
	region: "Crownfall Citadel",
	map: "world",
	bar: [],
	log: [],
	questName: "First Steps",
	questAbout: "Win 3 battles anywhere.",
	notice: "",
	talk: null,
	gear: [],
	equipped: [],
	setLabel: "",
	setBonus: "",
	setCount: 0,
	totals: [],
	skills: [],
	bag: [],
	death: [],
	peers: [],
	roomCode: "",
	net: "",
	chat: [],
	trade: null,
	shrine: "",
	companion: "No spirit",
	box: [],
	known: [],
	stash: [],
	selected: null,
	aim: "Click ground to walk. Close range swings on its own.",
	stock: [],
	wares: [],
	accountLevel: 1,
	accountXp: 0,
	accountNeed: 140,
	perkPoints: 0,
	perks: [],
	bounty: "",
	bountyPlace: "",
	unlocked: [],
	hint: "",
	foe: "",
	menu: null,
	mapX: 0,
	mapY: 0,
	party: [],
	autoplay: false,
	grind: "",
	accountScore: 0,
	turn: ""
});
var snap = emptySnap();
var listeners = /* @__PURE__ */ new Set();
function subscribe(fn) {
	listeners.add(fn);
	return () => listeners.delete(fn);
}
function getSnap() {
	return snap;
}
function publish(p) {
	snap = {
		...snap,
		...p
	};
	listeners.forEach((l) => l());
}
function blankSkills() {
	const s = {};
	for (const sk of SKILLS) s[sk.id] = {
		level: 1,
		xp: 0
	};
	return s;
}
function blankQuests() {
	const q = {};
	for (const d of QUESTS) q[d.id] = {
		n: 0,
		n2: 0,
		done: false
	};
	return q;
}
var TurbzGame = class {
	canvas;
	ctx;
	mates = [];
	mateCd = {};
	fightGap = 0;
	turnQ = [];
	fought = false;
	constructor(canvas) {
		this.canvas = canvas;
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("canvas");
		this.ctx = ctx;
		this.selfId = `p${Math.random().toString(36).slice(2, 10)}`;
		this.keys = /* @__PURE__ */ new Set();
		this.qa = /* @__PURE__ */ new Set();
		this.stick = {
			x: 0,
			y: 0
		};
		this.cam = {
			x: 400,
			y: 400
		};
		this.mobs = [];
		this.cds = {};
		this.status = [];
		this.parts = [];
		this.floats = [];
		this.remotes = /* @__PURE__ */ new Map();
		this.peers = [];
		this.chat = [];
		this.seenSwing = /* @__PURE__ */ new Map();
		this.nodeCd = {};
		this.path = [];
		this.shopStock = [];
		this.zoom = 2.35;
		this.facing = 1;
		this.role = "solo";
		this.log = ["The veil remembers your skills. It does not remember your pockets."];
		this.buff = {
			crit: 0,
			ward: 0,
			t: 0
		};
		this.pet = {
			x: 0,
			y: 0
		};
		this.running = false;
		this.acc = 0;
		this.last = 0;
		this.clock = 0;
		this.role = "solo";
		this.dead = false;
		this.vx = 0;
		this.vy = 0;
		this.walk = 0;
		this.hurt = 0;
		this.attackT = 0;
		this.shake = 0;
		this.combat = 0;
		this.shield = 0;
		this.wardT = 0;
		this.rollT = 0;
		this.castLock = 0;
		this.autoCd = 0;
		this.netAcc = 0;
		this.mobAcc = 0;
		this.setProc = 0;
		this.zoom = 2.35;
	}
	start() {
		this.running = true;
		this.bind();
		this.resize();
		publish({
			hasSave: !!localStorage.getItem(SAVE_KEY),
			mode: "title"
		});
		this.last = performance.now();
		const loop = (t) => {
			if (!this.running) return;
			const dt = Math.min(.05, (t - this.last) / 1e3);
			this.last = t;
			this.acc += dt;
			while (this.acc >= 1 / 60) {
				this.step(1 / 60);
				this.acc -= 1 / 60;
			}
			this.draw();
			this.raf = requestAnimationFrame(loop);
		};
		this.raf = requestAnimationFrame(loop);
		window.__turbz = this;
		window.__controlsTest = {
			getYaw: () => this.facing < 0 ? .4 : -.4,
			getSpeed: () => Math.hypot(this.vx, this.vy),
			setKeys: (codes) => {
				this.qa = new Set(codes);
			},
			getPos: () => ({
				x: this.save?.x ?? 0,
				y: this.save?.y ?? 0
			})
		};
	}
	stop() {
		this.running = false;
		cancelAnimationFrame(this.raf);
		this.room?.close();
		this.room = null;
	}
	setStick(x, y) {
		this.stick.x = x;
		this.stick.y = y;
	}
	setKeys(codes) {
		this.qa = new Set(codes);
	}
	bind() {
		const down = (e) => {
			this.keys.add(e.code);
			if (this.typing()) return;
			if ([
				"ArrowUp",
				"ArrowDown",
				"ArrowLeft",
				"ArrowRight",
				"Space"
			].includes(e.code)) e.preventDefault();
			if (e.code.startsWith("Digit")) {
				const digit = Number(e.code.slice(5));
				if (digit >= 1 && digit <= 9) this.cast(digit - 1);
			}
			if (e.code === "KeyE") this.interact();
			if (e.code === "KeyI" || e.code === "KeyB") this.toggle("bag");
			if (e.code === "KeyK") this.toggle("skills");
			if (e.code === "KeyQ") this.toggle("quests");
			if (e.code === "KeyM") this.toggle("map");
			if (e.code === "KeyG") this.toggle("ghost");
			if (e.code === "KeyT") this.toggleTrade();
			if (e.code === "Escape") this.escape();
			this.unlock();
		};
		const up = (e) => this.keys.delete(e.code);
		window.addEventListener("keydown", down);
		window.addEventListener("keyup", up);
		window.addEventListener("blur", () => {
			this.keys.clear();
			this.qa.clear();
		});
		this.canvas.addEventListener("contextmenu", (e) => {
			e.preventDefault();
			const w = this.screenToWorld(e.clientX, e.clientY);
			const r = this.canvas.getBoundingClientRect();
			this.openInspect(w.x, w.y, e.clientX - r.left, e.clientY - r.top);
		});
		this.canvas.addEventListener("pointerdown", (e) => {
			this.unlock();
			if (e.button === 2) return;
			this.menu = null;
			this.canvas.setPointerCapture(e.pointerId);
			const w = this.screenToWorld(e.clientX, e.clientY);
			this.pointer = {
				x: w.x,
				y: w.y,
				down: true
			};
			this.pointAt(w.x, w.y);
		});
		this.canvas.addEventListener("pointermove", (e) => {
			const w = this.screenToWorld(e.clientX, e.clientY);
			this.hoverAt(w.x, w.y);
			if (!this.pointer?.down) return;
			this.pointer = {
				x: w.x,
				y: w.y,
				down: true
			};
			this.pointAt(w.x, w.y);
		});
		this.canvas.addEventListener("pointerup", () => {
			if (this.pointer) this.pointer.down = false;
		});
		this.canvas.addEventListener("wheel", (e) => {
			e.preventDefault();
			this.zoom = Math.max(1.15, Math.min(3, this.zoom * (e.deltaY > 0 ? .92 : 1.08)));
		}, { passive: false });
		window.addEventListener("resize", () => this.resize());
	}
	typing() {
		const a = document.activeElement;
		return !!a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA");
	}
	unlock() {
		if (!this.audio) {
			const AC = window.AudioContext || window.webkitAudioContext;
			if (AC) this.audio = new AC();
		}
		this.audio?.resume();
		if (!this.musicTried) {
			this.musicTried = true;
			this.playMusic("veil.ogg");
		}
	}
	async playMusic(file) {
		try {
			if (!(await fetch(`/music/${file}`, { method: "HEAD" })).ok) {
				const alt = file.replace(/\.ogg$/, ".mp3");
				if (alt === file) return;
				if (!(await fetch(`/music/${alt}`, { method: "HEAD" })).ok) return;
				file = alt;
			}
			const audio = new Audio(`/music/${file}`);
			audio.loop = true;
			audio.volume = .35;
			await audio.play();
		} catch {}
	}
	tone(freq, dur, type = "square") {
		if (!this.audio) return;
		const o = this.audio.createOscillator();
		const g = this.audio.createGain();
		o.type = type;
		o.frequency.value = freq;
		g.gain.value = .035;
		o.connect(g);
		g.connect(this.audio.destination);
		o.start();
		o.stop(this.audio.currentTime + dur);
	}
	resize() {
		const dpr = Math.min(1.75, window.devicePixelRatio || 1);
		const r = this.canvas.getBoundingClientRect();
		this.canvas.width = Math.max(1, Math.floor(r.width * dpr));
		this.canvas.height = Math.max(1, Math.floor(r.height * dpr));
	}
	cssSize() {
		const r = this.canvas.getBoundingClientRect();
		const dpr = this.canvas.width / Math.max(1, r.width);
		return {
			w: r.width,
			h: r.height,
			dpr
		};
	}
	screenToWorld(cx, cy) {
		const r = this.canvas.getBoundingClientRect();
		const { w, h } = this.cssSize();
		const x = (cx - r.left) / r.width * w;
		const y = (cy - r.top) / r.height * h;
		return {
			x: this.cam.x + (x - w / 2) / this.zoom,
			y: this.cam.y + (y - h / 2) / this.zoom
		};
	}
	say(text) {
		this.log.unshift(text);
		this.log = this.log.slice(0, 6);
		this.syncHud(true);
	}
	begin(name, race, as) {
		const seed = Math.random() * 1e9 | 0;
		const rng = mulberry32(seed ^ 91);
		const type = RACES.find((r) => r.id === race).type;
		const weapon = rollGear(rng, {
			level: 1,
			slot: "weapon",
			floor: "common",
			typeBias: type,
			raceBias: race
		});
		const known = rollInnate(rng);
		const home = hearthXY();
		const save = {
			v: 3,
			name: (name || "Huntress").slice(0, 16),
			race,
			seed,
			x: home.x,
			y: home.y,
			map: "world",
			level: 1,
			xp: 0,
			kyo: 40,
			hp: 90,
			bag: {
				potion: 3,
				ghost_jar: 2,
				cleanse_salt: 0,
				leather: 0,
				mushroom: 0
			},
			gear: [weapon],
			equipped: { weapon: weapon.uid },
			known,
			bar: known,
			skills: blankSkills(),
			quests: blankQuests(),
			wins: 0,
			catches: {},
			regions: ["crown"],
			companion: null,
			box: [],
			bosses: {},
			talked: [],
			bestShrine: 0,
			stash: [],
			saltTurned: 0,
			accountLevel: 1,
			accountXp: 0,
			perkPoints: 0,
			perks: {},
			lastTavern: "crown_tap",
			innate: known,
			party: [],
			found: {},
			spirits: [],
			accountScore: 0,
			evilMark: 0,
			deathBanked: false
		};
		this.boot(save);
		this.say(`${save.name} wakes at the Crownfall hearth.`);
		if (as) this.openRoom(as.role, as.code);
		this.tone(220, .12);
	}
	continueGame(as) {
		const cached = this.cloudCache;
		const raw = cached ? JSON.stringify(cached) : localStorage.getItem(SAVE_KEY);
		if (!raw) return false;
		try {
			this.boot(JSON.parse(raw));
			this.say("The hearth kept your skills.");
			if (as) this.openRoom(as.role, as.code);
			return true;
		} catch {
			return false;
		}
	}
	boot(save) {
		this.normalize(save);
		this.save = save;
		this.dead = false;
		this.secondUsed = false;
		this.status = [];
		this.shield = 0;
		this.dest = null;
		this.shrine = null;
		this.mobs = this.mobs ?? [];
		this.cds = this.cds ?? {};
		this.parts = this.parts ?? [];
		this.floats = this.floats ?? [];
		this.remotes = this.remotes ?? /* @__PURE__ */ new Map();
		this.seenSwing = this.seenSwing ?? /* @__PURE__ */ new Map();
		this.nodeCd = this.nodeCd ?? {};
		this.keys = this.keys ?? /* @__PURE__ */ new Set();
		this.qa = this.qa ?? /* @__PURE__ */ new Set();
		this.loadMap(save.map, false);
		if (blocked(this.world, save.x, save.y)) {
			const home = nearestOpen(this.world, hearthXY().x, hearthXY().y);
			save.x = home.x;
			save.y = home.y;
			save.map = "world";
			this.loadMap("world", false);
		}
		this.cam.x = save.x;
		this.cam.y = save.y;
		publish({
			mode: "play",
			panel: null,
			hasSave: true
		});
		this.syncHud(true);
		this.persist();
	}
	loadMap(map, freshMobs) {
		const save = this.save;
		if (!save) return;
		if (map === "world") {
			if (!this.overworld) this.overworld = buildWorld(save.seed);
			this.world = this.overworld;
			this.world.cache = null;
		} else {
			this.world = buildDungeon(map, save.seed);
			paintWorld(this.world);
		}
		const witch = this.mobs.find((m) => m.witch && m.alive) ?? null;
		if (freshMobs || this.mobs.length === 0 || map !== "world") {
			this.mobs = this.world.spawns.filter((s) => s.kind === "mob").map((s) => this.makeMob(s));
			if (map === "world" && witch) this.mobs.push(witch);
		}
		save.map = map;
	}
	makeMob(s) {
		const species = s.species ?? "onibi";
		const def = MONSTER_BY_ID[species] ?? ANIMAL_BY_ID[species] ?? MONSTER_BY_ID.onibi;
		const animal = !!(s.animal || def.animal);
		const spiritKind = def.type === "spirit" || def.template === 16 || def.template === 23;
		const ghost = !animal && (spiritKind || Math.random() < .55);
		const hunter = Math.max(1, this.save?.level ?? s.level ?? 1);
		const level = s.boss ? Math.max(s.level, hunter + 1 + (Math.random() * 4 | 0)) : levelNearHunter(hunter, Math.random());
		const rarity = rarityForLevel(level, Math.random(), !!s.boss);
		const max = animal ? Math.floor(14 + level * 7) : Math.floor((26 + level * 16) * (s.boss ? 6.5 : 1) * (1 + rarity * .45));
		const type = s.type || def.type;
		const moves = MOVES.filter((m) => m.type === type && m.effect !== "mend" && m.effect !== "shell");
		const ranged = moves.filter((m) => attackForm(m) !== "melee");
		const spell = moves.filter((m) => attackForm(m) === "spell");
		const picked = animal ? "measured" : (ranged[rarity % Math.max(1, ranged.length)] ?? spell[0] ?? moves[0] ?? MOVES[0]).id;
		const lookRng = mulberry32(s.x * 13 + s.y * 97 + level * 17 + rarity * 41 + Math.floor(Math.random() * 1e6) >>> 0 || 1);
		const look = ghost ? rollGhostLook(lookRng, rarity, picked, s.boss ? "hunt" : void 0) : null;
		const speed = 8 + level + rarity * 4 + (look?.aggression === "hunt" ? 3 : 0) + (s.boss ? 6 : 0);
		return {
			id: s.id,
			species,
			name: s.name ?? (s.bossId ? bossName(s.bossId) : def.name),
			type,
			template: s.template ?? def.template,
			x: s.x,
			y: s.y,
			hp: max,
			max,
			level,
			boss: !!s.boss,
			bossId: s.bossId,
			homeX: s.x,
			homeY: s.y,
			cd: 0,
			hurt: 0,
			status: [],
			alive: true,
			respawn: 0,
			rarity,
			facing: 1,
			walk: Math.random() * 6,
			swing: 0,
			move: picked,
			animal,
			witch: false,
			race: null,
			lootGear: [],
			lootBag: {},
			lootKyo: 0,
			huntIn: 0,
			seen: false,
			ghost,
			look,
			speed,
			master: "",
			aggro: look?.aggression === "hunt"
		};
	}
	step(dt) {
		if (!this.save || snap.mode !== "play" || this.dead) {
			this.vx = 0;
			this.vy = 0;
			return;
		}
		if (snap.panel === "pause" || snap.panel === "death") {
			this.vx = 0;
			this.vy = 0;
			return;
		}
		this.tickPlayer(dt);
		if (this.role !== "guest") this.tickMobs(dt);
		else this.tickGuestHurt(dt);
		this.tickSpirits(dt);
		this.tickTurns(dt);
		this.tickParty(dt);
		this.tickFx(dt);
		this.netAcc += dt;
		if (this.netAcc > .1) {
			this.netAcc = 0;
			this.broadcastPos();
		}
		this.mobAcc += dt;
		if (this.role === "host" && this.mobAcc > .25) {
			this.mobAcc = 0;
			this.broadcastMobs();
		}
		this.syncHud(false);
	}
	held(code) {
		return this.keys.has(code) || this.qa.has(code);
	}
	tickPlayer(dt) {
		const save = this.save;
		this.clock += dt;
		const rooted = this.status.some((s) => s.id === "root" && s.t > 0);
		this.status.some((s) => s.id === "sleep" && s.t > 0);
		this.wardT = Math.max(0, this.wardT - dt);
		this.rollT = Math.max(0, this.rollT - dt);
		this.castLock = Math.max(0, this.castLock - dt);
		if (this.lunge) this.tickLunge(dt);
		else if (this.autoplay) this.tickAutoplay(dt);
		else {
			let ix = 0;
			let iy = 0;
			if (this.held("KeyA") || this.held("ArrowLeft")) ix -= 1;
			if (this.held("KeyD") || this.held("ArrowRight")) ix += 1;
			if (this.held("KeyW") || this.held("ArrowUp")) iy -= 1;
			if (this.held("KeyS") || this.held("ArrowDown")) iy += 1;
			if (this.stick.x || this.stick.y) {
				ix = this.stick.x;
				iy = this.stick.y;
			}
			if (ix === 0 && iy === 0 && this.dest && !rooted) {
				const dx = this.dest.x - save.x;
				const dy = this.dest.y - save.y;
				const l = Math.hypot(dx, dy);
				if ((this.dest.mob ? this.mobs.find((m) => m.id === this.dest.mob && m.alive) : null) && l <= 52) this.dest = null;
				else if (l < 6) this.dest = null;
				else {
					ix = dx / l;
					iy = dy / l;
				}
			}
			const mag = Math.hypot(ix, iy) || 1;
			const soak = this.status.some((s) => s.id === "soak");
			const speed = (rooted ? 0 : 118) * (soak ? .62 : 1);
			this.vx = ix / mag * speed;
			this.vy = iy / mag * speed;
			if (Math.abs(ix) > .2 || Math.abs(iy) > .2) {
				this.tryMove(this.vx * dt, this.vy * dt);
				this.walk += dt * 6;
				if (ix < -.15) this.facing = -1;
				else if (ix > .15) this.facing = 1;
			}
		}
		this.cam.x += (save.x - this.cam.x) * Math.min(1, dt * 8);
		this.cam.y += (save.y - this.cam.y) * Math.min(1, dt * 8);
		for (const id of Object.keys(this.cds)) this.cds[id] = Math.max(0, (this.cds[id] ?? 0) - dt);
		this.status.forEach((s) => s.t -= dt);
		this.status = this.status.filter((s) => s.t > 0);
		if (this.buff.t > 0) this.buff.t -= dt;
		this.hurt = Math.max(0, this.hurt - dt * 3);
		this.attackT = Math.max(0, this.attackT - dt * 3);
		if (this.status.find((s) => s.id === "burn")) this.hurtSelf(8 * dt, "burn");
		const adv = save.skills.adventuring.level;
		if (this.combat <= 0) save.hp = Math.min(this.maxHp(), save.hp + (1.2 + adv * .15) * dt);
		this.combat = Math.max(0, this.combat - dt);
		if (this.channel) {
			this.channel.t += dt;
			if (this.channel.t >= this.channel.need) this.finishChannel();
		}
		this.visitRegion();
		this.autoHarvest();
		const set = this.setInfo();
		if (set.on && set.fx && this.combat > 0) {
			this.setProc += dt;
			if (this.setProc > 6.2) {
				this.setProc = 0;
				this.procSet(set.fx);
			}
		}
	}
	tryMove(dx, dy) {
		const save = this.save;
		const world = this.world;
		const hit = (x, y) => blocked(world, x, y) || blocked(world, x - 7, y) || blocked(world, x + 7, y) || blocked(world, x, y - 6);
		if (!hit(save.x + dx, save.y)) save.x += dx;
		if (!hit(save.x, save.y + dy)) save.y += dy;
	}
	tickAutoplay(dt) {
		const save = this.save;
		if (this.dead || !this.world) return;
		const hpPct = save.hp / Math.max(1, this.maxHp());
		const threat = this.nearestMob(save.x, save.y, 90);
		if (hpPct < .34 && threat) {
			const ang = Math.atan2(save.y - threat.y, save.x - threat.x);
			this.stepToward(save.x + Math.cos(ang) * 80, save.y + Math.sin(ang) * 80, dt);
			return;
		}
		if (Math.hypot(save.x - this.stuckX, save.y - this.stuckY) < 4) this.stuckT += dt;
		else {
			this.stuckT = 0;
			this.stuckX = save.x;
			this.stuckY = save.y;
		}
		if (this.stuckT > 1.2) {
			this.stuckT = 0;
			this.path = [];
			this.pathI = 0;
			this.autoPlan = 0;
		}
		this.autoPlan -= dt;
		let step = this.path[this.pathI];
		if (!step && this.autoPlan <= 0) {
			this.autoPlan = 1.8;
			this.planGrind();
			step = this.path[this.pathI];
		}
		if (!step) return;
		if (this.stepToward(step.x, step.y, dt) < 14) {
			this.pathI += 1;
			if (!this.path[this.pathI]) this.autoPlan = 0;
		}
	}
	stepToward(x, y, dt) {
		const save = this.save;
		const dx = x - save.x;
		const dy = y - save.y;
		const l = Math.hypot(dx, dy) || 1;
		const rooted = this.status.some((s) => s.id === "root" && s.t > 0);
		const soak = this.status.some((s) => s.id === "soak");
		const speed = (rooted ? 0 : 118) * (soak ? .62 : 1);
		this.tryMove(dx / l * speed * dt, dy / l * speed * dt);
		this.walk += dt * 6;
		if (dx < -2) this.facing = -1;
		else if (dx > 2) this.facing = 1;
		return Math.hypot(x - save.x, y - save.y);
	}
	planGrind() {
		const save = this.save;
		if (!save) return;
		const order = Object.keys(save.skills).sort((a, b) => {
			const A = save.skills[a];
			const B = save.skills[b];
			return A.level - B.level || A.xp - B.xp;
		});
		for (const id of order) if (this.aimSkill(id)) {
			this.grind = id;
			return;
		}
		this.grind = "wander";
		const ang = Math.random() * Math.PI * 2;
		this.walkTo(save.x + Math.cos(ang) * 180, save.y + Math.sin(ang) * 180);
	}
	aimSkill(id) {
		const save = this.save;
		if (id === "mining" || id === "woodcutting" || id === "fishing" || id === "shroom") {
			const node = id === "mining" ? "ore" : id === "woodcutting" ? "tree" : id === "fishing" ? "fish" : "shroom";
			const at = this.nearestNode(node);
			return at ? this.walkTo(at.x, at.y) : false;
		}
		if (id === "trading") {
			if ([
				"meat",
				"leather",
				"mushroom",
				"ore",
				"timber",
				"fish"
			].reduce((n, k) => n + (save.bag[k] ?? 0), 0) > 0) {
				this.sellMats();
				this.path = [];
				return true;
			}
			const beast = this.mobs.find((m) => m.alive && m.animal) ?? this.nearestMob(save.x, save.y, 2e3);
			return beast ? this.walkTo(beast.x, beast.y) : false;
		}
		if (id === "alchemy") {
			if ((save.bag.dreamspore ?? 0) > 0 && (save.bag.embercap ?? 0) > 0) {
				this.brew("warmth");
				return true;
			}
			if ((save.bag.ironroot ?? 0) > 0 && (save.bag.mushroom ?? 0) > 0) {
				this.brew("ward");
				return true;
			}
			if ((save.bag.dreamspore ?? 0) > 0 && (save.bag.blue_lantern ?? 0) > 0) {
				this.brew("eye");
				return true;
			}
			const at = this.nearestNode("shroom");
			return at ? this.walkTo(at.x, at.y) : false;
		}
		if (id === "social") {
			let best = null;
			let bd = 1e9;
			for (const n of NPCS) {
				if (n.map !== "world") continue;
				const at = scaleTile(n.tx, n.ty);
				const x = at.tx * 32 + 16;
				const y = at.ty * 32 + 20;
				const d = Math.hypot(x - save.x, y - save.y);
				if (d < 48) {
					this.gainSkill("social", 8);
					this.say(`A word with ${n.name}.`);
					this.path = [];
					return true;
				}
				if (d < bd) {
					bd = d;
					best = {
						x,
						y,
						id: n.id,
						name: n.name
					};
				}
			}
			return best ? this.walkTo(best.x, best.y) : false;
		}
		if (id === "adventuring") {
			let far = null;
			let bd = 0;
			for (const p of POIS) {
				if (p.kind !== "shrine" && p.kind !== "dungeon") continue;
				const pos = poiPos(p);
				if (!pos) continue;
				const d = Math.hypot(pos.x - save.x, pos.y - save.y);
				if (d > bd) {
					bd = d;
					far = pos;
				}
			}
			if (far && bd < 80) {
				this.gainSkill("adventuring", 12);
				this.path = [];
				return true;
			}
			return far ? this.walkTo(far.x, far.y) : false;
		}
		if (id === "catching") {
			if ((save.bag.ghost_jar ?? 0) <= 0) {
				const holt = NPCS.find((n) => n.id === "holt");
				if (!holt) return false;
				const at = scaleTile(holt.tx, holt.ty);
				const x = at.tx * 32 + 16;
				const y = at.ty * 32 + 20;
				if (Math.hypot(x - save.x, y - save.y) < 50) {
					const cost = ITEM_BY_ID.ghost_jar ? this.price(ITEM_BY_ID.ghost_jar.price) : 99;
					if (save.kyo < cost) return false;
					this.buyItem("ghost_jar");
					this.path = [];
					return true;
				}
				return this.walkTo(x, y);
			}
			const soft = this.mobs.find((m) => m.alive && !m.boss && m.hp / m.max <= .5);
			if (soft && Math.hypot(soft.x - save.x, soft.y - save.y) < 70) {
				this.catchSpirit();
				this.path = [];
				return true;
			}
			const foe = soft ?? this.nearestMob(save.x, save.y, 2400);
			if (!foe) return false;
			if (Math.hypot(foe.x - save.x, foe.y - save.y) < 64) {
				this.path = [];
				return true;
			}
			return this.walkTo(foe.x, foe.y);
		}
		const foe = this.nearestMob(save.x, save.y, 2600);
		if (!foe) return false;
		if (Math.hypot(foe.x - save.x, foe.y - save.y) < 70) {
			this.path = [];
			return true;
		}
		return this.walkTo(foe.x, foe.y);
	}
	nearestNode(node) {
		const save = this.save;
		let best = null;
		let bd = 1e9;
		let any = null;
		let ad = 1e9;
		for (const p of POIS) {
			if (p.kind !== "node" || p.node !== node) continue;
			const pos = poiPos(p);
			if (!pos) continue;
			const d = Math.hypot(pos.x - save.x, pos.y - save.y);
			if (d < ad) {
				ad = d;
				any = pos;
			}
			if ((this.nodeCd[p.id] ?? 0) > 2) continue;
			if (d < bd) {
				bd = d;
				best = pos;
			}
		}
		return best ?? any;
	}
	walkTo(x, y) {
		const save = this.save;
		const path = this.findPath(x, y);
		if (!save || !path.length) return false;
		const last = path[path.length - 1];
		if (Math.hypot(last.x - x, last.y - y) > 256 && Math.hypot(last.x - save.x, last.y - save.y) < 32) return false;
		this.path = path;
		this.pathI = 0;
		return true;
	}
	findPath(x, y) {
		const world = this.world;
		const save = this.save;
		if (!world || !save) return [{
			x,
			y
		}];
		const w = world.w;
		const h = world.h;
		const sx = Math.max(0, Math.min(w - 1, Math.floor(save.x / 32)));
		const sy = Math.max(0, Math.min(h - 1, Math.floor(save.y / 32)));
		let gx = Math.max(0, Math.min(w - 1, Math.floor(x / 32)));
		let gy = Math.max(0, Math.min(h - 1, Math.floor(y / 32)));
		if (blocked(world, gx * 32 + 16, gy * 32 + 16)) {
			let found = false;
			for (let r = 1; r <= 4 && !found; r++) for (let dy = -r; dy <= r && !found; dy++) for (let dx = -r; dx <= r; dx++) {
				const nx = gx + dx;
				const ny = gy + dy;
				if (nx < 2 || ny < 2 || nx >= w - 2 || ny >= h - 2) continue;
				if (!blocked(world, nx * 32 + 16, ny * 32 + 16)) {
					gx = nx;
					gy = ny;
					found = true;
					break;
				}
			}
		}
		const key = (tx, ty) => ty * w + tx;
		const start = key(sx, sy);
		const goal = key(gx, gy);
		const q = [start];
		const prev = /* @__PURE__ */ new Map();
		prev.set(start, -1);
		let qi = 0;
		let hit = -1;
		let best = start;
		let bestD = Math.abs(sx - gx) + Math.abs(sy - gy);
		let guard = 0;
		const dirs = [
			[1, 0],
			[-1, 0],
			[0, 1],
			[0, -1]
		];
		while (qi < q.length && guard < 14e3) {
			guard++;
			const cur = q[qi++];
			if (cur === goal) {
				hit = cur;
				break;
			}
			const cx = cur % w;
			const cy = cur / w | 0;
			const cd = Math.abs(cx - gx) + Math.abs(cy - gy);
			if (cd < bestD) {
				bestD = cd;
				best = cur;
			}
			for (const [dx, dy] of dirs) {
				const nx = cx + dx;
				const ny = cy + dy;
				if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
				const k = key(nx, ny);
				if (prev.has(k)) continue;
				if (blocked(world, nx * 32 + 16, ny * 32 + 16)) continue;
				prev.set(k, cur);
				q.push(k);
			}
		}
		if (hit < 0) hit = best === start ? -1 : best;
		if (hit < 0) return [];
		const raw = [];
		let c = hit;
		while (c !== -1) {
			const tx = c % w;
			const ty = c / w | 0;
			raw.push({
				x: tx * 32 + 16,
				y: ty * 32 + 16
			});
			c = prev.get(c) ?? -1;
		}
		raw.reverse();
		if (raw.length <= 2) return raw;
		const sees = (a, b) => {
			const steps = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 10));
			for (let s = 1; s < steps; s++) {
				const t = s / steps;
				if (blocked(world, a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t)) return false;
			}
			return true;
		};
		const slim = [];
		let i = 0;
		while (i < raw.length - 1) {
			let j = Math.min(raw.length - 1, i + 16);
			while (j > i + 1 && !sees(raw[i], raw[j])) j--;
			slim.push(raw[j]);
			i = j;
		}
		return slim;
	}
	reachOf(id) {
		return attackRange(MOVE_BY_ID[id] ?? MOVES[0]);
	}
	autoMelee(mob) {
		const save = this.save;
		const weapon = this.piece("weapon");
		const type = weapon?.type ?? "normal";
		const tm = typeChart(type, mob.type);
		this.attackT = 1;
		this.facing = mob.x < save.x ? -1 : 1;
		this.playMoveFx(MOVE_BY_ID.measured ?? MOVES[0], save.x, save.y - 20, mob.x, mob.y - 12);
		if (tm === 0) {
			this.float(mob.x, mob.y - 36, "IMMUNE", "#e7d9ff");
			return;
		}
		const phys = 1 + (save.skills.physical.level - 1) * .02;
		let dmg = (11 + save.level * 2.4 + (weapon?.level ?? 1) * 1.6) * phys * this.stab(type) * tm;
		dmg *= 1 + this.chan("might") / 100;
		dmg *= 1 + Math.min(.4, (save.skills.hunting.level - 1) * .004);
		if (mob.boss) dmg *= 1 + this.chan("boss_bane") / 100;
		this.damageMob(mob, Math.max(1, dmg), false);
		this.gainSkill("physical", 2);
		this.combat = 3;
	}
	pointAt(x, y) {
		if (snap.mode !== "play" || this.dead || !this.save) return;
		if (this.save.map === "world") for (const n of NPCS) {
			if (n.map !== "world") continue;
			const at = scaleTile(n.tx, n.ty);
			const nx = at.tx * 32 + 16;
			const ny = at.ty * 32 + 20;
			if (Math.hypot(nx - x, ny - y) > 42) continue;
			if (Math.hypot(this.save.x - nx, this.save.y - ny) <= 64) {
				this.openTalk(n.id);
				this.dest = null;
			} else this.dest = {
				x: nx,
				y: ny + 18,
				mob: null
			};
			return;
		}
		const mob = this.nearestMob(x, y, 28);
		this.dest = {
			x: mob ? mob.x : x,
			y: mob ? mob.y : y,
			mob: mob?.id ?? null
		};
	}
	nearestMob(x, y, r) {
		let best = null;
		let bd = r;
		for (const m of this.mobs) {
			if (!m.alive) continue;
			const d = Math.hypot(m.x - x, m.y - y);
			if (d < bd) {
				bd = d;
				best = m;
			}
		}
		return best;
	}
	cast(index) {
		const save = this.save;
		if (!save) return;
		const id = save.bar[index];
		const move = id ? MOVE_BY_ID[id] : void 0;
		if (move) this.castMove(move);
	}
	arsenal(save) {
		const ids = new Set(save.innate?.length ? save.innate : ["measured"]);
		for (const g of save.gear) for (const id of ensureGearMoves(g)) if (MOVE_BY_ID[id]) ids.add(id);
		return [...ids].map((id) => MOVE_BY_ID[id]).filter(Boolean);
	}
	syncArsenal(save) {
		const list = this.arsenal(save).map((m) => m.id);
		save.known = list;
		save.bar = list;
	}
	autoBattle() {
		const save = this.save;
		if (!save || this.dead || this.castLock > 0 || this.lunge) return false;
		const ready = this.arsenal(save).filter((m) => (this.cds[m.id] ?? 0) <= 0);
		const foe = this.fightTarget();
		const hpPct = save.hp / Math.max(1, this.maxHp());
		const by = (t) => ready.find((m) => moveTactic(m) === t);
		if (hpPct < .5) {
			const heal = by("heal");
			if (heal && this.castMove(heal)) return true;
		}
		if (foe && this.wardT < .25 && this.shield < 8 && hpPct < .75) {
			const ward = by("ward");
			if (ward && this.castMove(ward, foe)) return true;
		}
		if (foe && hpPct < .48) {
			const roll = by("roll");
			if (roll && Math.hypot(foe.x - save.x, foe.y - save.y) < 78 && this.castMove(roll, foe)) return true;
		}
		if (!foe || ready.length === 0) return false;
		const dist = Math.hypot(foe.x - save.x, foe.y - save.y);
		const magicBetter = bodyRead(foe.type).kind === "magic";
		const pick = ready.filter((m) => {
			const tac = moveTactic(m);
			if (tac === "heal" || tac === "ward" || tac === "roll") return false;
			return dist <= attackRange(m) + 36 || tac === "blink" || tac === "lunge";
		}).sort((a, b) => this.moveScore(b, foe, magicBetter, dist) - this.moveScore(a, foe, magicBetter, dist))[0];
		if (!pick) return false;
		return this.castMove(pick, foe);
	}
	moveScore(m, foe, magicBetter, dist) {
		const tac = moveTactic(m);
		const form = attackForm(m);
		let score = m.power + m.priority * 6;
		if (magicBetter === (form === "spell" || tac === "channel")) score += 28;
		score += typeChart(m.type, foe.type) * 18;
		if (tac === "blink" && dist > 48) score += 20;
		if (tac === "lunge" && dist > 40 && dist < 150) score += 16;
		if (tac === "heavy" && dist < 60) score += 14;
		if (tac === "channel" && dist < attackRange(m)) score += 10;
		return score;
	}
	castMove(move, prefer) {
		const save = this.save;
		if (!save || this.dead || snap.panel === "death") return false;
		if (this.castLock > 0 || this.lunge) return false;
		if (this.status.some((s) => s.id === "sleep")) return false;
		if ((this.cds[move.id] ?? 0) > 0) return false;
		if (this.status.some((s) => s.id === "silence") && move.priority < 2 && move.effect !== "mend") return false;
		const tactic = moveTactic(move);
		const selfCast = tactic === "heal" || tactic === "ward" || tactic === "roll" || move.effect === "mend" || move.effect === "shell";
		const reach = attackRange(move);
		const target = selfCast ? null : prefer && prefer.alive ? prefer : this.nearestMob(save.x, save.y, reach + 48);
		if (!selfCast && !target) return false;
		if (target && tactic !== "blink" && tactic !== "lunge" && Math.hypot(target.x - save.x, target.y - save.y) > reach + 40) return false;
		const swift = this.chan("swift");
		const form = attackForm(move);
		let cd = Math.max(.28, (.55 + move.power / 90 - move.priority * .08) * (1 - Math.min(.4, swift / 100)));
		if (tactic === "heavy" || tactic === "channel") cd *= 1.7;
		else if (form === "spell") cd *= 1.35;
		else if (form === "melee") cd *= .8;
		if (tactic === "roll") cd = Math.max(cd, 2.6);
		if (tactic === "ward") cd = Math.max(cd, 5.5);
		if (tactic === "heal") cd = Math.max(cd, 3.2);
		this.cds[move.id] = cd;
		this.attackT = tactic === "heavy" ? 1 : .8;
		this.combat = 3;
		if (target && target.x < save.x) this.facing = -1;
		else if (target) this.facing = 1;
		if (tactic === "ward") {
			this.wardT = 3;
			this.shield = Math.max(this.shield, 12 + move.power);
			this.float(save.x, save.y - 48, "WARD", "#fff1a8");
			this.say("Warded for three seconds.");
			this.playMoveFx(move, save.x, save.y - 24, save.x, save.y - 24);
			return true;
		}
		if (tactic === "heal" || move.effect === "mend") {
			const heal = 18 + Math.max(8, move.power) * .45;
			save.hp = Math.min(this.maxHp(), save.hp + heal);
			this.float(save.x, save.y - 48, `+${Math.floor(heal)}`, "#9ad8c8");
			this.playMoveFx(move, save.x, save.y - 24, save.x, save.y - 20);
			return true;
		}
		if (tactic === "roll") {
			this.rollT = .55;
			const side = this.facing > 0 ? 1 : -1;
			this.tryMove(-side * 28, side * 36);
			this.float(save.x, save.y - 36, "ROLL", "#e7d9ff");
			this.playMoveFx(move, save.x, save.y - 10, save.x + side * 20, save.y);
			if (target && move.power > 0 && Math.hypot(target.x - save.x, target.y - save.y) < 70) this.resolveHit(move, target, false);
			return true;
		}
		if (tactic === "blink" && target) {
			const behind = target.x >= save.x ? 1 : -1;
			const nx = target.x + behind * 30;
			const ny = target.y + 4;
			if (!blocked(this.world, nx, ny)) {
				save.x = nx;
				save.y = ny;
			}
			this.facing = behind > 0 ? -1 : 1;
			this.float(save.x, save.y - 46, "BLINK", "#b4a6ff");
			this.playMoveFx(move, save.x, save.y - 20, target.x, target.y - 12);
			if (move.power > 0) this.resolveHit(move, target, false);
			return true;
		}
		if (tactic === "lunge" && target) {
			this.lunge = {
				t: 0,
				dur: .42,
				ox: save.x,
				oy: save.y,
				tx: target.x - this.facing * 18,
				ty: target.y,
				mob: target.id,
				hit: false
			};
			this.cds[move.id] = Math.max(cd, .9);
			return true;
		}
		if (tactic === "heavy" || tactic === "channel") {
			this.castLockMax = tactic === "channel" ? 1.15 : .62;
			this.castLock = this.castLockMax;
		}
		this.playMoveFx(move, save.x, save.y - 24, target ? target.x : save.x + this.facing * 30, target ? target.y - 16 : save.y - 20);
		this.tone(140 + move.priority * 40 + move.power, .06, move.type === "electric" ? "sawtooth" : "square");
		if (move.effect === "shell") {
			this.shield = Math.max(this.shield, 20 + move.power);
			this.wardT = Math.max(this.wardT, 1.2);
			this.say("Urn shell.");
			return true;
		}
		if (target) {
			if (tactic === "heavy") this.resolveHit(move, target, false, 1.7);
			else this.resolveHit(move, target, false, tactic === "channel" ? 1.25 : 1);
		}
		if (form === "spell" || tactic === "channel") this.gainSkill("magic", 3);
		else this.gainSkill("physical", 2);
		return true;
	}
	tickLunge(dt) {
		const save = this.save;
		const lung = this.lunge;
		if (!save || !lung) return;
		lung.t += dt;
		const u = Math.min(1, lung.t / lung.dur);
		const back = u < .45 ? u / .45 : 1 - (u - .45) / .55;
		save.x = lung.ox + (lung.tx - lung.ox) * Math.max(0, back);
		save.y = lung.oy + (lung.ty - lung.oy) * Math.max(0, back);
		this.attackT = 1;
		if (!lung.hit && u >= .4) {
			lung.hit = true;
			const mob = this.mobs.find((m) => m.id === lung.mob && m.alive);
			const move = MOVES.find((m) => moveTactic(m) === "lunge") ?? MOVES[0];
			this.playMoveFx(move, save.x, save.y - 16, lung.tx, lung.ty);
			if (mob) this.resolveHit(move, mob, false, 1.15);
		}
		if (u >= 1) this.lunge = null;
	}
	resolveHit(move, mob, fromPet, mult = 1) {
		const save = this.save;
		const form = attackForm(move);
		if (Math.random() * 100 > move.accuracy) {
			this.float(mob.x, mob.y - 36, "MISS", "#e8dcc4");
			return;
		}
		const pure = form === "spell";
		const tm = pure ? 1 : typeChart(move.type, mob.type);
		if (!pure && tm === 0) {
			this.float(mob.x, mob.y - 36, "IMMUNE", "#e7d9ff");
			return;
		}
		const gearStab = pure ? 1 : this.stab(move.type);
		const might = 1 + this.chan("might") / 100;
		const hunt = 1 + Math.min(.4, (save.skills.hunting.level - 1) * .004);
		const boss = mob.boss ? 1 + this.chan("boss_bane") / 100 : 1;
		const gloom = this.status.some((s) => s.id === "gloom") ? .8 : 1;
		const critChance = move.crit + this.chan("crit_edge") + this.buff.crit;
		const crit = Math.random() * 100 < critChance;
		const phys = form === "spell" ? 1 : 1 + (save.skills.physical.level - 1) * (form === "melee" ? .02 : .015);
		const mag = form === "spell" ? 1.45 * (1 + (save.skills.magic.level - 1) * .025) : 1;
		const melee = form === "melee" ? 1.35 : 1;
		const read = bodyRead(mob.type);
		const hide = form === "spell" || moveTactic(move) === "channel" ? read.kind === "magic" ? 1.2 : .8 : read.kind === "physical" ? 1.2 : .8;
		let dmg = (6 + move.power * .42) * (1 + save.level * .045) * gearStab * tm * might * hunt * boss * gloom * phys * mag * melee * hide * mult * (fromPet ? .62 : 1) * (crit ? 1.75 : 1);
		if (form === "ranged") dmg = mitigate(dmg, this.mobArmor(mob));
		if (mob.status.some((s) => s.id === "expose")) dmg *= 1.25;
		dmg = Math.max(1, dmg);
		let hits = Math.random() * 100 < this.chan("double_strike") ? 2 : 1;
		if (form === "ranged" && rangedStyle(move) === "volley") {
			hits = 3;
			dmg *= .55;
		}
		for (let i = 0; i < hits; i++) this.damageMob(mob, dmg, crit && i === 0);
		this.applyEffect(move, mob, true);
		if (move.effect === "leech") save.hp = Math.min(this.maxHp(), save.hp + dmg * .35);
		mob.status = mob.status.filter((s) => s.id !== "sleep");
	}
	damageMob(mob, dmg, crit) {
		const amount = Math.floor(dmg);
		if (this.role === "guest") {
			this.room?.send({
				t: "dmg",
				id: mob.id,
				amount
			});
			this.float(mob.x, mob.y - 30, `${amount}${crit ? "!" : ""}`, crit ? "#fff1a8" : "#f0e2c8");
			mob.hurt = 1;
			return;
		}
		this.applyMobDamage(mob, amount, crit);
	}
	applyMobDamage(mob, amount, crit = false) {
		mob.hp -= amount;
		mob.hurt = 1;
		this.float(mob.x, mob.y - 30, `${amount}${crit ? "!" : ""}`, crit ? "#fff1a8" : "#f0e2c8");
		if (crit) this.shake = Math.max(this.shake, 5);
		this.combat = 3;
		if (mob.hp <= 0) this.killMob(mob);
	}
	killMob(mob) {
		const save = this.save;
		mob.alive = false;
		mob.hp = 0;
		mob.respawn = mob.boss ? 70 : 22;
		const xp = Math.floor((8 + mob.level * 3) * (mob.boss ? 4 : 1) * (1 + this.chan("xp_boost") / 100));
		this.gainXp(xp);
		this.gainSkill("hunting", mob.boss ? 28 : 10);
		save.kyo += Math.floor((2 + mob.level) * (mob.boss ? 6 : 1) * (1 + this.chan("kyo_find") / 100));
		save.wins += 1;
		const regen = this.chan("regen");
		if (regen) save.hp = Math.min(this.maxHp(), save.hp + regen * .4);
		this.say(`${mob.name} falls.`);
		this.tone(90, .08, "triangle");
		this.questKill(mob);
		if (mob.witch) {
			for (const g of mob.lootGear) this.receiveGear({
				...g,
				uid: nextUid()
			});
			for (const [id, n] of Object.entries(mob.lootBag)) if (n > 0) this.giveItem(id, n);
			save.kyo += mob.lootKyo;
			this.say(`${mob.name} drops everything. ${mob.lootKyo} kyo, her bag, her gear.`);
			this.gainSkill("hunting", 24);
			this.gainAccount(40 + mob.level * 4);
			this.persist();
			return;
		}
		if (mob.animal) {
			const meat = mob.species === "stag" || mob.species === "boar" ? 2 : 1;
			const hide = mob.species === "stag" ? 2 : mob.species === "crow" ? 1 : 1;
			this.giveItem("meat", meat);
			this.giveItem("leather", hide);
			this.say(`${mob.name}: meat ${meat}, leather ${hide}.`);
			this.gainSkill("hunting", 8);
			this.gainSkill("physical", 4);
			this.persist();
			return;
		}
		const luck = this.chan("loot_find");
		const dropP = mob.boss ? 1 : Math.min(.92, .12 + mob.level * .016 + mob.rarity * .08 + luck / 200);
		if (Math.random() < dropP) {
			const floors = [
				null,
				"fine",
				"rare",
				"epic",
				"legendary"
			];
			const tier = Math.min(4, mob.rarity + (mob.level >= 24 ? 1 : 0) + (mob.level >= 40 ? 1 : 0));
			const piece = rollGear(mulberry32(Math.random() * 1e9 | 0), {
				level: Math.max(1, mob.level + mob.rarity * 2),
				luck: luck + mob.rarity * 14 + mob.level * .45,
				raceBias: save.race,
				floor: mob.boss ? mob.level > 14 ? "rare" : "fine" : floors[tier] ?? null,
				typeBias: mob.boss ? mob.type : null
			});
			this.receiveGear(piece);
			this.say(`Found ${piece.name}.`);
			this.tone(520, .1, "triangle");
		}
		if (mob.boss) {
			const piece = rollGear(mulberry32(Math.random() * 1e9 | 0), {
				level: mob.level + 2,
				luck: luck + 20,
				raceBias: save.race,
				floor: "epic"
			});
			this.receiveGear(piece);
			this.say(`Warlord relic: ${piece.name}.`);
			if (mob.bossId) save.bosses[mob.bossId] = (save.bosses[mob.bossId] ?? 0) + 1;
		}
		if (Math.random() < Math.min(.8, .22 + mob.level * .012 + mob.rarity * .06)) this.giveItem(mob.type === "water" ? "fish" : mob.type === "earth" ? "mushroom" : "meat", 1 + (mob.level >= 20 ? 1 : 0));
		if (Math.random() < Math.min(.55, .08 + mob.level * .008 + mob.rarity * .05)) this.giveItem("cleanse_salt", 1);
		if (mob.rarity >= 3 && Math.random() < .12 + mob.level * .004) this.giveItem("ghost_jar", 1);
		if (this.shrine && mob.id.startsWith("shrine")) this.shrineClear();
		if (this.role === "host") this.room?.send({
			t: "dead",
			id: mob.id,
			boss: mob.bossId ?? ""
		});
		this.tryRecruit(mob);
		this.persist();
	}
	tryRecruit(mob) {
		const save = this.save;
		if (!save || mob.animal || mob.boss || mob.witch || mob.id.startsWith("shrine") || mob.master) return;
		const catchLv = save.skills.catching?.level ?? 1;
		const chance = .1 + Math.min(.22, (catchLv - 1) * .004) + this.chan("catch_boost") / 220 + mob.rarity * .03;
		if (Math.random() > chance) return;
		const spirit = this.spiritFrom(mob);
		save.spirits = save.spirits ?? [];
		if (save.spirits.length < 3) {
			save.spirits.push(spirit);
			this.say(`${spirit.name} joins the hunt.`);
		} else {
			let weak = 0;
			for (let i = 1; i < save.spirits.length; i++) if (this.spiritPower(save.spirits[i]) < this.spiritPower(save.spirits[weak])) weak = i;
			if (this.spiritPower(spirit) <= this.spiritPower(save.spirits[weak])) {
				this.say(`${spirit.name} almost stayed. The party is stronger.`);
				return;
			}
			const gone = save.spirits[weak];
			save.spirits[weak] = spirit;
			this.say(`${spirit.name} replaces ${gone.name}.`);
		}
		this.gainSkill("catching", 16);
		save.catches[mob.type] = (save.catches[mob.type] ?? 0) + 1;
		this.noteCatch(mob);
	}
	spiritFrom(mob) {
		const look = mob.look ?? rollGhostLook(mulberry32(Math.random() * 1e9 | 0 || 1), mob.rarity, mob.move, "hunt");
		const max = Math.max(18, Math.floor(mob.max * .72));
		return {
			uid: nextUid(),
			species: mob.species,
			name: mob.name,
			type: mob.type,
			template: mob.template,
			level: mob.level,
			rarity: mob.rarity,
			look,
			move: mob.move,
			hp: max,
			max,
			speed: Math.max(6, (mob.speed ?? 10) - 1)
		};
	}
	spiritPower(s) {
		return s.level * 10 + s.rarity * 12 + s.speed + Math.floor(s.hp);
	}
	noteCatch(mob) {
		const save = this.save;
		if (this.world && biomeNameAt(this.world, save.x, save.y) === "ashen" && mob.type === "fire") {
			const q = save.quests.ember_hunt;
			if (!q.done) {
				q.n += 1;
				if (q.n >= 2) this.completeQuest("ember_hunt");
			}
		}
		if ((save.catches.fire ?? 0) >= 1 && (save.catches.light ?? 0) >= 1 && !save.quests.keeper_lanterns.done) this.completeQuest("keeper_lanterns");
		if (mob.type === "water" && save.quests.marsh_walk.n >= 1 && !save.quests.marsh_walk.done) this.completeQuest("marsh_walk");
	}
	questKill(mob) {
		const save = this.save;
		const q = save.quests;
		if (!q.first_steps.done) {
			q.first_steps.n += 1;
			if (q.first_steps.n >= 3) this.completeQuest("first_steps");
		}
		if (save.map === "crypt" && mob.species === "gaikotsu" && !mob.boss && !q.bone_patrol.done) {
			q.bone_patrol.n += 1;
			if (q.bone_patrol.n >= 2) this.completeQuest("bone_patrol");
		}
		if (mob.bossId === "bone_king" && !q.bone_king.done) this.completeQuest("bone_king");
	}
	completeQuest(id) {
		const save = this.save;
		const st = save.quests[id];
		if (!st || st.done) return;
		st.done = true;
		const def = QUESTS.find((q) => q.id === id);
		save.kyo += def.rewardKyo;
		if (def.rewardItems) {
			for (const [k, n] of Object.entries(def.rewardItems)) if (n > 0 && ITEM_BY_ID[k]) this.giveItem(k, n);
		}
		this.gainSkill("adventuring", 24);
		this.gainSkill("social", 12);
		this.say(`Quest complete: ${def.name}.`);
		this.tone(660, .15, "triangle");
	}
	giveItem(id, n) {
		const save = this.save;
		save.bag[id] = (save.bag[id] ?? 0) + n;
	}
	float(x, y, text, color) {
		this.floats.push({
			x,
			y,
			text,
			life: .85,
			color
		});
	}
	gainXp(n) {
		const save = this.save;
		save.xp += n;
		this.gainAccount(n);
		let need = xpNeed(save.level);
		while (save.xp >= need && save.level < 50) {
			save.xp -= need;
			save.level += 1;
			save.hp = this.maxHp();
			this.say(`Level ${save.level}.`);
			this.tone(480, .12, "square");
			this.maybeEvilWitch();
			need = xpNeed(save.level);
		}
	}
	maybeEvilWitch() {
		const save = this.save;
		if (!save || save.map !== "world" || !this.world) return;
		const mark = Math.floor(save.level / 20);
		if (mark < 1 || mark <= (save.evilMark ?? 0)) return;
		save.evilMark = mark;
		this.spawnEvilWitch();
	}
	spawnEvilWitch() {
		const save = this.save;
		if (!save || !this.world) return;
		const name = WITCH_NAMES[Math.floor(Math.random() * WITCH_NAMES.length)];
		const race = RACES[Math.floor(Math.random() * RACES.length)];
		let x = save.x + 280;
		let y = save.y;
		for (let i = 0; i < 40; i++) {
			const ang = Math.random() * Math.PI * 2;
			const dist = 220 + Math.random() * 180;
			const wx = save.x + Math.cos(ang) * dist;
			const wy = save.y + Math.sin(ang) * dist;
			if (blocked(this.world, wx, wy)) continue;
			x = wx;
			y = wy;
			break;
		}
		const lvl = Math.max(save.level, 20);
		const rng = mulberry32((Date.now() ^ Math.random() * 1e9) >>> 0 || 3);
		const best = [...MOVES].filter((m) => m.power >= 48 && m.effect !== "mend").sort((a, b) => b.power - a.power);
		const spell = best.find((m) => m.type === race.type) ?? best[0] ?? huntMove(race.type);
		const gear = [
			0,
			1,
			2
		].map(() => rollGear(rng, {
			level: lvl + 4,
			luck: 28,
			raceBias: race.id,
			floor: "epic",
			typeBias: race.type
		}));
		const mob = this.makeMob({
			id: `witch-${nextUid()}`,
			species: "muma",
			x,
			y,
			level: lvl + 2,
			template: 20,
			type: race.type,
			name
		});
		mob.witch = true;
		mob.race = race.id;
		mob.name = name;
		mob.move = spell.id;
		mob.hp = mob.max = Math.floor(120 + lvl * 28);
		mob.speed = 16 + lvl;
		mob.aggro = true;
		mob.lootGear = gear;
		mob.lootBag = {
			potion: 3,
			mushroom: 6,
			leather: 4
		};
		mob.lootKyo = 40 + lvl * 8;
		mob.huntIn = 18;
		mob.seen = true;
		mob.ghost = false;
		this.mobs.push(mob);
		for (let i = 0; i < 2; i++) {
			const pool = MONSTERS.filter((d) => d.type === "spirit" || d.type === race.type);
			const spec = pool[Math.floor(Math.random() * pool.length)] ?? MONSTERS[0];
			const pet = this.makeMob({
				id: `witch-spirit-${nextUid()}`,
				species: spec.id,
				x: x + (i === 0 ? -28 : 28),
				y: y + 16,
				level: Math.max(1, lvl - 1),
				template: spec.template,
				type: spec.type,
				name: spec.name
			});
			pet.master = mob.id;
			pet.aggro = true;
			if (pet.look) pet.look.aggression = "hunt";
			pet.rarity = Math.max(pet.rarity, 2);
			pet.hp = pet.max = Math.floor(pet.max * 1.35);
			this.mobs.push(pet);
		}
		this.say(`${name} is coming to hunt you. She brings two spirits.`);
		this.tone(90, .22, "sawtooth");
	}
	gainSkill(id, amount) {
		const st = this.save.skills[id];
		if (!st || st.level >= 60) return;
		st.xp += amount;
		const need = skillNeed(st.level);
		if (st.xp >= need) {
			st.xp -= need;
			st.level += 1;
			this.say(`${id} ${st.level}. ${skillLine(id, st.level)}`);
			this.tone(700, .08, "triangle");
		}
	}
	tickMobs(dt) {
		const save = this.save;
		for (const m of this.mobs) {
			m.hurt = Math.max(0, m.hurt - dt * 3);
			m.walk += dt * 4;
			m.status.forEach((s) => s.t -= dt);
			m.status = m.status.filter((s) => s.t > 0);
			if (!m.alive) {
				if (m.id.startsWith("shrine") || m.witch) continue;
				m.respawn -= dt;
				if (m.respawn <= 0) {
					const born = this.makeMob({
						...m,
						x: m.homeX,
						y: m.homeY,
						species: m.species,
						level: m.level,
						boss: m.boss,
						bossId: m.bossId,
						template: m.template,
						type: m.type,
						animal: m.animal
					});
					Object.assign(m, born);
				}
				continue;
			}
			if (!m.boss && !m.witch && !m.master && Math.hypot(m.x - save.x, m.y - save.y) > 1200) continue;
			if (m.status.some((s) => s.id === "burn")) m.hp -= 6 * dt;
			if (m.hp <= 0) {
				this.killMob(m);
				continue;
			}
			if (m.status.some((s) => s.id === "sleep")) continue;
			const dx = save.x - m.x;
			const dy = save.y - m.y;
			const d = Math.hypot(dx, dy);
			const rooted = m.status.some((s) => s.id === "root");
			if (m.animal && m.species !== "wolf" && m.species !== "boar") {
				if (!rooted && d < 120 && d > 1) {
					this.moveMob(m, -dx / d * 70 * dt, -dy / d * 70 * dt);
					m.facing = dx < 0 ? 1 : -1;
				} else if (!rooted) m.x += Math.sin(m.walk) * 10 * dt;
				continue;
			}
			if (m.witch) {
				this.tickWitch(m, save.x, save.y, d, dx, dy, dt);
				continue;
			}
			const aggro = this.wantsFight(m, d);
			if (aggro) {
				this.combat = 2;
				m.aggro = true;
			}
			const reach = attackRange(MOVE_BY_ID[m.move] ?? MOVES[0]);
			if (aggro && d > Math.min(reach * .72, 120) && !rooted && d > 1) {
				const sp = (m.boss ? 46 : m.look?.aggression === "hunt" ? 70 : 58) * (m.status.some((s) => s.id === "soak") ? .7 : 1);
				this.moveMob(m, dx / d * sp * dt, dy / d * sp * dt);
				if (dx < 0) m.facing = -1;
				else m.facing = 1;
			} else if (!aggro && !rooted) {
				m.x += Math.sin(m.walk) * (m.ghost ? 18 : 8) * dt;
				if (m.ghost) m.y += Math.cos(m.walk * .7) * 8 * dt;
			}
		}
	}
	wantsFight(m, d) {
		if (m.master) {
			const boss = this.mobs.find((x) => x.id === m.master && x.alive);
			if (boss && (boss.seen || boss.huntIn <= 0 || boss.hurt > 0 || boss.aggro)) return d < 240;
			return false;
		}
		if (m.hurt > 0 || m.aggro || m.hp < m.max) return d < (m.boss ? 280 : 240);
		if (m.look?.aggression === "drift" && !m.boss && !m.witch) return false;
		return d < (m.boss ? 240 : m.animal ? 110 : 168);
	}
	moveMob(m, dx, dy) {
		const world = this.world;
		if (!blocked(world, m.x + dx, m.y)) m.x += dx;
		if (!blocked(world, m.x, m.y + dy)) m.y += dy;
	}
	tickWitch(m, px, py, d, dx, dy, dt) {
		if (m.huntIn > 0) {
			m.huntIn -= dt;
			if (m.huntIn <= 0) this.say(`${m.name} is done waiting. She is hunting you.`);
		}
		const hunting = m.huntIn <= 0;
		if (d < 280 && !m.seen) {
			m.seen = true;
			this.say(`${m.name} knows you are here.`);
		}
		const rooted = m.status.some((s) => s.id === "root");
		m.cd -= dt;
		if (!rooted && d > 4) {
			if ((hunting || m.seen) && d > 108) {
				this.moveMob(m, dx / d * (hunting ? 86 : 54) * dt, dy / d * (hunting ? 86 : 54) * dt);
				m.facing = dx < 0 ? -1 : 1;
			} else if (!hunting && !m.seen) {
				const hx = m.homeX - m.x;
				const hy = m.homeY - m.y;
				const hd = Math.hypot(hx, hy);
				if (hd > 36) this.moveMob(m, hx / hd * 26 * dt, hy / hd * 26 * dt);
			}
		}
		if (!(hunting || m.seen) || this.role === "guest") return;
		this.combat = 2;
		m.aggro = true;
	}
	mobHitsPlayer(m, move, dist = 99) {
		const save = this.save;
		const form = dist < 46 && (attackForm(move) === "melee" || m.animal) ? "melee" : attackForm(move);
		const pure = form === "spell";
		const tm = pure ? 1 : typeChart(move.type, this.armorType());
		let dmg = (4 + m.level * 1.25 + move.power * (form === "spell" ? .16 : .08)) * (pure ? 1 : tm === 0 ? .2 : tm) * (m.boss ? 1.35 : 1);
		if (form === "melee") dmg *= 1.3;
		else if (form === "ranged") dmg = mitigate(dmg, this.playerArmor());
		dmg *= 1 - Math.min(.45, this.chan("ward") / 160 + this.buff.ward);
		if (this.status.some((s) => s.id === "shell")) dmg *= .7;
		if (Math.random() * 100 < this.chan("echo_guard")) {
			this.float(save.x, save.y - 36, "ECHO", "#6a4cff");
			return;
		}
		this.hurtSelf(dmg, move.effect);
		this.applyEffect(move, null, false);
	}
	tickGuestHurt(dt) {
		for (const m of this.mobs) {
			m.hurt = Math.max(0, m.hurt - dt * 3);
			m.walk += dt * 3;
		}
	}
	hurtSelf(amount, effect) {
		const save = this.save;
		if (this.wardT > 0) {
			this.float(save.x, save.y - 36, "WARD", "#fff1a8");
			return;
		}
		if (this.rollT > 0) {
			this.float(save.x, save.y - 36, "ROLL", "#e7d9ff");
			return;
		}
		let dmg = amount;
		if (this.shield > 0) {
			const use = Math.min(this.shield, dmg);
			this.shield -= use;
			dmg -= use;
		}
		if (dmg <= 0) return;
		save.hp -= dmg;
		this.hurt = 1;
		this.shake = Math.max(this.shake, 3);
		this.float(save.x, save.y - 42, `${Math.floor(dmg)}`, "#c4473a");
		this.combat = 3;
		if (effect && effect !== "none" && effect !== "mend") this.addStatus(effect, 3.5);
		if (save.hp <= 0) {
			if (this.chan("second_chance") >= 1 && !this.secondUsed) {
				this.secondUsed = true;
				save.hp = 1;
				this.say("Second Chance.");
				return;
			}
			this.die();
		}
	}
	die() {
		const save = this.save;
		if (this.shrine || save.map !== "world") {
			this.knockOut();
			return;
		}
		for (const g of save.gear) this.noteFound(g);
		this.bankAccount(save);
		this.dead = true;
		this.dest = null;
		publish({ panel: "rebirth" });
		this.say("This witch is gone. Her levels and kit became Account Score. Choose the next body.");
		this.tone(70, .3, "sawtooth");
		this.syncHud(true);
	}
	knockOut() {
		const save = this.save;
		const loss = Math.max(6, Math.min(save.kyo, 12 + Math.floor(save.kyo * .15)));
		save.kyo -= loss;
		save.hp = Math.max(1, Math.floor(this.maxHp() * .42));
		this.dead = false;
		this.dest = null;
		this.status = [];
		this.shield = 0;
		this.wardT = 0;
		this.castLock = 0;
		this.lunge = null;
		this.shrine = null;
		this.mobs = this.mobs.filter((m) => !m.id.startsWith("shrine-"));
		if (save.map !== "world") {
			const door = POIS.find((p) => p.kind === "dungeon" && p.id === save.map);
			save.map = "world";
			if (door && door.kind === "dungeon") {
				const at = scaleTile(door.tx, door.ty);
				save.x = at.tx * 32 + 16;
				save.y = (at.ty + 2) * 32 + 8;
			}
			this.loadMap("world", false);
		}
		this.cam.x = save.x;
		this.cam.y = save.y;
		publish({
			panel: null,
			death: []
		});
		this.say(`Knocked out. The ring keeps ${loss} kyo. You keep your gear.`);
		this.persist();
		this.syncHud(true);
	}
	rebirth(name, race, setId) {
		const save = this.save;
		if (!save || !this.dead) return;
		const set = setId ? SET_BY_ID[setId] : null;
		const wear = set && set.race === race && this.isUnlocked(set.id) ? set.id : null;
		save.name = (name || "Huntress").slice(0, 16);
		save.race = race;
		save.level = 1;
		save.xp = 0;
		save.hp = 90;
		save.kyo = Math.floor(save.kyo * .85);
		save.bag = {
			potion: 2,
			ghost_jar: 0,
			cleanse_salt: 0,
			leather: 0,
			mushroom: 0
		};
		save.party = [];
		save.companion = null;
		save.spirits = [];
		save.deathBanked = false;
		const known = rollInnate(mulberry32(Math.random() * 1e9 | 0));
		save.innate = known;
		save.known = known;
		save.bar = known;
		if (wear) this.wearSet(wear);
		else {
			const type = RACES.find((r) => r.id === race).type;
			const weapon = rollGear(mulberry32(Math.random() * 1e9 | 0), {
				level: Math.max(1, save.accountLevel),
				slot: "weapon",
				floor: "common",
				typeBias: type,
				raceBias: race
			});
			save.gear = [weapon];
			save.equipped = { weapon: weapon.uid };
		}
		const tavern = this.pickTavern();
		save.lastTavern = tavern.id;
		save.map = "world";
		save.x = tavern.boardTx * 32 + 16;
		save.y = (tavern.boardTy + 1) * 32 + 8;
		this.secondUsed = false;
		this.status = [];
		this.shield = 0;
		this.shrine = null;
		this.dead = false;
		this.loadMap("world", false);
		const spot = nearestOpen(this.world, save.x, save.y);
		save.x = spot.x;
		save.y = spot.y;
		this.cam.x = save.x;
		this.cam.y = save.y;
		this.syncArsenal(save);
		publish({
			panel: null,
			death: []
		});
		const dressed = wear ? SET_BY_ID[wear].name : "the default robes";
		this.say(`${save.name} wakes at ${tavern.name} in ${dressed}. The board is by the door.`);
		this.persist();
		this.syncHud(true);
	}
	wearSet(setId) {
		const save = this.save;
		const rng = mulberry32(Math.random() * 1e9 | 0);
		const race = save.race;
		const type = RACES.find((r) => r.id === race).type;
		const floor = save.accountLevel >= 10 ? "fine" : "common";
		const pieces = [
			"head",
			"chest",
			"legs",
			"feet",
			"relic"
		].map((slot) => rollGear(rng, {
			level: Math.max(1, save.accountLevel),
			slot,
			setId,
			floor,
			raceBias: race,
			typeBias: type,
			luck: 8
		}));
		const weapon = rollGear(rng, {
			level: Math.max(1, save.accountLevel),
			slot: "weapon",
			floor,
			typeBias: type,
			raceBias: race
		});
		save.gear = [weapon, ...pieces];
		save.equipped = { weapon: weapon.uid };
		for (const p of pieces) save.equipped[p.slot] = p.uid;
	}
	noteFound(g) {
		const save = this.save;
		if (!save || !g.setId || g.slot === "weapon") return;
		const slots = new Set(save.found[g.setId] ?? []);
		slots.add(g.slot);
		save.found[g.setId] = [...slots];
	}
	isUnlocked(id) {
		const have = new Set(this.save?.found[id] ?? []);
		return [
			"head",
			"chest",
			"legs",
			"feet",
			"relic"
		].every((s) => have.has(s));
	}
	autoHarvest() {
		const save = this.save;
		if (!save || save.map !== "world" || this.dead || this.channel) return;
		for (const p of POIS) {
			if (p.kind !== "node") continue;
			const pos = poiPos(p);
			if (!pos) continue;
			if (Math.hypot(pos.x - save.x, pos.y - save.y) > 64) continue;
			if ((this.nodeCd[p.id] ?? 0) > 0) continue;
			this.harvestNow(p.id, p.node);
		}
	}
	harvestNow(id, node) {
		this.nodeCd[id] = 14;
		const luck = 1 + this.chan("harvest") / 100;
		if (node === "ore") {
			const n = Math.max(1, Math.floor((1 + Math.random()) * luck));
			this.giveItem("ore", n);
			this.gainSkill("mining", 14);
			this.say(`Ore x${n}.`);
		} else if (node === "tree") {
			const n = Math.max(1, Math.floor((1 + Math.random()) * luck));
			this.giveItem("timber", n);
			this.gainSkill("woodcutting", 14);
			this.say(`Timber x${n}.`);
		} else if (node === "shroom") {
			const bonus = this.chan("shroom_sense");
			this.giveItem(Math.random() < .34 ? "dreamspore" : Math.random() < .5 ? "embercap" : "blue_lantern", 1 + (bonus > 20 ? 1 : 0));
			this.giveItem("mushroom", 1);
			this.gainSkill("shroom", 16);
			this.say("The patch gives.");
		} else {
			this.giveItem("fish", 1 + (this.chan("fish_luck") > 25 ? 1 : 0));
			this.gainSkill("fishing", 16);
			this.say("A bite.");
		}
		this.persist();
	}
	bankAccount(save) {
		if (save.deathBanked) return;
		let score = save.level * 50 + save.xp + Math.floor(save.kyo / 2);
		for (const g of save.gear) score += gearScore(g);
		for (const n of Object.values(save.bag)) score += (n ?? 0) * 4;
		for (const sk of Object.values(save.skills)) score += Math.max(0, (sk.level - 1) * 6);
		for (const s of save.spirits ?? []) score += this.spiritPower(s);
		save.accountScore = (save.accountScore ?? 0) + score;
		save.deathBanked = true;
		this.say(`Account Score +${score}. It stays.`);
	}
	fightTarget() {
		const save = this.save;
		if (!save) return null;
		let best = null;
		let bd = 230;
		for (const m of this.mobs) {
			if (!m.alive) continue;
			const d = Math.hypot(m.x - save.x, m.y - save.y);
			if (!this.wantsFight(m, d) && m.hurt <= 0) continue;
			if (d < bd) {
				bd = d;
				best = m;
			}
		}
		return best;
	}
	inFight() {
		return !!this.fightTarget();
	}
	playerSpeed() {
		const save = this.save;
		if (!save) return 8;
		return 10 + save.level + Math.floor(this.chan("swift") / 8) + Math.min(6, (save.skills.physical?.level ?? 1) / 8);
	}
	buildTurns() {
		const save = this.save;
		if (!save) return;
		const foes = this.mobs.filter((m) => m.alive && this.wantsFight(m, Math.hypot(m.x - save.x, m.y - save.y))).sort((a, b) => (b.speed ?? 0) - (a.speed ?? 0));
		const you = this.playerSpeed();
		const top = foes[0]?.speed ?? 0;
		const q = [];
		const spirits = (save.spirits ?? []).filter((s) => s.hp > 0);
		const pushYou = () => {
			q.push({
				side: "you",
				id: "you"
			});
			for (const s of spirits) q.push({
				side: "spirit",
				id: s.uid
			});
		};
		if (you >= top) {
			pushYou();
			for (const m of foes) q.push({
				side: "foe",
				id: m.id
			});
		} else {
			for (const m of foes.filter((m) => (m.speed ?? 0) > you)) q.push({
				side: "foe",
				id: m.id
			});
			pushYou();
			for (const m of foes.filter((m) => (m.speed ?? 0) <= you)) q.push({
				side: "foe",
				id: m.id
			});
		}
		this.turnQ = q;
	}
	tickTurns(dt) {
		const save = this.save;
		if (!save || this.dead || this.role === "guest") return;
		if (!this.inFight()) {
			this.turnQ = [];
			this.fought = false;
			for (const s of save.spirits ?? []) if (s.hp < s.max) s.hp = Math.min(s.max, s.hp + 6 * dt);
			return;
		}
		if (!this.fought) {
			this.fought = true;
			this.buildTurns();
			this.fightGap = .12;
		}
		this.fightGap -= dt;
		if (this.fightGap > 0 || this.lunge || this.castLock > .15) return;
		if (this.turnQ.length === 0) this.buildTurns();
		const step = this.turnQ.shift();
		if (!step) return;
		if (step.side === "you") {
			if (this.status.some((s) => s.id === "sleep") || !this.autoBattle()) {
				this.float(save.x, save.y - 44, "WAIT", "#c8c0b0");
				while (this.turnQ[0]?.side === "spirit") this.turnQ.shift();
			}
		} else if (step.side === "spirit") {
			const spirit = (save.spirits ?? []).find((s) => s.uid === step.id && s.hp > 0);
			if (spirit) this.spiritTurn(spirit);
		} else {
			const mob = this.mobs.find((m) => m.id === step.id && m.alive);
			if (mob) this.foeTurn(mob);
		}
		this.fightGap = .34;
		if (!this.inFight()) {
			this.turnQ = [];
			this.fought = false;
		}
	}
	spiritTurn(spirit) {
		const save = this.save;
		const slot = (save.spirits ?? []).indexOf(spirit);
		const at = this.mates[slot] ?? {
			x: save.x - 20,
			y: save.y,
			swing: 0
		};
		const foe = this.fightTarget();
		if (!foe) return;
		const heal = save.hp < this.maxHp() * .42 ? MOVES.find((m) => m.type === spirit.type && moveTactic(m) === "heal") : null;
		if (heal) {
			const n = 12 + spirit.level;
			save.hp = Math.min(this.maxHp(), save.hp + n);
			this.float(save.x, save.y - 50, `+${n}`, "#9ad8c8");
			this.playMoveFx(heal, at.x, at.y - 12, save.x, save.y - 16);
			return;
		}
		const move = MOVE_BY_ID[spirit.move] ?? MOVE_BY_ID[spirit.look.move] ?? MOVES.find((m) => m.type === spirit.type) ?? MOVES[0];
		at.swing = 1;
		this.mates[slot] = at;
		this.playMoveFx(move, at.x, at.y - 12, foe.x, foe.y - 12);
		this.resolveHit(move, foe, true, .75 + spirit.rarity * .12);
	}
	foeTurn(m) {
		const save = this.save;
		if (m.status.some((s) => s.id === "sleep")) {
			this.float(m.x, m.y - 36, "ASLEEP", "#e7d9ff");
			return;
		}
		const move = MOVE_BY_ID[m.move] ?? MOVES[0];
		const form = attackForm(move);
		m.cd = Math.max(0, (m.cd ?? 0) - .55);
		if (m.cd > 0) {
			this.float(m.x, m.y - 34, "WAIT", "#c8c0b0");
			return;
		}
		m.cd = (form === "spell" ? 1.05 : form === "ranged" ? .72 : .48) * (m.boss || m.witch ? .85 : 1);
		m.swing += 1;
		const spirits = (save.spirits ?? []).filter((s) => s.hp > 0);
		if (spirits.length && Math.random() < .28) {
			const spirit = spirits[Math.floor(Math.random() * spirits.length)];
			const slot = (save.spirits ?? []).indexOf(spirit);
			const at = this.mates[slot] ?? {
				x: save.x,
				y: save.y,
				swing: 0
			};
			this.playMoveFx(move, m.x, m.y - 16, at.x, at.y - 10);
			const dmg = Math.max(4, Math.floor(6 + m.level * 1.4 + move.power * .08));
			spirit.hp -= dmg;
			this.float(at.x, at.y - 28, `${dmg}`, "#c4473a");
			if (spirit.hp <= 0) {
				spirit.hp = 0;
				this.say(`${spirit.name} drops.`);
			}
			return;
		}
		this.playMoveFx(move, m.x, m.y - 16, save.x, save.y - 18);
		this.mobHitsPlayer(m, move, Math.hypot(save.x - m.x, save.y - m.y));
	}
	tickSpirits(dt) {
		const save = this.save;
		if (!save) return;
		const list = save.spirits ?? [];
		while (this.mates.length < list.length) this.mates.push({
			x: save.x,
			y: save.y,
			swing: 0
		});
		this.mates.length = list.length;
		list.forEach((spirit, i) => {
			const at = this.mates[i];
			at.swing = Math.max(0, at.swing - dt * 3);
			if (spirit.hp <= 0) {
				at.x += (save.x - this.facing * 18 - at.x) * Math.min(1, dt * 2);
				at.y += (save.y + 14 - at.y) * Math.min(1, dt * 2);
				return;
			}
			const foe = this.fightTarget();
			const ang = this.clock * 1.7 + i * 2.05;
			const rad = foe ? 34 + i * 16 : 22 + i * 12;
			const tx = foe ? foe.x + Math.cos(ang) * rad : save.x - this.facing * (26 + i * 16);
			const ty = foe ? foe.y + Math.sin(ang) * rad * .45 : save.y + 8 + i * 6;
			at.x += (tx - at.x) * Math.min(1, dt * 5);
			at.y += (ty - at.y) * Math.min(1, dt * 5);
		});
	}
	tickParty(dt) {
		const save = this.save;
		if (this.role === "guest") return;
		save.party = save.party ?? [];
		save.party.forEach((id, i) => {
			const npc = NPCS.find((n) => n.id === id);
			if (!npc) return;
			const key = `mate-${id}`;
			this.mateCd[key] = (this.mateCd[key] ?? 0) - dt;
			const foe = this.nearestMob(save.x, save.y, 190);
			const px = this.mateCd[`${key}x`] ?? save.x;
			const py = this.mateCd[`${key}y`] ?? save.y;
			const dist = foe ? Math.hypot(foe.x - px, foe.y - py) : 999;
			const ang = this.clock * .9 + i * 2.1;
			const orbit = foe ? dist > 80 ? 70 : 36 : 28;
			const homeX = foe ? foe.x + Math.cos(ang) * (orbit + i * 10) : save.x + Math.cos(ang) * 28;
			const homeY = foe ? foe.y + Math.sin(ang) * 22 : save.y + 10 + i * 8;
			if (foe && dist > 90 && dist < 160 && (this.mateCd[`${key}blink`] ?? 0) <= 0) {
				const behind = foe.x >= save.x ? 1 : -1;
				this.mateCd[`${key}x`] = foe.x + behind * 26;
				this.mateCd[`${key}y`] = foe.y + 4;
				this.mateCd[`${key}blink`] = 4;
				this.float(foe.x, foe.y - 28, "BLINK", "#b4a6ff");
			} else {
				this.mateCd[`${key}x`] = px + (homeX - px) * Math.min(1, dt * 4);
				this.mateCd[`${key}y`] = py + (homeY - py) * Math.min(1, dt * 4);
			}
			this.mateCd[`${key}blink`] = Math.max(0, (this.mateCd[`${key}blink`] ?? 0) - dt);
			if (!foe || this.mateCd[key] > 0) return;
			const reach = dist > 70 ? 150 : 56;
			if (Math.hypot(foe.x - (this.mateCd[`${key}x`] ?? 0), foe.y - (this.mateCd[`${key}y`] ?? 0)) > reach) return;
			this.mateCd[key] = dist > 70 ? 1.35 : .9;
			const move = dist > 70 ? huntMove(npc.shrine ?? "normal") : MOVES.find((m) => m.type === (npc.shrine ?? "normal") && attackForm(m) === "melee") ?? huntMove(npc.shrine ?? "normal");
			this.playMoveFx(move, this.mateCd[`${key}x`] ?? save.x, (this.mateCd[`${key}y`] ?? save.y) - 20, foe.x, foe.y - 12);
			this.damageMob(foe, (dist > 70 ? 6 : 9) + save.level * 1.4, false);
		});
	}
	tickFx(dt) {
		for (const p of this.parts) {
			p.life -= dt;
			p.x += p.vx * dt;
			p.y += p.vy * dt;
			p.vy += (p.kind === "rain" ? 40 : 0) * dt;
		}
		this.parts = this.parts.filter((p) => p.life > 0).slice(-240);
		for (const f of this.floats) {
			f.life -= dt;
			f.y -= dt * 22;
		}
		this.floats = this.floats.filter((f) => f.life > 0);
		this.shake = Math.max(0, this.shake - dt * 18);
		for (const id of Object.keys(this.nodeCd)) this.nodeCd[id] = Math.max(0, (this.nodeCd[id] ?? 0) - dt);
	}
	playMoveFx(move, x0, y0, x1, y1) {
		const color = TYPES[move.type].color;
		const n = 8 + Math.floor(move.power / 8) + (move.effect !== "none" ? 4 : 0) + move.priority;
		for (let i = 0; i < n; i++) {
			const kind = move.anim[i % move.anim.length] ?? "burst";
			const ang = i / n * Math.PI * 2 + move.priority;
			let x = x0;
			let y = y0;
			let vx = Math.cos(ang) * (40 + move.power);
			let vy = Math.sin(ang) * (40 + move.power);
			if (kind === "beam" || kind === "slash") {
				const t = i / n;
				x = x0 + (x1 - x0) * t;
				y = y0 + (y1 - y0) * t;
				vx = (x1 - x0) * 2;
				vy = (y1 - y0) * 2 + (kind === "slash" ? Math.sin(t * 8) * 80 : 0);
			} else if (kind === "rain") {
				x = x1 + (Math.random() - .5) * 40;
				y = y1 - 30 - Math.random() * 20;
				vx = 0;
				vy = 50 + move.power;
			} else if (kind === "orbit" || kind === "spiral") {
				vx = Math.cos(ang) * 70;
				vy = Math.sin(ang) * 70;
			} else if (kind === "shield") {
				x = x0 + Math.cos(ang) * 16;
				y = y0 + Math.sin(ang) * 16;
				vx = 0;
				vy = 0;
			}
			this.parts.push({
				x,
				y,
				vx,
				vy,
				life: .25 + move.priority * .05 + (move.effect === "sleep" ? .2 : 0),
				max: .45,
				color: effectTint(move.effect, color),
				size: kind === "burst" || move.power > 48 ? 4 : 2,
				kind
			});
		}
	}
	procSet(fx) {
		const save = this.save;
		this.say(`Set: ${fx.replace(/([a-z])([A-Z])/g, "$1 $2")}.`);
		this.shake = 8;
		this.tone(180, .2, "sawtooth");
		for (let i = 0; i < 30; i++) {
			const a = i / 30 * Math.PI * 2;
			this.parts.push({
				x: save.x,
				y: save.y - 20,
				vx: Math.cos(a) * 120,
				vy: Math.sin(a) * 120,
				life: .5,
				max: .5,
				color: fxColor(fx),
				size: 4,
				kind: "burst"
			});
		}
		for (const m of this.mobs) {
			if (!m.alive) continue;
			if (Math.hypot(m.x - save.x, m.y - save.y) > 120) continue;
			const bonus = fx === "solarnova" || fx === "bloodmoon" ? 28 : 18;
			if (this.role !== "guest") this.applyMobDamage(m, bonus + save.level * 2, true);
			if (fx === "briarburst" || fx === "tidalsurge") m.status.push({
				id: fx === "tidalsurge" ? "soak" : "root",
				t: 2.5
			});
			if (fx === "whitestorm" || fx === "gravepulse") m.status.push({
				id: "sleep",
				t: 1.6
			});
			if (fx === "voidring" || fx === "stormcrown") m.status.push({
				id: "silence",
				t: 2
			});
		}
		if (fx === "lanternwake" || fx === "featherfall" || fx === "gravepulse") save.hp = Math.min(this.maxHp(), save.hp + 20);
	}
	interact() {
		const save = this.save;
		if (!save || this.dead || !this.world) return;
		if (save.map !== "world") {
			const ex = dungeonExit();
			if (Math.hypot(save.x - ex.x, save.y - ex.y) < 36) {
				this.travel("world", WORLD_RETURN[save.map] ?? hearthXY());
				return;
			}
		}
		if (save.map === "world") for (const tavern of TAVERNS) {
			const x = tavern.boardTx * 32 + 16;
			const y = tavern.boardTy * 32 + 16;
			if (Math.hypot(save.x - x, save.y - y) < 48) {
				this.openBounty(tavern);
				return;
			}
		}
		let best = 999;
		let hit = null;
		for (const p of POIS) {
			if (save.map !== "world") break;
			const pos = poiPos(p);
			if (!pos) continue;
			const reach = p.kind === "dungeon" || p.kind === "shrine" ? 120 : 52;
			const d = Math.hypot(pos.x - save.x, pos.y - save.y);
			if (d <= reach && d < best) {
				best = d;
				hit = p;
			}
		}
		if (!hit) {
			this.say("Nothing close.");
			return;
		}
		if (hit.kind === "npc") this.openTalk(hit.id);
		else if (hit.kind === "shrine") {
			const keeper = NPCS.find((n) => n.shrine === hit.type);
			if (keeper) this.openTalk(keeper.id);
			else this.say("The arena waits. Find whoever keeps the door.");
		} else if (hit.kind === "dungeon") this.travel(hit.id, dungeonExit());
		else if (hit.kind === "hearth") {
			save.hp = this.maxHp();
			this.secondUsed = false;
			this.status = [];
			this.say("The hearth mends you. Skills stay either way.");
			this.gainSkill("adventuring", 4);
			this.persist();
		} else if (hit.kind === "node") this.startNode(hit.id, hit.node);
		else if (hit.kind === "boss") {
			const m = this.mobs.find((mm) => mm.bossId === hit.id);
			if (m) this.dest = {
				x: m.x,
				y: m.y,
				mob: m.id
			};
		}
	}
	startNode(id, node) {
		if ((this.nodeCd[id] ?? 0) > 0) {
			this.say("Already gathered.");
			return;
		}
		const skill = node === "ore" ? "mining" : node === "tree" ? "woodcutting" : node === "shroom" ? "shroom" : "fishing";
		const lv = this.save.skills[skill].level;
		const need = node === "fish" ? Math.max(.45, 1.5 / (1 + (lv - 1) * .02)) : Math.max(.45, 1.15 - lv * .008);
		this.channel = {
			kind: `${node}:${id}`,
			t: 0,
			need
		};
		this.say(node === "fish" ? "The line is in..." : "Working...");
	}
	finishChannel() {
		this.save;
		const ch = this.channel;
		this.channel = null;
		if (!ch) return;
		const [node, id] = ch.kind.split(":");
		this.nodeCd[id ?? ""] = 12;
		const luck = 1 + this.chan("harvest") / 100;
		if (node === "ore") {
			const n = Math.max(1, Math.floor((1 + Math.random()) * luck));
			this.giveItem("ore", n);
			this.gainSkill("mining", 14);
			this.say(`Ore x${n}.`);
		} else if (node === "tree") {
			const n = Math.max(1, Math.floor((1 + Math.random()) * luck));
			this.giveItem("timber", n);
			this.gainSkill("woodcutting", 14);
			this.say(`Timber x${n}.`);
		} else if (node === "shroom") {
			const bonus = this.chan("shroom_sense");
			this.giveItem(Math.random() < .34 ? "dreamspore" : Math.random() < .5 ? "embercap" : "blue_lantern", 1 + (bonus > 20 ? 1 : 0));
			this.giveItem("mushroom", 1);
			this.gainSkill("shroom", 16);
			this.say("The patch gives.");
		} else if (node === "fish") {
			this.giveItem("fish", 1 + (this.chan("fish_luck") > 25 ? 1 : 0));
			this.gainSkill("fishing", 16);
			this.say("A bite.");
		}
		this.persist();
	}
	openTalk(id) {
		const npc = NPCS.find((n) => n.id === id);
		if (!npc) return;
		this.talkId = id;
		this.talkI = 0;
		this.shop = npc.shop ?? null;
		if (npc.shop === "armor" || npc.shop === "fence") {
			const rng = mulberry32(Date.now() / 1e3 | 0);
			this.shopStock = [
				0,
				1,
				2,
				3
			].map(() => rollGear(rng, {
				level: Math.max(1, this.save.level),
				raceBias: this.save.race,
				luck: 5
			}));
		}
		const save = this.save;
		if (!save.talked.includes(id)) {
			save.talked.push(id);
			this.gainSkill("social", 8);
		}
		publish({ panel: "talk" });
		this.syncHud(true);
	}
	nextLine() {
		const npc = NPCS.find((n) => n.id === this.talkId);
		if (!npc) return;
		this.talkI = Math.min(npc.lines.length - 1, this.talkI + 1);
		this.syncHud(true);
	}
	startShrine(type) {
		const save = this.save;
		const t = type ?? NPCS.find((n) => n.id === this.talkId)?.shrine ?? "light";
		this.shrine = {
			type: t,
			round: 1
		};
		save.hp = this.maxHp();
		this.spawnShrineFoe();
		publish({ panel: null });
		this.say(`${TYPES[t].name} shrine. Round 1.`);
		this.gainSkill("adventuring", 6);
	}
	spawnShrineFoe() {
		const save = this.save;
		if (!this.shrine) return;
		const list = MOVES.filter((m) => m.type === this.shrine.type);
		const species = Object.values(MONSTER_BY_ID).find((m) => m.type === this.shrine.type)?.id ?? "hikari";
		const def = MONSTER_BY_ID[species];
		const level = save.level + this.shrine.round * 2;
		const mob = this.makeMob({
			id: `shrine-${this.shrine.round}-${nextUid()}`,
			species,
			x: save.x + 48,
			y: save.y - 10,
			level,
			template: def.template,
			type: this.shrine.type,
			name: `${TYPES[this.shrine.type].name} Saint`
		});
		mob.name = `${TYPES[this.shrine.type].name} Saint ${this.shrine.round}`;
		mob.move = (list[this.shrine.round] ?? list[0] ?? MOVES[0]).id;
		mob.boss = this.shrine.round === 3;
		mob.hp = mob.max = Math.floor(mob.max * (1 + this.shrine.round * .25));
		this.mobs.push(mob);
		this.dest = {
			x: mob.x,
			y: mob.y,
			mob: mob.id
		};
	}
	shrineClear() {
		const save = this.save;
		if (!this.shrine) return;
		if (this.shrine.round >= 3) {
			const piece = rollGear(mulberry32(Math.random() * 1e9 | 0), {
				level: save.level + 3,
				floor: "rare",
				typeBias: this.shrine.type,
				raceBias: save.race,
				luck: 30
			});
			this.receiveGear(piece);
			save.bestShrine = Math.max(save.bestShrine, 3);
			save.kyo += 40 + save.bestShrine * 5;
			this.say(`Shrine clear. ${piece.name}.`);
			this.shrine = null;
			this.gainSkill("adventuring", 30);
			this.persist();
			return;
		}
		this.shrine.round += 1;
		save.hp = this.maxHp();
		this.say(`Round ${this.shrine.round}. The saint is louder.`);
		this.spawnShrineFoe();
	}
	travel(map, at) {
		this.save;
		this.room?.send({
			t: "go",
			map,
			x: at.x,
			y: at.y
		});
		this.switchTo(map, at);
	}
	switchTo(map, at) {
		const save = this.save;
		save.x = at.x;
		save.y = at.y;
		this.loadMap(map, true);
		this.cam.x = save.x;
		this.cam.y = save.y;
		this.say(map === "world" ? "Back under the sky." : map === "crypt" ? "The Tiny Crypt breathes." : "The Ash Kiln is awake.");
		if (map === "crypt") {
			if (!save.quests.bone_king.done && save.regions.includes("bone")) {}
		}
		this.persist();
	}
	visitRegion() {
		const save = this.save;
		if (!this.world || save.map !== "world") return;
		const b = biomeNameAt(this.world, save.x, save.y);
		if (!save.regions.includes(b)) {
			save.regions.push(b);
			this.say(BIOME_LABEL[b]);
			this.gainSkill("adventuring", 10);
			const q = save.quests.marsh_walk;
			if (b === "tide" && !q.done && q.n < 1) {
				q.n = 1;
				this.say("Tide Reach. Now catch a water spirit.");
			}
			if (b === "bone") {
				const bk = save.quests.bone_king;
				if (!bk.done) bk.n = 1;
			}
		}
	}
	catchSpirit() {
		const save = this.save;
		const mob = this.nearestMob(save.x, save.y, 70);
		if (!mob) return this.say("No spirit close.");
		if ((save.bag.ghost_jar ?? 0) <= 0) return this.say("Need a ghost jar.");
		if (mob.boss) return this.say("That one does not fit.");
		const pct = mob.hp / mob.max;
		if (pct > .5) return this.say("Soften it first.");
		const chance = .22 + (1 - pct) * .5 + save.skills.catching.level * .004 + this.chan("catch_boost") / 100;
		save.bag.ghost_jar -= 1;
		if (Math.random() > chance) {
			this.say(`${mob.name} slips the jar.`);
			return;
		}
		const pet = {
			species: mob.species,
			level: mob.level,
			rarity: mob.rarity
		};
		if (!save.companion) save.companion = pet;
		else save.box.push(pet);
		mob.alive = false;
		mob.respawn = 20;
		this.gainSkill("catching", 18);
		save.catches[mob.type] = (save.catches[mob.type] ?? 0) + 1;
		if (this.world && biomeNameAt(this.world, save.x, save.y) === "ashen") {
			if (mob.type === "fire") {
				const q = save.quests.ember_hunt;
				if (!q.done) {
					q.n += 1;
					if (q.n >= 2) this.completeQuest("ember_hunt");
				}
			}
		}
		const fires = save.catches.fire ?? 0;
		const lights = save.catches.light ?? 0;
		if (fires >= 1 && lights >= 1) {
			if (!save.quests.keeper_lanterns.done) this.completeQuest("keeper_lanterns");
		}
		if (mob.type === "water" && save.quests.marsh_walk.n >= 1 && !save.quests.marsh_walk.done) this.completeQuest("marsh_walk");
		this.say(`${mob.name} jarred.`);
		this.tone(600, .12, "triangle");
		this.persist();
	}
	turnSalt() {
		const save = this.save;
		if ((save.bag.cleanse_salt ?? 0) < 2) return this.say("Need 2 cleanse salt.");
		save.bag.cleanse_salt -= 2;
		save.saltTurned += 2;
		if (!save.quests.salt_run.done) this.completeQuest("salt_run");
		this.persist();
	}
	useBag(id) {
		const save = this.save;
		const def = ITEM_BY_ID[id];
		if (!def || (save.bag[id] ?? 0) <= 0) return;
		if (id === "ghost_jar") return this.catchSpirit();
		if (id === "smoke_bomb") {
			save.bag[id] -= 1;
			this.dest = null;
			save.x += this.facing * -40;
			this.say("Smoke.");
			return;
		}
		if (id === "cleanse_salt") {
			save.bag[id] -= 1;
			this.status = [];
			this.say("Cleansed.");
			return;
		}
		if (def.heal) {
			save.bag[id] -= 1;
			save.hp = Math.min(this.maxHp(), save.hp + def.heal);
			this.say(`${def.name}.`);
		}
		if (def.buff === "fire") this.buff = {
			type: "fire",
			crit: 0,
			ward: 0,
			t: 25
		};
		if (def.buff === "crit") this.buff = {
			crit: 20,
			ward: 0,
			t: 25
		};
		if (def.buff === "ward") this.buff = {
			crit: 0,
			ward: .2,
			t: 25
		};
		this.persist();
		this.syncHud(true);
	}
	equip(uid) {
		const save = this.save;
		const g = save.gear.find((x) => x.uid === uid);
		if (!g) return;
		save.equipped[g.slot] = uid;
		this.say(`Equipped ${g.name}.`);
		this.selected = uid;
		this.persist();
		this.syncHud(true);
	}
	receiveGear(g) {
		const save = this.save;
		if (!save) return;
		save.gear.push(g);
		this.noteFound(g);
		const worn = this.piece(g.slot);
		if (!worn || gearScore(g) > gearScore(worn)) {
			save.equipped[g.slot] = g.uid;
			this.say(`Wore ${g.name}. Score ${gearScore(g)}.`);
		}
	}
	toggleAutoplay() {
		this.autoplay = !this.autoplay;
		this.path = [];
		this.pathI = 0;
		this.autoPlan = 0;
		this.grind = this.autoplay ? "looking" : "";
		this.dest = null;
		this.say(this.autoplay ? "Autoplay. She grinds her lowest skill." : "Autoplay off.");
		this.syncHud(true);
	}
	sell(uid) {
		const save = this.save;
		const i = save.gear.findIndex((g) => g.uid === uid);
		if (i < 0) return;
		const g = save.gear[i];
		if (Object.values(save.equipped).includes(uid)) {
			for (const k of Object.keys(save.equipped)) if (save.equipped[k] === uid) delete save.equipped[k];
		}
		const mult = (1 + Math.min(.5, (save.skills.trading.level - 1) * .01)) * (1 + this.chan("sell_boost") / 100);
		save.kyo += Math.floor(gearPrice(g) * .45 * mult);
		save.gear.splice(i, 1);
		this.gainSkill("trading", 8);
		this.say("Sold.");
		this.persist();
		this.syncHud(true);
	}
	buyGear(uid) {
		const save = this.save;
		const g = this.shopStock.find((x) => x.uid === uid);
		if (!g) return;
		const price = this.price(g.price);
		if (save.kyo < price) return this.say("Need more Kyo.");
		save.kyo -= price;
		this.receiveGear(g);
		this.shopStock = this.shopStock.filter((x) => x.uid !== uid);
		this.gainSkill("trading", 8);
		this.say(`Bought ${g.name}.`);
		this.persist();
		this.syncHud(true);
	}
	buyItem(id) {
		const save = this.save;
		const def = ITEM_BY_ID[id];
		if (!def) return;
		const price = this.price(def.price);
		if (save.kyo < price) return this.say("Need more Kyo.");
		save.kyo -= price;
		this.giveItem(id, 1);
		this.gainSkill("trading", 4);
		this.persist();
		this.syncHud(true);
	}
	price(n) {
		const save = this.save;
		const shop = Math.max(.55, 1 - (save.skills.trading.level - 1) * .008);
		const charm = 1 - this.chan("shop_charm") / 140;
		return Math.max(1, Math.floor(n * shop * charm));
	}
	brew(recipe) {
		const save = this.save;
		const take = (id, n) => {
			if ((save.bag[id] ?? 0) < n) return false;
			save.bag[id] -= n;
			return true;
		};
		if (recipe === "warmth" && take("dreamspore", 1) && take("embercap", 1)) this.giveItem("warmth_tonic", 1);
		else if (recipe === "ward" && take("ironroot", 1) && take("mushroom", 1)) this.giveItem("ironroot_phial", 1);
		else if (recipe === "eye" && take("dreamspore", 1) && take("blue_lantern", 1)) this.giveItem("cats_eye", 1);
		else if (recipe === "meal" && take("fish", 1)) this.giveItem("fish_meal", 1);
		else return this.say("Missing ingredients.");
		this.gainSkill(recipe === "meal" ? "fishing" : "alchemy", 18);
		this.say("Brewed.");
		this.persist();
		this.syncHud(true);
	}
	teach() {
		const save = this.save;
		const piece = this.piece("weapon") ?? this.piece("chest");
		if (!piece) return this.say("Wear a piece. New verses live in the gear.");
		if (save.kyo < 35) return this.say("Orien wants 35 Kyo.");
		const have = new Set(this.arsenal(save).map((m) => m.id));
		const id = learnPool(save.level + 4, save.race).find((m) => !have.has(m));
		if (!id) return this.say("That piece already sings every verse Orien knows.");
		save.kyo -= 35;
		piece.moves = [...ensureGearMoves(piece), id].slice(0, 2);
		this.syncArsenal(save);
		this.say(`${piece.name} learned ${MOVE_BY_ID[id].name}.`);
		this.persist();
		this.syncHud(true);
	}
	setBar(_index, _moveId) {
		this.say("Auto uses every verse on you. New ones come packed in gear.");
	}
	select(uid) {
		this.selected = uid;
		this.syncHud(true);
	}
	disenchant() {
		const save = this.save;
		const g = save.gear.find((x) => x.uid === this.selected);
		if (!g || g.enchants.length === 0) return;
		if (save.kyo < 80) return this.say("Disenchant costs 80 Kyo.");
		save.kyo -= 80;
		const e = g.enchants.pop();
		save.stash.push(e);
		this.say(`Stripped ${ENCHANT_BY_ID[e.id]?.name ?? e.id}.`);
		this.persist();
		this.syncHud(true);
	}
	applyStash(index) {
		const save = this.save;
		const g = save.gear.find((x) => x.uid === this.selected);
		const e = save.stash[index];
		if (!g || !e) return;
		if (g.enchants.length >= 8) return this.say("That piece is full.");
		const exist = g.enchants.find((x) => x.id === e.id);
		if (exist) exist.power = Math.min(ENCHANT_BY_ID[e.id]?.max ?? 99, exist.power + e.power);
		else g.enchants.push(e);
		save.stash.splice(index, 1);
		this.say("Enchant set.");
		this.persist();
		this.syncHud(true);
	}
	summonBox(index) {
		const save = this.save;
		const pet = save.box[index];
		if (!pet) return;
		if (save.companion) save.box.push(save.companion);
		save.companion = pet;
		save.box.splice(index, 1);
		this.say(`${MONSTER_BY_ID[pet.species]?.name ?? "Spirit"} walks with you.`);
		this.syncHud(true);
	}
	takeBounty() {
		const save = this.save;
		if (!save || !this.world || save.map !== "world") return;
		const live = this.mobs.find((m) => m.witch && m.alive);
		if (live) {
			this.say(`You already hunt ${live.name}.`);
			publish({ panel: null });
			return;
		}
		const name = WITCH_NAMES[Math.floor(Math.random() * WITCH_NAMES.length)];
		const race = RACES[Math.floor(Math.random() * RACES.length)];
		let x = save.x + 400;
		let y = save.y;
		for (let i = 0; i < 50; i++) {
			const tx = 4 + Math.floor(Math.random() * (this.world.w - 8));
			const ty = 4 + Math.floor(Math.random() * (this.world.h - 8));
			const wx = tx * 32 + 16;
			const wy = ty * 32 + 16;
			if (blocked(this.world, wx, wy)) continue;
			if (Math.hypot(wx - save.x, wy - save.y) < 420) continue;
			x = wx;
			y = wy;
			break;
		}
		const lvl = Math.max(save.level, save.accountLevel);
		const rng = mulberry32((Date.now() ^ Math.random() * 1e9) >>> 0);
		const gear = [
			0,
			1,
			2
		].map(() => rollGear(rng, {
			level: Math.max(1, save.accountLevel),
			luck: 18,
			raceBias: race.id,
			floor: save.accountLevel > 4 ? "fine" : null
		}));
		const spell = huntMove(race.type);
		const mob = this.makeMob({
			id: `witch-${nextUid()}`,
			species: "muma",
			x,
			y,
			level: lvl + 1,
			template: 20,
			type: race.type,
			name
		});
		mob.witch = true;
		mob.race = race.id;
		mob.name = name;
		mob.move = spell.id;
		mob.hp = mob.max = Math.floor(70 + lvl * 22);
		mob.lootGear = gear;
		mob.lootBag = {
			potion: 2,
			mushroom: 6,
			leather: 4,
			ghost_jar: 1
		};
		mob.lootKyo = 28 + save.accountLevel * 14;
		mob.huntIn = 75;
		mob.seen = false;
		this.mobs.push(mob);
		publish({ panel: null });
		this.say(`Bounty: ${name}. She already knows your name. Find her.`);
		this.persist();
		this.syncHud(true);
	}
	spendPerk(id) {
		const save = this.save;
		const def = ENCHANT_BY_ID[id];
		if (!save || !def) return;
		if (save.perkPoints <= 0) {
			this.say("No perk points.");
			return;
		}
		const cur = save.perks[id] ?? 0;
		const step = Math.max(1, Math.round(def.max / 8));
		if (cur + step > def.max) {
			this.say(`${def.name} is full.`);
			return;
		}
		save.perks[id] = cur + step;
		save.perkPoints -= 1;
		this.say(`${def.name} +${step}. Permanent.`);
		this.persist();
		this.syncHud(true);
	}
	craftGear() {
		const save = this.save;
		if (!save) return;
		if ((save.bag.leather ?? 0) < 10 || (save.bag.mushroom ?? 0) < 10) {
			this.say("Need 10 leather and 10 mushrooms.");
			return;
		}
		save.bag.leather -= 10;
		save.bag.mushroom -= 10;
		const piece = rollGear(mulberry32(Math.random() * 1e9 | 0), {
			level: Math.max(1, save.accountLevel),
			luck: 12 + save.accountLevel * 2,
			raceBias: save.race
		});
		this.receiveGear(piece);
		this.say(`Stitched ${piece.name} at account ${save.accountLevel}.`);
		this.gainSkill("alchemy", 22);
		this.persist();
		this.syncHud(true);
	}
	sellMats() {
		const save = this.save;
		if (!save) return;
		const ids = [
			"meat",
			"leather",
			"mushroom",
			"ore",
			"timber",
			"fish"
		];
		let kyo = 0;
		const charm = 1 + this.chan("sell_boost") / 100 + Math.min(.3, (save.skills.trading.level - 1) * .01);
		for (const id of ids) {
			const n = save.bag[id] ?? 0;
			if (n <= 0) continue;
			const price = ITEM_BY_ID[id]?.price ?? 6;
			kyo += Math.floor(n * price * .85 * charm);
			save.bag[id] = 0;
		}
		if (kyo <= 0) {
			this.say("Nothing Holt wants.");
			return;
		}
		save.kyo += kyo;
		this.say(`Sold the pack for ${kyo} kyo.`);
		this.gainSkill("trading", 10);
		this.persist();
		this.syncHud(true);
	}
	toggle(panel) {
		if (snap.mode !== "play") return;
		publish({ panel: snap.panel === panel ? null : panel });
		this.syncHud(true);
	}
	escape() {
		if (snap.panel) publish({ panel: null });
		else if (snap.mode === "play") publish({ panel: "pause" });
	}
	closePanel() {
		publish({ panel: null });
	}
	toTitle() {
		this.persist();
		this.room?.close();
		this.room = null;
		this.role = "solo";
		this.save = null;
		this.mobs = [];
		publish({
			...emptySnap(),
			hasSave: !!this.cloudCache || !!localStorage.getItem(SAVE_KEY),
			mode: "title"
		});
	}
	stab(type) {
		this.save;
		let s = 1;
		for (const slot of [
			"weapon",
			"head",
			"chest",
			"legs",
			"feet",
			"relic"
		]) {
			const g = this.piece(slot);
			if (!g) continue;
			if (g.type === type) s += slot === "weapon" ? .28 : .08;
		}
		s += this.chan("type_edge") / 100;
		if (this.buff.t > 0 && this.buff.type === type) s += .22;
		return s;
	}
	piece(slot) {
		const save = this.save;
		if (!save) return null;
		const uid = save.equipped[slot];
		return save.gear.find((g) => g.uid === uid) ?? null;
	}
	normalize(save) {
		const skills = blankSkills();
		const prev = save.skills ?? {};
		for (const sk of SKILLS) {
			const had = prev[sk.id];
			if (had && had.level) skills[sk.id] = {
				level: had.level,
				xp: had.xp || 0
			};
		}
		save.skills = skills;
		save.quests = save.quests ?? blankQuests();
		for (const d of QUESTS) if (!save.quests[d.id]) save.quests[d.id] = {
			n: 0,
			n2: 0,
			done: false
		};
		save.accountLevel = save.accountLevel || 1;
		save.accountXp = save.accountXp || 0;
		save.perkPoints = save.perkPoints || 0;
		save.perks = save.perks || {};
		save.lastTavern = save.lastTavern || "crown_tap";
		save.bag = save.bag || {};
		save.gear = save.gear || [];
		save.party = save.party ?? [];
		save.found = save.found ?? {};
		save.spirits = save.spirits ?? [];
		save.accountScore = save.accountScore ?? 0;
		save.evilMark = save.evilMark ?? 0;
		if (save.companion && save.spirits.length === 0) {
			const def = MONSTER_BY_ID[save.companion.species];
			if (def) {
				const look = rollGhostLook(mulberry32(save.seed || 1), save.companion.rarity || 0, "measured", "hunt");
				save.spirits.push({
					uid: nextUid(),
					species: save.companion.species,
					name: def.name,
					type: def.type,
					template: def.template,
					level: save.companion.level,
					rarity: save.companion.rarity || 0,
					look,
					move: look.move,
					hp: 30 + save.companion.level * 8,
					max: 30 + save.companion.level * 8,
					speed: 8 + save.companion.level
				});
			}
			save.companion = null;
		}
		if (!save.innate?.length) {
			const seed = save.seed || 1;
			save.innate = save.known?.length ? save.known.slice(0, 4) : rollInnate(mulberry32(seed));
		}
		for (const g of save.gear) ensureGearMoves(g);
		this.syncArsenal(save);
	}
	gainAccount(n) {
		const save = this.save;
		save.accountXp += Math.max(0, n);
		let need = accountNeed(save.accountLevel);
		while (save.accountXp >= need && save.accountLevel < 40) {
			save.accountXp -= need;
			save.accountLevel += 1;
			save.perkPoints += 5;
			this.say(`Account ${save.accountLevel}. 5 perk points.`);
			this.tone(520, .14, "square");
			need = accountNeed(save.accountLevel);
		}
	}
	pickTavern() {
		const last = this.save?.lastTavern;
		const pool = TAVERNS.filter((t) => t.id !== last);
		return pool[Math.floor(Math.random() * pool.length)] ?? TAVERNS[0];
	}
	openBounty(tavern) {
		publish({ panel: "bounty" });
		this.say(`${tavern.name}. The board has a witch's name.`);
		this.syncHud(true);
	}
	playerArmor() {
		let armor = 0;
		for (const slot of [
			"head",
			"chest",
			"legs",
			"feet"
		]) {
			const g = this.piece(slot);
			if (!g) continue;
			const q = [
				"worn",
				"common",
				"fine",
				"rare",
				"epic",
				"legendary"
			].indexOf(g.quality);
			armor += 8 + g.level * 2 + Math.max(0, q) * 5;
		}
		return armor;
	}
	mobArmor(mob) {
		if (mob.animal && mob.species !== "boar") return 2;
		if (mob.witch) return 10 + mob.level * 3;
		return 4 + mob.level * 2 + (mob.boss ? 24 : 0);
	}
	chan(id) {
		const save = this.save;
		if (!save) return 0;
		let n = 0;
		for (const slot of [
			"weapon",
			"head",
			"chest",
			"legs",
			"feet",
			"relic"
		]) {
			const g = this.piece(slot);
			if (!g) continue;
			for (const e of g.enchants) if (e.id === id) n += e.power;
		}
		n += save.perks[id] ?? 0;
		return n;
	}
	setInfo() {
		const ids = [
			"head",
			"chest",
			"legs",
			"feet",
			"relic"
		].map((s) => this.piece(s)?.setId ?? null);
		const first = ids.find((id) => id);
		if (!first) return {
			on: false,
			count: 0,
			name: "",
			bonus: "",
			fx: null
		};
		const count = ids.filter((id) => id === first).length;
		const set = SET_BY_ID[first];
		return {
			on: count === 5,
			count,
			name: set?.name ?? "",
			bonus: set?.bonus ?? "",
			fx: set?.fx ?? null
		};
	}
	maxHp() {
		const save = this.save;
		if (!save) return 80;
		return Math.floor(78 + save.level * 12 + this.chan("ward") * .8 + this.chan("spark_life") * .5);
	}
	armorType() {
		return (this.piece("chest") ?? this.piece("weapon"))?.type ?? "normal";
	}
	applyEffect(move, mob, onMob) {
		if (move.effect === "none" || move.effect === "leech" || move.effect === "mend" || move.effect === "shell") return;
		const st = {
			id: move.effect === "drain" ? "leech" : move.effect,
			t: 3.2 + move.priority * .3
		};
		if (onMob && mob) mob.status.push(st);
		else this.addStatus(st.id, st.t);
	}
	addStatus(id, t) {
		if (id === "none") return;
		this.status.push({
			id,
			t
		});
	}
	persist() {
		if (!this.save) return;
		for (const g of this.save.gear) this.noteFound(g);
		localStorage.setItem(SAVE_KEY, JSON.stringify(this.save));
		if (!this.cloudFn) return;
		const json = JSON.stringify(this.save);
		window.clearTimeout(this.cloudTimer);
		this.cloudTimer = window.setTimeout(() => this.cloudFn?.(json), 700);
	}
	attachCloud(fn) {
		this.cloudFn = fn;
	}
	rememberCloud(raw) {
		if (!raw || typeof raw !== "object") return;
		const save = raw;
		if (!save.name || !save.race) return;
		this.cloudCache = save;
		publish({ hasSave: true });
	}
	openShell(sx, sy) {
		this.openInspect(-9999, -9999, sx, sy);
	}
	openRoom(role, code) {
		this.room?.close();
		this.role = role;
		const room = `tz${code.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8)}`;
		publish({
			roomCode: code.toUpperCase(),
			net: "Seeking the veil..."
		});
		this.room = new P2PRoom({
			room,
			selfId: this.selfId,
			name: this.save?.name ?? "Huntress",
			onPeersChanged: (peers) => {
				this.peers = peers.map((p) => ({
					id: p.id,
					name: p.name
				}));
				publish({
					peers: peers.map((p) => p.name || p.id.slice(0, 4)),
					net: peers.length ? `${peers.length} linked` : "Lobby open"
				});
				if (this.role === "host") {
					this.room?.send({
						t: "world",
						seed: this.save?.seed,
						map: this.save?.map,
						x: this.save?.x,
						y: this.save?.y
					});
					this.broadcastMobs();
				}
			},
			onMessage: (from, data) => this.onNet(from, data)
		});
		this.room.join();
	}
	onNet(from, data) {
		const msg = data;
		if (!msg || typeof msg.t !== "string") return;
		const save = this.save;
		if (msg.t === "p") this.remotes.set(from, {
			name: String(msg.name ?? "Hunter"),
			x: Number(msg.x),
			y: Number(msg.y),
			hp: Number(msg.hp),
			max: Number(msg.max),
			race: msg.race || "vesper",
			facing: Number(msg.facing) || 1,
			map: msg.map || "world",
			pieces: Array.isArray(msg.pieces) ? msg.pieces : []
		});
		else if (msg.t === "world" && this.role === "guest" && save) {
			const seed = Number(msg.seed);
			if (seed && seed !== save.seed) {
				save.seed = seed;
				this.overworld = null;
				this.switchTo(msg.map || "world", {
					x: Number(msg.x) || save.x,
					y: Number(msg.y) || save.y
				});
			}
		} else if (msg.t === "mobs" && this.role === "guest" && Array.isArray(msg.list)) this.applyMobSnap(msg.list);
		else if (msg.t === "dmg" && this.role === "host") {
			const mob = this.mobs.find((m) => m.id === msg.id && m.alive);
			if (mob) this.applyMobDamage(mob, Number(msg.amount) || 0);
		} else if (msg.t === "dead") {
			const mob = this.mobs.find((m) => m.id === msg.id);
			if (mob && mob.alive && this.role === "guest") {
				mob.alive = false;
				mob.hp = 0;
				this.say(`${mob.name} falls.`);
				const piece = rollGear(mulberry32(Math.random() * 1e9 | 0), {
					level: mob.level,
					raceBias: save?.race,
					luck: 10,
					floor: mob.boss ? "rare" : null
				});
				save?.gear && this.receiveGear(piece);
				this.say(`Your roll: ${piece.name}.`);
			}
		} else if (msg.t === "go" && save) this.switchTo(msg.map, {
			x: Number(msg.x),
			y: Number(msg.y)
		});
		else if (msg.t === "chat") {
			this.chat.push({
				name: String(msg.name ?? "?"),
				text: String(msg.text ?? "").slice(0, 140)
			});
			this.chat = this.chat.slice(-8);
			publish({ chat: this.chat });
		} else if (msg.t === "trade") this.onTrade(from, msg);
	}
	applyMobSnap(list) {
		for (const row of list) {
			let mob = this.mobs.find((m) => m.id === row.id);
			if (!mob) continue;
			const prev = this.seenSwing.get(row.id) ?? 0;
			mob.x = row.x;
			mob.y = row.y;
			mob.hp = row.hp;
			mob.alive = row.alive;
			mob.move = row.move;
			if (row.swing > prev) {
				this.seenSwing.set(row.id, row.swing);
				const move = MOVE_BY_ID[row.move] ?? MOVES[0];
				const save = this.save;
				this.playMoveFx(move, mob.x, mob.y - 12, save.x, save.y - 18);
				if (Math.hypot(mob.x - save.x, mob.y - save.y) < move.range + 16) this.mobHitsPlayer(mob, move);
			}
		}
	}
	broadcastPos() {
		const save = this.save;
		if (!save || !this.room) return;
		const pieces = [
			"weapon",
			"head",
			"chest",
			"legs",
			"feet",
			"relic"
		].map((s) => this.piece(s)).filter((g) => !!g);
		this.room.broadcast({
			t: "p",
			name: save.name,
			x: save.x,
			y: save.y,
			hp: save.hp,
			max: this.maxHp(),
			race: save.race,
			facing: this.facing,
			map: save.map,
			pieces
		});
	}
	broadcastMobs() {
		if (!this.room) return;
		this.room.broadcast({
			t: "mobs",
			list: this.mobs.map((m) => ({
				id: m.id,
				x: m.x,
				y: m.y,
				hp: m.hp,
				alive: m.alive,
				swing: m.swing,
				move: m.move
			}))
		});
	}
	sendChat(text) {
		const save = this.save;
		if (!save) return;
		const line = text.trim().slice(0, 140);
		if (!line) return;
		this.chat.push({
			name: save.name,
			text: line
		});
		this.chat = this.chat.slice(-8);
		this.room?.send({
			t: "chat",
			name: save.name,
			text: line
		});
		publish({ chat: this.chat });
	}
	toggleTrade() {
		const near = this.nearestRemote();
		if (!near) return this.say("No hunter close enough to trade.");
		this.trade = {
			peer: near.id,
			mine: [],
			items: {},
			theirsGear: [],
			theirsItems: {},
			me: false,
			them: false,
			nonce: nextUid()
		};
		this.room?.send({
			t: "trade",
			op: "open",
			nonce: this.trade.nonce
		}, near.id);
		publish({ panel: "trade" });
		this.syncHud(true);
	}
	offerSelected() {
		if (!this.trade || !this.selected) return;
		if (!this.trade.mine.includes(this.selected)) this.trade.mine.push(this.selected);
		this.pushOffer();
	}
	offerItem(id) {
		if (!this.trade) return;
		this.trade.items[id] = (this.trade.items[id] ?? 0) + 1;
		this.pushOffer();
	}
	lockTrade() {
		if (!this.trade) return;
		this.trade.me = !this.trade.me;
		this.pushOffer();
		this.tryCommit();
	}
	pushOffer() {
		if (!this.trade || !this.save) return;
		const gear = this.trade.mine.map((id) => this.save.gear.find((g) => g.uid === id)).filter((g) => !!g);
		this.room?.send({
			t: "trade",
			op: "offer",
			gear,
			items: this.trade.items,
			lock: this.trade.me,
			nonce: this.trade.nonce
		}, this.trade.peer);
		this.syncHud(true);
	}
	onTrade(from, msg) {
		if (msg.op === "open") {
			this.trade = {
				peer: from,
				mine: [],
				items: {},
				theirsGear: [],
				theirsItems: {},
				me: false,
				them: false,
				nonce: String(msg.nonce ?? nextUid())
			};
			publish({ panel: "trade" });
		}
		if (!this.trade || this.trade.peer !== from) return;
		if (msg.op === "offer") {
			this.trade.theirsGear = msg.gear ?? [];
			this.trade.theirsItems = msg.items ?? {};
			this.trade.them = !!msg.lock;
			this.tryCommit();
		}
		this.syncHud(true);
	}
	tryCommit() {
		const tr = this.trade;
		const save = this.save;
		if (!tr || !save || !tr.me || !tr.them) return;
		for (const uid of tr.mine) {
			save.gear = save.gear.filter((g) => g.uid !== uid);
			for (const k of Object.keys(save.equipped)) if (save.equipped[k] === uid) delete save.equipped[k];
		}
		for (const [id, n] of Object.entries(tr.items)) save.bag[id] = Math.max(0, (save.bag[id] ?? 0) - n);
		for (const g of tr.theirsGear) this.receiveGear({
			...g,
			uid: nextUid()
		});
		for (const [id, n] of Object.entries(tr.theirsItems)) this.giveItem(id, n);
		this.trade = null;
		this.say("Trade sealed.");
		publish({
			panel: null,
			trade: null
		});
		this.persist();
	}
	nearestRemote() {
		const save = this.save;
		if (!save) return null;
		let best = null;
		let bd = 90;
		for (const [id, r] of this.remotes) {
			if (r.map !== save.map) continue;
			const d = Math.hypot(r.x - save.x, r.y - save.y);
			if (d < bd) {
				bd = d;
				best = {
					id,
					name: r.name
				};
			}
		}
		return best;
	}
	hudAt = 0;
	syncHud(force) {
		const now = performance.now();
		if (!force && now - this.hudAt < 120) return;
		this.hudAt = now;
		const save = this.save;
		if (!save) return;
		const set = this.setInfo();
		const q = QUESTS.find((d) => !save.quests[d.id]?.done) ?? QUESTS[QUESTS.length - 1];
		const region = this.world && save.map === "world" ? BIOME_LABEL[biomeNameAt(this.world, save.x, save.y)] : save.map === "crypt" ? "Tiny Crypt" : "Ash Kiln";
		const npc = NPCS.find((n) => n.id === this.talkId);
		publish({
			mode: "play",
			name: save.name,
			race: save.race,
			level: save.level,
			xp: save.xp,
			xpNeed: xpNeed(save.level),
			hp: Math.max(0, Math.ceil(save.hp)),
			maxHp: this.maxHp(),
			shield: Math.ceil(this.shield),
			kyo: save.kyo,
			region,
			map: save.map,
			log: this.log,
			questName: q.name,
			questAbout: q.about,
			bar: save.bar.filter((id) => MOVE_BY_ID[id]).map((id) => {
				const m = MOVE_BY_ID[id];
				const form = attackForm(m);
				const tac = moveTactic(m);
				let max = Math.max(.3, .55 + m.power / 90);
				if (tac === "heavy" || tac === "channel") max *= 1.7;
				else if (form === "spell") max *= 1.35;
				return {
					id,
					name: m.name,
					type: m.type,
					cd: this.cds[id] ?? 0,
					max,
					tag: `${tac} · ${formTag(m)}`
				};
			}),
			gear: save.gear,
			equipped: Object.values(save.equipped).filter((x) => !!x),
			setLabel: set.name ? `${set.name} ${set.count}/5` : "No set",
			setBonus: set.on ? set.bonus : "Wear all 5 pieces of one set.",
			setCount: set.count,
			totals: Object.entries([
				"head",
				"chest",
				"legs",
				"feet",
				"relic",
				"weapon"
			].reduce((acc, slot) => {
				this.piece(slot)?.enchants.forEach((e) => acc[e.id] = (acc[e.id] ?? 0) + e.power);
				return acc;
			}, {})).map(([id, power]) => ({
				id,
				name: ENCHANT_BY_ID[id]?.name ?? id,
				power
			})),
			skills: SKILLS.map((sk) => ({
				id: sk.id,
				name: sk.name,
				level: save.skills[sk.id].level,
				xp: save.skills[sk.id].xp,
				need: skillNeed(save.skills[sk.id].level),
				line: skillLine(sk.id, save.skills[sk.id].level)
			})),
			bag: ITEMS.filter((it) => (save.bag[it.id] ?? 0) > 0).map((it) => ({
				id: it.id,
				name: it.name,
				count: save.bag[it.id] ?? 0,
				about: it.about
			})),
			talk: npc ? {
				id: npc.id,
				name: npc.name,
				role: npc.role,
				line: npc.lines[this.talkI] ?? npc.lines[0],
				shop: npc.shop ?? null,
				shrine: npc.shrine ?? null
			} : null,
			shrine: this.shrine ? `${TYPES[this.shrine.type].name} shrine · round ${this.shrine.round}/3` : "",
			companion: (save.spirits ?? []).filter((s) => s.hp > 0).map((s) => `${s.name} lv${s.level}`).join(", ") || "No spirits",
			accountScore: save.accountScore ?? 0,
			turn: this.turnQ[0] ? this.turnQ[0].side === "you" ? "Your turn" : this.turnQ[0].side === "spirit" ? "Spirit" : "Enemy" : "",
			box: save.box.map((p) => `${MONSTER_BY_ID[p.species]?.name ?? "Spirit"} lv ${p.level}`),
			known: save.known.map((id) => ({
				id,
				name: MOVE_BY_ID[id]?.name ?? id,
				type: MOVE_BY_ID[id]?.type ?? "normal"
			})),
			stash: save.stash.map((e) => `${ENCHANT_BY_ID[e.id]?.name ?? e.id} ${e.power}`),
			selected: this.selected,
			chat: this.chat,
			trade: this.trade ? {
				open: true,
				peer: this.remotes.get(this.trade.peer)?.name ?? "Hunter",
				mine: this.trade.mine.map((id) => save.gear.find((g) => g.uid === id)?.name ?? id).join(", ") || "—",
				theirs: this.trade.theirsGear.map((g) => g.name).join(", ") || "—",
				me: this.trade.me,
				them: this.trade.them
			} : null,
			stock: this.shopStock.map((g) => ({
				uid: g.uid,
				name: g.name,
				price: this.price(g.price),
				type: TYPES[g.type].name
			})),
			wares: [
				"potion",
				"big_potion",
				"ghost_jar",
				"cleanse_salt",
				"spirit_candy",
				"smoke_bomb"
			].map((id) => ({
				id,
				name: ITEM_BY_ID[id].name,
				price: this.price(ITEM_BY_ID[id].price)
			})),
			net: snap.net,
			roomCode: snap.roomCode,
			peers: snap.peers,
			aim: this.castLock > 0 ? "Casting..." : this.channel ? "Gathering..." : "Right-click for menus. Walk into a node. Click a keeper you are near.",
			hint: this.hint,
			foe: (() => {
				const mob = this.nearestMob(save.x, save.y, 230);
				if (!mob || this.combat <= 0 && mob.hurt <= 0) return "";
				const read = bodyRead(mob.type);
				return `${mob.name} · Lv ${mob.level} · ${TYPES[mob.type].name} · ${Math.ceil(mob.hp)}/${Math.ceil(mob.max)} · ${read.kind === "magic" ? "magic hits harder" : "physical hits harder"}`;
			})(),
			menu: this.menu,
			mapX: save.x,
			mapY: save.y,
			party: (save.party ?? []).map((id) => NPCS.find((n) => n.id === id)?.name ?? id),
			autoplay: this.autoplay,
			grind: this.autoplay ? this.grind : "",
			accountLevel: save.accountLevel,
			accountXp: save.accountXp,
			accountNeed: accountNeed(save.accountLevel),
			perkPoints: save.perkPoints,
			perks: Object.entries(ENCHANT_BY_ID).map(([id, def]) => ({
				id,
				name: def.name,
				power: save.perks[id] ?? 0,
				about: def.about
			})),
			bounty: (() => {
				const witch = this.mobs.find((m) => m.witch && m.alive);
				if (!witch) return "";
				return witch.huntIn > 0 ? `${witch.name} · ${Math.ceil(witch.huntIn)}s before she hunts` : `${witch.name} is hunting you`;
			})(),
			bountyPlace: (() => {
				const witch = this.mobs.find((m) => m.witch && m.alive);
				if (!witch || !this.world) return "";
				return biomeNameAt(this.world, witch.x, witch.y);
			})(),
			unlocked: SETS.filter((s) => this.isUnlocked(s.id)).map((s) => ({
				id: s.id,
				name: s.name,
				race: s.race,
				bonus: s.bonus
			}))
		});
	}
	draw() {
		const { w, h, dpr } = this.cssSize();
		const ctx = this.ctx;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.fillStyle = "#140e0c";
		ctx.fillRect(0, 0, w, h);
		if (!this.world || !this.save || snap.mode !== "play") {
			ctx.fillStyle = "#f0e2c8";
			ctx.font = "12px 'Press Start 2P', monospace";
			ctx.fillText("TURBZ", 24, 48);
			return;
		}
		const sx = (Math.random() - .5) * this.shake;
		const sy = (Math.random() - .5) * this.shake;
		ctx.translate(w / 2 + sx, h / 2 + sy);
		ctx.scale(this.zoom, this.zoom);
		ctx.translate(-this.cam.x, -this.cam.y);
		ctx.imageSmoothingEnabled = false;
		if (this.world.cache) ctx.drawImage(this.world.cache, 0, 0);
		else drawWorldSlice(ctx, this.world, this.cam.x, this.cam.y, w, h, this.zoom);
		const save = this.save;
		if (save.map === "world") for (const p of POIS) {
			const pos = poiPos(p);
			if (!pos) continue;
			if (p.kind === "npc") {
				const npc = NPCS.find((n) => n.id === p.id);
				drawActor(ctx, {
					x: pos.x,
					y: pos.y,
					race: "vesper",
					female: npc.female,
					hair: npc.hair,
					skin: npc.outfit % 5,
					facing: 1,
					walk: .2,
					attack: 0,
					hurt: 0,
					pieces: [
						{
							slot: "chest",
							style: npc.outfit,
							type: "normal",
							fxSeed: 0,
							quality: 0
						},
						{
							slot: "legs",
							style: npc.outfit,
							type: "normal",
							fxSeed: 1,
							quality: 0
						},
						{
							slot: "feet",
							style: npc.outfit,
							type: "normal",
							fxSeed: 2,
							quality: 0
						}
					],
					setFx: null,
					setOn: false,
					time: this.clock
				});
				drawShadowName(ctx, npc.name.split(" ").slice(-1)[0], pos.x, pos.y - 62, "#f0e2c8");
			}
		}
		else {
			const ex = dungeonExit();
			drawRift(ctx, ex.x, ex.y + 8);
			drawShadowName(ctx, "EXIT", ex.x, ex.y - 130, "#e7d9ff");
		}
		for (const m of this.mobs) {
			if (!m.alive) continue;
			if (Math.abs(m.x - this.cam.x) > w / this.zoom * .62 + 140) continue;
			if (Math.abs(m.y - this.cam.y) > h / this.zoom * .62 + 160) continue;
			if (m.witch && m.race) {
				const rr = RACES.find((r) => r.id === m.race);
				drawActor(ctx, {
					x: m.x,
					y: m.y,
					race: m.race,
					female: true,
					hair: rr.hair,
					skin: 2,
					facing: m.facing,
					walk: m.walk,
					attack: m.cd > 2 ? .4 : 0,
					hurt: m.hurt,
					tall: rr.tall,
					time: this.clock,
					pieces: m.lootGear.map((g) => ({
						slot: g.slot,
						style: g.style,
						type: g.type,
						fxSeed: g.fxSeed,
						quality: 3
					})),
					setFx: null,
					setOn: false
				});
			} else drawMonster(ctx, {
				x: m.x,
				y: m.y,
				template: m.template,
				type: m.type,
				facing: m.facing,
				walk: m.walk,
				hurt: m.hurt,
				boss: m.boss,
				rarity: m.rarity,
				ghost: !!m.ghost,
				animal: !!m.animal,
				species: m.species,
				look: m.look ?? null,
				time: this.clock
			});
			const pct = m.hp / m.max;
			const near = Math.hypot(m.x - save.x, m.y - save.y) < 220;
			const show = near || m.boss || m.witch || this.combat > 0;
			const barW = m.boss || m.witch ? 78 : 56;
			const by = m.y - (m.witch ? 64 : m.boss ? 92 : 74);
			if (show) {
				ctx.fillStyle = "#1a1214";
				ctx.fillRect(m.x - barW / 2 - 1, by - 1, barW + 2, 8);
				ctx.fillStyle = m.witch ? "#c4473a" : TYPES[m.type].color;
				ctx.fillRect(m.x - barW / 2, by, barW * pct, 6);
				drawShadowName(ctx, `${Math.max(0, Math.ceil(m.hp))} ${TYPES[m.type].name}`, m.x, by - 2, "#fff6e8");
			}
			if (m.boss || m.witch || near) drawShadowName(ctx, `${m.name} ${m.level}`, m.x, by - 18, m.witch ? "#ff4d6a" : m.boss ? "#c4473a" : TYPES[m.type].color);
		}
		if (save.map === "world") for (const tavern of TAVERNS) {
			const x = tavern.boardTx * 32 + 16;
			const y = tavern.boardTy * 32 + 16;
			ctx.fillStyle = "#3a221c";
			ctx.fillRect(x - 6, y - 18, 12, 16);
			ctx.fillStyle = "#e6c15a";
			ctx.fillRect(x - 5, y - 16, 10, 8);
			drawShadowName(ctx, "BOARD", x, y - 28, "#e6c15a");
		}
		const race = RACES.find((r) => r.id === save.race);
		const set = this.setInfo();
		const pieces = [
			"weapon",
			"head",
			"chest",
			"legs",
			"feet",
			"relic"
		].map((slot) => this.piece(slot)).filter((g) => !!g).map((g) => ({
			slot: g.slot,
			style: g.style,
			type: g.type,
			fxSeed: g.fxSeed,
			quality: [
				"worn",
				"common",
				"fine",
				"rare",
				"epic",
				"legendary"
			].indexOf(g.quality)
		}));
		(save.spirits ?? []).forEach((spirit, i) => {
			const at = this.mates[i];
			if (!at || spirit.hp <= 0) return;
			drawMonster(ctx, {
				x: at.x,
				y: at.y,
				template: spirit.template,
				type: spirit.type,
				facing: this.facing,
				walk: this.walk + i,
				hurt: at.swing > 0 ? .2 : 0,
				boss: false,
				rarity: spirit.rarity,
				ghost: true,
				look: spirit.look,
				time: this.clock
			});
			drawShadowName(ctx, spirit.name, at.x, at.y - 52, TYPES[spirit.type].color);
		});
		for (const id of save.party ?? []) {
			const npc = NPCS.find((n) => n.id === id);
			if (!npc) continue;
			const px = this.mateCd[`mate-${id}x`] ?? save.x + 20;
			const py = this.mateCd[`mate-${id}y`] ?? save.y + 8;
			drawActor(ctx, {
				x: px,
				y: py,
				race: "vesper",
				female: npc.female,
				hair: npc.hair,
				skin: npc.outfit % 5,
				facing: this.facing,
				walk: this.walk,
				attack: 0,
				hurt: 0,
				pieces: [
					{
						slot: "chest",
						style: npc.outfit,
						type: npc.shrine ?? "normal",
						fxSeed: 2,
						quality: 2
					},
					{
						slot: "legs",
						style: npc.outfit,
						type: "normal",
						fxSeed: 1,
						quality: 1
					},
					{
						slot: "feet",
						style: npc.outfit,
						type: "normal",
						fxSeed: 0,
						quality: 1
					}
				],
				setFx: null,
				setOn: false,
				time: this.clock,
				scale: 1.05
			});
			drawShadowName(ctx, npc.name.split(" ").slice(-1)[0], px, py - 62, "#9ad8c8");
		}
		for (const r of this.remotes.values()) {
			if (r.map !== save.map) continue;
			const rr = RACES.find((x) => x.id === r.race);
			drawActor(ctx, {
				x: r.x,
				y: r.y,
				race: r.race,
				female: true,
				hair: rr.hair,
				skin: 0,
				facing: r.facing,
				walk: 1,
				attack: 0,
				hurt: 0,
				tall: rr.tall,
				pieces: r.pieces.map((g) => ({
					slot: g.slot,
					style: g.style,
					type: g.type,
					fxSeed: g.fxSeed,
					quality: 2
				})),
				setFx: null,
				setOn: false,
				time: this.clock
			});
			drawShadowName(ctx, r.name, r.x, r.y - 62, "#e6c15a");
		}
		drawActor(ctx, {
			x: save.x,
			y: save.y,
			race: save.race,
			female: true,
			hair: race.hair,
			skin: RACES.findIndex((r) => r.id === save.race),
			facing: this.facing,
			walk: this.walk,
			attack: this.attackT,
			hurt: this.hurt,
			tall: race.tall,
			pieces,
			setFx: set.fx,
			setOn: set.on,
			time: this.clock,
			scale: 1
		});
		drawShadowName(ctx, save.name, save.x, save.y - 62, "#fff6e8");
		if (this.combat > 0 || this.wardT > 0) {
			const pct = Math.max(0, save.hp / this.maxHp());
			ctx.fillStyle = "#1a1214";
			ctx.fillRect(save.x - 22, save.y - 70, 44, 6);
			ctx.fillStyle = "#c4473a";
			ctx.fillRect(save.x - 22, save.y - 70, 44 * pct, 4);
			if (this.wardT > 0) {
				ctx.strokeStyle = "#fff1a8";
				ctx.lineWidth = 2;
				ctx.strokeRect(save.x - 24, save.y - 72, 48, 10);
			}
		}
		for (const p of this.parts) {
			ctx.globalAlpha = Math.max(0, p.life / p.max);
			ctx.fillStyle = p.color;
			ctx.fillRect(p.x, p.y, p.size, p.size);
		}
		ctx.globalAlpha = 1;
		for (const f of this.floats) {
			ctx.font = "26px VT323, monospace";
			ctx.textAlign = "center";
			ctx.fillStyle = "#140e0c";
			ctx.fillText(f.text, f.x + 1, f.y + 1);
			ctx.fillStyle = f.color;
			ctx.fillText(f.text, f.x, f.y);
		}
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		if (this.channel || this.castLock > 0) {
			const p = this.channel ? this.channel.t / this.channel.need : 1 - this.castLock / Math.max(.05, this.castLockMax);
			ctx.fillStyle = "#1a1214";
			ctx.fillRect(w / 2 - 46, h / 2 - 78, 92, 6);
			ctx.fillStyle = this.castLock > 0 ? "#e6c15a" : "#f0e2c8";
			ctx.fillRect(w / 2 - 46, h / 2 - 78, 92 * Math.max(0, Math.min(1, p)), 6);
		}
	}
	clearMenu() {
		this.menu = null;
		publish({ menu: null });
	}
	menuAct(id) {
		if (id.startsWith("menu:")) {
			const panel = id.slice(5);
			if (panel === "trade") this.toggleTrade();
			else if (panel === "jar") this.catchSpirit();
			else if (panel === "auto") this.toggleAutoplay();
			else this.toggle(panel);
			this.clearMenu();
			return;
		}
		if (id.startsWith("talk:")) this.openTalk(id.slice(5));
		else if (id.startsWith("join:")) this.recruit(id.slice(5));
		else if (id === "gather") this.interact();
		this.clearMenu();
	}
	recruit(id) {
		const save = this.save;
		if (!save) return;
		save.party = save.party ?? [];
		const npc = NPCS.find((n) => n.id === id);
		if (!npc) return;
		if (save.party.includes(id)) {
			this.say(`${npc.name} already walks with you.`);
			return;
		}
		if (save.party.length >= 3) {
			this.say("Three followers is a full hunt.");
			return;
		}
		save.party.push(id);
		this.say(`${npc.name} joins. They will strike with you.`);
		this.persist();
		this.syncHud(true);
	}
	drawMap(canvas) {
		const world = this.overworld ?? (this.save?.map === "world" ? this.world : null);
		const save = this.save;
		const ctx = canvas.getContext("2d");
		if (!ctx || !world || !save) return;
		const w = 560;
		const h = 360;
		if (canvas.width !== w) canvas.width = w;
		if (canvas.height !== h) canvas.height = h;
		const sx = w / world.w;
		const sy = h / world.h;
		const colors = [
			"#4a3480",
			"#d5e6f4",
			"#3c8a40",
			"#d9c6a4",
			"#c4ae90",
			"#2a78b0",
			"#c56a3c"
		];
		const step = Math.max(1, Math.round(world.w / 140));
		for (let y = 0; y < world.h; y += step) for (let x = 0; x < world.w; x += step) {
			const t = world.tiles[y * world.w + x];
			ctx.fillStyle = !t ? "#111" : t.block && t.floor !== 2 ? "#1c1412" : colors[t.biome] ?? "#555";
			ctx.fillRect(Math.floor(x * sx), Math.floor(y * sy), Math.ceil(sx * step) + 1, Math.ceil(sy * step) + 1);
		}
		for (const tavern of TAVERNS) {
			ctx.fillStyle = "#e6c15a";
			ctx.fillRect(tavern.tx * sx, tavern.ty * sy, 4, 4);
		}
		for (const p of POIS) {
			if (p.kind !== "shrine" && p.kind !== "dungeon" && p.kind !== "boss" && p.kind !== "node") continue;
			const at = scaleTile(p.tx, p.ty);
			const mx = at.tx * sx + sx / 2;
			const my = at.ty * sy + sy / 2;
			ctx.fillStyle = p.kind === "dungeon" ? "#b4a6ff" : p.kind === "boss" ? "#c4473a" : p.kind === "node" ? "#8fd06a" : "#e6c15a";
			ctx.beginPath();
			ctx.arc(mx, my, p.kind === "dungeon" ? 7 : p.kind === "shrine" ? 6 : 4, 0, Math.PI * 2);
			ctx.fill();
			if (p.kind === "shrine" || p.kind === "dungeon" || p.kind === "boss") {
				ctx.font = "13px VT323, monospace";
				ctx.fillStyle = "#fff6e8";
				ctx.textAlign = "left";
				ctx.fillText(p.kind === "dungeon" ? p.name : p.kind === "shrine" ? "Arena" : p.name, mx + 6, my + 3);
			}
		}
		if (save.map === "world") {
			ctx.fillStyle = "#fff6e8";
			ctx.strokeStyle = "#1a1214";
			ctx.lineWidth = 2;
			const px = save.x / 32 * sx;
			const py = save.y / 32 * sy;
			ctx.beginPath();
			ctx.moveTo(px, py - 6);
			ctx.lineTo(px + 5, py + 5);
			ctx.lineTo(px - 5, py + 5);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		} else {
			ctx.fillStyle = "#b4a6ff";
			ctx.fillRect(8, 8, 10, 10);
			ctx.font = "14px VT323, monospace";
			ctx.fillStyle = "#efe6ff";
			ctx.textAlign = "left";
			ctx.fillText("Inside a rift. The exit is the tear behind you.", 22, 16);
		}
		ctx.font = "14px VT323, monospace";
		ctx.fillStyle = "#f0e2c8";
		ctx.textAlign = "left";
		ctx.fillText("You  ·  gold arena  ·  violet rift  ·  red boss  ·  green node", 8, 352);
	}
	hoverAt(x, y) {
		const info = this.describeAt(x, y);
		this.hint = info?.hint ?? "";
	}
	openInspect(x, y, sx, sy) {
		const info = x < -1e3 ? null : this.describeAt(x, y);
		const { w, h } = this.cssSize();
		const shell = [
			{
				id: "menu:bag",
				label: "Bag"
			},
			{
				id: "menu:skills",
				label: "Skills"
			},
			{
				id: "menu:quests",
				label: "Quests"
			},
			{
				id: "menu:map",
				label: "Map"
			},
			{
				id: "menu:moves",
				label: "Verses"
			},
			{
				id: "menu:ghost",
				label: "Spirit"
			},
			{
				id: "menu:jar",
				label: "Jar"
			},
			{
				id: "menu:bounty",
				label: "Bounty"
			},
			{
				id: "menu:trade",
				label: "Trade"
			},
			{
				id: "menu:pause",
				label: "Pause"
			},
			{
				id: "menu:auto",
				label: "Autoplay"
			}
		];
		this.menu = {
			sx: Math.max(8, Math.min(sx, w - 300)),
			sy: Math.max(8, Math.min(sy, h - 280)),
			title: info?.title ?? "Menu",
			lines: info?.lines ?? ["Bag, skills, the board, and the rest of the veil."],
			actions: [...info?.actions ?? [], ...shell]
		};
		this.syncHud(true);
	}
	describeAt(x, y) {
		const save = this.save;
		if (!save) return null;
		const mob = this.nearestMob(x, y, 40);
		if (mob) {
			const read = bodyRead(mob.type);
			const best = [...this.arsenal(save)].sort((a, b) => this.moveScore(b, mob, read.kind === "magic", 48) - this.moveScore(a, mob, read.kind === "magic", 48))[0];
			const kind = attackForm(best ?? MOVES[0]) === "spell" ? "magic" : "physical";
			return {
				hint: `${mob.name} · ${TYPES[mob.type].name} · favor ${read.kind}`,
				title: mob.name,
				lines: [
					`${TYPES[mob.type].name} · ${Math.ceil(mob.hp)} / ${Math.ceil(mob.max)}`,
					read.line,
					best ? `Best you carry: ${best.name} (${moveTactic(best)}, ${kind}).` : "No verse packed yet."
				],
				actions: []
			};
		}
		if (save.map === "world") for (const n of NPCS) {
			if (n.map !== "world") continue;
			const p = poiPos({
				kind: "npc",
				id: n.id
			});
			if (!p || Math.hypot(p.x - x, p.y - y) > 46) continue;
			const offers = npcOffers(n);
			const actions = [{
				id: `talk:${n.id}`,
				label: "Speak"
			}];
			if (offers.includes("Companionship")) actions.push({
				id: `join:${n.id}`,
				label: save.party?.includes(n.id) ? "With you" : "Ask to follow"
			});
			return {
				hint: `${n.name} · ${offers.join(" · ") || "Talk"}`,
				title: n.name,
				lines: [
					n.role,
					offers.length ? `Offers ${offers.join(", ")}.` : "They will talk if you ask.",
					`Party ${save.party?.length ?? 0} / 3`
				],
				actions
			};
		}
		for (const p of POIS) {
			const pos = poiPos(p);
			if (!pos || Math.hypot(pos.x - x, pos.y - y) > 56) continue;
			if (p.kind === "dungeon") return {
				hint: `${p.name} · rift`,
				title: p.name,
				lines: ["A giant rift. Walk the lip and step through.", "Die in there and you are knocked out. Kyo bleeds. Gear stays."],
				actions: []
			};
			if (p.kind === "shrine") return {
				hint: `${p.name} · arena`,
				title: p.name,
				lines: ["A battle arena. Speak to the keeper at the door.", "A loss here is a knockout, not the veil."],
				actions: []
			};
			if (p.kind === "node") return {
				hint: `${p.node} node`,
				title: p.node,
				lines: ["Gather with Speak, or from this menu."],
				actions: [{
					id: "gather",
					label: "Gather"
				}]
			};
			if (p.kind === "boss") return {
				hint: p.name,
				title: p.name,
				lines: [`World boss · ${TYPES[p.type].name}`, bodyRead(p.type).line],
				actions: []
			};
		}
		return null;
	}
	preview(canvas, race) {
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "#1c1412";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		const r = RACES.find((x) => x.id === race);
		drawActor(ctx, {
			x: canvas.width / 2,
			y: canvas.height - 8,
			race,
			female: true,
			hair: r.hair,
			skin: RACES.findIndex((x) => x.id === race),
			facing: 1,
			walk: performance.now() / 400,
			attack: 0,
			hurt: 0,
			tall: 1,
			pieces: [
				{
					slot: "chest",
					style: 0,
					type: r.type,
					fxSeed: 1,
					quality: 3
				},
				{
					slot: "legs",
					style: 0,
					type: r.type,
					fxSeed: 2,
					quality: 2
				},
				{
					slot: "head",
					style: 1,
					type: r.type,
					fxSeed: 3,
					quality: 2
				},
				{
					slot: "feet",
					style: 0,
					type: r.type,
					fxSeed: 0,
					quality: 1
				}
			],
			setFx: "lanternwake",
			setOn: true,
			scale: 1.02
		});
	}
};
function xpNeed(level) {
	return Math.floor(28 * Math.pow(1.2, level - 1));
}
function typeChart(a, d) {
	if (TYPES[d].immune.includes(a)) return 0;
	if (TYPES[a].strong.includes(d)) return 2;
	if (TYPES[a].weak.includes(d)) return .5;
	return 1;
}
function mitigate(dmg, armor) {
	return dmg * (100 / (100 + Math.max(0, armor)));
}
function hearthXY() {
	const p = scaleTile(30, 33);
	return {
		x: p.tx * 32 + 16,
		y: p.ty * 32 + 16
	};
}
function nearestOpen(world, x, y) {
	if (!world) return {
		x,
		y
	};
	const hit = (px, py) => blocked(world, px, py) || blocked(world, px - 7, py) || blocked(world, px + 7, py);
	if (!hit(x, y)) return {
		x,
		y
	};
	for (let r = 1; r <= 12; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
		if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
		const nx = x + dx * 32;
		const ny = y + dy * 32;
		if (!hit(nx, ny)) return {
			x: nx,
			y: ny
		};
	}
	return hearthXY();
}
function effectTint(effect, color) {
	if (effect === "burn") return "#ffb15e";
	if (effect === "soak") return "#7ec8ea";
	if (effect === "root") return "#6ecf6a";
	if (effect === "sleep") return "#d6c6f5";
	if (effect === "gloom") return "#6a4cff";
	if (effect === "spark") return "#f2d43a";
	if (effect === "leech" || effect === "drain") return "#ff4d6a";
	if (effect === "silence") return "#c8c0b0";
	if (effect === "expose") return "#fff1a8";
	return color;
}
function bossName(id) {
	if (id === "bone_king") return "Bone King";
	if (id === "ash_regent") return "Ash Regent";
	if (id === "tide_tyrant") return "Tide Tyrant";
	if (id === "void_cantor") return "Void Cantor";
	if (id === "marrow_saint") return "Marrow Saint";
	return "Warlord";
}
function poiPos(p) {
	if (p.kind === "npc") {
		const n = NPCS.find((x) => x.id === p.id);
		if (!n) return null;
		const s = scaleTile(n.tx, n.ty);
		return {
			x: s.tx * 32 + 16,
			y: s.ty * 32 + 20
		};
	}
	if ("tx" in p) {
		const s = scaleTile(p.tx, p.ty);
		return {
			x: s.tx * 32 + 16,
			y: s.ty * 32 + 18
		};
	}
	return null;
}
function useSnap() {
	return (0, import_react.useSyncExternalStore)(subscribe, getSnap, getSnap);
}
function TurbzApp() {
	const auth = useCurrentUserState();
	const user = auth.user;
	if (auth.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "game-root grid place-items-center overflow-auto p-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "screen-card px-panel my-auto w-full max-w-md overflow-auto p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xs text-blood",
					children: "TURBZ API"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-3 text-xl text-bone",
					children: "TURBZ"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-dim",
					children: "Checking your account. Autosave and lobbies wait on the veil."
				})
			]
		})
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApiGate, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hunt, {});
}
function ApiGate() {
	const [user, setUser] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [mode, setMode] = (0, import_react.useState)("up");
	const [err, setErr] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function submit() {
		const name = user.trim();
		if (!/^[a-zA-Z0-9_]{3,16}$/.test(name)) {
			setErr("Username is 3–16 letters, numbers, or _.");
			return;
		}
		if (password.length < 8) {
			setErr("Password needs 8 characters.");
			return;
		}
		setBusy(true);
		setErr("");
		const email = `${name.toLowerCase()}@hunt.turbz`;
		try {
			if (mode === "up") {
				const res = await authClient.signUp.email({
					email,
					password,
					name
				});
				if (res.error) throw new Error(res.error.message || "That name is taken");
			} else {
				const res = await authClient.signIn.email({
					email,
					password
				});
				if (res.error) throw new Error(res.error.message || "Wrong name or password");
			}
		} catch (e) {
			setErr(e instanceof Error ? e.message : "TURBZ API refused that");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "game-root grid place-items-center overflow-auto p-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "screen-card px-panel my-auto w-full max-w-md overflow-auto p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xs text-blood",
					children: "TURBZ API"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-3 text-xl text-bone",
					children: "Sign in to hunt"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-dim",
					children: "Username and password only. That account autosaves, and lobby codes meet other TURBZ witches."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-4 grid gap-2",
					onSubmit: (e) => {
						e.preventDefault();
						submit();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: user,
							onChange: (e) => setUser(e.target.value.slice(0, 16)),
							required: true,
							placeholder: "Username",
							"aria-label": "Username",
							autoComplete: "username",
							className: "w-full border-2 border-bone bg-ink px-3 py-2 text-bone outline-none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: password,
							onChange: (e) => setPassword(e.target.value),
							type: "password",
							required: true,
							minLength: 8,
							placeholder: "Password",
							"aria-label": "Password",
							autoComplete: mode === "up" ? "new-password" : "current-password",
							className: "w-full border-2 border-bone bg-ink px-3 py-2 text-bone outline-none"
						}),
						err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-blood",
							children: err
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "px-btn px-btn-kyo",
							type: "submit",
							disabled: busy,
							children: busy ? "Wait" : mode === "up" ? "Create account" : "Sign in"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "px-btn",
							type: "button",
							onClick: () => setMode(mode === "up" ? "in" : "up"),
							children: mode === "up" ? "I already have a name" : "Need a name"
						})
					]
				})
			]
		})
	});
}
function Hunt() {
	const snap = useSnap();
	const canvasRef = (0, import_react.useRef)(null);
	const gameRef = (0, import_react.useRef)(null);
	const [create, setCreate] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("Mira");
	const [race, setRace] = (0, import_react.useState)("vesper");
	const [code, setCode] = (0, import_react.useState)("");
	const [intent, setIntent] = (0, import_react.useState)("solo");
	const [chat, setChat] = (0, import_react.useState)("");
	const [circle, setCircle] = (0, import_react.useState)(false);
	const [arenaSeed, setArenaSeed] = (0, import_react.useState)(null);
	const [booted, setBooted] = (0, import_react.useState)(false);
	const onArenaCloud = (0, import_react.useCallback)((save) => {
		noteArena(save);
		setArenaSeed(save);
	}, []);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const game = new TurbzGame(canvas);
		gameRef.current = game;
		game.attachCloud((json) => {
			try {
				noteHunt(JSON.parse(json));
			} catch {}
		});
		game.start();
		bindCloud((json) => {
			writeCloudSave({ data: json }).catch(() => {});
		});
		loadCloudSave().then((text) => {
			if (typeof text === "string" && text.length > 2) try {
				const split = ingestCloud(JSON.parse(text));
				if (split.hunt && typeof split.hunt === "object") game.rememberCloud(split.hunt);
				setArenaSeed(split.arena);
			} catch {
				setArenaSeed(readArenaLocal());
			}
			else setArenaSeed(readArenaLocal());
		}).catch(() => setArenaSeed(readArenaLocal())).finally(() => {
			cloudReady();
			setBooted(true);
		});
		return () => game.stop();
	}, []);
	const g = () => gameRef.current;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "game-root",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref: canvasRef,
			className: "game-canvas",
			"aria-label": "TURBZ wilds"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "overlay",
			children: [
				snap.mode !== "play" && !create && !circle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title, {
					hasSave: snap.hasSave,
					code,
					setCode,
					onNew: () => {
						setIntent("solo");
						setCreate(true);
					},
					onContinue: () => {
						g()?.continueGame();
					},
					onHost: () => {
						const c = code.trim() || makeCode();
						setCode(c);
						setIntent("host");
						if (snap.hasSave) g()?.continueGame({
							role: "host",
							code: c
						});
						else setCreate(true);
					},
					onJoin: () => {
						const c = code.trim();
						if (c.length < 3) return;
						setIntent("join");
						if (snap.hasSave) g()?.continueGame({
							role: "guest",
							code: c
						});
						else setCreate(true);
					},
					circleReady: booted,
					circleMarks: arenaSeed && typeof arenaSeed === "object" && "points" in arenaSeed ? Number(arenaSeed.points) : null,
					onCircle: () => setCircle(true)
				}),
				snap.mode !== "play" && create && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Create, {
					name,
					setName,
					race,
					setRace,
					game: g(),
					onBack: () => setCreate(false),
					onGo: () => {
						const lobby = intent === "solo" ? void 0 : {
							role: intent === "host" ? "host" : "guest",
							code: code.trim() || makeCode()
						};
						g()?.begin(name, race, lobby);
						setCreate(false);
					}
				}),
				snap.mode === "play" && !circle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
					snap,
					game: g(),
					chat,
					setChat
				}),
				circle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArenaScreen, {
					seed: arenaSeed,
					onClose: () => setCircle(false),
					onCloud: onArenaCloud
				})
			]
		})]
	});
}
function makeCode() {
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	return Array.from({ length: 4 }, () => alphabet[Math.floor(Math.random() * 32)]).join("");
}
function Title(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-full items-center justify-center overflow-auto p-3 pb-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "screen-card px-panel my-auto w-full max-w-xl p-4 sm:p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xs text-blood",
					children: "TURBO ENGINE · V3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-3 text-lg text-bone sm:text-2xl",
					children: "TURBZ"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-dim",
					children: "You are signed in to TURBZ API. Die and you must choose a new witch. A finished set of her blood can be worn again. Otherwise you wake in the default robes, at another tavern, beside the bounty board."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "px-btn px-btn-kyo",
							onClick: props.onNew,
							children: "New Hunt"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "px-btn",
							disabled: !props.hasSave,
							onClick: props.onContinue,
							children: "Continue"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "px-btn",
							disabled: !props.circleReady,
							onClick: props.onCircle,
							children: props.circleMarks != null && props.circleMarks > 0 ? `Witch Circle · ${props.circleMarks}` : "Witch Circle"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 border-t-2 border-bone pt-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xs text-kyo",
							children: "Lobby code"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-dim",
							children: "Same code finds another signed-in witch."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: props.code,
							onChange: (e) => props.setCode(e.target.value.toUpperCase().slice(0, 6)),
							placeholder: "CODE",
							"aria-label": "Lobby code",
							autoComplete: "off",
							suppressHydrationWarning: true,
							className: "mt-2 w-full border-2 border-bone bg-ink px-3 py-2 font-display text-xs text-bone outline-none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 grid grid-cols-2 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "px-btn",
								onClick: props.onHost,
								children: "Create"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "px-btn",
								onClick: props.onJoin,
								children: "Join"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-dim",
					children: "Witch Circle is six against six. Weapons, spells, and the occasional summoner. Marks are the only lives, and that save is not the hunt."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-dim",
					children: "Right-click for menus. Walk into a node to harvest it. Click a keeper only when you are already near."
				})
			]
		})
	});
}
function Create(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-full items-center justify-center overflow-auto p-3 pb-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-panel w-full max-w-3xl p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xs text-blood",
					children: "CHOOSE A BODY"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display mt-2 text-sm text-bone",
					children: "Five daughters of the veil"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-3 block text-dim",
					children: ["Name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: props.name,
						onChange: (e) => props.setName(e.target.value.slice(0, 16)),
						className: "mt-1 w-full border-2 border-bone bg-ink px-3 py-2 text-bone outline-none"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5",
					children: RACES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: `border-2 p-2 text-left ${props.race === r.id ? "border-kyo bg-ink" : "border-bone bg-ink"}`,
						onClick: () => props.setRace(r.id),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RaceCanvas, {
								race: r.id,
								game: props.game,
								active: props.race === r.id
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display mt-2 block text-xs",
								children: r.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `block ${typeClass(r.type)}`,
								children: TYPES[r.type].name
							})
						]
					}, r.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-dim",
					children: RACES.find((r) => r.id === props.race)?.blurb
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "px-btn",
						onClick: props.onBack,
						children: "Back"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "px-btn px-btn-kyo",
						onClick: props.onGo,
						children: "Wake in the robes"
					})]
				})
			]
		})
	});
}
function RaceCanvas({ race, game, active }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const canvas = ref.current;
		if (!canvas || !game) return;
		canvas.width = 120;
		canvas.height = 140;
		let frame = 0;
		const draw = () => {
			game.preview(canvas, race);
			frame = requestAnimationFrame(draw);
		};
		if (active) frame = requestAnimationFrame(draw);
		else game.preview(canvas, race);
		return () => cancelAnimationFrame(frame);
	}, [
		race,
		game,
		active
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref,
		width: 120,
		height: 140,
		className: "h-28 w-full bg-ink"
	});
}
function typeClass(t) {
	return `type-${t}`;
}
function Play({ snap, game, chat, setChat }) {
	const last = snap.chat[snap.chat.length - 1];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "vitals-dock px-panel",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-display text-xs text-kyo",
					children: [
						snap.name,
						" · lv ",
						snap.level,
						" · score ",
						snap.accountScore
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bar-track mt-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-blood",
						style: { width: `${Math.max(0, Math.min(100, snap.hp / Math.max(1, snap.maxHp) * 100))}%` }
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-dim",
					children: [
						snap.hp,
						"/",
						snap.maxHp,
						" · ",
						snap.kyo,
						" kyo · ",
						snap.region,
						snap.shield > 0 ? ` · ward ${snap.shield}` : ""
					]
				}),
				snap.foe && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-kyo",
					children: snap.foe
				}),
				snap.turn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-dim",
					children: snap.turn
				}),
				snap.autoplay && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-kyo",
					children: ["Autoplay · ", snap.grind || "looking"]
				}),
				snap.log[0] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: snap.log[0] }),
				snap.shrine && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-kyo",
					children: snap.shrine
				}),
				snap.roomCode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-kyo",
					children: ["Lobby ", snap.roomCode]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
					className: "mt-1",
					onSubmit: (e) => {
						e.preventDefault();
						game?.sendChat(chat);
						setChat("");
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: chat,
						onChange: (e) => setChat(e.target.value),
						placeholder: last ? `${last.name}: ${last.text}` : "Party chat",
						"aria-label": "Party chat",
						autoComplete: "off",
						suppressHydrationWarning: true,
						className: "w-full border-2 border-bone bg-ink px-2 py-1 text-bone outline-none"
					})
				})
			]
		}),
		snap.hint && !snap.menu && !snap.panel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hint-chip px-panel",
			children: snap.hint
		}),
		snap.menu && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "ctx-menu px-panel",
			style: {
				left: typeof window === "undefined" ? snap.menu.sx : Math.max(8, Math.min(snap.menu.sx, window.innerWidth - 340)),
				top: typeof window === "undefined" ? snap.menu.sy : Math.max(8, Math.min(snap.menu.sy, window.innerHeight - 240))
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xs text-kyo",
					children: snap.menu.title
				}),
				snap.menu.lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-dim",
					children: line
				}, line)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 grid grid-cols-2 gap-1",
					children: [snap.menu.actions.map((action) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "px-btn",
						onClick: () => game?.menuAct(action.id),
						children: action.label
					}, action.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "px-btn",
						onClick: () => game?.clearMenu(),
						children: "Close"
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "dock",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "move-row",
				children: snap.bar.map((move, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "px-btn",
					onClick: () => game?.cast(i),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: typeClass(move.type),
							children: move.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-dim",
							children: move.tag
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block h-1 bg-ink",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block h-full bg-kyo",
								style: { width: `${Math.max(0, 100 - move.cd / Math.max(.05, move.max) * 100)}%` }
							})
						})
					]
				}, `${move.id}-${i}`))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: `auto-fab px-btn ${snap.autoplay ? "px-btn-kyo" : ""}`,
			type: "button",
			onClick: () => game?.toggleAutoplay(),
			children: snap.autoplay ? "Stop auto" : "Autoplay"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: "menu-fab px-btn",
			type: "button",
			onClick: () => game?.openShell(Math.max(8, window.innerWidth - 340), Math.max(8, window.innerHeight - 460)),
			children: "Menu"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stick, { on: (x, y) => game?.setStick(x, y) }),
		snap.panel && snap.panel !== "talk" && snap.panel !== "rebirth" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			title: snap.panel,
			onClose: () => game?.closePanel(),
			children: [
				snap.panel === "bag" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bag, {
					snap,
					game
				}),
				snap.panel === "skills" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skills, {
					snap,
					game
				}),
				snap.panel === "quests" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xs text-kyo",
						children: snap.questName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: snap.questAbout }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-dim",
						children: "Skills and finished sets survive the veil. The body does not."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2",
						children: ["Set ", snap.setLabel]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-dim",
						children: snap.setBonus
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-dim",
						children: ["Unlocked sets: ", snap.unlocked.length]
					})
				] }),
				snap.panel === "map" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
					snap,
					game
				}),
				snap.panel === "moves" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moves, { snap }),
				snap.panel === "ghost" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ghost, {
					snap,
					game
				}),
				snap.panel === "bounty" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xs text-blood",
							children: "WITCH HUNT"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: snap.bounty || "The board is blank. Take a name and the witch will know." }),
						snap.bountyPlace && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-dim",
							children: [
								"Last seen toward ",
								snap.bountyPlace,
								"."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-dim",
							children: "If you are slow, she comes for you. She drops her bag, her kyo, and every piece she wears."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "px-btn px-btn-kyo",
							onClick: () => game?.takeBounty(),
							children: "Take the hunt"
						})
					]
				}),
				snap.panel === "pause" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Right-click, or Menu, opens the veil. Walk within two tiles of a node and it is harvested. Click a keeper only after you have walked up to them." }),
						snap.roomCode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-kyo",
							children: ["Lobby ", snap.roomCode]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "px-btn",
							onClick: () => game?.toTitle(),
							children: "Return to title"
						})
					]
				}),
				snap.panel === "trade" && snap.trade && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["With ", snap.trade.peer] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["You offer: ", snap.trade.mine] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["They offer: ", snap.trade.theirs] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "px-btn",
							onClick: () => game?.offerSelected(),
							children: "Offer selected gear"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "px-btn",
							onClick: () => game?.lockTrade(),
							children: [snap.trade.me ? "Unlock" : "Lock in", snap.trade.them ? " · they are ready" : ""]
						})
					]
				})
			]
		}),
		snap.panel === "talk" && snap.talk && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "talk-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-panel max-h-[50dvh] overflow-auto p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-display text-xs text-kyo",
						children: [
							snap.talk.name,
							" · ",
							snap.talk.role
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2",
						children: snap.talk.line
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "px-btn",
								onClick: () => game?.nextLine(),
								children: "More"
							}),
							snap.talk.shrine && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "px-btn px-btn-kyo",
								onClick: () => game?.startShrine(snap.talk.shrine),
								children: "Enter shrine"
							}),
							snap.talk.id === "orien" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "px-btn",
								onClick: () => game?.teach(),
								children: "Learn verse · 35"
							}),
							snap.talk.id === "holt" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "px-btn",
								onClick: () => game?.turnSalt(),
								children: "Turn in salt"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "px-btn",
								onClick: () => game?.closePanel(),
								children: "Leave"
							})
						]
					}),
					snap.talk.shop === "general" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid gap-1",
						children: snap.wares.map((ware) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "px-btn",
							onClick: () => game?.buyItem(ware.id),
							children: [
								ware.name,
								" · ",
								ware.price,
								" kyo"
							]
						}, ware.id))
					}),
					(snap.talk.shop === "armor" || snap.talk.shop === "fence") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid gap-1",
						children: [snap.stock.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "px-btn",
							onClick: () => game?.buyGear(item.uid),
							children: [
								item.name,
								" · ",
								item.price
							]
						}, item.uid)), snap.talk.shop === "fence" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "px-btn",
							onClick: () => snap.selected && game?.sell(snap.selected),
							children: "Sell selected gear"
						})]
					}),
					snap.talk.shop === "alchemy" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "px-btn",
								onClick: () => game?.brew("warmth"),
								children: "Warmth tonic · spore + embercap"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "px-btn",
								onClick: () => game?.brew("ward"),
								children: "Ironroot phial · root + shroom"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "px-btn",
								onClick: () => game?.brew("eye"),
								children: "Cat's eye · spore + lantern"
							})
						]
					}),
					snap.talk.id === "bram" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "px-btn mt-2",
						onClick: () => game?.brew("meal"),
						children: "Cook a fish"
					})
				]
			})
		}),
		snap.panel === "rebirth" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rebirth, {
			snap,
			game
		})
	] });
}
function Rebirth({ snap, game }) {
	const [name, setName] = (0, import_react.useState)("Mira");
	const [race, setRace] = (0, import_react.useState)("vesper");
	const [setId, setSetId] = (0, import_react.useState)(null);
	const owned = snap.unlocked.filter((s) => s.race === race);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-40 flex items-center justify-center overflow-auto bg-ink/85 p-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-panel max-h-[88dvh] w-full max-w-3xl overflow-auto p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xs text-blood",
					children: "THE VEIL"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display mt-2 text-sm",
					children: "Choose the next witch"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-dim",
					children: "This body is gone. Account Score, skills, perks, and finished sets stay. You wake in another tavern."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-3 block text-dim",
					children: ["Name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: name,
						onChange: (e) => setName(e.target.value.slice(0, 16)),
						className: "mt-1 w-full border-2 border-bone bg-ink px-3 py-2 text-bone outline-none"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5",
					children: RACES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: `border-2 p-2 text-left ${race === r.id ? "border-kyo bg-ink" : "border-bone bg-ink"}`,
						onClick: () => {
							setRace(r.id);
							setSetId(null);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display block text-xs",
							children: r.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: typeClass(r.type),
							children: TYPES[r.type].name
						})]
					}, r.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 font-display text-xs text-kyo",
					children: "Spawn clothes"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 grid gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: `px-btn ${setId === null ? "border-kyo" : ""}`,
							onClick: () => setSetId(null),
							children: "Default witch robes"
						}),
						owned.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-dim",
							children: [
								"No finished ",
								RACES.find((r) => r.id === race)?.name,
								" set yet. Find every piece once."
							]
						}),
						owned.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: `px-btn text-left ${setId === s.id ? "border-kyo" : ""}`,
							onClick: () => setSetId(s.id),
							children: [s.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-dim",
								children: s.bonus
							})]
						}, s.id))
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "px-btn px-btn-kyo mt-4",
					onClick: () => game?.rebirth(name, race, setId),
					children: "Wake at a new tavern"
				})
			]
		})
	});
}
function Stick({ on }) {
	const ref = (0, import_react.useRef)(null);
	function at(e) {
		const box = ref.current?.getBoundingClientRect();
		if (!box) return;
		const x = (e.clientX - box.left) / box.width * 2 - 1;
		const y = (e.clientY - box.top) / box.height * 2 - 1;
		const len = Math.hypot(x, y) || 1;
		on(len > 1 ? x / len : x, len > 1 ? y / len : y);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: "stick-wrap",
		onPointerDown: (e) => {
			e.currentTarget.setPointerCapture(e.pointerId);
			at(e);
		},
		onPointerMove: (e) => {
			if (e.currentTarget.hasPointerCapture(e.pointerId)) at(e);
		},
		onPointerUp: () => on(0, 0),
		"aria-label": "Move stick"
	});
}
function Panel({ title, onClose, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "panel-drawer",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-panel panel-scroll h-full p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xs text-kyo",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "px-btn",
					onClick: onClose,
					children: "Close"
				})]
			}), children]
		})
	});
}
function Bag({ snap, game }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-display text-xs",
				children: ["Worn · ", snap.setLabel]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-dim",
				children: snap.setBonus
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-2",
				children: [snap.totals.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					row.name,
					" ",
					row.power
				] }, row.id)), snap.totals.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-dim",
					children: "No enchants yet."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid gap-1",
				children: snap.bag.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "px-btn",
					onClick: () => game?.useBag(item.id),
					children: [
						item.name,
						" x",
						item.count,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-dim",
							children: item.about
						})
					]
				}, item.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid gap-2 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "px-btn",
					onClick: () => game?.craftGear(),
					children: "Craft · 10 leather + 10 mushroom"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "px-btn",
					onClick: () => game?.sellMats(),
					children: "Sell hides and meat"
				})]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-1",
			children: [
				snap.gear.map((piece) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: `px-btn text-left ${snap.selected === piece.uid ? "border-kyo" : ""}`,
					onClick: () => game?.select(piece.uid),
					children: [piece.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-1 block text-dim",
						children: [
							piece.slot,
							" · ",
							piece.quality,
							snap.equipped.includes(piece.uid) ? " · worn" : ""
						]
					})]
				}, piece.uid)),
				snap.selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 grid grid-cols-2 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "px-btn px-btn-kyo",
							onClick: () => game?.equip(snap.selected),
							children: "Wear"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "px-btn",
							onClick: () => game?.sell(snap.selected),
							children: "Sell"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "px-btn",
							onClick: () => game?.disenchant(),
							children: "Unravel"
						})
					]
				}),
				snap.stash.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 grid gap-1",
					children: snap.stash.map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "px-btn",
						onClick: () => game?.applyStash(i),
						children: ["Apply ", line]
					}, `${line}-${i}`))
				})
			]
		})]
	});
}
function Skills({ snap, game }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Account ",
				snap.accountLevel,
				" · ",
				snap.accountXp,
				"/",
				snap.accountNeed,
				" · ",
				snap.perkPoints,
				" perk points"
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-kyo",
				children: [
					"Account Score ",
					snap.accountScore,
					". Kept forever when a witch dies."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bar-track",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full bg-kyo",
					style: { width: `${Math.min(100, snap.accountXp / Math.max(1, snap.accountNeed) * 100)}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-dim",
				children: "Each account level gives 5 points. They are permanent enchantments on every witch you become."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-1",
				children: snap.perks.map((perk) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "px-btn text-left",
					disabled: snap.perkPoints < 1,
					onClick: () => game?.spendPerk(perk.id),
					children: [
						perk.name,
						" ",
						perk.power,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-dim",
							children: perk.about
						})
					]
				}, perk.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-1",
				children: snap.skills.map((sk) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-kyo",
					children: [
						sk.name,
						" ",
						sk.level
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-dim",
					children: [
						" ",
						"· ",
						sk.xp,
						"/",
						sk.need,
						" · ",
						sk.line
					]
				})] }, sk.id))
			})
		]
	});
}
function Moves({ snap }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-1",
		children: snap.known.map((move) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: typeClass(move.type),
			children: move.name
		}) }, move.id))
	});
}
function Ghost({ snap, game }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: snap.companion }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-dim",
				children: "Kills can recruit a spirit. A full party of three keeps the stronger ones. Dead spirits sit out the next turns."
			}),
			snap.box.map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "px-btn",
				onClick: () => game?.summonBox(i),
				children: ["Call ", line]
			}, `${line}-${i}`))
		]
	});
}
function Mini({ snap, game }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const canvas = ref.current;
		if (!canvas || !game) return;
		game.drawMap(canvas);
	}, [
		game,
		snap.mapX,
		snap.mapY,
		snap.map
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref,
		className: "map-canvas",
		"aria-label": "World map"
	});
}
//#endregion
export { TurbzApp as n, ApiGate as t };
