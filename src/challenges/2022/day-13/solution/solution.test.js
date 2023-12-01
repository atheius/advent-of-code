import test from "node:test";
import assert from "assert";
import { join } from "path";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { part1, part2 } from "./solution.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const input = readFileSync(join(__dirname, "../example.txt"), "utf8");

test("2022 | day 13 | part 1", () => {
  assert.equal(part1(input), 13);
});

test("2022 | day 13 | part 2", () => {
  assert.equal(part2(input), 140);
});
