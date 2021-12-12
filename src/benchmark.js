import * as path from "path";
import * as fs from "fs";
import chalk from "chalk";
import { performance } from "perf_hooks";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const baseDir = "./src/challenges/2021";

fs.readdir(baseDir, async (err, files) => {
  if (err) {
    throw err;
  }

  console.log(chalk.white("\n----- Benchmarks (µs) -----"));

  for (let file of files) {
    const dayString = file.split("-")[1];

    const { part1, part2 } = await import(
      path.join(
        path.join(__dirname, "../", baseDir, file, "solution/solution.js")
      )
    );

    const input = fs
      .readFileSync(path.join(__dirname, "../", baseDir, file, "example.txt"))
      .toString();

    const startTime = performance.now();
    part1(input);
    const endTime = performance.now();
    const perfResult = (endTime - startTime) * 1000;
    console.log(
      `\nDay ${dayString} Part 01:`,
      chalk.green(`${perfResult.toFixed(0)}`.padEnd(4))
    );

    const startTime2 = performance.now();
    part2(input);
    const endTime2 = performance.now();
    const perfResult2 = (endTime2 - startTime2) * 1000;
    console.log(
      `Day ${dayString} Part 02:`,
      chalk.green(`${perfResult2.toFixed(0)}`.padEnd(4))
    );
  }

  console.log("\n");
});
