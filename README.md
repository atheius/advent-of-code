# 🎄 Advent of Code 🎄

Project for AOC challenges and solutions.

## Setup

Create a .env file with the following:

```
SESSION_TOKEN=<aoc-session-token>
```

Link the package locally:

```sh
npm link
```

## CLI

Initialise a day:

```sh
aoc --init --day 1
```

Run a solution:

```sh
aoc --solve --day 1 --part 1
```

Submit a solution:

```
aoc --submit --day 1 --part 1
```

## Test

Run tests with:

```sh
npm test
```

## Benchmark

Run benchmarks with:

```sh
npm run benchmark
```

## Puzzles

See below for a list of puzzles and solutions in this repo.

| Year | Day | Puzzle                                                                    | Solutions                                                         |
| ---- | --- | ------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 2021 | 01  | [Sonar Sweep](./src/challenges/2021/day-01/README.md)                     | [Part 1 and 2](./src/challenges/2021/day-01/solution/solution.js) |
| 2021 | 02  | [Dive!](./src/challenges/2021/day-02/README.md)                           | [Part 1 and 2](./src/challenges/2021/day-02/solution/solution.js) |
| 2021 | 03  | [Binary Diagnostic](./src/challenges/2021/day-03/README.md)               | [Part 1 and 2](./src/challenges/2021/day-03/solution/solution.js) |
| 2021 | 04  | [Giant Squid](./src/challenges/2021/day-04/README.md)                     | [Part 1 and 2](./src/challenges/2021/day-04/solution/solution.js) |
| 2021 | 05  | [Hydrothermal Venture](./src/challenges/2021/day-05/README.md)            | [Part 1 and 2](./src/challenges/2021/day-05/solution/solution.js) |
| 2021 | 06  | [Lanternfish](./src/challenges/2021/day-06/README.md)                     | [Part 1 and 2](./src/challenges/2021/day-06/solution/solution.js) |
| 2021 | 07  | [The Treachery of Whales](./src/challenges/2021/day-07/README.md)         | [Part 1 and 2](./src/challenges/2021/day-07/solution/solution.js) |
| 2021 | 08  | [Seven Segment Search](./src/challenges/2021/day-08/README.md)            | [Part 1 and 2](./src/challenges/2021/day-08/solution/solution.js) |
| 2021 | 09  | [Smoke Basin](./src/challenges/2021/day-09/README.md)                     | [Part 1 and 2](./src/challenges/2021/day-09/solution/solution.js) |
| 2021 | 10  | [Syntax Scoring](./src/challenges/2021/day-10/README.md)                  | [Part 1 and 2](./src/challenges/2021/day-10/solution/solution.js) |
| 2021 | 11  | [Dumbo Octopus](./src/challenges/2021/day-11/README.md)                   | [Part 1 and 2](./src/challenges/2021/day-11/solution/solution.js) |
| 2021 | 12  | [Passage Pathing](./src/challenges/2021/day-12/README.md)                 | [Part 1 and 2](./src/challenges/2021/day-12/solution/solution.js) |
| 2021 | 13  | [Transparent Origami](./src/challenges/2021/day-13/README.md)             | [Part 1 and 2](./src/challenges/2021/day-13/solution/solution.js) |
| 2021 | 14  | [Extended Polymerization](./src/challenges/2021/day-14/README.md)         | [Part 1 and 2](./src/challenges/2021/day-14/solution/solution.js) |
| 2021 | 15  | [Chiton](./src/challenges/2021/day-15/README.md)                          | [Part 1 and 2](./src/challenges/2021/day-15/solution/solution.js) |
| 2021 | 16  | [Packet Decoder](./src/challenges/2021/day-16/README.md)                  | [Part 1 and 2](./src/challenges/2021/day-16/solution/solution.js) |
| 2021 | 17  | [Trick Shot](./src/challenges/2021/day-17/README.md)                      | [Part 1 and 2](./src/challenges/2021/day-17/solution/solution.js) |
| 2021 | 18  | [Snailfish](./src/challenges/2021/day-18/README.md)                       | [Part 1 and 2](./src/challenges/2021/day-18/solution/solution.js) |
| 2021 | 19  | [Beacon Scanner](./src/challenges/2021/day-19/README.md)                  | TODO                                                              |
| 2021 | 20  | [Trench Map](./src/challenges/2021/day-20/README.md)                      | [Part 1 and 2](./src/challenges/2021/day-20/solution/solution.js) |
| 2021 | 21  | [Dirac Dice](./src/challenges/2021/day-21/README.md)                      | [Part 1 and 2](./src/challenges/2021/day-21/solution/solution.js) |
| 2021 | 22  | [Reactor Reboot](./src/challenges/2021/day-22/README.md)                  | [Part 1 and 2](./src/challenges/2021/day-22/solution/solution.js) |
| 2021 | 23  | [Amphipod](./src/challenges/2021/day-23/README.md)                        | TODO                                                              |
| 2021 | 24  | [Arithmetic Logic Unit](./src/challenges/2021/day-24/README.md)           | [Part 1 and 2](./src/challenges/2021/day-24/solution/solution.js) |
| 2021 | 25  | [Sea Cucumber](./src/challenges/2021/day-25/README.md)                    | [Part 1](./src/challenges/2021/day-25/solution/solution.js)       |
| 2022 | 01  | [Calorie Counting](./src/challenges/2022/day-01/README.md)                | [Part 1 and 2](./src/challenges/2022/day-01/solution/solution.js) |
| 2022 | 02  | [Rock Paper Scissors](./src/challenges/2022/day-02/README.md)             | [Part 1 and 2](./src/challenges/2022/day-02/solution/solution.js) |
| 2022 | 03  | [Rucksack Reorganization](./src/challenges/2022/day-03/README.md)         | [Part 1 and 2](./src/challenges/2022/day-03/solution/solution.js) |
| 2022 | 04  | [Camp Cleanup](./src/challenges/2022/day-04/README.md)                    | [Part 1 and 2](./src/challenges/2022/day-04/solution/solution.js) |
| 2022 | 05  | [Supply Stacks](./src/challenges/2022/day-05/README.md)                   | [Part 1 and 2](./src/challenges/2022/day-05/solution/solution.js) |
| 2022 | 06  | [Tuning Trouble](./src/challenges/2022/day-06/README.md)                  | [Part 1 and 2](./src/challenges/2022/day-06/solution/solution.js) |
| 2022 | 07  | [No Space Left On Device](./src/challenges/2022/day-07/README.md)         | [Part 1 and 2](./src/challenges/2022/day-07/solution/solution.js) |
| 2022 | 08  | [Treetop Tree House](./src/challenges/2022/day-08/README.md)              | [Part 1 and 2](./src/challenges/2022/day-08/solution/solution.js) |
| 2022 | 09  | [Rope Bridge](./src/challenges/2022/day-09/README.md)                     | [Part 1 and 2](./src/challenges/2022/day-09/solution/solution.js) |
| 2022 | 10  | [Cathode-Ray Tube](./src/challenges/2022/day-10/README.md)                | [Part 1 and 2](./src/challenges/2022/day-10/solution/solution.js) |
| 2022 | 11  | [Monkey in the Middle](./src/challenges/2022/day-11/README.md)            | [Part 1 and 2](./src/challenges/2022/day-11/solution/solution.js) |
| 2022 | 12  | [Hill Climbing Algorithm](./src/challenges/2022/day-12/README.md)         | [Part 1 and 2](./src/challenges/2022/day-12/solution/solution.js) |
| 2022 | 13  | [Distress Signal](./src/challenges/2022/day-13/README.md)                 | [Part 1 and 2](./src/challenges/2022/day-13/solution/solution.js) |
| 2022 | 14  | [Regolith Reservoir](./src/challenges/2022/day-14/README.md)              | [Part 1 and 2](./src/challenges/2022/day-14/solution/solution.js) |
| 2022 | 15  | [Beacon Exclusion Zone](./src/challenges/2022/day-15/README.md)           | [Part 1 and 2](./src/challenges/2022/day-15/solution/solution.js) |
| 2022 | 16  | [Proboscidea Volcanium](./src/challenges/2022/day-16/README.md)           | [Part 1 and 2](./src/challenges/2022/day-16/solution/solution.js) |
| 2022 | 17  | [Pyroclastic Flow](./src/challenges/2022/day-17/README.md)                | [Part 1 and 2](./src/challenges/2022/day-17/solution/solution.js) |
| 2022 | 18  | [Boiling Boulders](./src/challenges/2022/day-18/README.md)                | [Part 1 and 2](./src/challenges/2022/day-18/solution/solution.js) |
| 2022 | 19  | [Not Enough Minerals](./src/challenges/2022/day-19/README.md)             | [Part 1 and 2](./src/challenges/2022/day-19/solution/solution.js) |
| 2022 | 20  | [Grove Positioning System](./src/challenges/2022/day-20/README.md)        | [Part 1 and 2](./src/challenges/2022/day-20/solution/solution.js) |
| 2022 | 21  | [Monkey Math](./src/challenges/2022/day-21/README.md)                     | [Part 1 and 2](./src/challenges/2022/day-21/solution/solution.js) |
| 2022 | 22  | [Monkey Map](./src/challenges/2022/day-22/README.md)                      | [Part 1 and 2](./src/challenges/2022/day-22/solution/solution.js) |
| 2022 | 23  | [Unstable Diffusion](./src/challenges/2022/day-23/README.md)              | [Part 1 and 2](./src/challenges/2022/day-23/solution/solution.js) |
| 2022 | 24  | [Blizzard Basin](./src/challenges/2022/day-24/README.md)                  | [Part 1 and 2](./src/challenges/2022/day-24/solution/solution.js) |
| 2022 | 25  | [Full of Hot Air](./src/challenges/2022/day-25/README.md)                 | [Part 1](./src/challenges/2022/day-25/solution/solution.js)       |
| 2023 | 01  | [Trebuchet?!](./src/challenges/2023/day-01/README.md)                     | [Part 1 and 2](./src/challenges/2023/day-01/solution/solution.js) |
| 2023 | 02  | [Cube Conundrum](./src/challenges/2023/day-02/README.md)                  | [Part 1 and 2](./src/challenges/2023/day-02/solution/solution.js) |
| 2023 | 03  | [Gear Ratios](./src/challenges/2023/day-03/README.md)                     | [Part 1 and 2](./src/challenges/2023/day-03/solution/solution.js) |
| 2023 | 04  | [Scratchcards](./src/challenges/2023/day-04/README.md)                    | [Part 1 and 2](./src/challenges/2023/day-04/solution/solution.js) |
| 2023 | 05  | [If You Give A Seed A Fertilizer](./src/challenges/2023/day-05/README.md) | [Part 1 and 2](./src/challenges/2023/day-05/solution/solution.js) |
| 2023 | 06  | [Wait For It](./src/challenges/2023/day-06/README.md)                     | [Part 1 and 2](./src/challenges/2023/day-06/solution/solution.js) |
| 2023 | 07  | [Camel Cards](./src/challenges/2023/day-07/README.md)                     | [Part 1 and 2](./src/challenges/2023/day-07/solution/solution.js) |
| 2023 | 08  | [Haunted Wasteland](./src/challenges/2023/day-08/README.md)               | [Part 1 and 2](./src/challenges/2023/day-08/solution/solution.js) |
| 2023 | 09  | [Mirage Maintenance](./src/challenges/2023/day-09/README.md)              | [Part 1 and 2](./src/challenges/2023/day-09/solution/solution.js) |
| 2023 | 10  | [Pipe Maze](./src/challenges/2023/day-10/README.md)                       | [Part 1 and 2](./src/challenges/2023/day-10/solution/solution.js) |
| 2023 | 11  | [Cosmic Expansion](./src/challenges/2023/day-11/README.md)                | [Part 1 and 2](./src/challenges/2023/day-11/solution/solution.js) |
| 2023 | 12  | [Hot Springs](./src/challenges/2023/day-12/README.md)                     | [Part 1 and 2](./src/challenges/2023/day-12/solution/solution.js) |
| 2023 | 12  | [Hot Springs](./src/challenges/2023/day-12/README.md)                     | [Part 1 and 2](./src/challenges/2023/day-12/solution/solution.js) |
| 2023 | 13  | [Point of Incidence](./src/challenges/2023/day-13/README.md)              | [Part 1 and 2](./src/challenges/2023/day-13/solution/solution.js) |
| 2023 | 14  | [Parabolic Reflector Dish](./src/challenges/2023/day-14/README.md)        | [Part 1 and 2](./src/challenges/2023/day-14/solution/solution.js) |
| 2023 | 15  | [Lens Library](./src/challenges/2023/day-15/README.md)                    | [Part 1 and 2](./src/challenges/2023/day-15/solution/solution.js) |
| 2023 | 16  | [The Floor Will Be Lava](./src/challenges/2023/day-16/README.md)          | [Part 1 and 2](./src/challenges/2023/day-16/solution/solution.js) |
| 2023 | 17  | [Clumsy Crucible](./src/challenges/2023/day-17/README.md)                 | [Part 1 and 2](./src/challenges/2023/day-17/solution/solution.js) |
| 2023 | 18  | [Lavaduct Lagoon](./src/challenges/2023/day-18/README.md)                 | [Part 1 and 2](./src/challenges/2023/day-18/solution/solution.js) |
| 2023 | 19  | [Aplenty](./src/challenges/2023/day-19/README.md)                         | [Part 1 and 2](./src/challenges/2023/day-19/solution/solution.js) |
| 2023 | 20  | [Pulse Propagation](./src/challenges/2023/day-20/README.md)               | [Part 1 and 2](./src/challenges/2023/day-20/solution/solution.js) |
| 2023 | 21  | [Step Counter](./src/challenges/2023/day-21/README.md)                    | [Part 1 and 2](./src/challenges/2023/day-21/solution/solution.js) |
| 2023 | 22  | [Sand Slabs](./src/challenges/2023/day-22/README.md)                      | [Part 1 and 2](./src/challenges/2023/day-22/solution/solution.js) |
| 2023 | 23  | [A Long Walk](./src/challenges/2023/day-23/README.md)                     | [Part 1 and 2](./src/challenges/2023/day-23/solution/solution.js) |
| 2023 | 24  | [Never Tell Me The Odds](./src/challenges/2023/day-24/README.md)          | [Part 1 and 2](./src/challenges/2023/day-24/solution/solution.js) |
| 2023 | 25  | [Snowverload](./src/challenges/2023/day-25/README.md)                     | [Part 1](./src/challenges/2023/day-25/solution/solution.js)       |
