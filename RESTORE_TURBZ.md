# Restore turbz-app.tsx

The file was truncated by an automated update that could not upload the full ~62KB source in one API call.

## Quick restore (recommended)

```bash
git fetch origin
git checkout 65d64689d4c71cfe1a4f3241a5793e1607a503f5 -- src/components/turbz-app.tsx
git add src/components/turbz-app.tsx
git commit -m "Restore turbz-app.tsx from good commit"
git push
```

Then re-apply the menu update locally (or ask the agent to patch after restore).

## Menu update goals (after restore)

1. **Quest Board** — 10 random quests, refresh every 30 minutes
2. **Skills** — two tabs: Account Perks | Skills list
3. **Verses** — two tabs: Equip (max 9) | Unlock & Upgrade (sorted catalog)
4. **Trade → Black Market** — random stock every 5 min; Items / Gear / Enchants / Spirits; gear 5–50 levels above character

## Assemble path (experimental)

`scripts/assemble-turbz.mjs` + `predev`/`prebuild` in package.json can rebuild `turbz-app.tsx` from `src/components/turbz.b64.part*` or `turbz-app.tsx.part*` once those payloads are complete.
