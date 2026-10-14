#!/usr/bin/env node
/**
 * Ensures public/MapAssets is populated from TURBZ2 catalog zip if missing.
 * Run during Cloudflare build: node scripts/fetch-map-assets.mjs
 */
import { existsSync, mkdirSync, createWriteStream, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { execSync } from "node:child_process";

const ROOT = join(process.cwd(), "public", "MapAssets");
const ZIP_URL =
  "https://github.com/keganacummings-source/TURBZ2/raw/main/Map_Building_Asset_Catalog.zip";

function hasTiles() {
  try {
    const cats = readdirSync(ROOT).filter((d) => /^\d{2}_/.test(d));
    return cats.length >= 10;
  } catch {
    return false;
  }
}

function buildCatalog() {
  const cats = readdirSync(ROOT).filter((d) => {
    try {
      return statSync(join(ROOT, d)).isDirectory() && /^\d{2}_/.test(d);
    } catch {
      return false;
    }
  });
  const catalog = { version: 1, root: "/MapAssets", categories: [] };
  for (const cat of cats.sort()) {
    const dir = join(ROOT, cat);
    const files = readdirSync(dir).filter((f) => f.endsWith(".png")).sort();
    const solid = /Wall|Cliff|Door|Gate|Statue|Trap|Altar|Shop|Vault|Dungeon/i.test(cat);
    const liquid = /Water|Liquid/i.test(cat);
    const entries = files.map((f) => ({
      id: `${cat}/${f.replace(/\.png$/i, "")}`,
      file: f,
      path: `/MapAssets/${cat}/${f}`,
      category: cat,
      solid: solid && !/floor|ground|open|bridge/i.test(f),
      slow: liquid ? 0.45 : 1,
    }));
    catalog.categories.push({
      id: cat,
      label: cat.replace(/^\d{2}_/, "").replace(/_/g, " "),
      count: entries.length,
      solid,
      liquid,
      tiles: entries,
    });
  }
  writeFileSync(join(ROOT, "catalog.json"), JSON.stringify(catalog));
  console.log("[map-assets] catalog.json written,", catalog.categories.reduce((n, c) => n + c.count, 0), "tiles");
}

async function main() {
  mkdirSync(ROOT, { recursive: true });
  if (hasTiles()) {
    console.log("[map-assets] already present");
    if (!existsSync(join(ROOT, "catalog.json"))) buildCatalog();
    return;
  }
  console.log("[map-assets] downloading catalog zip…");
  const res = await fetch(ZIP_URL);
  if (!res.ok) throw new Error(`download failed: ${res.status}`);
  const zipPath = join(process.cwd(), ".map-assets.zip");
  await pipeline(Readable.fromWeb(res.body), createWriteStream(zipPath));
  execSync(`unzip -qo "${zipPath}" -d "${join(process.cwd(), "public")}"`, { stdio: "inherit" });
  const nested = join(process.cwd(), "public", "Map_Building_Asset_Catalog");
  if (existsSync(nested)) {
    execSync(`cp -a "${nested}/." "${ROOT}/" && rm -rf "${nested}"`, { stdio: "inherit" });
  }
  buildCatalog();
  console.log("[map-assets] ready");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
