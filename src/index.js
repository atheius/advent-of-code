import arg from "arg";
import chalk from "chalk";
import { initDay, solveDay, submitSolution } from "./utils.js";

const parseArgumentsIntoOptions = (rawArgs) => {
  const args = arg(
    {
      "--init": Boolean,
      "-i": "--init",
      "--submit": Boolean,
      "-s": "--submit",
      "--solve": Boolean,
      "--year": String,
      "-y": "--year",
      "--day": String,
      "-d": "--day",
      "--part": String,
      "-p": "--part",
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    init: args["--init"],
    submit: args["--submit"],
    solve: args["--solve"],
    year: args["--year"],
    day: args["--day"],
    part: args["--part"],
  };
};

export const cli = async (args) => {
  const options = parseArgumentsIntoOptions(args);

  if (!options.year) {
    options.year = new Date().getFullYear();
  }

  if (!options.day) {
    options.day = new Date().getDate();
  }

  if (!options.part) {
    options.part = 1;
  }

  const { init, submit, solve, year, day, part } = options;

  console.log("🎄🎄🎄 Advent of Code 🎄🎄🎄");

  if (day < 1 || day > 25) {
    console.log(chalk.redBright("Error: Day must be between 1 and 25"));
    return;
  }

  if (part < 1 || part > 2) {
    console.log(chalk.redBright("Error: Part must be either 1 or 2"));
    return;
  }

  if (init) {
    return initDay(year, day);
  }

  if (submit) {
    return submitSolution(
      parseInt(year, 10),
      parseInt(day, 10),
      parseInt(part, 10)
    );
  }

  if (solve) {
    return solveDay(parseInt(year, 10), parseInt(day, 10), parseInt(part, 10));
  }

  console.log(chalk.yellowBright("Choose an option e.g. aoc --init"));
};
