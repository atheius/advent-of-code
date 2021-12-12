import { readLines } from "../../../../helpers.js";

const chunkPattern = /(\(\))|(\{\})|(\[\])|(\<\>)/g;

const matchingChars = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
};

const countOccurences = (str, pattern) =>
  ((str || "").match(pattern) || []).length;

const getLineStatus = (line) => {
  const chars = line.split("");
  for (let i = 0; i < chars.length - 1; i++) {
    if (
      Object.keys(matchingChars).includes(chars[i]) &&
      Object.values(matchingChars).includes(chars[i + 1])
    ) {
      return { status: "CORRUPT", char: chars[i + 1] };
    }
  }
  return { status: "INCOMPLETE" };
};

const processLine = (line) => {
  let processedLine = line;
  let numMatches = -1;
  while (numMatches !== 0) {
    numMatches = countOccurences(processedLine, chunkPattern);
    processedLine = processedLine.replace(chunkPattern, "");
  }
  return processedLine;
};

const completeLine = (line) => {
  let lineEnding = "";
  const chars = line.split("");
  for (let i = chars.length - 1; i >= 0; i--) {
    lineEnding += matchingChars[chars[i]];
  }
  return lineEnding;
};

const part1 = (input) => {
  const lines = readLines(input);

  const points = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137,
  };

  let score = 0;
  for (let line of lines) {
    const { status, char } = getLineStatus(processLine(line));
    if (status === "CORRUPT") {
      score += points[char];
    }
  }

  return score;
};

const part2 = (input) => {
  const lines = readLines(input);

  const points = {
    ")": 1,
    "]": 2,
    "}": 3,
    ">": 4,
  };

  let scores = [];
  for (let line of lines) {
    const processedLine = processLine(line);
    const { status } = getLineStatus(processedLine);
    if (status === "INCOMPLETE") {
      const lineEnding = completeLine(processedLine);
      const subTotal = lineEnding.split("").reduce((total, char) => {
        return total * 5 + points[char];
      }, 0);
      scores.push(subTotal);
    }
  }

  scores.sort((a, b) => a - b);

  return scores[Math.floor(scores.length / 2)];
};

export { part1, part2 };
