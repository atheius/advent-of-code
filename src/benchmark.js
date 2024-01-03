import path from "path";
import { readdir, readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { run, bench } from "mitata";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const years = await readdir("./src/challenges/");

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

    bench(`${year} | ${dayString} | part 1`, () => part1(input));

    if (part2) {
      bench(`${year} | ${dayString} | part 2`, () => part2(input, false));
    }
  }
}

await run({
  percentiles: false,
});
