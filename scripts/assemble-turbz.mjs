#!/usr/bin/env node
/**
 * Reconstructs src/components/turbz-app.tsx from committed part files.
 * Runs as predev / prebuild so local + CI always get the full source.
 */
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "src/components");
const out = join(dir, "turbz-app.tsx");
const parts = readdirSync(dir)
  .filter((f) => /^turbz-app\.tsx\.part\d+$/.test(f))
  .sort((a, b) => Number(a.replace(/\D/g, "")) - Number(b.replace(/\D/g, "")));
if (!parts.length) {
  console.warn("[assemble-turbz] no part files found, skipping");
  process.exit(0);
}
const body = parts.map((f) => readFileSync(join(dir, f), "utf8")).join("");
writeFileSync(out, body);
console.log(`[assemble-turbz] wrote ${out} (${body.length} bytes from ${parts.length} parts)`);
