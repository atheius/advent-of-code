import * as path from "path";
import * as fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { test } from "tap";
import { part1, part2 } from "./solution.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// test("part 1", (t) => {
//   t.equal(part1(example1), 16);
//   t.equal(part1(example2), 12);
//   t.equal(part1(example3), 23);
//   t.equal(part1(example4), 31);
//   t.end();
// });

test("part 2", (t) => {
  t.equal(part2(example5), 3);
  t.equal(part2(example6), 54);
  t.equal(part2(example7), 7);
  t.equal(part2(example8), 9);
  t.equal(part2(example9), 1);
  t.equal(part2(example10), 0);
  // t.equal(part2(example11), 1);
  t.end();
});
