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

const input3 = fs.readFileSync(path.join(__dirname, "../input.txt")).toString();

test("part 1", (t) => {
  t.equal(part1(input), 590784);
  t.end();
});

test("part 2", (t) => {
  t.equal(part2(input2), 2758514936282235);
  t.equal(part2(input3), 1125649856443608);
  t.end();
});
