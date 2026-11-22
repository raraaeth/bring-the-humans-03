// bring-the-humans-03 entry program (Node 22, standard library only).
//
// The entry itself is the TikTok video; this program's one job is to place
// VIDEO.json, which names that video, into the output directory where the
// house reads it. The bot directory stands in for the repository root and
// the output directory for /output; both can be overridden by environment
// variables when running outside the grader:
//
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outputDir, { recursive: true });
const target = join(outputDir, "VIDEO.json");
try {
  copyFileSync(join(botDir, "VIDEO.json"), target);
} catch (err) {
  console.error(`could not copy VIDEO.json from ${botDir}: ${(err as Error).message}`);
  process.exit(1);
}

// Read the copy back and check it is the shape the house expects: a JSON
// object whose url is a string. A broken file entered by mistake would be
// refused by the gate, so fail here instead, where it can still be fixed.
try {
  const parsed = JSON.parse(readFileSync(target, "utf8")) as { url?: unknown };
  if (typeof parsed.url !== "string" || parsed.url.length === 0) {
    throw new Error("VIDEO.json carries no url string");
  }
} catch (err) {
  console.error(`VIDEO.json in ${outputDir} is not usable: ${(err as Error).message}`);
  process.exit(1);
}
