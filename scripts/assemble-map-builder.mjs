#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "fs";
import { gunzipSync } from "zlib";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const dir = join(dirname(fileURLToPath(import.meta.url)), "../src/components");
const parts = [];
for (let i = 0; i < 20; i++) {
  const p = join(dir, `map-builder.b64.part${i}`);
  if (!existsSync(p)) break;
  parts.push(readFileSync(p, "utf8").trim());
}
if (!parts.length) {
  console.log("[assemble-map-builder] no parts, skip");
  process.exit(0);
}
const out = gunzipSync(Buffer.from(parts.join(""), "base64")).toString("utf8");
writeFileSync(join(dir, "map-builder.tsx"), out);
console.log("[assemble-map-builder] wrote map-builder.tsx", out.length, "bytes");
