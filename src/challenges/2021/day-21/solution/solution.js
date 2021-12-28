import { readLines, sortAscending } from "../../../../helpers.js";

const parseInput = (input) =>
  readLines(input).map((line) => parseInt(line.split(":")[1].trim(), 10));

const rollDeterministicDice = (previousRoll = 0) => (previousRoll % 100) + 1;

const changePosition = (previousPosition, score) =>
  ((previousPosition + score - 1) % 10) + 1;

const playGame = (positions, scores, winningScore = 1000) => {
  let totalRolls = 0;
  let dice = 0;

  // End the game when someone wins
  while (Math.max(...scores) < winningScore) {
    // For each player in the game
    for (let i = 0; i < positions.length; i += 1) {
      // Has anyone won yet?
      if (Math.max(...scores) >= winningScore) {
        continue;
      }

      let nextScore = 0;

      // Roll 3 times
      for (let j = 0; j < 3; j += 1) {
        dice = rollDeterministicDice(dice);
        totalRolls += 1;
        nextScore += dice;
      }

      // Change position
      positions[i] = changePosition(positions[i], nextScore);

      // Set next score based on position
      scores[i] += positions[i];
    }
  }

  return { finalScores: scores, totalRolls };
};

const diceFrequencies = {
  3: 1,
  4: 3,
  5: 6,
  6: 7,
  7: 6,
  8: 3,
  9: 1,
};

const turn = (
  currentPlayer,
  p1Score,
  p1Position,
  p2Score,
  p2Position,
  winningScore,
  cache = {}
) => {
  // Base case (a player has won)
  if (p1Score >= winningScore) {
    return [1, 0];
  } else if (p2Score >= winningScore) {
    return [0, 1];
  }

  const cacheKey =
    currentPlayer +
    "|" +
    p1Score +
    "|" +
    p1Position +
    "|" +
    p2Score +
    "|" +
    p2Position;

  if (!(cacheKey in cache)) {
    let p1Wins = 0;
    let p2Wins = 0;

    for (let [diceValue, diceFrequency] of Object.entries(diceFrequencies)) {
      diceValue = parseInt(diceValue, 10);
      let p1NextWins;
      let p2NextWins;

      if (currentPlayer === 0) {
        const nextP1Position = changePosition(p1Position, diceValue);
        const nextP1Score = p1Score + nextP1Position;
        [p1NextWins, p2NextWins] = turn(
          1,
          nextP1Score,
          nextP1Position,
          p2Score,
          p2Position,
          winningScore,
          cache
        );
      } else {
        const nextP2Position = changePosition(p2Position, diceValue);
        const nextP2Score = p2Score + nextP2Position;
        [p1NextWins, p2NextWins] = turn(
          0,
          p1Score,
          p1Position,
          nextP2Score,
          nextP2Position,
          winningScore,
          cache
        );
      }

      p1Wins += p1NextWins * diceFrequency;
      p2Wins += p2NextWins * diceFrequency;
    }

    cache[cacheKey] = [p1Wins, p2Wins];
  }

  return cache[cacheKey];
};

const part1 = (input) => {
  const positions = parseInput(input);
  const scores = new Array(positions.length).fill(0);
  const { finalScores, totalRolls } = playGame(positions, scores, 1000);
  return sortAscending(finalScores)[0] * totalRolls;
};

const part2 = (input) => {
  const positions = parseInput(input);
  const scores = new Array(positions.length).fill(0);
  const wins = turn(0, scores[0], positions[0], scores[1], positions[1], 21);
  return Math.max(...wins);
};

export { part1, part2 };
