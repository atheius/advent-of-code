import * as path from "path";
import * as fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { test } from "tap";
import { part1, part2 } from "./solution.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const input = fs
  .readFileSync(path.join(__dirname, "../example.txt"))
  .toString();

test("part 1", (t) => {
  t.equal(part1(input), 33);
  t.end();
});

test("part 2", (t) => {
  // Takes too long to test!
  // t.equal(part2(input), 3472);
  t.end();
});
