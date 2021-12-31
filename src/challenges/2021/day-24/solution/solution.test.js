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

const input4 = fs.readFileSync(path.join(__dirname, "../input.txt")).toString();

test("part 1", (t) => {
  // here is an ALU program which takes an input number,
  // negates it, and stores it in x
  t.equal(part1(input, [0]).x, 0);
  t.equal(part1(input, [1]).x, -1);
  t.equal(part1(input, [2]).x, -2);

  // Here is an ALU program which takes two input numbers,
  // then sets z to 1 if the second input number is three times
  // larger than the first input number, or sets z to 0 otherwise:
  t.equal(part1(input2, [1, 1]).z, 0);
  t.equal(part1(input2, [1, 3]).z, 1);
  t.equal(part1(input2, [3, 9]).z, 1);

  // Here is an ALU program which takes a non-negative integer as input,
  // converts it into binary, and stores the lowest (1's) bit in z,
  // the second-lowest (2's) bit in y, the third-lowest (4's) bit in x,
  // and the fourth-lowest (8's) bit in w:
  t.same(part1(input3, [1]), { w: 0, x: 0, y: 0, z: 1 });
  t.same(part1(input3, [4]), { w: 0, x: 1, y: 0, z: 0 });
  t.same(part1(input3, [7]), { w: 0, x: 1, y: 1, z: 1 });

  // Is this model numebr valid?
  t.same(part1(input4, [9, 2, 9, 1, 5, 9, 7, 9, 9, 9, 9, 4, 9, 8]).z, 0);

  t.end();
});

test("part 2", (t) => {
  // Is this model numebr valid?
  t.same(part1(input4, [2, 1, 6, 1, 1, 5, 1, 3, 9, 1, 1, 1, 8, 1]).z, 0);
  t.end();
});
