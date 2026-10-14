# TURBZ menu update — assemble

`src/components/turbz-app.tsx` is rebuilt from compressed parts on every `dev` / `build`.

```bash
npm run assemble:turbz
# or just:
npm run dev
```

Parts: `src/components/turbz.b64.part0` … `part7`  
Script: `scripts/assemble-turbz.mjs`

## What's in the update

1. **Quest Board** — 10 random quests, refresh every 30 minutes  
2. **Skills** — tabs: Account Perks | Skills  
3. **Verses** — tabs: Equip (max 9) | Unlock & Upgrade (sorted catalog)  
4. **Trade → Black Market** — stock refreshes every 5 minutes; Items / Gear / Enchants / Spirits; gear 5–50 levels above you  

Engine-side equip limit / black-market stock still need a follow-up pass if combat bar does not respect 9 slots yet.
