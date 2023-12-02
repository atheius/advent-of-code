import { readLines, sum, product } from "../../../../helpers.js";

const colourPattern = /(\d{1,2})\s*(red|blue|green)/gi;

const parseInput = (input) =>
  readLines(input).map((line) =>
    line
      .split(":")[1]
      .split(";")
      .map((x) =>
        x.split(",").reduce(
          (acc, curr) => {
            const [, num, colour] = [...curr.matchAll(colourPattern)].flat();
            return {
              ...acc,
              [colour]: (acc[colour] += parseInt(num, 10)),
            };
          },
          { red: 0, green: 0, blue: 0 }
        )
      )
  );

const part1 = (input) => {
  const parsedInput = parseInput(input);

  const MAX_RED = 12;
  const MAX_GREEN = 13;
  const MAX_BLUE = 14;

  const possibleGames = parsedInput.reduce((acc, games, idx) => {
    const possible = games.reduce((acc, curr) => {
      if (
        curr.red > MAX_RED ||
        curr.green > MAX_GREEN ||
        curr.blue > MAX_BLUE
      ) {
        return false;
      }
      return acc;
    }, true);

    if (possible) {
      return [...acc, idx + 1];
    }
    return acc;
  }, []);

  return sum(possibleGames);
};

const part2 = (input) => {
  const totalPower = parseInput(input).reduce(
    (power, games) =>
      power +
      product(
        Object.values(
          // Get minimum values for each colour (from each game)
          games.reduce(
            (acc, curr) => {
              for (const key of Object.keys(curr)) {
                if (curr[key] > acc[key]) {
                  acc[key] = curr[key];
                }
              }
              return acc;
            },
            { red: 0, blue: 0, green: 0 }
          )
        )
      ),
    0
  );

  return totalPower;
};

export { part1, part2 };
