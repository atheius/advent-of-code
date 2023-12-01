import test from "node:test";
import assert from "assert";
import { join } from "path";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { part1, part2 } from "./solution.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const input = readFileSync(join(__dirname, "../example.txt"), "utf8");

const example1 = "8A004A801A8002F478";
const example2 = "620080001611562C8802118E34";
const example3 = "C0015000016115A2E0802F182340";
const example4 = "A0016C880162017C3686B18A3D4780";

const example5 = "C200B40A82";
const example6 = "04005AC33890";
const example7 = "880086C3E88112";
const example8 = "CE00C43D881120";
const example9 = "D8005AC2A8F0";
const example10 = "F600BC2D8F";
const example11 = "9C0141080250320F1802104A08";

test("2021 | day 16 | part 1", () => {
  assert.equal(part1(example1), 16);
  assert.equal(part1(example2), 12);
  assert.equal(part1(example3), 23);
  assert.equal(part1(example4), 31);
});

test("2021 | day 16 | part 2", () => {
  assert.equal(part2(example5), 3);
  assert.equal(part2(example6), 54);
  assert.equal(part2(example7), 7);
  assert.equal(part2(example8), 9);
  assert.equal(part2(example9), 1);
  assert.equal(part2(example10), 0);
  assert.equal(part2(example11), 1);
});
