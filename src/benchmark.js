import path from "path";
import { readdir, readFile } from "fs/promises";
import chalk from "chalk";
import { performance } from "perf_hooks";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const years = await readdir("./src/challenges/");

console.log(chalk.white("\n----- Benchmarks (µs) -----"));

for (const year of years) {
  const baseDir = `./src/challenges/${year}`;

  const days = await readdir(baseDir);

  for (const day of days) {
    const dayString = day.split("-")[1];

    const { part1, part2 } = await import(
      path.join(
        path.join(__dirname, "../", baseDir, day, "solution/solution.js")
      )
    );

    const input = await readFile(
      path.join(__dirname, "../", baseDir, day, "example.txt"),
      "utf-8"
    );

    const startTime = performance.now();
    part1(input);
    const endTime = performance.now();
    const perfResult = (endTime - startTime) * 1000;
    console.log(
      `\nYear ${year} Day ${dayString} Part 01:`,
      chalk.green(`${perfResult.toFixed(0)}`.padEnd(4))
    );

    if (part2) {
      const startTime2 = performance.now();
      part2(input, false);
      const endTime2 = performance.now();
      const perfResult2 = (endTime2 - startTime2) * 1000;
      console.log(
        `Year ${year} Day ${dayString} Part 02:`,
        chalk.green(`${perfResult2.toFixed(0)}`.padEnd(4))
      );
    }
  }
}

console.log("\n");
