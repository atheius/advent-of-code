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

const input2 = fs
  .readFileSync(path.join(__dirname, "../example2.txt"))
  .toString();

const input3 = fs
  .readFileSync(path.join(__dirname, "../example3.txt"))
  .toString();

const input4 = fs
  .readFileSync(path.join(__dirname, "../example4.txt"))
  .toString();

test("part 1", (t) => {
  t.equal(part1(input), 5);
  t.equal(part1(input2), 6);
  t.equal(part1(input3), 10);
  t.equal(part1(input4), 11);
  t.end();
});

test("part 2", (t) => {
  t.equal(part2(input), 23);
  t.equal(part2(input2), 23);
  t.equal(part2(input3), 29);
  t.equal(part2(input4), 26);
  t.end();
});
