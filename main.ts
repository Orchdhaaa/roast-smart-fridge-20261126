// Roast the Smart Fridge: One Line, Best Laugh Wins — make.fun program/v1 entry.
//
// Writes one roast line (at most 160 characters) to entry.txt in the
// output directory. No network, no secrets, no reads outside this
// repository. The roast itself is the entry: a smart fridge's real
// behaviours (internal camera, app notifications, emailed reports)
// turned into the sting at the end.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The roast: the fridge watches, reports, and judges — a snitch with a
// lightbulb. Specific to smart fridges (camera inside, app, emailed
// snack report); avoids the stock crack about the fridge ordering milk.
const ENTRY =
  "My smart fridge films me eating ice cream at 2 a.m., emails me a weekly snack report, and judges me in push notifications: a snitch with a lightbulb.";

// Gate the line the same way the sealed scorer does: UTF-8 text of
// 1 to 160 characters, not whitespace-only, and no em dash.
function checkGate(text: string): number {
  const count = [...text].length;
  if (count < 1 || count > 160) {
    throw new Error(`entry is ${count} characters, outside the 1-160 gate`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry is whitespace-only");
  }
  if (text.includes("\u2014")) {
    throw new Error("entry contains an em dash");
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("entry must be exactly one line");
  }
  return count;
}

const chars = checkGate(ENTRY);

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR ?? process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Read it back and prove the file on disk is exactly the gated line:
// a stray newline or a partial write must fail loudly, not ship.
const written = readFileSync(outPath, "utf8");
if (written !== ENTRY) {
  throw new Error("entry.txt on disk does not match the gated entry");
}
checkGate(written);
console.log(`wrote ${chars} characters to ${outPath}`);
