import test from "node:test";
import assert from "assert";
import { join } from "path";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { part1, part2 } from "./solution.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const input = readFileSync(join(__dirname, "../example.txt"), "utf8");
const input2 = readFileSync(join(__dirname, "../example2.txt"), "utf8");
const input3 = readFileSync(join(__dirname, "../example3.txt"), "utf8");
const input4 = readFileSync(join(__dirname, "../example4.txt"), "utf8");

test("2022 | day 06 | part 1", () => {
  assert.equal(part1(input), 5);
  assert.equal(part1(input2), 6);
  assert.equal(part1(input3), 10);
  assert.equal(part1(input4), 11);
});

test("2022 | day 06 | part 2", () => {
  assert.equal(part2(input), 23);
  assert.equal(part2(input2), 23);
  assert.equal(part2(input3), 29);
  assert.equal(part2(input4), 26);
});
