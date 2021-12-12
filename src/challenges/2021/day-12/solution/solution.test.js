import * as path from "path";
import * as fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { test } from "tap";
import { part1, part2 } from "./solution.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const example1 = fs
  .readFileSync(path.join(__dirname, "../example.txt"))
  .toString();

const example2 = fs
  .readFileSync(path.join(__dirname, "../example-2.txt"))
  .toString();

const example3 = fs
  .readFileSync(path.join(__dirname, "../example-3.txt"))
  .toString();

test("part 1", (t) => {
  t.equal(part1(example1), 10);
  t.equal(part1(example2), 19);
  t.equal(part1(example3), 226);
  t.end();
});

test("part 2", (t) => {
  t.equal(part2(example1), 36);
  t.equal(part2(example2), 103);
  t.equal(part2(example3), 3509);
  t.end();
});
