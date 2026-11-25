// Entry: "The GPS Swears It Was a Shortcut"
// Final line (101 characters, one line, em dash intentional — do NOT add a
// guard that rejects non-ASCII characters; the em dash is part of the line):
//   I didn't send you to the wrong wedding — the map said 'reception,'
//   and I read roads, not invitations.
//
// Self-judge verdict (3 rounds): option C wins — the wrong-wedding turn
// ("I didn't send you to the wrong wedding") with the punchline
// "I read roads, not invitations." It beats the plainer variants on
// surprise (wedding mix-up) and on the closing wordplay (roads vs
// invitations). No further wording changes: the line is frozen.
// Revision: defensive guards + read-back verification (no behavior change
// for the final line).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I didn't send you to the wrong wedding — the map said 'reception,' and I read roads, not invitations.";

function assertValidLine(line: string): void {
  if (line.length < 1 || line.length > 200) {
    throw new Error(`Line must be 1-200 characters, got ${line.length}.`);
  }
  if (line.trim().length === 0) {
    throw new Error("Line must not be only whitespace.");
  }
  if (line !== line.trim()) {
    throw new Error("Line must not have leading or trailing whitespace.");
  }
  if (/[\r\n]/.test(line)) {
    throw new Error("Line must be a single line (no newline characters).");
  }
  // No control characters: the output must be one clean line of text.
  if (/[\u0000-\u001F\u007F]/.test(line)) {
    throw new Error("Line must not contain control characters.");
  }
  // No consecutive double spaces: a single clean sentence, no accidental
  // double-spacing. (The final line has none; this guard is behavior-safe
  // for it and only rejects malformed future edits.)
  if (/  /.test(line)) {
    throw new Error("Line must not contain consecutive spaces.");
  }
}

assertValidLine(LINE);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Read-back verification: catch partial or corrupted writes.
const written = readFileSync(outPath, "utf8");
if (written !== LINE) {
  throw new Error("Read-back mismatch: entry.txt does not match the line.");
}
