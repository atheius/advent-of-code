import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { JSDOM } from "jsdom";
import dotenv from "dotenv";
import chalk from "chalk";
import TurndownService from "turndown";
import { performance } from "perf_hooks";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { version } = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../package.json"))
);

dotenv.config();

const turndownService = new TurndownService({
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
  headingStyle: "atx",
});

const BASE_URL = "https://adventofcode.com";
const SESSION_TOKEN = process.env.SESSION_TOKEN;

const requestHeaders = {
  cookie: `session=${SESSION_TOKEN}`,
  "User-Agent": `github.com/atheius/aoc v${version}`,
};

/**
 * Get the puzzle input for the day
 */
const getPuzzleInput = async (year, day) => {
  try {
    const inputFile = `./src/challenges/${year.toString()}/day-${day
      .toString()
      .padStart(2, "0")}/input.txt`;

    if (fs.existsSync(inputFile)) {
      const existingData = fs.readFileSync(inputFile, "utf8");
      if (
        !existingData.includes(
          "Please don't repeatedly request this endpoint before it unlocks!"
        )
      ) {
        return existingData;
      }
    }

    const res = await fetch(`${BASE_URL}/${year}/day/${day}/input`, {
      headers: requestHeaders,
      method: "GET",
    });

    const data = await res.text();

    if (fs.existsSync(inputFile)) {
      fs.unlinkSync(inputFile);
    }

    fs.writeFileSync(inputFile, data);

    return data;
  } catch (err) {
    console.error(chalk.red("Failed to get puzzle input."));
    console.error(err.message);
  }
};

/**
 * Save the question as markdown
 * @param {*} year
 * @param {*} day
 * @returns
 */
const getQuestionMarkdown = async (year, day) => {
  try {
    const res = await fetch(`${BASE_URL}/${year}/day/${day}`, {
      headers: requestHeaders,
      method: "GET",
    });

    const data = await res.text();

    const questionParts = data.match(
      /<article class="day-desc">.*?<\/article>/gs
    );

    if (questionParts === null) {
      console.error(chalk.red(`Couldn't find the question for day: ${day}`));
      return;
    }

    const questionFile = `./src/challenges/${year.toString()}/day-${day
      .toString()
      .padStart(2, "0")}/README.md`;

    const turndownData = turndownService.turndown(
      questionParts.reduce((all, part) => [...all, part], []).join("")
    );

    const puzzleTitle = turndownData
      .split("\n")[0]
      .split(":")[1]
      .split("-")[0]
      .trim();

    fs.writeFileSync(questionFile, turndownData);

    return puzzleTitle;
  } catch (err) {
    console.error(chalk.red("Failed to get puzzle question."));
    console.error(err.message);
  }
};

/**
 * Copies a directory
 * @param {*} src
 * @param {*} dest
 */
const copyDir = (src, dest) => {
  fs.mkdirSync(dest, { recursive: true });
  let entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    entry.isDirectory()
      ? copyDir(srcPath, destPath)
      : fs.copyFileSync(srcPath, destPath);
  }
};

/**
 * Initialise day
 * @param {*} day
 * @returns
 */
const initDay = async (year, day) => {
  const yearString = year.toString();
  const dayString = day.toString().padStart(2, "0");

  if (
    fs.existsSync(
      path.join(
        process.cwd(),
        `./src/challenges/${yearString}/day-${dayString}`
      )
    )
  ) {
    console.log(
      chalk.yellow("Folder already exists - skipping create template")
    );
  } else {
    console.log(chalk.green(`Creating template folder for day: ${dayString}`));
    copyDir(
      path.join(process.cwd(), "./template"),
      path.join(
        process.cwd(),
        `./src/challenges/${yearString}/day-${dayString}`
      )
    );
    const testFile = fs.readFileSync(
      `./src/challenges/${yearString}/day-${dayString}/solution/solution.test.js`,
      "utf8"
    );
    fs.writeFileSync(
      `./src/challenges/${yearString}/day-${dayString}/solution/solution.test.js`,
      testFile.replaceAll("_YEAR_", yearString).replaceAll("_DAY_", dayString),
      "utf8"
    );
  }

  console.log(chalk.green(`Getting question for day: ${dayString}`));

  const puzzleTitle = await getQuestionMarkdown(year, day);

  console.log(
    chalk.green(`Getting puzzle input for day: ${dayString} part: 01`)
  );

  await getPuzzleInput(year, day);
};

/**
 * Run solution for a specific day
 * @param {*} year
 * @param {*} day
 * @param {*} part
 */
const solveDay = async (year, day, part) => {
  try {
    const yearString = String(year);
    const dayString = String(day).padStart(2, "0");
    const partString = String(part).padStart(2, "0");

    const { part1, part2 } = await import(
      `./challenges/${yearString}/day-${dayString}/solution/solution.js`
    );

    const input = await getPuzzleInput(year, day, 1);

    const startTime = performance.now();
    const answer = part === 1 ? part1(input) : part2(input);
    const endTime = performance.now();
    const perfResult = (endTime - startTime) / 1000;

    console.log(
      "Completed in " + chalk.blue(`${perfResult.toFixed(3)}`) + " seconds"
    );
    console.log(
      `Year ${yearString} Day: ${dayString} Part: ${partString} Answer: ${answer.toString()}`
    );

    return answer.toString();
  } catch (err) {
    console.error(err);
  }
};

/**
 * Submit a solution for a specific day
 * @param {*} year
 * @param {*} day
 * @param {*} part
 * @param {*} answer
 */
const submitSolution = async (year, day, part) => {
  try {
    const answer = await solveDay(year, day, part);

    const result = await fetch(`${BASE_URL}/${year}/day/${day}/answer`, {
      headers: {
        ...requestHeaders,
        "content-type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: `level=${part}&answer=${answer}`,
    });

    const body = await result.text();

    const $main = new JSDOM(body).window.document.querySelector("main");

    const info =
      $main !== null
        ? $main.textContent.replace(/\[.*\]/, "").trim()
        : "Can't find the main element";

    if (info.includes("That's the right answer")) {
      console.log(chalk.green(info));
      if (part === 1) {
        // Update the question with part 2
        getQuestionMarkdown(year, day);
      }
    } else if (info.includes("That's not the right answer")) {
      console.log(chalk.red(info));
    } else if (info.includes("You gave an answer too recently")) {
      console.log(chalk.yellow(info));
    } else if (info.includes("You don't seem to be solving the right level")) {
      console.log(chalk.yellow(info));
    } else {
      console.log(info);
    }
  } catch (err) {
    console.error(err.message);
  }
};

export { initDay, getPuzzleInput, solveDay, submitSolution };
