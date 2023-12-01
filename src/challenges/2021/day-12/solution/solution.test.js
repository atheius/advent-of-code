import test from "node:test";
import assert from "assert";
import { join } from "path";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { part1, part2 } from "./solution.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const input = readFileSync(join(__dirname, "../example.txt"), "utf8");
const input2 = readFileSync(join(__dirname, "../example-2.txt"), "utf8");
const input3 = readFileSync(join(__dirname, "../example-3.txt"), "utf8");

test("2021 | day 12 | part 1", () => {
  assert.equal(part1(input), 10);
  assert.equal(part1(input2), 19);
  assert.equal(part1(input3), 226);
});

test("2021 | day 12 | part 2", () => {
  assert.equal(part2(input), 36);
  assert.equal(part2(input2), 103);
  assert.equal(part2(input3), 3509);
});
