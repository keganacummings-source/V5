#!/usr/bin/env node
/**
 * Reconstructs src/components/turbz-app.tsx from:
 * 1) turbz-app.tsx.partN text parts, OR
 * 2) turbz.b64.partN gzip+base64 chunks
 */
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { gunzipSync } from "zlib";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "src/components");
const out = join(dir, "turbz-app.tsx");

function fromTextParts() {
  const parts = readdirSync(dir)
    .filter((f) => /^turbz-app\.tsx\.part\d+$/.test(f))
    .sort((a, b) => Number(a.replace(/\D/g, "")) - Number(b.replace(/\D/g, "")));
  if (!parts.length) return null;
  return parts.map((f) => readFileSync(join(dir, f), "utf8")).join("");
}

function fromB64Parts() {
  const parts = readdirSync(dir)
    .filter((f) => /^turbz\.b64\.part\d+$/.test(f))
    .sort((a, b) => Number(a.replace(/\D/g, "")) - Number(b.replace(/\D/g, "")));
  if (!parts.length) return null;
  const b64 = parts.map((f) => readFileSync(join(dir, f), "utf8")).join("").replace(/\s/g, "");
  return gunzipSync(Buffer.from(b64, "base64")).toString("utf8");
}

const body = fromTextParts() || fromB64Parts();
if (!body) {
  console.warn("[assemble-turbz] no part files found, skipping");
  process.exit(0);
}
writeFileSync(out, body);
console.log(`[assemble-turbz] wrote ${out} (${body.length} bytes)`);
